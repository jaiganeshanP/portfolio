import { motion } from "framer-motion";
import { HiLockClosed, HiCog, HiX } from "react-icons/hi";
import styles from "./AdminFab.module.css";

export default function AdminFab({ isAdmin, onOpen, dashboardOpen }) {
  return (
    <motion.button
      className={`${styles.fab} ${isAdmin ? styles.fabAdmin : ""} ${dashboardOpen ? styles.fabOpen : ""}`}
      onClick={onOpen}
      title={isAdmin ? (dashboardOpen ? "Close dashboard" : "Open dashboard") : "Admin login"}
      initial={{ opacity:0, scale:0 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ delay:1.5, type:"spring", stiffness:260, damping:20 }}
      whileHover={{ scale:1.1 }}
      whileTap={{ scale:.92 }}
      aria-label="Admin panel"
    >
      {dashboardOpen ? <HiX size={18}/> : isAdmin ? <HiCog size={18}/> : <HiLockClosed size={15}/>}
    </motion.button>
  );
}
