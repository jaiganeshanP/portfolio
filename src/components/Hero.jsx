import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowDown, HiDownload, HiMail } from "react-icons/hi";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { personalInfo } from "../data/portfolioData";
import styles from "./Hero.module.css";

const TITLES = personalInfo.titles;

function TypingText() {
  const [idx,      setIdx]      = useState(0);
  const [text,     setText]     = useState("");
  const [deleting, setDeleting] = useState(false);
  const [pause,    setPause]    = useState(false);

  useEffect(() => {
    if (pause) { const t = setTimeout(() => setPause(false), 1200); return () => clearTimeout(t); }
    const target = TITLES[idx];
    const speed  = deleting ? 55 : 100;
    const t = setTimeout(() => {
      if (!deleting) {
        setText(target.slice(0, text.length + 1));
        if (text.length + 1 === target.length) { setPause(true); setDeleting(true); }
      } else {
        setText(target.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setIdx((i) => (i + 1) % TITLES.length); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx, pause]);

  return <span className={styles.typingText}>{text}<span className={styles.cursor}>|</span></span>;
}

const float = (i) => ({
  animate: {
    y:      [0, -12, 0],
    rotate: [0, i % 2 === 0 ? 8 : -8, 0],
    transition: { duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut" },
  },
});

export default function Hero({ cvData, cvName }) {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  const downloadCV = async () => {
    if (!cvData) return;
    try {
      // Firebase Storage URLs are cross-origin — fetch first then blob-download
      const res  = await fetch(cvData);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = cvName || "Jaiganeshan_P_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(cvData, "_blank");
    }
  };

  return (
    <section id="hero" className={styles.hero}>
      {[0,1,2,3,4,5].map((i) => (
        <motion.div key={i} className={`${styles.shape} ${styles[`s${i}`]}`}
          variants={float(i)} animate="animate" aria-hidden="true" />
      ))}
      <div className={styles.glow}  aria-hidden="true" />
      <div className={styles.glow2} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <motion.div className={styles.badge}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, delay:0.1 }}>
          <span className={styles.badgeDot} />
          Available for opportunities
        </motion.div>

        <motion.h1 className={styles.heading}
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, delay:0.2, ease:[0.22,1,0.36,1] }}>
          Hi, I'm <span className={styles.nameGrad}>{personalInfo.name}</span>
        </motion.h1>

        <motion.div className={styles.typingRow}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.35 }}>
          <span className={styles.typingLabel}>I'm a </span>
          <TypingText />
        </motion.div>

        <motion.p className={styles.tagline}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.5 }}>
          {personalInfo.tagline}
        </motion.p>

        <motion.div className={styles.cta}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.65 }}>

          <motion.button className={styles.btnPrimary}
            onClick={() => scrollTo("#projects")}
            whileHover={{ scale:1.03, boxShadow:"0 8px 32px rgba(59,130,246,0.4)" }}
            whileTap={{ scale:0.97 }}>
            View Projects <HiArrowDown size={15} />
          </motion.button>

          <motion.button
            className={`${styles.btnSecondary} ${!cvData ? styles.btnGrayed : ""}`}
            onClick={cvData ? downloadCV : undefined}
            title={cvData ? "Download Resume" : "No resume uploaded yet — admin can upload one"}
            whileHover={cvData ? { scale:1.03 } : {}}
            whileTap={cvData ? { scale:0.97 } : {}}>
            <HiDownload size={15} />
            {cvData ? "Download Resume" : "Resume Soon"}
          </motion.button>

          <motion.button className={styles.btnGhost}
            onClick={() => scrollTo("#contact")}
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
            <HiMail size={15} /> Contact Me
          </motion.button>
        </motion.div>

        <motion.div className={styles.socials}
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ duration:0.7, delay:0.8 }}>
          <a href={personalInfo.github}   target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FiGithub size={19}/></a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FiLinkedin size={19}/></a>
          <div className={styles.socialDivider} />
          <span className={styles.locationTag}>📍 {personalInfo.location}</span>
        </motion.div>
      </div>

      <motion.div className={styles.illustration}
        initial={{ opacity:0, x:60 }} animate={{ opacity:1, x:0 }}
        transition={{ duration:1, delay:0.4, ease:[0.22,1,0.36,1] }} aria-hidden="true">
        <CodeEditorSVG />
      </motion.div>

      <div className={styles.scrollHint} onClick={() => scrollTo("#about")} role="button" aria-label="Scroll down">
        <motion.div className={styles.scrollDot}
          animate={{ y:[0,8,0] }} transition={{ duration:1.5, repeat:Infinity }} />
      </div>
    </section>
  );
}

