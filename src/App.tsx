import { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useSelector } from "react-redux";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ApplicationProgress from "./pages/ApplicationProgress";
import VerificationForm from "./pages/VerificationForm";
import VerificationHistory from "./pages/VerificationHistory";
import CreditPurchase from "./pages/CreditPurchase";
import NotFound from "./pages/NotFound";
import AadhaarVerification from "./pages/AadhaarVerification";
import GstinVerification from "./pages/GstinVerification";
import JobVerification from "./pages/JobVerification";
import JobHistoryVerification from "./pages/JobHistoryVerification";

import { Toaster } from "./components/ui/toaster";
import PrivateRoute from "./routes/PrivateRoute";
import { RootState } from "./types/store.types";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";
import Reset from "./pages/Reset";
import ResetEmail from "./pages/ResetEmail";

function App() {
  // G_ANALYTICS ----------------------------------------------------------------
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view");
    }
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Change to true to test PrivateRoute

  const token = useSelector((state: RootState) => state.user.token);
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  return (
    <HashRouter>
      <Toaster></Toaster>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/reset-password/email" element={<ResetEmail />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={Dashboard}
            />
          }
        />
        <Route path="/application-progress" element={<ApplicationProgress />} />
        
        <Route
          path="/gstin-verification"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={GstinVerification}
            />
          }
        />
        <Route
          path="/job-verification"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={JobVerification}
            />
          }
        />
        <Route
          path="/job-history-verification"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={JobHistoryVerification}
            />
          }
        />
        <Route
          path="/verification-form/:type"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={VerificationForm}
            />
          }
        />
        <Route
          path="/verification-history"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={VerificationHistory}
            />
          }
        />
        <Route
          path="/credit-purchase"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={CreditPurchase}
            />
          }
        />
        <Route
          path="/success-payment"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={PaymentSuccess}
            />
          }
        />

        <Route
          path="/failure-payment"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={PaymentFailure}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
