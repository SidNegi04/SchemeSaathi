import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Results from "./pages/Results";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";

export default function App() {
  const location = useLocation();
  const isChat = location.pathname === "/chat";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/results" element={<Results />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isChat && <Footer />}
    </div>
  );
}