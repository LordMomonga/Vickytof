import {
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useAppointments, useCancelAppointment } from "../hooks/useSalonApi";

export const AppointmentsPage = () => {
  const { data: appointments = [] } = useAppointments();
  const cancelAppointment = useCancelAppointment();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Mes rendez-vous</h1>

      {appointments.map((appointment) => (
        <Card key={appointment._id} className="rounded-3xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="space-y-1">
              <p className="text-lg font-semibold">{appointment.service?.name ?? "Service"}</p>
              <p className="text-slate-600">
                {appointment.date} - {appointment.startTime} à {appointment.endTime}
              </p>
              <p className="text-slate-600">Prix: {appointment.totalPrice} EUR</p>
            </div>

            <div className="flex items-center gap-3">
              <Chip label={appointment.status} />
              {appointment.status !== "cancelled" && (
                <Button variant="outlined" color="error" onClick={() => setSelectedId(appointment._id)}>
                  Annuler
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={Boolean(selectedId)} onClose={() => setSelectedId(null)}>
        <DialogTitle>Annuler ce rendez-vous ?</DialogTitle>
        <DialogContent>Cette action passe le rendez-vous au statut &quot;cancelled&quot;.</DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedId(null)}>Retour</Button>
          <Button
            color="error"
            onClick={async () => {
              if (!selectedId) {
                return;
              }
              await cancelAppointment.mutateAsync(selectedId);
              setSelectedId(null);
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
