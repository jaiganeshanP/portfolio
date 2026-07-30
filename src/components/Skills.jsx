import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "../data/portfolioData";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import styles from "./Skills.module.css";

const CAT_ICONS = {
  Frontend: "🎨",
  Backend: "⚙️",
  Databases: "🗄️",
  FullStack: "🌐",
  DataScience: "📊",
  Tools: "🛠️",
};

const CAT_COLORS = {
  Frontend: "#3b82f6",
  Backend: "#a78bfa",
  Databases: "#34d399",
  FullStack: "#c1ef44",
  DataScience: "#06b6d4",
  Tools: "#f59e0b",
};
export default function Skills() {
  const { ref, isInView } = useScrollAnimation();
  const [active, setActive] = useState("Frontend");
  const cats = Object.keys(skills);

  return (
    <section id="skills" className={`section ${styles.skills}`}>
      <div className="container" ref={ref}>
        <motion.div initial={{ opacity:0,y:24 }} animate={isInView?{opacity:1,y:0}:{}} transition={{ duration:.6 }}>
          <p className="section-label">Technical Skills</p>
          <h2 className="section-title">What I work with</h2>
          <p className="section-subtitle">A curated stack of technologies I use to build fast, accessible, and maintainable products.</p>
        </motion.div>

        <motion.div className={styles.tabs}
          initial={{ opacity:0,y:16 }} animate={isInView?{opacity:1,y:0}:{}} transition={{ duration:.6, delay:.15 }}>
          {cats.map((cat) => (
            <motion.button key={cat}
              className={`${styles.tab} ${active===cat?styles.tabActive:""}`}
              style={active===cat?{"--cc":CAT_COLORS[cat]}:{}}
              onClick={() => setActive(cat)}
              whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
              {CAT_ICONS[cat]} {cat}
            </motion.button>
          ))}
        </motion.div>

        <div className={styles.grid}>
          {skills[active].map((sk, i) => (
            <motion.div key={sk.name}
              className={`glass-card ${styles.card}`}
              initial={{ opacity:0,y:24 }} animate={isInView?{opacity:1,y:0}:{}}
              transition={{ duration:.5, delay:i*.08 }}
              whileHover={{ scale:1.03, translateY:-4 }}
              style={{ "--cc": CAT_COLORS[active] }}>
              <div className={styles.cardHead}>
                <span className={styles.skName}>{sk.name}</span>
                <span className={styles.skPct}>{sk.level}%</span>
              </div>
              <div className={styles.track}>
                <motion.div className={styles.fill}
                  initial={{ width:0 }}
                  animate={isInView?{ width:`${sk.level}%` }:{}}
                  transition={{ duration:1, delay:.3+i*.08, ease:[0.22,1,0.36,1] }} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className={styles.summary}
          initial={{ opacity:0,y:24 }} animate={isInView?{opacity:1,y:0}:{}} transition={{ duration:.6, delay:.5 }}>
          {cats.map((cat) => (
            <div key={cat} className={styles.sumItem}>
              <span className={styles.sumIcon} style={{ background:`${CAT_COLORS[cat]}22`, color:CAT_COLORS[cat] }}>
                {CAT_ICONS[cat]}
              </span>
              <div>
                <p className={styles.sumLabel}>{cat}</p>
                <p className={styles.sumCount}>{skills[cat].length} skills</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
