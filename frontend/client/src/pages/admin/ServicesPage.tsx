import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Card, CardContent, MenuItem, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateService, useServices } from "../../hooks/useSalonApi";
import type { Service } from "../../types";

const categories: Service["category"][] = [
  "homme",
  "femme",
  "enfant",
  "barbe",
  "soin",
  "coloration",
];

const schema = z.object({
  name: z.string().min(1),
  duration: z.string().min(1),
  price: z.string().min(1),
  category: z.enum(categories),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const ServicesPage = () => {
  const { data: services = [] } = useServices();
  const createService = useCreateService();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      duration: "30",
      price: "20",
      category: "homme",
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createService.mutateAsync({
      ...values,
      duration: Number(values.duration),
      price: Number(values.price),
    });
    reset();
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="rounded-3xl">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-2xl font-bold">Ajouter un service</h2>

          {createService.isSuccess && <Alert severity="success">Service cree.</Alert>}
          {createService.isError && <Alert severity="error">Echec de creation.</Alert>}

          <form className="space-y-4" onSubmit={onSubmit}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom"
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Duree (minutes)"
                  type="number"
                  error={Boolean(errors.duration)}
                  helperText={errors.duration?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prix (EUR)"
                  type="number"
                  error={Boolean(errors.price)}
                  helperText={errors.price?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Categorie" fullWidth>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => <TextField {...field} label="Description" multiline minRows={3} fullWidth />}
            />

            <Button type="submit" variant="contained" fullWidth disabled={createService.isPending}>
              Creer
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">Liste des services</h2>
          <div className="mt-4 space-y-3">
            {services.map((service) => (
              <div key={service._id} className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-sm text-slate-500">
                    {service.duration} min - {service.category}
                  </p>
                </div>
                <p className="font-bold">{service.price} EUR</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
