import { useState, useEffect, useRef, createContext, useContext, type ReactNode } from "react";
import {
  Monitor,
  Server,
  Database,
  Cloud,
  Mail,
  ChevronDown,
  Truck,
  ShoppingCart,
  Dumbbell,
  Code2,
  Layers,
  Terminal,
  Cpu,
  ArrowRight,
  Menu,
  X,
  Zap,
  Globe,
  BarChart3,
  ExternalLink,
} from "lucide-react";

/* ─── svg icons ──────────────────────────────────────────────────── */

function LinkedinIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ─── i18n ───────────────────────────────────────────────────────── */

type Lang = "en" | "es";

const t = {
  en: {
    nav: { projects: "Projects", stack: "Stack", contact: "Contact" },
    hero: {
      badge: "Full-Stack Developer",
      h1: "I build products",
      h1Gradient: "end to end",
      sub: "Web apps, mobile apps & APIs — from design to AWS deployment.",
      techLine: "Kotlin · React · React Native · PostgreSQL · Docker",
      cta: "View projects",
      ctaContact: "Contact",
    },
    stats: {
      products: "Products in production",
      platforms: "Platforms deployed",
      records: "Records migrated",
      cloud: "Cloud infrastructure",
    },
    projects: {
      sectionLabel: "Portfolio",
      sectionTitle: "Projects",
      sectionSub: "Each project was designed, developed and deployed from scratch — backend, frontend, mobile and cloud.",
      viewStack: "View full stack",
      hideStack: "Hide stack",
      visitSite: "Visit site",
    },
    projectData: [
      {
        subtitle: "Courier Management System",
        description: "Full platform for delivery management with real-time GPS tracking, task assignment, push notifications, and admin panel. Includes a mobile app for couriers with navigation and delivery photo capture.",
        features: ["Real-time GPS tracking", "Smart task assignment", "Push notifications", "Delivery photos (AWS S3)", "Multi-organization", "Performance reports"],
      },
      {
        subtitle: "POS & Inventory System",
        description: "Modern point-of-sale system that replaced a legacy Clarion/TopSpeed system. Migration of +11,800 products and +195,000 historical sales. Offline mode, direct USB thermal printing, debt management, and real-time analytics dashboard via WebSockets.",
        features: ["Real-time POS search", "Offline mode + auto sync", "ESC/POS thermal printing", "Customer debt management", "Real-time KPI dashboard", "Multi-session tabs"],
      },
      {
        subtitle: "AI-Powered Fitness Tracker",
        description: "Fitness app with AI-powered routine generation using Amazon Bedrock (Nova Lite). Workout tracking, activity calendar, routine sharing with the community, and voice recognition for hands-free routine creation.",
        features: ["AI routine generation", "Workout tracking", "Activity calendar", "Share routines (social)", "Voice recognition", "30+ equipment catalog"],
      },
    ],
    techSection: { label: "Technologies", title: "Tech Stack" },
    contact: {
      label: "Contact",
      title: "Let's talk",
      sub: "Open to work opportunities. If you like what you see, reach out.",
    },
  },
  es: {
    nav: { projects: "Proyectos", stack: "Stack", contact: "Contacto" },
    hero: {
      badge: "Full-Stack Developer",
      h1: "Construyo productos",
      h1Gradient: "de punta a punta",
      sub: "Web apps, mobile apps y APIs — desde el diseño hasta el deploy en AWS.",
      techLine: "Kotlin · React · React Native · PostgreSQL · Docker",
      cta: "Ver proyectos",
      ctaContact: "Contacto",
    },
    stats: {
      products: "Productos en producción",
      platforms: "Plataformas desplegadas",
      records: "Registros migrados",
      cloud: "Cloud infrastructure",
    },
    projects: {
      sectionLabel: "Portfolio",
      sectionTitle: "Proyectos",
      sectionSub: "Cada proyecto fue diseñado, desarrollado y desplegado de cero — backend, frontend, mobile y cloud.",
      viewStack: "Ver stack completo",
      hideStack: "Ocultar stack",
      visitSite: "Visitar sitio",
    },
    projectData: [
      {
        subtitle: "Sistema de Gestión de Courier",
        description: "Plataforma completa para gestión de entregas con tracking GPS en tiempo real, asignación de tareas, notificaciones push, y panel admin. App mobile para cadetes con navegación y captura de fotos de entrega.",
        features: ["Tracking GPS en tiempo real", "Asignación inteligente de tareas", "Push notifications", "Fotos de entrega con S3", "Multi-organización", "Reportes de rendimiento"],
      },
      {
        subtitle: "Sistema POS & Inventario",
        description: "Sistema punto de venta que reemplazó un sistema legacy Clarion/TopSpeed. Migración de +11,800 productos y +195,000 ventas históricas. Modo offline, impresión térmica USB directa, gestión de deudas, y dashboard analítico en tiempo real via WebSockets.",
        features: ["POS con búsqueda instantánea", "Modo offline + sync automático", "Impresión térmica ESC/POS", "Gestión de deudas de clientes", "Dashboard KPIs en tiempo real", "Multi-sesión con tabs"],
      },
      {
        subtitle: "Fitness Tracker con IA",
        description: "App de fitness con generación de rutinas por IA usando Amazon Bedrock (Nova Lite). Tracking de entrenamientos, calendario de actividad, sharing de rutinas con la comunidad, y reconocimiento de voz para crear rutinas hands-free.",
        features: ["Generación de rutinas con IA", "Tracking de entrenamientos", "Calendario de actividad", "Compartir rutinas (social)", "Reconocimiento de voz", "Catálogo de +30 equipos"],
      },
    ],
    techSection: { label: "Tecnologías", title: "Stack Técnico" },
    contact: {
      label: "Contacto",
      title: "Hablemos",
      sub: "Abierto a oportunidades de trabajo. Si te interesa lo que ves, escribime.",
    },
  },
} as const;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });
const useLang = () => useContext(LangContext);
const useT = () => { const { lang } = useLang(); return t[lang]; };

