import { Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Grain from "./components/Grain";
import ServiceStatus from "./components/ServiceStatus";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

export default function App() {
  const { pathname } = useLocation();
  /* The assistant owns the full viewport; a marketing footer under it would
     just push the composer off screen. */
  const bare = pathname === "/chat";

  return (
    <>
      <Grain />
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!bare && <Footer />}
      <ServiceStatus />
    </>
  );
}
