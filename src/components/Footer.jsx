import { motion } from "framer-motion";
import { HiMail } from "react-icons/hi";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { personalInfo } from "../data/portfolioData";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>JP</div>
            <div>
              <p className={styles.brandName}>{personalInfo.name}</p>
              <p className={styles.brandRole}>Web Developer Associate</p>
            </div>
          </div>
          <div className={styles.socials}>
            {[
              { icon:FiGithub,   href:personalInfo.github,            label:"GitHub" },
              { icon:FiLinkedin, href:personalInfo.linkedin,          label:"LinkedIn" },
              { icon:HiMail,     href:`mailto:${personalInfo.email}`, label:"Email" },
            ].map(({ icon:Icon, href, label }) => (
              <motion.a key={label} href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={styles.socialBtn}
                whileHover={{ scale:1.1, y:-2 }} whileTap={{ scale:.95 }}
                aria-label={label}>
                <Icon size={18}/>
              </motion.a>
            ))}
          </div>
        </div>

        <div className={styles.divider}/>

        <div className={styles.bottom}>
          <p className={styles.copy}>Copyright © {year} {personalInfo.name}. All rights reserved.</p>
          <p className={styles.built}>Built with <span className={styles.heart}>♥</span> using React & Framer Motion, Build by <span className={styles.brandName}>techiejai</span></p>
        </div>
      </div>
    </footer>
  );
}
