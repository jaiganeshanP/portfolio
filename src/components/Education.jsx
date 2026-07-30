import { motion } from "framer-motion";
import { HiAcademicCap, HiBadgeCheck } from "react-icons/hi";
import { education, certifications } from "../data/portfolioData";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import styles from "./Education.module.css";

export default function Education() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="education" className={`section ${styles.education}`}>
      <div className="container" ref={ref}>
        <motion.div initial={{ opacity:0,y:24 }} animate={isInView?{opacity:1,y:0}:{}} transition={{ duration:.6 }}>
          <p className="section-label">Education</p>
          <h2 className="section-title">Academic foundation</h2>
          <p className="section-subtitle">Strong computer science fundamentals combined with practical certifications.</p>
        </motion.div>

        <div className={styles.grid}>
          <div className={styles.degrees}>
            {education.map((e, i) => (
              <motion.div key={e.degree} className={`glass-card ${styles.degCard}`}
                initial={{ opacity:0,x:-30 }} animate={isInView?{opacity:1,x:0}:{}}
                transition={{ duration:.6, delay:.2+i*.15 }} whileHover={{ scale:1.02 }}>
                <div className={styles.degIcon}><HiAcademicCap size={24}/></div>
                <div>
                  <h3 className={styles.degree}>{e.degree}</h3>
                  <p className={styles.uni}>{e.institution}</p>
                  <div className={styles.degMeta}>
                    <span className={styles.cgpa}>CGPA: <strong>{e.cgpa}</strong></span>
                    <span className={styles.grade}>{e.grade}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className={`glass-card ${styles.certsCard}`}
            initial={{ opacity:0,x:30 }} animate={isInView?{opacity:1,x:0}:{}} transition={{ duration:.6, delay:.35 }}>
            <h3 className={styles.certsTitle}>Certifications</h3>
            <div className={styles.certsList}>
              {certifications.map((c, i) => (
                <motion.div key={c} className={styles.certItem}
                  initial={{ opacity:0,y:12 }} animate={isInView?{opacity:1,y:0}:{}}
                  transition={{ duration:.4, delay:.5+i*.08 }}>
                  <HiBadgeCheck className={styles.certIcon}/>
                  <span>{c}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
