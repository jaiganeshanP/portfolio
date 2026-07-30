import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useTheme }         from "./hooks/useTheme";
import { useAdmin }         from "./hooks/useAdmin";
import { usePortfolioData } from "./hooks/usePortfolioData";
import Navbar              from "./components/Navbar";
import Hero                from "./components/Hero";
import About               from "./components/About";
import Skills              from "./components/Skills";
import Experience          from "./components/Experience";
import Projects            from "./components/Projects";
import Education           from "./components/Education";
import Contact             from "./components/Contact";
import Footer              from "./components/Footer";
import ParticlesBackground from "./components/ParticlesBackground";
import AdminLogin          from "./components/AdminLogin";
import AdminDashboard      from "./components/AdminDashboard";
import AdminFab            from "./components/AdminFab";
import "./styles/globals.css";

export default function App() {
  const { theme, toggleTheme }                                = useTheme();
  const { isAdmin, login, logout, loginError, setLoginError } = useAdmin();
  const portfolioData                                         = usePortfolioData();

  const [showLogin,     setShowLogin]     = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // ── No blocking loading screen ────────────────────────────────
  // Page renders immediately with static defaults.
  // When Firebase responds, state updates and React re-renders
  // only the changed parts (seamless for the visitor).

  const handleLogin = (pw) => {
    const ok = login(pw);
    if (ok) { setShowLogin(false); setShowDashboard(true); }
    return ok;
  };

  const handleLogout = () => { logout(); setShowDashboard(false); };

  return (
    <>
      <ParticlesBackground />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero
          cvData={portfolioData.cvData}
          cvName={portfolioData.cvName}
        />
        <About
          profileImage={portfolioData.profileImage}
          aboutText={portfolioData.aboutText}
        />
        <Skills />
        <Experience experience={portfolioData.experience} />
        <Projects   projects={portfolioData.projects} />
        <Education />
        <Contact />
      </main>

      <Footer />

      <AdminFab
        isAdmin={isAdmin}
        dashboardOpen={showDashboard}
        onOpen={() => {
          if (isAdmin) setShowDashboard((v) => !v);
          else setShowLogin(true);
        }}
      />

      <AnimatePresence>
        {showLogin && !isAdmin && (
          <AdminLogin
            key="login"
            onLogin={handleLogin}
            onClose={() => { setShowLogin(false); setLoginError(""); }}
            loginError={loginError}
            setLoginError={setLoginError}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdmin && showDashboard && (
          <AdminDashboard
            key="dashboard"
            data={portfolioData}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </>
  );
}
