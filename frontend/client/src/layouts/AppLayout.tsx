import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SendIcon from "@mui/icons-material/Send";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  InputBase,
  TextField,
  Toolbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { catalogProducts } from "../data/catalog";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";

const navItems = [
  { label: "HOME", to: "/" },
  { label: "BOOK APPOINTMENT", to: "/booking" },
  { label: "LOC STYLE GALLERY", to: "/gallery" },
  { label: "SHOP", to: "/shop" },
  { label: "PRODUCTS", to: "/products" },
  { label: "STYLING TOOLS", to: "/styling-tools" },
  { label: "LOC EXTENSIONS", to: "/loc-extensions" },
  { label: "KITS", to: "/kits" },
  { label: "WHOLESALE", to: "/wholesale" },
  { label: "MEMBERS ONLY", to: "/members-only" },
];

export const AppLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.items);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ from: "bot" | "user"; text: string }>>([
    { from: "bot", text: "Bonjour, je suis l'assistante vicktykof. Comment puis-je vous aider?" },
  ]);

  const navigate = useNavigate();

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const searchResults = useMemo(() => {
    if (!search.trim()) {
      return [];
    }
    const q = search.toLowerCase();
    return catalogProducts.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search]);

  return (
    <div className="min-h-screen">
      <div className="bg-black px-4 py-2 text-center text-xs font-semibold tracking-[0.08em] text-white md:text-sm">
        FAST SHIPPING ALL ORDERS PROCESSED WITHIN 1-2 BUSINESS DAYS
      </div>

      <div className="bg-[#ff008c] px-4 py-3 text-center text-sm font-medium tracking-[0.06em] text-white md:hidden">
        <Link to="/booking">BOOK APPOINTMENT</Link>
      </div>

      <header className="border-b border-slate-300 bg-[#ececec]">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="min-h-[126px] justify-between gap-4 px-1" sx={{ display: { xs: "none", md: "flex" } }}>
             <div>
              --
            </div>


          
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/" className="brand-script text-2xl text-violet-500 md:text-3xl ">
                vicktykof
              </Link>
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
              <IconButton onClick={() => setSearchOpen(true)}>
                <SearchOutlinedIcon />
              </IconButton>
              <IconButton component={Link} to="/login">
                <PersonOutlineOutlinedIcon />
              </IconButton>
              <IconButton component={Link} to="/cart">
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>
            </div>
          </Toolbar>

          <Toolbar disableGutters className="min-h-[92px] justify-between" sx={{ display: { xs: "flex", md: "none" } }}>
            <div className="flex items-center gap-1">
                            <IconButton onClick={() => setMenuOpen(true)}>
                            <MenuIcon />
                            </IconButton>


              <Link to="/" className="brand-script ml-10 text-2xl text-violet-500 font-bold">
                vicktykof
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <IconButton onClick={() => setSearchOpen(true)}>
                <SearchOutlinedIcon />
              </IconButton>
              <IconButton component={Link} to="/login">
                <PersonOutlineOutlinedIcon />
              </IconButton>
              <IconButton component={Link} to="/cart">
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>
            </div>
          </Toolbar>

          <div className="hidden pb-8 pt-2 md:block">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {navItems.map((item) => (
                <Link key={item.label} to={item.to} className="nav-link text-[13px] font-medium tracking-[0.015em] text-slate-900">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>

        <div className="h-[1px] bg-slate-300" />
      </header>

      <Container maxWidth="xl" className="py-6 md:py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Outlet />
        </motion.div>
      </Container>

      <footer className="mt-10 bg-black py-14 text-slate-100">
        <Container maxWidth="xl">
          <div className="grid gap-10 text-center md:grid-cols-2 md:text-left xl:grid-cols-4">
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-fuchsia-500">Contact Us</p>
              <p className="text-lg font-bold">vicktykof</p>
              <p className="text-slate-300">2177 rue du carrousel, Quebec G2B5B5</p>
              <p className="text-slate-300">+1(581)745-7409</p>
              <p className="text-slate-300">vicktykoff@gmail.com</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-fuchsia-500">Information</p>
              <p>Returns / Exchanges</p>
              <p>Refunds</p>
              <p>Privacy Policy</p>
              <p>Terms of Service / Privacy Policy</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-fuchsia-500">Quick Links</p>
              <p>Book Appointment</p>
              <p>Products</p>
              <p>Gallery</p>
              <p>Members Only</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-fuchsia-500">Account</p>
              {!user ? (
                <Button component={Link} to="/login" variant="outlined" sx={{ borderColor: "#fff", color: "#fff", borderRadius: 0 }}>
                  Login
                </Button>
              ) : (
                <div className="space-y-2">
                  <Chip label={`${user.firstName} ${user.lastName}`} />
                  <Button onClick={logout} variant="text" sx={{ color: "#cbd5e1" }}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </footer>

      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box className="w-[290px] space-y-3 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="brand-script text-xl text-violet-500">vicktykof</p>
            <IconButton onClick={() => setMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)} className="block border-b border-slate-200 py-3 text-sm font-medium">
              {item.label}
            </Link>
          ))}
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="block border-b border-slate-200 py-3 text-lg font-medium">
            CART ({cartCount})
          </Link>
        </Box>
      </Drawer>

      <Drawer anchor="top" open={searchOpen} onClose={() => setSearchOpen(false)}>
        <Box className="mx-auto w-full max-w-3xl p-4">
          <div className="mb-3 flex items-center gap-2">
            <Box className="flex-1 rounded border border-slate-300 px-3 py-1">
              <InputBase autoFocus fullWidth placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>
            <IconButton onClick={() => setSearchOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="max-h-[50vh] overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  setSearchOpen(false);
                  navigate("/products");
                }}
                className="grid w-full grid-cols-[60px_1fr_auto] items-center gap-3 border-b border-slate-200 px-1 py-2 text-left"
              >
                <img src={result.image} alt={result.name} className="h-12 w-12 rounded object-cover" />
                <span>{result.name}</span>
                <span className="font-medium">${result.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </Box>
      </Drawer>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 z-[1200] rounded-full bg-[#ff0f8b] p-4 text-white shadow-2xl transition hover:scale-105"
        aria-label="Open chat"
      >
        <ChatBubbleOutlineIcon />
      </button>

      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Live Messaging</DialogTitle>
        <DialogContent>
          <div className="mb-3 max-h-[300px] space-y-2 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-2">
            {chatMessages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`max-w-[85%] rounded px-3 py-2 text-sm ${message.from === "user" ? "ml-auto bg-black text-white" : "bg-white text-slate-800"}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <TextField size="small" fullWidth placeholder="Ecrire un message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
            <IconButton
              onClick={() => {
                if (!chatInput.trim()) {
                  return;
                }
                const userText = chatInput.trim();
                setChatMessages((prev) => [...prev, { from: "user", text: userText }]);
                setChatInput("");
                setTimeout(() => {
                  setChatMessages((prev) => [
                    ...prev,
                    { from: "bot", text: "Merci. Nous avons bien reçu votre message et on vous répond rapidement." },
                  ]);
                }, 350);
              }}
              sx={{ bgcolor: "#111", color: "#fff", "&:hover": { bgcolor: "#000" } }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