/* ─── project base data (shared across langs) ───────────────────── */

const projectsBase = [
  {
    id: "kdt",
    title: "KDT Go",
    icon: Truck,
    accent: "#3b82f6",
    url: "https://kdtgo.com",
    platforms: ["Web Admin", "Mobile App", "REST API"],
    tech: {
      Frontend: ["React 18", "TypeScript", "Tailwind CSS", "Google Maps", "Recharts"],
      Mobile: ["React Native", "Expo 54", "Mapbox", "Background GPS"],
      Backend: ["Kotlin", "Ktor 3", "Exposed ORM", "JWT"],
      Infra: ["AWS EC2", "S3", "CloudFront", "ECR", "SES", "Docker"],
      Database: ["PostgreSQL 16", "Flyway"],
    },
  },
  {
    id: "vendiar",
    title: "Vendiar",
    icon: ShoppingCart,
    accent: "#10b981",
    url: "https://vendiar.com",
    platforms: ["PWA", "REST API", "WebSockets"],
    tech: {
      Frontend: ["React 19", "TypeScript", "Tailwind CSS 4", "Recharts", "PWA"],
      Backend: ["Kotlin", "Ktor 3", "Exposed ORM", "WebSockets"],
      Infra: ["AWS EC2", "S3", "CloudFront", "Docker", "GitHub Actions CI/CD"],
      Database: ["PostgreSQL 16", "Flyway", "HikariCP"],
    },
  },
  {
    id: "fitbdy",
    title: "FitBdy",
    icon: Dumbbell,
    accent: "#8b5cf6",
    url: "https://fitbdy.com",
    platforms: ["Web App", "Mobile App", "REST API"],
    tech: {
      Frontend: ["React 19", "TypeScript", "Tailwind CSS", "Radix UI", "Recharts"],
      Mobile: ["React Native", "Expo 54", "Speech Recognition"],
      Backend: ["Kotlin", "Ktor 3", "AWS Bedrock (Nova Lite)", "JWT"],
      Infra: ["AWS EC2", "EAS Build", "Docker"],
      Database: ["PostgreSQL", "Flyway"],
    },
  },
];

const techStack = [
  { title: "Frontend", icon: Monitor, items: ["React 18/19", "React Native", "TypeScript", "Tailwind CSS", "Vite", "Expo"] },
  { title: "Backend", icon: Server, items: ["Kotlin", "Ktor 3", "Exposed ORM", "JWT Auth", "WebSockets", "REST APIs"] },
  { title: "Databases", icon: Database, items: ["PostgreSQL 16", "Flyway Migrations", "HikariCP", "Testcontainers"] },
  { title: "Cloud & DevOps", icon: Cloud, items: ["AWS EC2 / S3 / CloudFront", "AWS Bedrock / SES / ECR", "Docker", "GitHub Actions CI/CD"] },
];

