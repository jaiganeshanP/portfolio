import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane, HiCheckCircle } from "react-icons/hi";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { personalInfo } from "../data/portfolioData";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import styles from "./Contact.module.css";
import { supabase } from "../supabase/supabase";


function validate(form) {
  const e = {};
  if (!form.name.trim())    e.name    = "Name is required";
  if (!form.email.trim())   e.email   = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
  if (!form.message.trim()) e.message = "Message is required";
  else if (form.message.trim().length < 20) e.message = "Message too short (min 20 chars)";
  return e;
}

export default function Contact() {
  const { ref, isInView } = useScrollAnimation();
  const [form,      setForm]      = useState({ name:"", email:"", message:"" });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);
  const [sendError, setSendError] = useState(null);
  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]:"" }));
  };

  const onSubmit = async (e) => {
  e.preventDefault();
  const errs = validate(form);
  if (Object.keys(errs).length) { setErrors(errs); return; }

  setSending(true);
  setSendError(null);

  const { error } = await supabase.from("contacts").insert([form]);

  setSending(false);

  if (error) {
    console.error(error);
    setSendError("Something went wrong sending your message. Please try again.");
    return;
  }

  setSubmitted(true);
};

  const CONTACTS = [
    { icon:HiMail,           label:"Email",    value:personalInfo.email,    href:`mailto:${personalInfo.email}` },
    { icon:HiPhone,          label:"Phone",    value:personalInfo.phone,    href:`tel:${personalInfo.phone}` },
    { icon:HiLocationMarker, label:"Location", value:personalInfo.location, href:null },
  ];

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className="container" ref={ref}>
        <motion.div initial={{ opacity:0,y:24 }} animate={isInView?{opacity:1,y:0}:{}} transition={{ duration:.6 }}>
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Let's work together</h2>
          <p className="section-subtitle">Open to new opportunities, collaborations, or just a friendly hello. I'll get back to you promptly.</p>
        </motion.div>

        <div className={styles.grid}>
          <motion.div className={styles.info}
            initial={{ opacity:0,x:-30 }} animate={isInView?{opacity:1,x:0}:{}} transition={{ duration:.7, delay:.2 }}>
            {CONTACTS.map(({ icon:Icon, label, value, href }) => (
              <div key={label} className={styles.contactItem}>
                <div className={styles.contactIcon}><Icon size={20}/></div>
                <div>
                  <p className={styles.contactLabel}>{label}</p>
                  {href
                    ? <a href={href} className={styles.contactVal}>{value}</a>
                    : <p className={styles.contactVal}>{value}</p>
                  }
                </div>
              </div>
            ))}
            <div className={styles.divider}/>
            <p className={styles.followLabel}>Find me on</p>
            <div className={styles.socialRow}>
              <a href={personalInfo.github}   target="_blank" rel="noopener noreferrer" className={styles.socialBtn}><FiGithub size={16}/> GitHub</a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}><FiLinkedin size={16}/> LinkedIn</a>
            </div>
          </motion.div>

          <motion.div className={`glass-card ${styles.formCard}`}
            initial={{ opacity:0,x:30 }} animate={isInView?{opacity:1,x:0}:{}} transition={{ duration:.7, delay:.3 }}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="ok" className={styles.success}
                  initial={{ opacity:0,scale:.9 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0 }}>
                  <motion.div className={styles.successIcon}
                    initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ type:"spring", stiffness:250, damping:20, delay:.1 }}>
                    <HiCheckCircle size={40}/>
                  </motion.div>
                  <h3>Message sent!</h3>
                  <p>Thanks for reaching out. I'll respond within 24 hours.</p>
                  <button className={styles.resetBtn}
                    onClick={() => { setSubmitted(false); setForm({ name:"",email:"",message:"" }); }}>
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" className={styles.form} onSubmit={onSubmit} noValidate
                  initial={{ opacity:1 }} exit={{ opacity:0 }}>
                  <div className={styles.row}>
                    <Field label="Your Name" name="name" value={form.name} onChange={onChange} placeholder="Jack" error={errors.name}/>
                    <Field label="Email Address" name="email" type="email" value={form.email} onChange={onChange} placeholder="jack@example.com" error={errors.email}/>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Message</label>
                    <textarea name="message" value={form.message} onChange={onChange}
                      placeholder="Tell me about your project or opportunity..."
                      rows={5}
                      className={`${styles.textarea} ${errors.message?styles.fieldError:""}`}/>
                    {errors.message && <span className={styles.errMsg}>{errors.message}</span>}
                    {sendError && <p className={styles.errMsg}>{sendError}</p>}
                  </div>
                  <motion.button type="submit" className={styles.submitBtn} disabled={sending}
                    whileHover={!sending?{ scale:1.02, boxShadow:"0 8px 32px rgba(59,130,246,.35)" }:{}}
                    whileTap={!sending?{ scale:.98 }:{}}>
                    {sending
                      ? <span className={styles.spinner}/>
                      : <><span>Send Message</span><HiPaperAirplane size={15} style={{ transform:"rotate(45deg)" }}/></>
                    }
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type="text", value, onChange, placeholder, error }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`${styles.input} ${error?styles.fieldError:""}`}/>
      {error && <span className={styles.errMsg}>{error}</span>}
    </div>
  );
}
