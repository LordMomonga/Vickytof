import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  MenuItem,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";

type ServiceKind = "salon" | "product";

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  kind: ServiceKind;
};

type Location = {
  id: string;
  city: string;
  salon: string;
  travelFee: number;
  services: Service[];
};

const commonServices: Service[] = [
  { id: "consult", name: "Consultation loc", duration: 30, price: 45, kind: "salon" },
  { id: "retwist", name: "Comb Retwist", duration: 120, price: 135, kind: "salon" },
  { id: "style", name: "Retwist + Style", duration: 150, price: 165, kind: "salon" },
  { id: "detox", name: "Loc Detox", duration: 75, price: 95, kind: "salon" },
  { id: "product-gel", name: "Produit: Pink Super Hold Gel", duration: 0, price: 22, kind: "product" },
  { id: "product-spray", name: "Produit: Funky Loc Spray", duration: 0, price: 22, kind: "product" },
];

const quebecLocations: Location[] = [
  {
    id: "sainte-foy",
    city: "Quebec",
    salon: "Vicktykof - Sainte-Foy",
    travelFee: 0,
    services: commonServices,
  },
  {
    id: "montreal",
    city: "Montreal",
    salon: "Service mobile Montreal",
    travelFee: 35,
    services: commonServices,
  },
  {
    id: "laval",
    city: "Laval",
    salon: "Service mobile Laval",
    travelFee: 25,
    services: commonServices,
  },
  {
    id: "gatineau",
    city: "Gatineau",
    salon: "Service mobile Gatineau",
    travelFee: 60,
    services: commonServices,
  },
  {
    id: "levis",
    city: "Levis",
    salon: "Service mobile Levis",
    travelFee: 20,
    services: commonServices,
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
  const [productMode, setProductMode] = useState<"delivery" | "pickup">("delivery");

  const selectedLocation = useMemo(
    () => quebecLocations.find((location) => location.id === locationId) ?? null,
    [locationId],
  );

  const selectedService = useMemo(
    () => selectedLocation?.services.find((service) => service.id === serviceId) ?? null,
    [selectedLocation, serviceId],
  );

  const isRemoteSalonService = useMemo(() => {
    if (!selectedLocation || !selectedService) {
      return false;
    }
    return selectedLocation.id !== "sainte-foy" && selectedService.kind === "salon";
  }, [selectedLocation, selectedService]);

  const totalPrice = useMemo(() => {
    if (!selectedService) {
      return 0;
    }
    if (isRemoteSalonService && selectedLocation) {
      return selectedService.price + selectedLocation.travelFee;
    }
    return selectedService.price;
  }, [selectedService, isRemoteSalonService, selectedLocation]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ bgcolor: "#000", borderRadius: 0, "&:hover": { bgcolor: "#111" } }}>
        Ouvrir la reservation
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "22px", bgcolor: "#f2f2f2" } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <div className="px-6 pb-5 pt-6 text-center">
            <p className="brand-script text-5xl text-violet-500">vicktykof</p>
          </div>

          <Divider />

          {step === 1 && (
            <>
              <p className="py-5 text-center text-2xl font-semibold">Selectionnez un lieu (Quebec):</p>
              {quebecLocations.map((location, index) => (
                <button
                  key={location.id}
                  onClick={() => {
                    setLocationId(location.id);
                    setStep(2);
                  }}
                  className="flex w-full items-center justify-between border-t border-slate-300 px-6 py-6 text-left hover:bg-slate-100"
                >
                  <span className="text-lg font-semibold text-slate-900">
                    {index + 1}. {location.salon}
                  </span>
                  <ChevronRightIcon sx={{ color: "#7f8790" }} />
                </button>
              ))}
            </>
          )}

          {step === 2 && selectedLocation && (
            <>
              <div className="flex items-center justify-between px-6 py-4">
                <Button startIcon={<KeyboardBackspaceIcon />} onClick={() => setStep(1)} sx={{ color: "#111827", textTransform: "none" }}>
                  Retour
                </Button>
                <p className="text-sm font-semibold text-slate-500">{selectedLocation.salon}</p>
              </div>
              <Divider />

              {selectedLocation.id !== "sainte-foy" && (
                <Alert severity="info" sx={{ borderRadius: 0 }}>
                  Ce lieu est traite comme service a distance. La locticienne se deplace. Des frais de deplacement de ${selectedLocation.travelFee} s'appliquent pour les services salon.
                </Alert>
              )}

              <p className="py-5 text-center text-2xl font-semibold">Selectionnez un service:</p>
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
                    <p className="text-lg font-semibold text-slate-900">{service.name}</p>
                    <p className="text-sm text-slate-500">
                      {service.kind === "salon" ? `${service.duration} min` : "Produit"}
                    </p>
                  </div>
                  <p className="text-xl font-semibold">${service.price}</p>
                </button>
              ))}
            </>
          )}

          {step === 3 && selectedLocation && selectedService && (
            <Box className="px-6 pb-6 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <Button startIcon={<KeyboardBackspaceIcon />} onClick={() => setStep(2)} sx={{ color: "#111827", textTransform: "none" }}>
                  Retour
                </Button>
                <p className="text-sm font-semibold text-slate-500">{selectedLocation.salon}</p>
              </div>

              {isRemoteSalonService && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Service a distance confirme. Frais de deplacement ajoutes: ${selectedLocation.travelFee}.
                </Alert>
              )}

              {selectedService.kind === "product" && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Service produit: livraison incluse ou le client peut venir prendre au point de collecte.
                </Alert>
              )}

              <div className="mx-auto max-w-[440px] rounded-xl border border-slate-300 bg-white p-3">
                <h3 className="text-base font-semibold">Formulaire de reservation</h3>
                <p className="mt-1 text-sm text-slate-600">{selectedService.name}</p>
                <p className="mb-3 text-sm font-semibold text-slate-900">Prix total: ${totalPrice}</p>

                <div className="grid gap-2">
                  <TextField size="small" label="Nom complet" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <TextField size="small" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <TextField size="small" label="Telephone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <TextField size="small" label="Date souhaitee" type="date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />

                  {selectedService.kind === "product" && (
                    <TextField
                      size="small"
                      select
                      label="Mode produit"
                      value={productMode}
                      onChange={(e) => setProductMode(e.target.value as "delivery" | "pickup")}
                    >
                      <MenuItem value="delivery">Livraison incluse</MenuItem>
                      <MenuItem value="pickup">Je viens prendre</MenuItem>
                    </TextField>
                  )}

                  <TextField size="small" label="Notes" multiline minRows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <Button
                  fullWidth
                  sx={{ mt: 2, borderRadius: 0, bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } }}
                  onClick={() => setOpen(false)}
                >
                  Confirmer
                </Button>
              </div>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
