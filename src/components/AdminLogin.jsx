import { useState } from "react";
import { motion } from "framer-motion";
import { HiLockClosed, HiEye, HiEyeOff, HiShieldCheck, HiX } from "react-icons/hi";
import styles from "./AdminLogin.module.css";

export default function AdminLogin({ onLogin, onClose, loginError, setLoginError }) {
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [shaking,  setShaking]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = onLogin(password);
    if (!ok) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <motion.div className={styles.overlay}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>

      <motion.div className={styles.card}
        initial={{ opacity:0, scale:.92, y:24 }}
        animate={shaking
          ? { x:[0,-10,10,-8,8,0], opacity:1, scale:1, y:0 }
          : { opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:.94, y:12 }}
        transition={{ duration:.45, ease:[0.22,1,0.36,1] }}>

        {onClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <HiX size={15}/>
          </button>
        )}

        <div className={styles.iconWrap}><HiShieldCheck size={30}/></div>
        <h2 className={styles.title}>Admin Access</h2>
        <p className={styles.sub}>Enter your password to manage portfolio content</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputWrap}>
            <HiLockClosed className={styles.inputIcon} size={15}/>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError?.(""); }}
              placeholder="Admin password"
              className={`${styles.input} ${loginError ? styles.inputError : ""}`}
              autoFocus
            />
            <button type="button" className={styles.eyeBtn}
              onClick={() => setShowPw((v) => !v)} tabIndex={-1}>
              {showPw ? <HiEyeOff size={15}/> : <HiEye size={15}/>}
            </button>
          </div>
          {loginError && (
            <motion.p className={styles.error}
              initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }}>
              {loginError}
            </motion.p>
          )}
          <motion.button type="submit" className={styles.btn}
            whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}>
            Unlock Dashboard
          </motion.button>
        </form>

        <p className={styles.hint}>
          Default password: <code>jai@admin2025</code> — change it in <code>useAdmin.js</code>
        </p>
      </motion.div>
    </motion.div>
  );
}
