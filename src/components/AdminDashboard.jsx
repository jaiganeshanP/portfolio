import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX, HiPlus, HiTrash, HiPencil, HiCheck, HiPhotograph,
  HiBriefcase, HiCode, HiUser, HiLogout, HiRefresh,
  HiExternalLink, HiDocumentText, HiDownload, HiUpload,
  HiCloudUpload, HiShieldCheck,
} from "react-icons/hi";
import { FiGithub } from "react-icons/fi";
import styles from "./AdminDashboard.module.css";

/* ─── Helpers ─────────────────────────────── */
function readAsDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
function fmtBytes(b) {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(2)} MB`;
}
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

const TABS = [
  { id:"projects",   label:"Projects",    Icon:HiCode },
  { id:"experience", label:"Experience",  Icon:HiBriefcase },
  { id:"profile",    label:"Profile",     Icon:HiUser },
  { id:"cv",         label:"CV / Resume", Icon:HiDocumentText },
];

/* ═══════════════ DASHBOARD SHELL ═══════════════ */
export default function AdminDashboard({ data, onLogout }) {
  const [tab,       setTab]       = useState("projects");
  const [showReset, setShowReset] = useState(false);

  return (
    <div className={styles.overlay}>
      <motion.div className={styles.panel}
        initial={{ x:"100%", opacity:0 }} animate={{ x:0, opacity:1 }}
        exit={{ x:"100%", opacity:0 }}
        transition={{ duration:.45, ease:[0.22,1,0.36,1] }}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.hLeft}>
            <div className={styles.adminBadge}><HiShieldCheck size={12}/> Admin</div>
            <div>
              <p className={styles.hTitle}>Portfolio Dashboard</p>
              <p className={styles.hSub}>Manage your content live</p>
            </div>
          </div>
          <div className={styles.hRight}>
            <button className={styles.resetBtn} onClick={() => setShowReset(true)} title="Reset all to defaults"><HiRefresh size={15}/></button>
            <button className={styles.logoutBtn} onClick={onLogout}><HiLogout size={14}/> Logout</button>
          </div>
        </div>

        {/* Tab bar */}
        <div className={styles.tabBar}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id}
              className={`${styles.tabBtn} ${tab===id ? styles.tabActive : ""}`}
              onClick={() => setTab(id)}>
              <Icon size={13}/> {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.body}>
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-6 }} transition={{ duration:.2 }}
              className={styles.tabContent}>
              {tab==="projects"   && <ProjectsTab   data={data}/>}
              {tab==="experience" && <ExperienceTab data={data}/>}
              {tab==="profile"    && <ProfileTab    data={data}/>}
              {tab==="cv"         && <CvTab         data={data}/>}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Reset confirm */}
      <AnimatePresence>
        {showReset && (
          <motion.div className={styles.confirmOverlay}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setShowReset(false)}>
            <motion.div className={styles.confirmBox}
              initial={{ scale:.9 }} animate={{ scale:1 }} exit={{ scale:.9 }}
              onClick={(e) => e.stopPropagation()}>
              <div className={styles.confirmIcon}><HiRefresh size={22}/></div>
              <h3>Reset everything?</h3>
              <p>All custom projects, experience, images and CV will be cleared and restored to defaults.</p>
              <div className={styles.confirmBtns}>
                <button className={styles.cancelBtn} onClick={() => setShowReset(false)}>Cancel</button>
                <button className={styles.dangerBtn} onClick={() => { data.resetAll(); setShowReset(false); }}>Yes, reset all</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════ PROJECTS TAB ═══════════════ */
const BLANK_PROJECT = { title:"", subtitle:"", description:"", tech:[], features:[], color:"#3b82f6", icon:"🚀", githubUrl:"", liveUrl:"", image:null };
const COLORS = ["#3b82f6","#6366f1","#34d399","#f59e0b","#ef4444","#ec4899","#06b6d4","#8b5cf6"];

function ProjectsTab({ data }) {
  const { projects, setProjects } = data;
  const imgRef = useRef();
  const [editing, setEditing] = useState(null); // null | "new" | number
  const [form,    setForm]    = useState(BLANK_PROJECT);

  const openNew  = () => { setForm({ ...BLANK_PROJECT }); setEditing("new"); };
  const openEdit = (i) => { setForm({ ...BLANK_PROJECT, ...projects[i], tech:[...(projects[i].tech||[])], features:[...(projects[i].features||[])] }); setEditing(i); };
  const close    = () => setEditing(null);

  const handleImg = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readAsDataURL(file);
    setForm((f) => ({ ...f, image:url }));
    e.target.value = "";
  };

  const save = () => {
    if (!form.title.trim()) return;
    if (editing === "new") setProjects((p) => [...p, { ...form }]);
    else setProjects((p) => p.map((x,i) => i===editing ? { ...form } : x));
    close();
  };

  const remove = (i) => setProjects((p) => p.filter((_,idx) => idx!==i));
  const csv    = (v) => v.split(",").map((s) => s.trim()).filter(Boolean);
  const setF   = (k) => (v) => setForm((f) => ({ ...f, [k]:v }));

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>Projects <Pill n={projects.length}/></h3>
        <button className={styles.addBtn} onClick={openNew}><HiPlus size={13}/> Add Project</button>
      </div>

      <div className={styles.list}>
        {projects.length === 0 && <Empty msg="No projects yet — add one above."/>}
        {projects.map((p, i) => (
          <div key={i} className={styles.listRow} style={{"--cc":p.color||"#3b82f6"}}>
            <div className={styles.listAccent}/>
            <div className={styles.listContent}>
              {p.image && <img src={p.image} alt="" className={styles.thumb}/>}
              <div className={styles.listEmoji}>{p.icon||"🚀"}</div>
              <div className={styles.listText}>
                <p className={styles.listTitle}>{p.title}</p>
                <p className={styles.listSub}>{p.subtitle}</p>
                <div className={styles.listLinks}>
                  {p.githubUrl && <Chip href={p.githubUrl} icon={<FiGithub size={10}/>} label="GitHub"/>}
                  {p.liveUrl   && <Chip href={p.liveUrl}   icon={<HiExternalLink size={10}/>} label="Live"/>}
                </div>
              </div>
              <Actions onEdit={() => openEdit(i)} onDelete={() => remove(i)}/>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing !== null && (
          <motion.div className={styles.drawer}
            initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:18 }}>
            <DrawerHead title={editing==="new" ? "New Project" : "Edit Project"} onClose={close}/>
            <div className={styles.formGrid}>

              {/* Image upload */}
              <div className={styles.colFull}>
                <Label>Screenshot / Cover Image</Label>
                <div className={styles.imgBox} onClick={() => imgRef.current?.click()}>
                  {form.image
                    ? <img src={form.image} alt="preview" className={styles.imgPreview}/>
                    : <ImgPlaceholder text="Click to upload" sub="PNG, JPG, WebP"/>
                  }
                </div>
                <input ref={imgRef} type="file" accept="image/*" className={styles.fileHidden} onChange={handleImg}/>
                {form.image && <RemoveLink onClick={() => setForm((f) => ({...f,image:null}))}>Remove image</RemoveLink>}
              </div>

              <InputField label="Title *"      value={form.title}      onChange={setF("title")}      placeholder="SignEcho"/>
              <InputField label="Subtitle"     value={form.subtitle}   onChange={setF("subtitle")}   placeholder="Short tagline"/>
              <InputField label="Icon (emoji)" value={form.icon}       onChange={setF("icon")}       placeholder="🚀"/>
              <InputField label="GitHub URL"   value={form.githubUrl}  onChange={setF("githubUrl")}  placeholder="https://github.com/..."/>
              <InputField label="Live URL"     value={form.liveUrl}    onChange={setF("liveUrl")}    placeholder="https://..."/>

              <div className={styles.colFull}>
                <Label>Description</Label>
                <textarea className={styles.textarea} rows={3} value={form.description}
                  onChange={(e) => setF("description")(e.target.value)}
                  placeholder="What this project does and solves..."/>
              </div>
              <div className={styles.colFull}>
                <Label>Tech Stack <Hint>(comma-separated)</Hint></Label>
                <input className={styles.input} value={form.tech.join(", ")}
                  onChange={(e) => setForm((f) => ({...f,tech:csv(e.target.value)}))}
                  placeholder="Django, JavaScript, MySQL"/>
              </div>
              <div className={styles.colFull}>
                <Label>Key Features <Hint>(comma-separated)</Hint></Label>
                <input className={styles.input} value={form.features.join(", ")}
                  onChange={(e) => setForm((f) => ({...f,features:csv(e.target.value)}))}
                  placeholder="Real-time updates, 90% accuracy, ..."/>
              </div>
              <div className={styles.colFull}>
                <Label>Accent Color</Label>
                <div className={styles.colorRow}>
                  {COLORS.map((c) => (
                    <button key={c} type="button"
                      className={`${styles.swatch} ${form.color===c?styles.swatchActive:""}`}
                      style={{ background:c }} onClick={() => setF("color")(c)}/>
                  ))}
                  <input type="color" className={styles.colorPick} value={form.color}
                    onChange={(e) => setF("color")(e.target.value)} title="Custom colour"/>
                </div>
              </div>
            </div>
            <DrawerFoot onCancel={close} onSave={save} label="Save Project"/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════ EXPERIENCE TAB ═══════════════ */
const BLANK_EXP = { company:"", role:"", period:"", type:"Past", achievements:[] };

function ExperienceTab({ data }) {
  const { experience, setExperience } = data;
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(BLANK_EXP);
  const [achInput, setAchInput] = useState("");

  const openNew  = () => { setForm({ ...BLANK_EXP, achievements:[] }); setAchInput(""); setEditing("new"); };
  const openEdit = (i) => { setForm({ ...experience[i], achievements:[...(experience[i].achievements||[])] }); setAchInput(""); setEditing(i); };
  const close    = () => setEditing(null);

  const addAch = () => {
    if (!achInput.trim()) return;
    setForm((f) => ({ ...f, achievements:[...f.achievements, achInput.trim()] }));
    setAchInput("");
  };
  const removeAch = (i) => setForm((f) => ({ ...f, achievements:f.achievements.filter((_,j) => j!==i) }));
  const moveAch   = (i, d) => {
    const arr = [...form.achievements];
    const j = i+d;
    if (j<0 || j>=arr.length) return;
    [arr[i],arr[j]] = [arr[j],arr[i]];
    setForm((f) => ({ ...f, achievements:arr }));
  };

  const save = () => {
    if (!form.company.trim()) return;
    if (editing==="new") setExperience((e) => [{ ...form },...e]);
    else setExperience((e) => e.map((x,i) => i===editing ? { ...form } : x));
    close();
  };
  const remove = (i) => setExperience((e) => e.filter((_,j) => j!==i));
  const setF   = (k) => (v) => setForm((f) => ({ ...f, [k]:v }));

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>Experience <Pill n={experience.length}/></h3>
        <button className={styles.addBtn} onClick={openNew}><HiPlus size={13}/> Add Role</button>
      </div>

      <div className={styles.list}>
        {experience.length === 0 && <Empty msg="No experience entries yet."/>}
        {experience.map((exp, i) => (
          <div key={i} className={`${styles.listRow} ${styles.expRow}`}>
            <div className={styles.listContent}>
              <div className={styles.expDot} data-type={exp.type}/>
              <div className={styles.listText}>
                <p className={styles.listTitle}>{exp.company}</p>
                <p className={styles.listSub}>{exp.role} · {exp.period}</p>
                <span className={`${styles.typeBadge} ${exp.type==="Current"?styles.typeCurrent:styles.typePast}`}>{exp.type}</span>
              </div>
              <Actions onEdit={() => openEdit(i)} onDelete={() => remove(i)}/>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing !== null && (
          <motion.div className={styles.drawer}
            initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:18 }}>
            <DrawerHead title={editing==="new"?"New Role":"Edit Role"} onClose={close}/>
            <div className={styles.formGrid}>
              <InputField label="Company *" value={form.company} onChange={setF("company")} placeholder="Cognifyz Technologies"/>
              <InputField label="Role *"    value={form.role}    onChange={setF("role")}    placeholder="Web Developer Intern"/>
              <InputField label="Period"    value={form.period}  onChange={setF("period")}  placeholder="Jun 2025 – Dec 2025"/>
              <div className={styles.field}>
                <Label>Type</Label>
                <select className={styles.input} value={form.type} onChange={(e) => setF("type")(e.target.value)}>
                  <option value="Current">Current</option>
                  <option value="Past">Past</option>
                </select>
              </div>
              <div className={styles.colFull}>
                <Label>Achievements</Label>
                {form.achievements.length > 0 && (
                  <div className={styles.achList}>
                    {form.achievements.map((a,i) => (
                      <div key={i} className={styles.achRow}>
                        <div className={styles.achMoves}>
                          <button className={styles.achMove} onClick={() => moveAch(i,-1)}>↑</button>
                          <button className={styles.achMove} onClick={() => moveAch(i,+1)}>↓</button>
                        </div>
                        <span className={styles.achText}>{a}</span>
                        <button className={styles.achDel} onClick={() => removeAch(i)}><HiX size={11}/></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.achInputRow}>
                  <input className={styles.input} value={achInput}
                    onChange={(e) => setAchInput(e.target.value)}
                    placeholder="Type an achievement and press Enter…"
                    onKeyDown={(e) => { if(e.key==="Enter"){e.preventDefault();addAch();} }}/>
                  <button className={styles.achAddBtn} onClick={addAch}><HiPlus size={14}/></button>
                </div>
              </div>
            </div>
            <DrawerFoot onCancel={close} onSave={save} label="Save Role"/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════ PROFILE TAB ═══════════════ */
function ProfileTab({ data }) {
  const { profileImage, setProfileImage, heroImage, setHeroImage, aboutText, setAboutText } = data;
  const profRef  = useRef();
  const heroRef  = useRef();
  const [bioLocal,      setBioLocal]      = useState(aboutText);
  const [bioSaved,      setBioSaved]      = useState(false);
  const [uploadingProf, setUploadingProf] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [profError,     setProfError]     = useState("");
  const [heroError,     setHeroError]     = useState("");

  const uploadProfile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfError("");
    setUploadingProf(true);
    try {
      await setProfileImage(file); // pass raw File — Firebase hook uploads it
    } catch (err) {
      console.error("Profile upload error:", err);
      setProfError("Upload failed. Check Firebase Storage rules.");
    } finally {
      setUploadingProf(false);
      e.target.value = "";
    }
  };

  const uploadHero = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroError("");
    setUploadingHero(true);
    try {
      await setHeroImage(file); // pass raw File — Firebase hook uploads it
    } catch (err) {
      console.error("Hero upload error:", err);
      setHeroError("Upload failed. Check Firebase Storage rules.");
    } finally {
      setUploadingHero(false);
      e.target.value = "";
    }
  };

  const saveBio = () => {
    setAboutText(bioLocal);
    setBioSaved(true);
    setTimeout(() => setBioSaved(false), 2200);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle} style={{ marginBottom:".5rem" }}>Profile & Images</h3>

      {/* Avatar */}
      <div className={styles.profileBlock}>
        <p className={styles.blockTitle}>Profile / Avatar Photo</p>
        <p className={styles.blockHint}>Displayed in the About section. Square image recommended.</p>
        <div className={styles.avatarRow}>
          <div className={styles.avatarBox}>
            {uploadingProf
              ? <div className={styles.miniSpinner}/>
              : profileImage
                ? <img src={profileImage} alt="profile" className={styles.avatarImg}/>
                : <span className={styles.avatarInit}>JP</span>
            }
          </div>
          <div className={styles.avatarActions}>
            <button
              className={styles.uploadBtn}
              onClick={() => profRef.current?.click()}
              disabled={uploadingProf}
            >
              <HiPhotograph size={14}/>
              {uploadingProf ? "Uploading…" : profileImage ? "Change Photo" : "Upload Photo"}
            </button>
            {profileImage && !uploadingProf && (
              <button className={styles.removeLink} onClick={() => setProfileImage(null)}>
                <HiTrash size={12}/> Remove
              </button>
            )}
          </div>
        </div>
        {profError && <p className={styles.uploadError}>{profError}</p>}
        <input ref={profRef} type="file" accept="image/*" className={styles.fileHidden} onChange={uploadProfile}/>
      </div>

      {/* Hero BG */}
      <div className={styles.profileBlock}>
        <p className={styles.blockTitle}>Hero Background <span className={styles.optTag}>optional</span></p>
        <p className={styles.blockHint}>Subtle overlay behind the hero section. 1920×1080 recommended.</p>
        <div
          className={`${styles.heroBgBox} ${uploadingHero ? styles.heroBgUploading : ""}`}
          onClick={() => !uploadingHero && heroRef.current?.click()}
          style={heroImage ? { backgroundImage:`url(${heroImage})`, backgroundSize:"cover", backgroundPosition:"center" } : {}}
        >
          {uploadingHero
            ? <div className={styles.uploadingState}><div className={styles.cvSpinner}/><p>Uploading…</p></div>
            : heroImage
              ? <div className={styles.heroBgOverlay}><HiPhotograph size={16}/> Change image</div>
              : <ImgPlaceholder text="Upload hero background" sub="Wide image, 1920×1080 recommended"/>
          }
        </div>
        {heroError && <p className={styles.uploadError}>{heroError}</p>}
        <input ref={heroRef} type="file" accept="image/*" className={styles.fileHidden} onChange={uploadHero}/>
        {heroImage && !uploadingHero && (
          <RemoveLink onClick={() => setHeroImage(null)} style={{ marginTop:".5rem" }}>
            Remove background
          </RemoveLink>
        )}
      </div>

      {/* Bio */}
      <div className={styles.profileBlock}>
        <p className={styles.blockTitle}>About / Bio Text</p>
        <p className={styles.blockHint}>Shown in the About section of your portfolio.</p>
        <textarea className={styles.textarea} rows={6} value={bioLocal}
          onChange={(e) => setBioLocal(e.target.value)}/>
        <button className={`${styles.saveBtn} ${bioSaved?styles.savedBtn:""}`} onClick={saveBio}
          style={{ marginTop:".75rem", alignSelf:"flex-start" }}>
          <HiCheck size={13}/> {bioSaved ? "Saved!" : "Save Bio"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ CV TAB ═══════════════ */
function CvTab({ data }) {
  const { cvData, cvName, cvSize, cvUploadedAt, setCv, removeCv } = data;
  const fileRef     = useRef();
  const [drag,      setDrag]     = useState(false);
  const [uploading, setUploading]= useState(false);
  const [error,     setError]    = useState("");
  const [replaced,  setReplaced] = useState(false);

  const MAX = 5 * 1024 * 1024; // 5 MB

  const process = useCallback(async (file) => {
    setError("");
    if (!file) return;
    const ALLOWED = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!ALLOWED.includes(file.type)) { setError("Only PDF, DOC or DOCX accepted."); return; }
    if (file.size > MAX) { setError("File too large. Max 5 MB."); return; }
    setUploading(true);
    try {
      await setCv({ file, name: file.name, size: file.size }); // pass raw File — Firebase uploads it
      setReplaced(true);
      setTimeout(() => setReplaced(false), 2500);
    } catch (err) {
      console.error("CV upload error:", err);
      setError("Upload failed. Check your Firebase Storage rules.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [setCv]);

  const onInput  = (e) => process(e.target.files?.[0]);
  const onDrop   = (e) => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files?.[0]); };
  const onOver   = (e) => { e.preventDefault(); setDrag(true); };
  const onLeave  = ()  => setDrag(false);

  const download = async () => {
    if (!cvData) return;
    try {
      // Firebase Storage URLs are cross-origin — fetch first, then blob-download
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

  const ext = cvName ? cvName.split(".").pop().toUpperCase() : "PDF";

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>CV / Resume</h3>
      </div>

      {/* Info */}
      <div className={styles.cvBanner}>
        <HiShieldCheck size={15} className={styles.cvBannerIcon}/>
        <p>Upload your CV here. The <strong>"Download Resume"</strong> button on the Hero section will serve exactly this file to visitors.</p>
      </div>

      {/* Drop zone or file card */}
      {!cvData ? (
        <div
          className={`${styles.dropZone} ${drag?styles.dropActive:""} ${uploading?styles.dropUploading:""}`}
          onClick={() => !uploading && fileRef.current?.click()}
          onDrop={onDrop} onDragOver={onOver} onDragLeave={onLeave}>
          {uploading
            ? <div className={styles.uploadingState}><div className={styles.cvSpinner}/><p>Uploading…</p></div>
            : <>
                <div className={styles.dropIcon}><HiCloudUpload size={34}/></div>
                <p className={styles.dropMain}>{drag ? "Drop your CV here" : "Click or drag & drop your CV"}</p>
                <p className={styles.dropSub}>PDF, DOC or DOCX · Max 5 MB</p>
              </>
          }
        </div>
      ) : (
        <motion.div className={styles.fileCard}
          initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}>
          <div className={styles.fileIcon}>
            <HiDocumentText size={20}/>
            <span className={styles.extBadge}>{ext}</span>
          </div>
          <div className={styles.fileInfo}>
            <p className={styles.fileName}>{cvName}</p>
            <p className={styles.fileMeta}>{fmtBytes(cvSize)}{cvUploadedAt && <> · Uploaded {fmtDate(cvUploadedAt)}</>}</p>
            {replaced && (
              <motion.p className={styles.replacedMsg}
                initial={{ opacity:0 }} animate={{ opacity:1 }}>
                <HiCheck size={11}/> CV updated successfully!
              </motion.p>
            )}
          </div>
          <div className={styles.fileActions}>
            <button className={styles.dlBtn}      onClick={download}>                         <HiDownload size={14}/> Download</button>
            <button className={styles.replaceBtn} onClick={() => fileRef.current?.click()}>   <HiUpload   size={13}/> Replace</button>
            <button className={styles.delFileBtn} onClick={removeCv} title="Remove CV">       <HiTrash    size={13}/></button>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.p className={styles.cvError} initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }}>
          ⚠ {error}
        </motion.p>
      )}

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className={styles.fileHidden} onChange={onInput}/>

      {cvData && (
        <div className={styles.cvTip}>
          <HiDocumentText size={13}/>
          <span>The <strong>Download Resume</strong> button in your Hero section now serves this file directly — no server required.</span>
        </div>
      )}

      <div className={styles.cvGuide}>
        <p className={styles.guideTitle}>Tips for a great CV</p>
        <ul className={styles.guideList}>
          <li>Export from Google Docs or Word as <strong>PDF</strong> for best compatibility</li>
          <li>Name it clearly: <code>Jaiganeshan_P_Resume_2025.pdf</code></li>
          <li>Keep it under 2 MB for fast downloads on mobile</li>
          <li>Avoid tables and text boxes — keep it ATS-friendly</li>
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════ SHARED MINI COMPONENTS ═══════════════ */
function DrawerHead({ title, onClose }) {
  return (
    <div className={styles.drawerHead}>
      <p className={styles.drawerTitle}>{title}</p>
      <button className={styles.drawerClose} onClick={onClose}><HiX size={14}/></button>
    </div>
  );
}
function DrawerFoot({ onCancel, onSave, label }) {
  return (
    <div className={styles.drawerFoot}>
      <button className={styles.cancelBtn2} onClick={onCancel}>Cancel</button>
      <button className={styles.saveBtn}    onClick={onSave}><HiCheck size={13}/> {label}</button>
    </div>
  );
}
function Actions({ onEdit, onDelete }) {
  return (
    <div className={styles.rowActions}>
      <button className={styles.editBtn}   onClick={onEdit}>  <HiPencil size={13}/></button>
      <button className={styles.deleteBtn} onClick={onDelete}><HiTrash  size={13}/></button>
    </div>
  );
}
function InputField({ label, value, onChange, placeholder, full }) {
  return (
    <div className={full ? styles.colFull : styles.field}>
      <Label>{label}</Label>
      <input className={styles.input} value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/>
    </div>
  );
}
function ImgPlaceholder({ text, sub }) {
  return (
    <div className={styles.imgPlaceholder}>
      <HiPhotograph size={26} style={{ opacity:.5 }}/>
      <span className={styles.imgPlMain}>{text}</span>
      <span className={styles.imgPlSub}>{sub}</span>
    </div>
  );
}
function Label({ children }) { return <label className={styles.label}>{children}</label>; }
function Hint({ children })  { return <span className={styles.hint}>{children}</span>; }
function Pill({ n })         { return <span className={styles.pill}>{n}</span>; }
function Empty({ msg })      { return <p className={styles.empty}>{msg}</p>; }
function Chip({ href, icon, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.chip}
      onClick={(e) => e.stopPropagation()}>
      {icon} {label}
    </a>
  );
}
function RemoveLink({ onClick, children, style }) {
  return <button className={styles.removeLink} onClick={onClick} style={style}>{children}</button>;
}