/* ─── hooks ──────────────────────────────────────────────────────── */

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ─── lang toggle ────────────────────────────────────────────────── */

function LangToggle() {
  const { lang, setLang } = useLang();
  const other: Lang = lang === "en" ? "es" : "en";

  return (
    <button
      onClick={() => setLang(other)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 999,
        background: "rgba(30,41,59,0.7)", border: "1px solid #334155",
        color: "#94a3b8", fontSize: 13, fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.02em",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#475569"; e.currentTarget.style.color = "white"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#94a3b8"; }}
    >
      <Globe size={13} />
      {other.toUpperCase()}
    </button>
  );
}

/* ─── nav ────────────────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const txt = useT();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "#projects", label: txt.nav.projects },
    { href: "#stack", label: txt.nav.stack },
    { href: "#contact", label: txt.nav.contact },
  ];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(11,17,33,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid #1e293b" : "1px solid transparent",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, color: "white", fontWeight: 700, fontSize: 17, textDecoration: "none" }}>
          <Code2 style={{ width: 20, height: 20, color: "#3b82f6" }} />
          kevin.dev
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{ fontSize: 14, color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >{l.label}</a>
          ))}
          <LangToggle />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="md:hidden">
          <LangToggle />
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden" style={{ background: "rgba(11,17,33,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e293b", padding: "8px 24px 16px" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "10px 0", color: "#94a3b8", textDecoration: "none", fontSize: 15 }}
            >{l.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ─── hero ───────────────────────────────────────────────────────── */

function Hero() {
  const txt = useT();
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "80px 24px 48px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "25%", width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <Reveal>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: "rgba(30,41,59,0.7)", border: "1px solid #334155", fontSize: 13, color: "#94a3b8", marginBottom: 32 }}>
            <Terminal size={14} />
            {txt.hero.badge}
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", color: "white", margin: "0 0 24px" }}>
            {txt.hero.h1}{" "}
            <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {txt.hero.h1Gradient}
            </span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#64748b", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
            {txt.hero.sub}
            <br />
            <span style={{ color: "#94a3b8" }}>{txt.hero.techLine}</span>
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="#projects" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "#3b82f6", color: "white", fontWeight: 600, fontSize: 15, borderRadius: 12, textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
            >
              {txt.hero.cta}
              <ArrowRight size={16} />
            </a>
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "rgba(30,41,59,0.6)", color: "#cbd5e1", fontWeight: 500, fontSize: 15, borderRadius: 12, border: "1px solid #334155", textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(51,65,85,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(30,41,59,0.6)")}
            >
              {txt.hero.ctaContact}
            </a>
          </div>
        </div>
      </Reveal>

      <a href="#projects" style={{ position: "absolute", bottom: 32, color: "#475569", animation: "bounce 2s infinite", textDecoration: "none" }}>
        <ChevronDown size={24} />
      </a>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </section>
  );
}

/* ─── stats ──────────────────────────────────────────────────────── */

function Stats() {
  const txt = useT();
  const items = [
    { icon: Zap, value: "3", label: txt.stats.products },
    { icon: Globe, value: "5", label: txt.stats.platforms },
    { icon: BarChart3, value: "200K+", label: txt.stats.records },
    { icon: Cloud, value: "AWS", label: txt.stats.cloud },
  ];

  return (
    <section style={{ padding: "0 24px 64px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {items.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ textAlign: "center", padding: "28px 20px", background: "#111827", borderRadius: 16, border: "1px solid #1e293b" }}>
                  <Icon size={20} style={{ color: "#3b82f6", margin: "0 auto 12px" }} />
                  <div style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── project card ───────────────────────────────────────────────── */

function ProjectCard({ project, index }: { project: typeof projectsBase[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const txt = useT();
  const langData = txt.projectData[index];
  const Icon = project.icon;
  const c = project.accent;

  return (
    <Reveal delay={index * 120}>
      <div style={{ borderRadius: 20, border: `1px solid ${c}22`, background: "#111827", overflow: "hidden", transition: "border-color 0.3s" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${c}44`)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${c}22`)}
      >
        <div style={{ height: 3, background: `linear-gradient(90deg, ${c}, ${c}88)` }} />

        <div style={{ padding: "28px 28px 24px" }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ padding: 12, borderRadius: 14, background: `${c}12`, flexShrink: 0 }}>
              <Icon size={24} style={{ color: c }} />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "white", margin: 0, lineHeight: 1.2 }}>{project.title}</h3>
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 12, fontWeight: 600, color: c, textDecoration: "none",
                    padding: "3px 10px", borderRadius: 999, border: `1px solid ${c}33`,
                    background: `${c}0a`, transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${c}18`; e.currentTarget.style.borderColor = `${c}55`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${c}0a`; e.currentTarget.style.borderColor = `${c}33`; }}
                >
                  <ExternalLink size={11} />
                  {txt.projects.visitSite}
                </a>
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: c, margin: "4px 0 0" }}>{langData.subtitle}</p>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {project.platforms.map((p) => (
                <span key={p} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: "#1a2332", color: "#94a3b8", border: "1px solid #1e293b", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>{p}</span>
              ))}
            </div>
          </div>

          {/* description */}
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#94a3b8", margin: 0 }}>{langData.description}</p>

          {/* features */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginTop: 20 }}>
            {langData.features.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cbd5e1" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>

          {/* tech toggle */}
          <button onClick={() => setExpanded(!expanded)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 20, padding: 0, border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: c }}
          >
            <Layers size={14} />
            {expanded ? txt.projects.hideStack : txt.projects.viewStack}
            <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
          </button>

          {expanded && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 16, animation: "fadeIn 0.3s ease" }}>
              {Object.entries(project.tech).map(([cat, items]: [string, string[]]) => (
                <div key={cat} style={{ background: "#0b1121", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{cat}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map((item) => (
                      <span key={item} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: "#1a2332", color: "#cbd5e1", border: "1px solid #1e293b" }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </Reveal>
  );
}

/* ─── projects section ───────────────────────────────────────────── */

function Projects() {
  const txt = useT();
  return (
    <section id="projects" style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase" }}>{txt.projects.sectionLabel}</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 800, color: "white", margin: "8px 0 12px", letterSpacing: "-0.02em" }}>{txt.projects.sectionTitle}</h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>{txt.projects.sectionSub}</p>
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {projectsBase.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── tech stack ─────────────────────────────────────────────────── */

function TechStackSection() {
  const txt = useT();
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

  return (
    <section id="stack" style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase" }}>{txt.techSection.label}</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 800, color: "white", margin: "8px 0 0", letterSpacing: "-0.02em" }}>{txt.techSection.title}</h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {techStack.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Reveal key={cat.title} delay={i * 80}>
                <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, padding: 24, height: "100%", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#334155")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
                >
                  <Icon size={20} style={{ color: colors[i], marginBottom: 14 }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", margin: "0 0 14px" }}>{cat.title}</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {cat.items.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8" }}>
                        <Cpu size={12} style={{ color: "#334155", flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── contact ────────────────────────────────────────────────────── */

function Contact() {
  const txt = useT();
  const btn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 28px", fontWeight: 600, fontSize: 15,
    borderRadius: 12, textDecoration: "none", transition: "all 0.2s", cursor: "pointer",
  };

  return (
    <section id="contact" style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#8b5cf6", letterSpacing: "0.1em", textTransform: "uppercase" }}>{txt.contact.label}</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 800, color: "white", margin: "8px 0 16px", letterSpacing: "-0.02em" }}>{txt.contact.title}</h2>
          <p style={{ fontSize: 16, color: "#64748b", marginBottom: 36 }}>{txt.contact.sub}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="mailto:kevin@example.com" style={{ ...btn, background: "#3b82f6", color: "white", border: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
            >
              <Mail size={17} /> Email
            </a>
            <a href="https://www.linkedin.com/in/kevinvinograd" target="_blank" rel="noopener noreferrer"
              style={{ ...btn, background: "#1a2332", color: "#cbd5e1", border: "1px solid #1e293b" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1e293b")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1a2332")}
            >
              <LinkedinIcon size={17} /> LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── footer ─────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer style={{ padding: 24, borderTop: "1px solid #1e293b" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" }}>
          <Code2 size={15} />
          &copy; {new Date().getFullYear()} Kevin
        </div>
        <div style={{ fontSize: 12, color: "#334155" }}>React + TypeScript + Tailwind CSS</div>
      </div>
    </footer>
  );
}

/* ─── app ────────────────────────────────────────────────────────── */

export default function App() {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Projects />
        <TechStackSection />
        <Contact />
      </main>
      <Footer />
    </LangContext.Provider>
  );
}
