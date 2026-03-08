import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  useAvailableSlots,
  useCreateAppointment,
  useEmployees,
  useServices,
} from "../hooks/useSalonApi";

const bookingSchema = z.object({
  service: z.string().min(1, "Service requis"),
  employee: z.string().min(1, "Coiffeur requis"),
  date: z.string().min(1, "Date requise"),
  slot: z.string().min(1, "Créneau requis"),
  notes: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

export const BookingPage = () => {
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: employees = [], isLoading: loadingEmployees } = useEmployees();
  const createAppointment = useCreateAppointment();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      employee: "",
      date: "",
      slot: "",
      notes: "",
    },
  });

  const selectedService = watch("service");
  const selectedEmployee = watch("employee");
  const selectedDate = watch("date");
  const selectedSlot = watch("slot");

  const { data: slots = [], isLoading: loadingSlots } = useAvailableSlots(
    selectedEmployee,
    selectedService,
    selectedDate,
  );

  const selectedServiceItem = useMemo(
    () => services.find((service) => service._id === selectedService),
    [services, selectedService],
  );

  const selectedEmployeeItem = useMemo(
    () => employees.find((employee) => employee._id === selectedEmployee),
    [employees, selectedEmployee],
  );

  const onSubmit = handleSubmit(async (values) => {
    await createAppointment.mutateAsync({
      employee: values.employee,
      service: values.service,
      date: values.date,
      startTime: values.slot,
      notes: values.notes,
    });

    reset({ service: "", employee: "", date: "", slot: "", notes: "" });
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <Card className="rounded-3xl">
        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="text-2xl font-bold">Prendre un rendez-vous</h2>
            <p className="text-slate-500">Choisissez votre prestation et votre créneau.</p>
          </div>

          {createAppointment.isSuccess && (
            <Alert severity="success">Rendez-vous confirmé avec succès.</Alert>
          )}

          {createAppointment.isError && (
            <Alert severity="error">Impossible de créer le rendez-vous.</Alert>
          )}

          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="service"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Service"
                    error={Boolean(errors.service)}
                    helperText={errors.service?.message}
                    fullWidth
                  >
                    {services.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.name} - {service.price} EUR
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="employee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Coiffeur"
                    error={Boolean(errors.employee)}
                    helperText={errors.employee?.message}
                    fullWidth
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee._id} value={employee._id}>
                        {employee.user.firstName} {employee.user.lastName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.date)}
                    helperText={errors.date?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="slot"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Créneau"
                    error={Boolean(errors.slot)}
                    helperText={errors.slot?.message}
                    fullWidth
                  >
                    {slots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>

            <Controller
              name="notes"
              control={control}
              render={({ field }) => <TextField {...field} label="Notes" multiline minRows={2} fullWidth />}
            />

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loadingServices || loadingEmployees || loadingSlots || createAppointment.isPending}
              >
                Confirmer le rendez-vous
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit rounded-3xl">
        <CardContent className="space-y-4 p-6">
          <h3 className="text-xl font-bold">Résumé</h3>
          <div className="space-y-2 text-slate-600">
            <Typography>Service: {selectedServiceItem?.name ?? "-"}</Typography>
            <Typography>
              Coiffeur:{" "}
              {selectedEmployeeItem
                ? `${selectedEmployeeItem.user.firstName} ${selectedEmployeeItem.user.lastName}`
                : "-"}
            </Typography>
            <Typography>Date: {selectedDate || "-"}</Typography>
            <Typography>Créneau: {selectedSlot || "-"}</Typography>
            <Typography>Prix: {selectedServiceItem ? `${selectedServiceItem.price} EUR` : "-"}</Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
