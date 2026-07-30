import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase/supabase";
import {
  projects    as defaultProjects,
  experience  as defaultExperience,
  personalInfo as defaultPersonalInfo,
} from "../data/portfolioData";

// ── Session cache so page renders instantly on repeat visits ──────
const CACHE_KEY = "portfolio_cache_v1";
function readCache()       { try { const r = sessionStorage.getItem(CACHE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function writeCache(data)  { try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {} }
function clearCache()      { try { sessionStorage.removeItem(CACHE_KEY); } catch {} }

// ── Supabase table + storage bucket names ─────────────────────────
const TABLE   = "portfolio_content";   // Supabase table
const ROW_ID  = 1;                     // Single row stores all content
const BUCKET  = "jaiganeshan-portfolio";    // Storage bucket

// ── Upload a file to Supabase Storage, return public URL ──────────
async function uploadFile(path, file) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── Delete a file from Supabase Storage ──────────────────────────
async function deleteFile(path) {
  await supabase.storage.from(BUCKET).remove([path]);
}

export function usePortfolioData() {
  const cached = readCache();

  const [loading,      setLoading]          = useState(!cached);
  const [projects,     setProjectsState]    = useState(cached?.projects     || defaultProjects);
  const [experience,   setExperienceState]  = useState(cached?.experience   || defaultExperience);
  const [profileImage, setProfileImageState]= useState(cached?.profile_image|| null);
  const [heroImage,    setHeroImageState]   = useState(cached?.hero_image   || null);
  const [aboutText,    setAboutTextState]   = useState(cached?.about_text   || defaultPersonalInfo.about);
  const [cvData,       setCvDataState]      = useState(cached?.cv_url       || null);
  const [cvName,       setCvNameState]      = useState(cached?.cv_name      || null);
  const [cvSize,       setCvSizeState]      = useState(cached?.cv_size      || null);
  const [cvUploadedAt, setCvUploadedAtState]= useState(cached?.cv_uploaded_at || null);

  // ── Apply a Supabase row snapshot to React state ──────────────
  const applyRow = useCallback((row) => {
    if (!row) return;
    if (row.projects      != null) setProjectsState(row.projects      || defaultProjects);
    if (row.experience    != null) setExperienceState(row.experience  || defaultExperience);
    if (row.profile_image != null) setProfileImageState(row.profile_image);
    if (row.hero_image    != null) setHeroImageState(row.hero_image);
    if (row.about_text    != null) setAboutTextState(row.about_text   || defaultPersonalInfo.about);
    if (row.cv_url        != null) setCvDataState(row.cv_url);
    if (row.cv_name       != null) setCvNameState(row.cv_name);
    if (row.cv_size       != null) setCvSizeState(row.cv_size);
    if (row.cv_uploaded_at!= null) setCvUploadedAtState(row.cv_uploaded_at);
    writeCache(row);
  }, []);

  // ── Initial fetch + real-time subscription ────────────────────
  useEffect(() => {
    // Fetch current data
    supabase
      .from(TABLE)
      .select("*")
      .eq("id", ROW_ID)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== "PGRST116") {
          // PGRST116 = row not found (first run) — not a real error
          console.error("Supabase fetch error:", error);
        }
        if (data) applyRow(data);
        setLoading(false);
      });

    // Real-time subscription — updates UI live when row changes
    const channel = supabase
      .channel("portfolio_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE, filter: `id=eq.${ROW_ID}` },
        (payload) => {
          if (payload.new) applyRow(payload.new);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [applyRow]);

  // ── Upsert helper — creates row on first run, updates after ───
  const upsert = useCallback(async (fields) => {
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, ...fields }, { onConflict: "id" });
    if (error) throw error;
  }, []);

  // ── Projects ──────────────────────────────────────────────────
  const setProjects = useCallback(async (val) => {
    const next = typeof val === "function" ? val(projects) : val;
    setProjectsState(next);
    await upsert({ projects: next });
  }, [projects, upsert]);

  // ── Experience ────────────────────────────────────────────────
  const setExperience = useCallback(async (val) => {
    const next = typeof val === "function" ? val(experience) : val;
    setExperienceState(next);
    await upsert({ experience: next });
  }, [experience, upsert]);

  // ── About text ────────────────────────────────────────────────
  const setAboutText = useCallback(async (text) => {
    setAboutTextState(text);
    await upsert({ about_text: text });
  }, [upsert]);

  // ── Profile image ─────────────────────────────────────────────
  const setProfileImage = useCallback(async (fileOrNull) => {
    if (!fileOrNull) {
      setProfileImageState(null);
      await upsert({ profile_image: null });
      await deleteFile("images/profile");
      return;
    }
    const url = await uploadFile("images/profile", fileOrNull);
    setProfileImageState(url);
    await upsert({ profile_image: url });
  }, [upsert]);

  // ── Hero background ───────────────────────────────────────────
  const setHeroImage = useCallback(async (fileOrNull) => {
    if (!fileOrNull) {
      setHeroImageState(null);
      await upsert({ hero_image: null });
      await deleteFile("images/hero");
      return;
    }
    const url = await uploadFile("images/hero", fileOrNull);
    setHeroImageState(url);
    await upsert({ hero_image: url });
  }, [upsert]);

  // ── CV upload ─────────────────────────────────────────────────
  const setCv = useCallback(async ({ file, name, size }) => {
    const path       = `cv/${name}`;
    const url        = await uploadFile(path, file);
    const uploadedAt = new Date().toISOString();
    setCvDataState(url);
    setCvNameState(name);
    setCvSizeState(size);
    setCvUploadedAtState(uploadedAt);
    await upsert({ cv_url: url, cv_name: name, cv_size: size, cv_uploaded_at: uploadedAt });
  }, [upsert]);

  // ── Remove CV ─────────────────────────────────────────────────
  const removeCv = useCallback(async () => {
    if (cvName) await deleteFile(`cv/${cvName}`);
    setCvDataState(null); setCvNameState(null);
    setCvSizeState(null); setCvUploadedAtState(null);
    await upsert({ cv_url: null, cv_name: null, cv_size: null, cv_uploaded_at: null });
  }, [cvName, upsert]);

  // ── Reset all ─────────────────────────────────────────────────
  const resetAll = useCallback(async () => {
    clearCache();
    await upsert({
      projects:      defaultProjects,
      experience:    defaultExperience,
      about_text:    defaultPersonalInfo.about,
      profile_image: null,
      hero_image:    null,
      cv_url:        null,
      cv_name:       null,
      cv_size:       null,
      cv_uploaded_at: null,
    });
  }, [upsert]);

  return {
    loading,
    projects,     setProjects,
    experience,   setExperience,
    profileImage, setProfileImage,
    heroImage,    setHeroImage,
    aboutText,    setAboutText,
    cvData,       cvName, cvSize, cvUploadedAt,
    setCv,        removeCv,
    resetAll,
  };
}
