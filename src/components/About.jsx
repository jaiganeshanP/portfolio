import { motion } from "framer-motion";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { personalInfo, stats } from "../data/portfolioData";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import AnimatedCounter from "./AnimatedCounter";
import styles from "./About.module.css";

const fadeUp = {
  hidden:  { opacity:0, y:30 },
  visible: (i=0) => ({ opacity:1, y:0, transition:{ duration:0.6, delay:i*0.12, ease:[0.22,1,0.36,1] } }),
};

export default function About({ profileImage, aboutText }) {
  const { ref, isInView } = useScrollAnimation();
  const bio = aboutText || personalInfo.about;

  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container" ref={ref}>
        <div className={styles.grid}>

          {/* ── LEFT ── */}
          <div className={styles.left}>
            <motion.div initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp}>
              <p className="section-label">About Me</p>
              <h2 className="section-title">
                Crafting <span className="highlight">digital experiences</span> that matter
              </h2>
            </motion.div>

            <motion.p className={styles.bio}
              initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={1}>
              {bio}
            </motion.p>

            <motion.div className={styles.contactList}
              initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={2}>
              <a href={`mailto:${personalInfo.email}`} className={styles.contactItem}>
                <HiMail className={styles.cIcon}/><span>{personalInfo.email}</span>
              </a>
              <a href={`tel:${personalInfo.phone}`} className={styles.contactItem}>
                <HiPhone className={styles.cIcon}/><span>{personalInfo.phone}</span>
              </a>
              <div className={styles.contactItem}>
                <HiLocationMarker className={styles.cIcon}/><span>{personalInfo.location}</span>
              </div>
            </motion.div>

            <motion.div className={styles.socialRow}
              initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={3}>
              <a href={personalInfo.github}   target="_blank" rel="noopener noreferrer" className={styles.socialBtn}><FiGithub size={15}/> GitHub</a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}><FiLinkedin size={15}/> LinkedIn</a>
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <div className={styles.right}>
            <div className={styles.statsGrid}>
              {stats.map((s, i) => (
                <motion.div key={s.label} className={`glass-card ${styles.statCard}`}
                  initial="hidden" animate={isInView?"visible":"hidden"}
                  variants={fadeUp} custom={i*0.15+1} whileHover={{ scale:1.04 }}>
                  <div className={styles.statVal}>
                    {isInView && <AnimatedCounter to={s.value}/>}
                    <span className={styles.statSuffix}>{s.suffix}</span>
                  </div>
                  <div className={styles.statLabel}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div className={`glass-card ${styles.profileCard}`}
              initial="hidden" animate={isInView?"visible":"hidden"} variants={fadeUp} custom={2}>
              <div className={styles.avatar}>
                {profileImage
                  ? <img src={profileImage} alt="Jaiganeshan P" className={styles.avatarImg}/>
                  : <span className={styles.avatarInitials}>JP</span>
                }
              </div>
              <div>
                <p className={styles.profileName}>{personalInfo.name}</p>
                <p className={styles.profileRole}>Web Developer Associate</p>
                <div className={styles.techPills}>
                  {["Django","JavaScript","Python","React"].map((t) => (
                    <span key={t} className={styles.pill}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
