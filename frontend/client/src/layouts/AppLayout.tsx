import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Box, Button, Chip, Container, IconButton, InputBase, Toolbar } from "@mui/material";
import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const navItems = [
  { label: "HOME", to: "/" },
  { label: "BOOK APPOINTMENT", to: "/booking" },
  { label: "LOC STYLE GALLERY", to: "/" },
  { label: "SHOP", to: "/" },
  { label: "PRODUCTS", to: "/" },
  { label: "STYLING TOOLS", to: "/admin/services" },
  { label: "LOC EXTENSIONS", to: "/" },
  { label: "KITS", to: "/" },
];

export const AppLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen">
      <div className="bg-black px-4 py-3 text-center text-xs font-semibold tracking-[0.1em] text-white">
        FAST SHIPPING ALL ORDERS PROCESSED WITHIN 1-2 BUSINESS DAYS
      </div>

      <header className="border-b border-slate-300 bg-[#eceaec]">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="min-h-[126px] justify-between gap-4 px-1">
            <div className="hidden items-center gap-1 md:flex">
              <span className="text-[28px] leading-none text-slate-900">$</span>
              <span className="text-[15px] font-medium text-slate-900">CANADA (CAD $)</span>
              <KeyboardArrowDownIcon sx={{ color: "#111827" }} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="brand-script text-3xl text-violet-600 md:text-4xl"
            >
              vicktykof
            </motion.div>

            <div className="flex items-center gap-2">
              <Button
                component={Link}
                to="/booking"
                variant="contained"
                sx={{
                  borderRadius: 0,
                  px: 4.2,
                  py: 1.7,
                  backgroundColor: "#000",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  "&:hover": { backgroundColor: "#111" },
                }}
              >
                BOOK APPOINTMENT
              </Button>
              <IconButton>
                <SearchOutlinedIcon />
              </IconButton>
              <IconButton>
                <PersonOutlineOutlinedIcon />
              </IconButton>
              <IconButton>
                <ShoppingBagOutlinedIcon />
              </IconButton>
            </div>
          </Toolbar>

          <div className="pb-8 pt-2">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-[14px] font-medium tracking-[0.015em] text-slate-900 transition-colors hover:text-violet-700"
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/" className="text-[14px] font-medium text-slate-900 hover:text-violet-700">
                WHOLESALE
              </Link>
              <Link to="/" className="text-[14px] font-medium text-slate-900 hover:text-violet-700">
                MEMBERS ONLY
              </Link>
            </div>
          </div>
        </Container>

        <div className="h-[2px] bg-violet-500/70" />
      </header>

      <Container maxWidth="xl" className="py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Outlet />
        </motion.div>
      </Container>

      <footer className="mt-12 bg-black py-14 text-slate-100">
        <Container maxWidth="xl">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-violet-400">Contact Us</p>
              <p className="text-lg font-bold">vicktykof</p>
              <p className="text-slate-300">6655 Amberton Dr #M, Elkridge MD</p>
              <p className="text-slate-300">customerservice@vicktykof.com</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-violet-400">Information</p>
              <p>Returns / Exchanges</p>
              <p>Refunds</p>
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-violet-400">Account</p>
              {!user ? (
                <Button component={Link} to="/login" variant="outlined" sx={{ borderColor: "#a78bfa", color: "#f3f4f6" }}>
                  Connexion
                </Button>
              ) : (
                <div className="space-y-2">
                  <Chip label={`${user.firstName} ${user.lastName}`} />
                  <Button onClick={logout} variant="text" sx={{ color: "#cbd5e1" }}>
                    Deconnexion
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-violet-400">Sign Up To Our Emails</p>
              <Box className="rounded-none border border-slate-600 px-3 py-1">
                <InputBase fullWidth placeholder="email@example.com" sx={{ color: "#e2e8f0" }} />
              </Box>
              <Button variant="contained" sx={{ borderRadius: 0, background: "#a78bfa", color: "#111827", fontWeight: 800 }}>
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};
