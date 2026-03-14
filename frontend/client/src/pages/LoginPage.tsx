import { Alert, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      await login.mutateAsync({ email, password });
      navigate("/", { replace: true });
    } catch {
      // handled by UI state
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Box className="w-full max-w-[540px] rounded-2xl bg-[#f1f1f1] p-8 shadow-[0_8px_22px_rgba(0,0,0,0.08)]">
        <div className="mb-7 text-center">
          <p className="brand-script text-5xl text-violet-500">vicktykof</p>
        </div>

        <h1 className="text-[42px] font-semibold leading-tight text-black">Sign in</h1>
        <p className="mt-2 text-[16px] text-slate-600">Sign in or create an account</p>

        {login.isError && (
          <Alert severity="error" sx={{ mt: 2.5 }}>
            Invalid credentials.
          </Alert>
        )}

        <Button
          fullWidth
          sx={{
            mt: 3,
            borderRadius: "12px",
            py: 1.35,
            fontSize: "1rem",
            textTransform: "none",
            fontWeight: 600,
            color: "#111827",
            background: "#ffffff",
            border: "1px solid #d1d5db",
            "&:hover": {
              background: "#f8fafc",
            },
          }}
        >
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-slate-500">
          <div className="h-[1px] flex-1 bg-slate-300" />
          <span className="text-sm">or</span>
          <div className="h-[1px] flex-1 bg-slate-300" />
        </div>

        <TextField
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#f7f7f7",
            },
          }}
        />

        <TextField
          placeholder="Password"
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
          disabled={login.isPending}
          sx={{
            mt: 2.2,
            borderRadius: "12px",
            py: 1.45,
            fontSize: "1.5rem",
            textTransform: "none",
            fontWeight: 700,
            color: "#fff",
            bgcolor: "#0b63ce",
            "&:hover": { bgcolor: "#0b55af" },
          }}
        >
          Continue
        </Button>

        <div className="mt-5 text-center text-sm text-slate-600">
          <span>Je n&apos;ai pas de compte ? </span>
          <Link to="/register" className="font-semibold text-[#0b63ce] hover:underline">
            Inscription
          </Link>
        </div>

        <div className="mt-6 flex justify-center gap-4 text-sm text-[#0b63ce]">
          <a href="#">Privacy policy</a>
          <a href="#">Terms of service</a>
        </div>
      </Box>
    </div>
  );
};
