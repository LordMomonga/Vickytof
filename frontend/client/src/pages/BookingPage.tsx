import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PaymentIcon from "@mui/icons-material/Payment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SpaIcon from "@mui/icons-material/Spa";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay, type PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { useQuery } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCreateAppointment, useAvailableSlots, useEmployees, useServices } from "../hooks/useSalonApi";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

type AvailabilityDayProps = PickersDayProps & {
  highlightedDays?: string[];
};

const AvailabilityDay = ({ day, outsideCurrentMonth, highlightedDays = [], ...other }: AvailabilityDayProps) => {
  const dayKey = day.format("YYYY-MM-DD");
  const isAvailable = !outsideCurrentMonth && highlightedDays.includes(dayKey);

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        borderRadius: "12px",
        ...(isAvailable && {
          backgroundColor: "#dbeafe",
          color: "#1d4ed8",
          fontWeight: 700,
          "&:hover, &:focus": {
            backgroundColor: "#bfdbfe",
          },
        }),
        "&.Mui-selected": {
          backgroundColor: "#2563eb !important",
          color: "#fff",
        },
        "&.Mui-selected:hover, &.Mui-selected:focus": {
          backgroundColor: "#1d4ed8 !important",
        },
      }}
    />
  );
};

const mobileSteps = [
  { id: 1, label: "Service", icon: SpaIcon },
  { id: 2, label: "Calendrier", icon: EventAvailableIcon },
  { id: 3, label: "Heure", icon: ScheduleIcon },
  { id: 4, label: "Avance", icon: PaymentIcon },
  { id: 5, label: "Confirmation", icon: CheckCircleOutlineIcon },
] as const;

