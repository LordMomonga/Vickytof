import { Card, CardContent, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useDashboardStats } from "../../hooks/useSalonApi";

export const DashboardPage = () => {
  const { data, isLoading } = useDashboardStats();

  const stats = [
    { label: "Rendez-vous aujourd'hui", value: data?.todayAppointments ?? 0 },
    { label: "Clients actifs", value: data?.activeClients ?? 0 },
    { label: "Revenu semaine", value: `${data?.weekRevenue ?? 0} EUR` },
    { label: "Taux de remplissage", value: `${data?.fillRate ?? 0}%` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Dashboard salon</h1>
        <p className="text-slate-500">Suivi global des performances et des rendez-vous.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="rounded-3xl">
                <CardContent className="p-6">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
