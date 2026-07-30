import { motion } from "framer-motion";
import { HiExternalLink, HiCode } from "react-icons/hi";
import { FiGithub } from "react-icons/fi";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import styles from "./Projects.module.css";

export default function Projects({ projects }) {
  const { ref, isInView } = useScrollAnimation();
  const list = projects || [];

  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className="container" ref={ref}>
        <motion.div initial={{ opacity:0,y:24 }} animate={isInView?{opacity:1,y:0}:{}} transition={{ duration:.6 }}>
          <p className="section-label">Projects</p>
          <h2 className="section-title">Things I've built</h2>
          <p className="section-subtitle">Real-world projects that solve meaningful problems — from accessibility tech to ML-powered analytics.</p>
        </motion.div>

        <div className={styles.grid}>
          {list.map((p, i) => (
            <motion.div key={`${p.title}-${i}`}
              className={`glass-card ${styles.card}`}
              initial={{ opacity:0,y:36 }} animate={isInView?{opacity:1,y:0}:{}}
              transition={{ duration:.7, delay:.2+i*.2, ease:[0.22,1,0.36,1] }}
              whileHover={{ y:-6 }}
              style={{ "--pc": p.color||"#3b82f6" }}>
              <div className={styles.accentBar}/>
              {p.image && <img src={p.image} alt={p.title} className={styles.coverImg}/>}
              <div className={styles.inner}>
                <div className={styles.head}>
                  <div className={styles.iconBox}><span className={styles.emoji}>{p.icon||"🚀"}</span></div>
                  <div className={styles.headLinks}>
                    {p.githubUrl
                      ? <motion.a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} whileHover={{ scale:1.15 }} whileTap={{ scale:.9 }}><FiGithub size={15}/></motion.a>
                      : <span className={styles.iconBtn}><FiGithub size={15}/></span>
                    }
                    {p.liveUrl
                      ? <motion.a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} whileHover={{ scale:1.15 }} whileTap={{ scale:.9 }}><HiExternalLink size={15}/></motion.a>
                      : <span className={styles.iconBtn}><HiExternalLink size={15}/></span>
                    }
                  </div>
                </div>

                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.subtitle}>{p.subtitle}</p>
                <p className={styles.desc}>{p.description}</p>

                {(p.features||[]).length > 0 && (
                  <ul className={styles.features}>
                    {p.features.map((f,j) => (
                      <li key={j} className={styles.feature}>
                        <span className={styles.fDot}/>{f}
                      </li>
                    ))}
                  </ul>
                )}

                {(p.tech||[]).length > 0 && (
                  <div className={styles.techRow}>
                    {p.tech.map((t) => (
                      <span key={t} className={styles.techBadge}><HiCode size={10}/> {t}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