function CodeEditorSVG() {
  return (
    <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"auto" }}>
      <rect x="60" y="60" width="300" height="200" rx="16" fill="rgba(10,22,40,0.9)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
      <rect x="60" y="60" width="300" height="32" rx="16" fill="rgba(15,31,61,0.95)"/>
      <rect x="60" y="76" width="300" height="16" fill="rgba(15,31,61,0.95)"/>
      <circle cx="88" cy="76" r="5" fill="#ff5f57"/>
      <circle cx="104" cy="76" r="5" fill="#febc2e"/>
      <circle cx="120" cy="76" r="5" fill="#28c840"/>
      <motion.rect x="88" y="112" width="80" height="7" rx="3" fill="rgba(99,102,241,0.8)" animate={{ opacity:[0.6,1,0.6] }} transition={{ duration:2.5, repeat:Infinity }}/>
      <rect x="180" y="112" width="50" height="7" rx="3" fill="rgba(96,165,250,0.7)"/>
      <rect x="242" y="112" width="40" height="7" rx="3" fill="rgba(52,211,153,0.7)"/>
      <rect x="100" y="130" width="60" height="7" rx="3" fill="rgba(167,139,250,0.8)"/>
      <rect x="172" y="130" width="90" height="7" rx="3" fill="rgba(96,165,250,0.5)"/>
      <motion.rect x="88" y="148" width="40" height="7" rx="3" fill="rgba(96,165,250,0.8)" animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity, delay:0.4 }}/>
      <rect x="140" y="148" width="110" height="7" rx="3" fill="rgba(52,211,153,0.5)"/>
      <rect x="100" y="166" width="70" height="7" rx="3" fill="rgba(167,139,250,0.6)"/>
      <rect x="182" y="166" width="55" height="7" rx="3" fill="rgba(99,102,241,0.6)"/>
      <motion.rect x="88" y="184" width="120" height="7" rx="3" fill="rgba(96,165,250,0.9)" animate={{ width:[0,120] }} transition={{ duration:1.5, delay:0.5, ease:"easeOut" }}/>
      <rect x="100" y="202" width="50" height="7" rx="3" fill="rgba(52,211,153,0.5)"/>
      <rect x="162" y="202" width="80" height="7" rx="3" fill="rgba(167,139,250,0.4)"/>
      <rect x="190" y="260" width="40" height="20" rx="4" fill="rgba(59,130,246,0.3)"/>
      <rect x="155" y="278" width="110" height="8" rx="4" fill="rgba(59,130,246,0.2)"/>
      <motion.g animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="20" y="130" width="64" height="26" rx="8" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.4)" strokeWidth="1"/>
        <text x="52" y="147" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="JetBrains Mono">Django</text>
      </motion.g>
      <motion.g animate={{ y:[0,8,0] }} transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut", delay:0.5 }}>
        <rect x="336" y="100" width="60" height="26" rx="8" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
        <text x="366" y="117" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="JetBrains Mono">React</text>
      </motion.g>
      <motion.g animate={{ y:[0,-6,0] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut", delay:1 }}>
        <rect x="336" y="180" width="60" height="26" rx="8" fill="rgba(52,211,153,0.15)" stroke="rgba(52,211,153,0.4)" strokeWidth="1"/>
        <text x="366" y="197" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono">Python</text>
      </motion.g>
      <motion.g animate={{ y:[0,6,0] }} transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut", delay:0.3 }}>
        <rect x="20" y="200" width="60" height="26" rx="8" fill="rgba(167,139,250,0.15)" stroke="rgba(167,139,250,0.4)" strokeWidth="1"/>
        <text x="50" y="217" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="JetBrains Mono">CSS3</text>
      </motion.g>
      <motion.rect x="212" y="182" width="2" height="12" rx="1" fill="#60a5fa" animate={{ opacity:[1,0,1] }} transition={{ duration:1, repeat:Infinity }}/>
    </svg>
  );
}