export const BookingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useAuthStore((state) => state.user);
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const createAppointment = useCreateAppointment();

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(dayjs().startOf("month"));
  const [notes, setNotes] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [depositPaid, setDepositPaid] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const effectiveServiceId = selectedServiceId || services[0]?._id || "";
  const effectiveEmployeeId = selectedEmployeeId || employees[0]?._id || "";

  const selectedService = useMemo(
    () => services.find((service) => service._id === effectiveServiceId) ?? null,
    [effectiveServiceId, services],
  );

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee._id === effectiveEmployeeId) ?? null,
    [effectiveEmployeeId, employees],
  );

  const selectedDateKey = selectedDate?.format("YYYY-MM-DD");
  const depositAmount = selectedService ? Math.round(selectedService.price * 0.3) : 0;
  const remainingAmount = selectedService ? Math.max(selectedService.price - depositAmount, 0) : 0;

  const { data: availableSlots = [], isLoading: slotsLoading } = useAvailableSlots(
    effectiveEmployeeId || undefined,
    effectiveServiceId || undefined,
    selectedDateKey,
  );

  const { data: availableDays = [], isLoading: availableDaysLoading } = useQuery<string[]>({
    queryKey: ["available-days", effectiveEmployeeId, effectiveServiceId, visibleMonth.format("YYYY-MM")],
    enabled: Boolean(effectiveEmployeeId && effectiveServiceId),
    staleTime: 60_000,
    queryFn: async () => {
      const start = visibleMonth.startOf("month");
      const end = visibleMonth.endOf("month");
      const today = dayjs().startOf("day");
      const dates: string[] = [];

      for (let cursor = start; cursor.isSame(end, "day") || cursor.isBefore(end, "day"); cursor = cursor.add(1, "day")) {
        if (cursor.isBefore(today, "day")) {
          continue;
        }
        dates.push(cursor.format("YYYY-MM-DD"));
      }

      const responses = await Promise.all(
        dates.map(async (date) => {
          const { data } = await api.get("/appointments/slots", {
            params: {
              employee: effectiveEmployeeId,
              service: effectiveServiceId,
              date,
            },
          });

          return (data.slots as string[]).length > 0 ? date : null;
        }),
      );

      return responses.filter((value): value is string => Boolean(value));
    },
  });

  const availableDaySet = useMemo(() => new Set(availableDays), [availableDays]);

  const resetAfterServiceChange = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setDepositPaid(false);
    setSuccessMessage("");
  };

  const resetAfterEmployeeOrDateChange = () => {
    setSelectedTime("");
    setDepositPaid(false);
    setSuccessMessage("");
  };

  const serviceReady = Boolean(selectedService);
  const timeReady = Boolean(selectedService && selectedDate && selectedTime);
  const paymentReady = depositPaid;
  const canConfirm = Boolean(user && effectiveServiceId && effectiveEmployeeId && selectedDateKey && selectedTime && depositPaid);

  const goNext = () => {
    setCurrentStep((step) => Math.min(step + 1, 5) as 1 | 2 | 3 | 4 | 5);
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 1) as 1 | 2 | 3 | 4 | 5);
  };

  const handleSubmit = async () => {
    if (!canConfirm || !selectedDateKey) {
      return;
    }

    try {
      await createAppointment.mutateAsync({
        employee: effectiveEmployeeId,
        service: effectiveServiceId,
        date: selectedDateKey,
        startTime: selectedTime,
        notes: notes.trim() || undefined,
      });

      setSuccessMessage("Rendez-vous reserve avec succes.");
      if (isMobile) {
        setCurrentStep(5);
      }
    } catch {
      setSuccessMessage("");
    }
  };

  const renderStepActions = (step: 1 | 2 | 3 | 4 | 5) => {
    if (!isMobile) {
      return null;
    }

    const disabledNext =
      (step === 1 && !serviceReady) ||
      (step === 2 && !selectedDate) ||
      (step === 3 && !timeReady) ||
      (step === 4 && !paymentReady);

    return (
      <div className="mt-5 flex gap-3">
        {step > 1 ? (
          <Button fullWidth variant="outlined" onClick={goBack} sx={{ borderRadius: "14px" }}>
            Retour
          </Button>
        ) : null}

        {step < 5 ? (
          <Button
            fullWidth
            variant="contained"
            onClick={goNext}
            disabled={disabledNext}
            sx={{ borderRadius: "14px", backgroundColor: "#2563eb", "&:hover": { backgroundColor: "#1d4ed8" } }}
          >
            Suivant
          </Button>
        ) : null}
      </div>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Reservation</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Prenez votre rendez-vous et choisissez vos disponibilites</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Sur mobile, les etapes sont separees pour rendre la reservation plus simple: service, calendrier, heures disponibles, paiement de l&apos;avance et confirmation.
          </p>
        </div>

        {isMobile ? (
          <div className="grid grid-cols-5 gap-2">
            {mobileSteps.map((step) => {
              const Icon = step.icon;
              const active = currentStep === step.id;
              const completed = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`rounded-2xl border px-2 py-3 text-center transition ${
                    active
                      ? "border-blue-600 bg-blue-50"
                      : completed
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-white"
                  }`}
                >
                  <Icon sx={{ color: active ? "#2563eb" : completed ? "#059669" : "#64748b", fontSize: 20 }} />
                  <p className="mt-1 text-[11px] font-semibold text-slate-700">{step.id}</p>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(340px,380px)_minmax(0,1fr)]">
          <Paper elevation={0} className="rounded-[28px] border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <SpaIcon sx={{ color: "#2563eb" }} />
              <h2 className="text-lg font-semibold text-slate-950">Resume</h2>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Service</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{selectedService?.name ?? "-"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Employe</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedEmployee ? `${selectedEmployee.user.firstName} ${selectedEmployee.user.lastName}` : "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date et heure</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedDate ? selectedDate.format("DD/MM/YYYY") : "-"} {selectedTime ? `a ${selectedTime}` : ""}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Paiement</p>
                <p className="mt-2 text-sm font-medium text-slate-900">Avance: {depositAmount} EUR</p>
                <p className="mt-1 text-xs text-slate-500">Reste a payer: {remainingAmount} EUR</p>
              </div>
            </div>
          </Paper>

          <div className="flex flex-col gap-6">
            {(!isMobile || currentStep === 1) && (
              <Paper elevation={0} className="rounded-[28px] border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <SpaIcon sx={{ color: "#2563eb" }} />
                  <h2 className="text-lg font-semibold text-slate-950">1. Service</h2>
                </div>
                <p className="mt-2 text-sm text-slate-600">Choisissez d&apos;abord le service que vous voulez reserver.</p>

                <div className="mt-4 flex flex-col gap-3">
                  {servicesLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <CircularProgress size={28} />
                    </div>
                  ) : (
                    services.map((service) => {
                      const active = service._id === effectiveServiceId;

                      return (
                        <button
                          key={service._id}
                          type="button"
                          onClick={() => {
                            setSelectedServiceId(service._id);
                            resetAfterServiceChange();
                            if (isMobile) {
                              setCurrentStep(2);
                            }
                          }}
                          className={`rounded-2xl border px-4 py-4 text-left transition ${
                            active
                              ? "border-blue-600 bg-blue-50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-950">{service.name}</p>
                              <p className="mt-1 text-sm text-slate-500">{service.duration} min</p>
                            </div>
                            <Chip
                              label={`${service.price} EUR`}
                              size="small"
                              sx={{
                                backgroundColor: active ? "#2563eb" : "#e2e8f0",
                                color: active ? "#fff" : "#0f172a",
                                fontWeight: 700,
                              }}
                            />
                          </div>
                          {service.description ? <p className="mt-3 text-sm text-slate-600">{service.description}</p> : null}
                        </button>
                      );
                    })
                  )}
                </div>

                {renderStepActions(1)}
              </Paper>
            )}

            {(!isMobile || currentStep === 2) && (
              <Paper elevation={0} className="rounded-[28px] border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <EventAvailableIcon sx={{ color: "#2563eb" }} />
                  <h2 className="text-lg font-semibold text-slate-950">2. Calendrier</h2>
                </div>
                <p className="mt-2 text-sm text-slate-600">Les jours avec disponibilites apparaissent avec un fond bleu.</p>

                <div className="mt-4">
                  <TextField
                    fullWidth
                    select
                    size="small"
                    label="Coiffeur / employe"
                    value={effectiveEmployeeId}
                    onChange={(event) => {
                      setSelectedEmployeeId(event.target.value);
                      setSelectedDate(null);
                      resetAfterEmployeeOrDateChange();
                    }}
                    disabled={employeesLoading || employees.length === 0}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee._id} value={employee._id}>
                        {employee.user.firstName} {employee.user.lastName}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-3">
                  <DateCalendar
                    value={selectedDate}
                    onChange={(nextDate) => {
                      setSelectedDate(nextDate);
                      resetAfterEmployeeOrDateChange();
                      if (isMobile && nextDate) {
                        setCurrentStep(3);
                      }
                    }}
                    onMonthChange={(month) => setVisibleMonth(month.startOf("month"))}
                    disablePast
                    loading={availableDaysLoading}
                    slots={{ day: AvailabilityDay as never }}
                    slotProps={{
                      day: {
                        highlightedDays: availableDays,
                      } as never,
                    }}
                    shouldDisableDate={(day) => !availableDaySet.has(day.format("YYYY-MM-DD"))}
                  />
                </div>

                {employees.length === 0 ? (
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    Aucun employe n&apos;est disponible pour le moment.
                  </Alert>
                ) : null}

                {renderStepActions(2)}
              </Paper>
            )}

            {(!isMobile || currentStep === 3) && (
              <Paper elevation={0} className="rounded-[28px] border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ScheduleIcon sx={{ color: "#2563eb" }} />
                  <h2 className="text-lg font-semibold text-slate-950">3. Heures disponibles</h2>
                </div>
                <p className="mt-2 text-sm text-slate-600">Choisissez l&apos;heure qui vous convient parmi les disponibilites.</p>

                {!selectedService ? (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Commencez par choisir un service.
                  </Alert>
                ) : !selectedDate ? (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Choisissez d&apos;abord un jour bleu dans le calendrier.
                  </Alert>
                ) : slotsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <CircularProgress size={28} />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    Aucun creneau libre pour cette date.
                  </Alert>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "contained" : "outlined"}
                        onClick={() => {
                          setSelectedTime(slot);
                          setDepositPaid(false);
                          setSuccessMessage("");
                          if (isMobile) {
                            setCurrentStep(4);
                          }
                        }}
                        sx={{
                          minWidth: 92,
                          borderRadius: "999px",
                          borderColor: "#93c5fd",
                          color: selectedTime === slot ? "#fff" : "#1d4ed8",
                          backgroundColor: selectedTime === slot ? "#2563eb" : "#eff6ff",
                          "&:hover": {
                            borderColor: "#2563eb",
                            backgroundColor: selectedTime === slot ? "#1d4ed8" : "#dbeafe",
                          },
                        }}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}

                <TextField
                  fullWidth
                  size="small"
                  label="Notes pour le rendez-vous"
                  multiline
                  minRows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  sx={{ mt: 4 }}
                />

                {renderStepActions(3)}
              </Paper>
            )}

            {(!isMobile || currentStep === 4) && (
              <Paper elevation={0} className="rounded-[28px] border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <PaymentIcon sx={{ color: "#2563eb" }} />
                  <h2 className="text-lg font-semibold text-slate-950">4. Paiement de l&apos;avance</h2>
                </div>
                <p className="mt-2 text-sm text-slate-600">Payez l&apos;avance avant de passer a la confirmation finale.</p>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Montant de l&apos;avance: {depositAmount} EUR</p>
                  <p className="mt-1 text-sm text-slate-600">Reste a payer sur place: {remainingAmount} EUR</p>
                </div>

                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Methode de paiement"
                  value={paymentMethod}
                  onChange={(event) => {
                    setPaymentMethod(event.target.value);
                    setDepositPaid(false);
                    setSuccessMessage("");
                  }}
                  sx={{ mt: 3 }}
                >
                  <MenuItem value="card">Carte bancaire</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="interac">Interac</MenuItem>
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setDepositPaid(true);
                    setSuccessMessage("");
                    if (isMobile) {
                      setCurrentStep(5);
                    }
                  }}
                  disabled={!selectedTime}
                  sx={{
                    mt: 3,
                    borderRadius: "16px",
                    py: 1.5,
                    backgroundColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  }}
                >
                  Payer l&apos;avance de {depositAmount} EUR
                </Button>

                {depositPaid ? (
                  <Alert severity="success" sx={{ mt: 3 }}>
                    Avance payee avec succes par {paymentMethod}.
                  </Alert>
                ) : (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Selectionnez une heure avant de payer l&apos;avance.
                  </Alert>
                )}

                {renderStepActions(4)}
              </Paper>
            )}

            {(!isMobile || currentStep === 5) && (
              <Paper elevation={0} className="rounded-[28px] border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlineIcon sx={{ color: "#2563eb" }} />
                  <h2 className="text-lg font-semibold text-slate-950">5. Confirmation</h2>
                </div>
                <p className="mt-2 text-sm text-slate-600">Verifiez les informations puis confirmez votre rendez-vous.</p>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">
                    Service: <span className="font-medium text-slate-900">{selectedService?.name ?? "-"}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Employe:{" "}
                    <span className="font-medium text-slate-900">
                      {selectedEmployee ? `${selectedEmployee.user.firstName} ${selectedEmployee.user.lastName}` : "-"}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Date: <span className="font-medium text-slate-900">{selectedDate ? selectedDate.format("DD/MM/YYYY") : "-"}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Heure: <span className="font-medium text-slate-900">{selectedTime || "-"}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Avance: <span className="font-medium text-slate-900">{depositPaid ? `${depositAmount} EUR payee` : "Non payee"}</span>
                  </p>
                </div>

                {!user ? (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Connectez-vous pour confirmer le rendez-vous. <Link to="/login" className="font-semibold text-sky-700">Aller a la connexion</Link>
                  </Alert>
                ) : null}

                {createAppointment.isError ? (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    Impossible de confirmer le rendez-vous. Verifiez le creneau choisi et reessayez.
                  </Alert>
                ) : null}

                {successMessage ? (
                  <Alert severity="success" sx={{ mt: 3 }}>
                    {successMessage}
                  </Alert>
                ) : null}

                <Divider sx={{ my: 4 }} />

                <div className="flex gap-3">
                  {isMobile ? (
                    <Button fullWidth variant="outlined" onClick={goBack} sx={{ borderRadius: "14px" }}>
                      Retour
                    </Button>
                  ) : null}

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!canConfirm || createAppointment.isPending}
                    sx={{
                      borderRadius: "16px",
                      py: 1.5,
                      backgroundColor: "#2563eb",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                    }}
                  >
                    {createAppointment.isPending ? "Confirmation..." : "Confirmer le rendez-vous"}
                  </Button>
                </div>
              </Paper>
            )}
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};
