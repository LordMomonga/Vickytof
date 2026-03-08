import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0a0a0f" },
    secondary: { main: "#7c3aed" },
    background: { default: "#efedf1" },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: ["Poppins", "Segoe UI", "sans-serif"].join(","),
    h1: {
      fontFamily: ["Poppins", "Segoe UI", "sans-serif"].join(","),
      fontWeight: 800,
    },
    h2: {
      fontFamily: ["Poppins", "Segoe UI", "sans-serif"].join(","),
      fontWeight: 800,
    },
  },
});
