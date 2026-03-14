import { Alert, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useRegister();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      await register.mutateAsync({
        firstName,
        lastName,
        email,
        phone: phone.trim() || undefined,
        password,
      });
      navigate("/", { replace: true });
    } catch {
      // handled by UI state
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <Box className="w-full max-w-[540px] rounded-2xl bg-[#f1f1f1] p-8 shadow-[0_8px_22px_rgba(0,0,0,0.08)]">
        <div className="mb-7 text-center">
          <p className="brand-script text-5xl text-violet-500">vicktykof</p>
        </div>

        <h1 className="text-[42px] font-semibold leading-tight text-black">Inscription</h1>
        <p className="mt-2 text-[16px] text-slate-600">Créez votre compte pour réserver un rendez-vous</p>

        {register.isError && (
          <Alert severity="error" sx={{ mt: 2.5 }}>
            Impossible de créer le compte. Vérifiez vos informations.
          </Alert>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <TextField
            placeholder="Prénom"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#f7f7f7",
              },
            }}
          />

          <TextField
            placeholder="Nom"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#f7f7f7",
              },
            }}
          />
        </div>

        <TextField
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          fullWidth
          sx={{
            mt: 1.7,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#f7f7f7",
            },
          }}
        />

        <TextField
          placeholder="Téléphone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          fullWidth
          sx={{
            mt: 1.7,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#f7f7f7",
            },
          }}
        />

        <TextField
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          fullWidth
          sx={{
            mt: 1.7,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#f7f7f7",
            },
          }}
        />

        <Button
          fullWidth
          onClick={submit}
          disabled={register.isPending}
          sx={{
            mt: 2.2,
            borderRadius: "12px",
            py: 1.45,
            fontSize: "1.1rem",
            textTransform: "none",
            fontWeight: 700,
            color: "#fff",
            bgcolor: "#0b63ce",
            "&:hover": { bgcolor: "#0b55af" },
          }}
        >
          {register.isPending ? "Création..." : "Créer mon compte"}
        </Button>

        <div className="mt-5 text-center text-sm text-slate-600">
          <span>J&apos;ai déjà un compte ? </span>
          <Link to="/login" className="font-semibold text-[#0b63ce] hover:underline">
            Connexion
          </Link>
        </div>
      </Box>
    </div>
  );
};
