import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";

type Service = { id: string; name: string; duration: number; price: number };
type Location = { id: string; city: string; salon: string; services: Service[] };

const quebecLocations: Location[] = [
  {
    id: "quebec-city",
    city: "Quebec City",
    salon: "Vicktykof Quebec (Sainte-Foy)",
    services: [
      { id: "qc-consult", name: "Consultation loc", duration: 30, price: 40 },
      { id: "qc-retwist", name: "Comb Retwist", duration: 120, price: 135 },
      { id: "qc-style", name: "Retwist + Style", duration: 150, price: 165 },
      { id: "qc-detox", name: "Loc Detox", duration: 75, price: 95 },
    ],
  },
  {
    id: "montreal",
    city: "Montreal",
    salon: "Vicktykof Montreal (Centre-Ville)",
    services: [
      { id: "mtl-consult", name: "Consultation loc", duration: 30, price: 45 },
      { id: "mtl-starter", name: "Starter Locs", duration: 180, price: 220 },
      { id: "mtl-crochet", name: "Crochet Retwist", duration: 150, price: 170 },
      { id: "mtl-color", name: "Color Consultation", duration: 45, price: 70 },
    ],
  },
  {
    id: "laval",
    city: "Laval",
    salon: "Vicktykof Laval (Chomedey)",
    services: [
      { id: "lvl-retwist", name: "Comb Retwist", duration: 120, price: 130 },
      { id: "lvl-micro", name: "Micro Loc Maintenance", duration: 210, price: 260 },
      { id: "lvl-extensions", name: "Loc Extensions Repair", duration: 180, price: 220 },
    ],
  },
  {
    id: "gatineau",
    city: "Gatineau",
    salon: "Vicktykof Gatineau (Hull)",
    services: [
      { id: "gat-consult", name: "Consultation loc", duration: 30, price: 40 },
      { id: "gat-retwist", name: "Comb Retwist + Style", duration: 150, price: 160 },
      { id: "gat-detox", name: "Detox + Steam", duration: 75, price: 100 },
    ],
  },
];

export const BookingPage = () => {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const selectedLocation = useMemo(
    () => quebecLocations.find((location) => location.id === locationId) ?? null,
    [locationId],
  );
  const selectedService = useMemo(
    () => selectedLocation?.services.find((service) => service.id === serviceId) ?? null,
    [selectedLocation, serviceId],
  );

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ bgcolor: "#000", borderRadius: 0, "&:hover": { bgcolor: "#111" } }}>
        Open Booking Modal
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: "22px", bgcolor: "#f2f2f2" },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <div className="flex items-center justify-between px-6 pb-5 pt-6">
            <p className="brand-script text-4xl text-violet-500">vicktykof</p>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
              Powered by
              <br />
              mangomint
            </p>
          </div>

          <Divider />

          {step === 1 && (
            <>
              <p className="py-5 text-center text-2xl font-semibold">Select a location:</p>
              {quebecLocations.map((location, index) => (
                <button
                  key={location.id}
                  onClick={() => {
                    setLocationId(location.id);
                    setStep(2);
                  }}
                  className="flex w-full items-center justify-between border-t border-slate-300 px-6 py-6 text-left hover:bg-slate-100"
                >
                  <span className="text-xl font-semibold text-slate-900">
                    {index + 1}. {location.city} - {location.salon}
                  </span>
                  <ChevronRightIcon sx={{ color: "#7f8790" }} />
                </button>
              ))}
            </>
          )}

          {step === 2 && selectedLocation && (
            <>
              <div className="flex items-center justify-between px-6 py-4">
                <Button
                  startIcon={<KeyboardBackspaceIcon />}
                  onClick={() => setStep(1)}
                  sx={{ color: "#111827", textTransform: "none" }}
                >
                  Back
                </Button>
                <p className="text-sm font-semibold text-slate-500">{selectedLocation.city}</p>
              </div>
              <Divider />
              <p className="py-5 text-center text-2xl font-semibold">Select a service:</p>
              {selectedLocation.services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setServiceId(service.id);
                    setStep(3);
                  }}
                  className="grid w-full grid-cols-[1fr_auto] items-center border-t border-slate-300 px-6 py-5 text-left hover:bg-slate-100"
                >
                  <div>
                    <p className="text-xl font-semibold text-slate-900">{service.name}</p>
                    <p className="text-sm text-slate-500">{service.duration} min</p>
                  </div>
                  <p className="text-2xl font-semibold">${service.price}</p>
                </button>
              ))}
            </>
          )}

          {step === 3 && selectedLocation && selectedService && (
            <Box className="px-6 pb-6 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <Button
                  startIcon={<KeyboardBackspaceIcon />}
                  onClick={() => setStep(2)}
                  sx={{ color: "#111827", textTransform: "none" }}
                >
                  Back
                </Button>
                <p className="text-sm font-semibold text-slate-500">{selectedLocation.city}</p>
              </div>

              <div className="mx-auto max-w-[520px] rounded-xl border border-slate-300 bg-white p-4">
                <h3 className="text-lg font-semibold">Appointment Form</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedService.name} - {selectedService.duration} min
                </p>
                <p className="mb-4 text-sm font-semibold text-slate-900">
                  Total price: ${selectedService.price}
                </p>

                <div className="grid gap-3">
                  <TextField size="small" label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <TextField size="small" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <TextField size="small" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <TextField size="small" label="Preferred date" type="date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                  <TextField size="small" label="Notes" multiline minRows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <Button
                  fullWidth
                  sx={{ mt: 2, borderRadius: 0, bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } }}
                  onClick={() => setOpen(false)}
                >
                  Confirm Appointment
                </Button>
              </div>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
