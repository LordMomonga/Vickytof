import { Alert, Button, Card, CardContent, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useLogin();

  const [email, setEmail] = useState("admin@salonpro.com");
  const [password, setPassword] = useState("123456");

  const submit = async () => {
    try {
      await login.mutateAsync({ email, password });
      navigate("/", { replace: true });
    } catch {
      // handled by UI state
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="rounded-3xl">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold">Connexion</h1>

          {login.isError && <Alert severity="error">Identifiants invalides.</Alert>}

          <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
          />

          <Button variant="contained" fullWidth onClick={submit} disabled={login.isPending}>
            Se connecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
