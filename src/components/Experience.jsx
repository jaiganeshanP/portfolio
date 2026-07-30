import { motion } from "framer-motion";
import { HiBriefcase, HiCheckCircle } from "react-icons/hi";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import styles from "./Experience.module.css";

export default function Experience({ experience }) {
  const { ref, isInView } = useScrollAnimation();
  const list = experience || [];

  return (
    <section id="experience" className={`section ${styles.experience}`}>
      <div className="container" ref={ref}>
        <motion.div initial={{ opacity:0,y:24 }} animate={isInView?{opacity:1,y:0}:{}} transition={{ duration:.6 }}>
          <p className="section-label">Work Experience</p>
          <h2 className="section-title">Where I've contributed</h2>
          <p className="section-subtitle">Hands-on experience delivering production-ready web applications in Agile environments.</p>
        </motion.div>

        <div className={styles.timeline}>
          {list.map((job, i) => (
            <motion.div key={`${job.company}-${i}`} className={styles.item}
              initial={{ opacity:0, x: i%2===0?-30:30 }}
              animate={isInView?{opacity:1,x:0}:{}}
              transition={{ duration:.7, delay:.2+i*.2, ease:[0.22,1,0.36,1] }}>
              <div className={styles.connector}>
                <div className={`${styles.dot} ${job.type==="Current"?styles.dotActive:styles.dotPast}`}>
                  <HiBriefcase size={14}/>
                </div>
                {i < list.length-1 && <div className={styles.line}/>}
              </div>

              <motion.div className={`glass-card ${styles.card}`}
                whileHover={{ scale:1.015 }}
                transition={{ type:"spring", stiffness:300, damping:20 }}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.company}>{job.company}</h3>
                    <p className={styles.role}>{job.role}</p>
                  </div>
                  <div className={styles.meta}>
                    <span className={`${styles.badge} ${job.type==="Current"?styles.badgeCurrent:styles.badgePast}`}>{job.type}</span>
                    <span className={styles.period}>{job.period}</span>
                  </div>
                </div>
                <ul className={styles.achList}>
                  {(job.achievements||[]).map((ach, j) => (
                    <motion.li key={j} className={styles.ach}
                      initial={{ opacity:0,x:-12 }}
                      animate={isInView?{opacity:1,x:0}:{}}
                      transition={{ duration:.4, delay:.4+i*.2+j*.06 }}>
                      <HiCheckCircle className={styles.checkIcon}/>
                      <span>{ach}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
