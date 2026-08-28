import { useState, useEffect, useRef } from "react";
import { CLUBS_DATA, COMMON_FOOD_MENU } from "./data/clubsData";
import ClubView from "./components/ClubView";
import BookingModal from "./components/BookingModal";
import ClubMap from "./components/ClubMap";
import PhotoLightbox from "./components/PhotoLightbox";
import {
  PinIcon,
  ClockIcon,
  VkIcon,
  FlameIcon,
  GamepadIcon,
  TrophyIcon,
  ZapIcon,
  ArrowRightIcon,
  PizzaIcon,
  SnackIcon,
  TeaIcon,
  AppleIcon,
  PlayStoreIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TableIcon,
} from "./components/Icons";

/* ─── Global Cyber CSS ───────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes floatChar {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes subtleZoom {
    0%   { transform: scale(1); }
    100% { transform: scale(1.06); }
  }
  .anim-zoom { animation: subtleZoom 7s ease-out forwards; }
  .scrollbar-none::-webkit-scrollbar { display: none; }
  .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:#050813; }
  ::-webkit-scrollbar-thumb { background:#151b36; border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:#0066ff; }
  .custom-leaflet-pin, .custom-leaflet-marker { background: transparent !important; border: none !important; }
  .leaflet-container { background: #050813 !important; font-family: 'Exo 2', sans-serif; }
  .leaflet-tile-pane { filter: grayscale(100%) invert(92%) contrast(125%) brightness(80%) !important; }
  .leaflet-bar a { background: #0c1024 !important; color: #fff !important; border-color: #1a234a !important; }
  .leaflet-bar a:hover { background: #0066ff !important; }
`;

/* ─── Dot Matrix Grid Component ──────────────────────────────────────────── */
function DotMatrix({ rows = 3, cols = 6, className = "" }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div
      className={`grid gap-1.5 select-none pointer-events-none ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/40 block" />
      ))}
    </div>
  );
}

/* ─── STRIKE Logo ────────────────────────────────────────────────────────── */
function StrikeLogo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex flex-col select-none ${className}`}>
      <span
        className="text-2xl sm:text-3xl tracking-wider text-white leading-none font-bold italic"
        style={{ fontFamily: "'Russo One',sans-serif" }}
      >
        STRIKE
      </span>
      <span
        className="text-[9px] sm:text-[10px] text-[#00d4ff] font-bold tracking-[0.28em] uppercase mt-0.5"
        style={{ fontFamily: "'Exo 2',sans-serif" }}
      >
        CYBER CLUB
      </span>
    </div>
  );
}

/* ─── Section Header with Cyber Slashes «НАШИ КЛУБЫ //» ──────────────────── */
function SectionHeader({
  whiteText,
  blueText,
  subText,
  actionText,
  onActionClick,
}: {
  whiteText: string;
  blueText: string;
  subText?: string;
  actionText?: string;
  onActionClick?: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-2">
      <div className="flex items-center gap-4 flex-1">
        <h2
          className="text-2xl sm:text-3.5xl lg:text-4xl font-bold tracking-tight uppercase flex items-center gap-2.5 shrink-0"
          style={{ fontFamily: "'Russo One',sans-serif" }}
        >
          <span className="text-white">{whiteText}</span>
          <span className="text-[#0088ff]">{blueText} //</span>
        </h2>
        <div className="h-[2px] bg-gradient-to-r from-[#0088ff]/60 via-[#0088ff]/20 to-transparent flex-1 hidden sm:block max-w-sm" />
      </div>

      <div className="flex items-center gap-6 justify-between md:justify-end">
        {subText && (
          <p
            className="text-slate-400 text-xs leading-relaxed max-w-xs text-right hidden sm:block font-normal"
            style={{ fontFamily: "'Exo 2',sans-serif" }}
          >
            {subText}
          </p>
        )}

        {actionText && (
          <button
            onClick={onActionClick}
            className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#00d4ff] bg-[#080c1b] hover:bg-[#0c1024] border border-white/20 hover:border-[#0088ff] rounded-xl transition-all cursor-pointer shrink-0"
            style={{ fontFamily: "'Exo 2',sans-serif" }}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({
  activeClubId,
  onNavigateHome,
  onOpenBooking,
}: {
  activeClubId: number | null;
  onNavigateHome: () => void;
  onSelectClub: (id: number) => void;
  onOpenBooking: (id?: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const navLinks = activeClubId === null
    ? [
        ["ГЛАВНАЯ", "#hero"],
        ["КЛУБЫ", "#clubs"],
        ["ТАРИФЫ", "#pricing"],
        ["АКЦИИ", "#promotions"],
        ["БАР И ЕДА", "#food"],
        ["ГАЛЕРЕЯ", "#gallery"],
        ["КОНТАКТЫ", "#contacts"],
      ]
    : [
        ["Акции клуба", "#club-promotions"],
        ["Галерея", "#club-gallery"],
        ["Железо и зоны", "#club-hardware"],
        ["Тарифы", "#club-pricing"],
        ["Бар и еда", "#club-food"],
        ["SmartGamer", "#club-smartgamer"],
        ["Контакты", "#club-contacts"],
      ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 h-20 flex items-center justify-between"
      style={{
        background: "rgba(5,8,19,0.94)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full h-full flex items-center justify-between gap-6 relative">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none z-10"
        >
          <StrikeLogo size={46} />
        </button>

        {/* Center Nav links */}
        <ul className="hidden lg:flex items-center gap-6 z-10">
          {navLinks.map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-[#0088ff] transition-colors duration-200"
                style={{ fontFamily: "'Exo 2',sans-serif" }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Section: Booking Button */}
        <div className="hidden sm:flex items-center gap-5 z-10">
          <button
            onClick={() => onOpenBooking(activeClubId ?? undefined)}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#0066ff] hover:bg-[#1a75ff] rounded-xl shadow-[0_0_25px_rgba(0,102,255,0.7)] transition-all cursor-pointer"
            style={{ fontFamily: "'Exo 2',sans-serif" }}
          >
            ЗАБРОНИРОВАТЬ
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 text-slate-300 hover:text-white focus:outline-none cursor-pointer z-10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 w-full bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-white transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-white transition-all ${open ? "-rotate-45 -translate-y-2.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          className="lg:hidden fixed top-20 left-0 right-0 border-t px-6 py-5 flex flex-col gap-4 z-50 shadow-2xl"
          style={{ background: "#050813", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={() => {
              onOpenBooking(activeClubId ?? undefined);
              setOpen(false);
            }}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#0066ff] rounded-xl shadow-lg text-center"
            style={{ fontFamily: "'Exo 2',sans-serif" }}
          >
            ЗАБРОНИРОВАТЬ МЕСТО
          </button>

          <div className="flex flex-col gap-3 pt-2">
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-[#0088ff] py-1 transition-colors"
                style={{ fontFamily: "'Exo 2',sans-serif" }}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero Section with Seamless Borderless Photo Slideshow ──────────────── */
function Hero() {
  const slides = [
    {
      image: "./photos/lomonosova/photo-3.jpg",
      badge: "STRIKE ул. Ломоносова, 84",
      spec: "RTX 4070 Ti · 240Hz · HyperX Cloud Alpha",
    },
    {
      image: "./photos/lomonosova/photo-2.jpg",
      badge: "STRIKE ул. Ломоносова, 84",
      spec: "DUO / TRIO Зона · Ryzen 7800X3D · 600Hz",
    },
    {
      image: "./photos/20let/photo-1.jpg",
      badge: "STRIKE ул. 20-летия Октября, 101",
      spec: "VIP Zone · RTX 4070 Ti · 390Hz FAST IPS",
    },
    {
      image: "./photos/lomonosova/photo-6.jpg",
      badge: "STRIKE Киберарена",
      spec: "45 ПК · 24/7 Круглосуточно · Бар & Кальян",
    },
    {
      image: "./photos/shilovo/photo-1.jpg",
      badge: "STRIKE ул. Ключникова, 1 (Шилово)",
      spec: "BOOTCAMP · RTX 4070 Super · 280Hz",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="hero" className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden pt-20 pb-12" style={{ background: "#050813" }}>
      {/* Background Seamless Photo Slider bleeding to left */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] overflow-hidden pointer-events-none z-0">
        {slides.map((slide, idx) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.badge}
              className={`w-full h-full object-cover object-center ${idx === currentSlide ? "anim-zoom" : ""}`}
            />
          </div>
        ))}

        {/* Soft Multi-layered Left & Bottom Vignette / Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050813] via-[#050813]/70 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050813] via-[#050813]/30 to-transparent z-20" />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050813] to-transparent z-20" />
      </div>

      {/* Top Left Dot Matrix */}
      <div className="absolute top-24 left-8 sm:left-24 hidden sm:block select-none z-10">
        <DotMatrix rows={3} cols={6} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 w-full relative">
        {/* Left Column: Slogan & Actions */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center pt-2">
          {/* Slogan */}
          <h1
            className="text-white text-5xl sm:text-6.5xl lg:text-7xl leading-[0.94] tracking-tight uppercase mb-6 select-none"
            style={{ fontFamily: "'Russo One',sans-serif" }}
          >
            ТВОЯ <span className="text-[#0088ff]">ИГРА.</span>
            <br />
            ТВОИ <span className="text-[#0088ff]">ПРАВИЛА.</span>
          </h1>

          <p
            className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-lg font-normal drop-shadow-md"
            style={{ fontFamily: "'Exo 2',sans-serif" }}
          >
            STRIKE — это сеть премиальных компьютерных клубов Воронежа. Мощное железо до RTX 5070 / 4070 Ti, экраны до 600 Гц, топовая кухня и атмосфера киберспорта 24/7.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
            <a
              href="#clubs"
              className="px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#0066ff] hover:bg-[#1a75ff] rounded-xl shadow-[0_0_30px_rgba(0,102,255,0.7)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              <span>ВЫБРАТЬ КЛУБ</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>

            <a
              href="#promotions"
              className="px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white bg-[#080c1b]/90 hover:bg-[#0c1024] border border-[#0066ff]/40 hover:border-[#0088ff] rounded-xl transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              <FlameIcon className="w-4 h-4 text-[#00d4ff]" />
              <span>СМОТРЕТЬ АКЦИИ</span>
              <span className="text-[#0088ff] text-xs font-mono">[//]</span>
            </a>
          </div>

          {/* Bottom Left Tech Indicators */}
          <div className="flex items-center gap-6 pt-1 select-none">
            <div className="flex items-center gap-1.5 text-xs text-[#00d4ff]">
              <span>▲</span>
              <span>▲</span>
            </div>
            <DotMatrix rows={2} cols={6} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Hero Feature Ribbon ─────────────────────────────────────────────────── */
function FeatureRibbon() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      title: "МОЩНОЕ ЖЕЛЕЗО",
      sub: "RTX 5070 / 4070 Ti / 3080",
    },
    {
      icon: <GamepadIcon className="w-6 h-6 text-white" />,
      title: "ТОПОВАЯ ПЕРИФЕРИЯ",
      sub: "Logitech Superlight, HyperX, Dark Project",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
      title: "КУХНЯ И ЧАЙНАЯ",
      sub: "Пицца, горячие снеки, пуэры 24/7",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
      title: "КРУГЛОСУТОЧНО 24/7",
      sub: "Все 3 филиала открыты без перерывов",
    },
  ];

  return (
    <div className="border-y border-white/[0.08] bg-[#070b1a] py-6 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] sm:bg-transparent border border-white/[0.06] sm:border-none"
          >
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0">
              {f.icon}
            </div>
            <div>
              <h3
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: "'Russo One',sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-normal mt-0.5 leading-snug" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                {f.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section «НАШИ КЛУБЫ //» (Prominent Large Cards + Clean Address Titles) ─── */
function ClubsSection({
  onSelectClub,
  onOpenBooking,
}: {
  onSelectClub: (clubId: number) => void;
  onOpenBooking: (clubId: number) => void;
}) {
  return (
    <section id="clubs" className="py-20" style={{ background: "#050813" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          whiteText="НАШИ"
          blueText="КЛУБЫ"
          subText="3 премиальных филиала в Воронеже. Выбирай удобный клуб, топовое железо и бронируй место онлайн 24/7"
          actionText="ВСЕ КЛУБЫ"
          onActionClick={() => onSelectClub(0)}
        />

        {/* Mobile Swipe Hint */}
        <div className="flex sm:hidden items-center justify-between text-[11px] text-slate-400 mb-4 px-1 font-medium" style={{ fontFamily: "'Exo 2',sans-serif" }}>
          <span>Свайпайте вправо/влево для выбора клуба</span>
          <span className="text-[#0088ff] font-bold">← →</span>
        </div>

        {/* 3 Large High-Impact Cards (Swipeable on Mobile, unclipped glow on desktop) */}
        <div className="flex lg:grid lg:grid-cols-3 gap-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none py-8 px-2">
          {CLUBS_DATA.map((club) => (
            <div
              key={club.id}
              className="min-w-[320px] sm:min-w-0 flex-1 rounded-3xl bg-[#080c1b] border border-[#0066ff]/35 hover:border-[#0088ff] transition-all duration-300 p-6 shadow-2xl flex flex-col justify-between group snap-center hover:shadow-[0_0_40px_rgba(0,102,255,0.3)] hover:-translate-y-1"
            >
              <div>
                {/* Large High-Res Photo Header (Clean without overlay badges) */}
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 bg-[#050813] shrink-0 border border-white/[0.08]">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080c1b]/80 via-transparent to-transparent" />
                </div>

                {/* Big Address Title */}
                <h3
                  className="text-xl sm:text-2xl font-bold uppercase text-white group-hover:text-[#0088ff] transition-colors tracking-tight leading-snug mb-3"
                  style={{ fontFamily: "'Russo One',sans-serif" }}
                >
                  {club.shortName}
                </h3>

                {/* Address & Metro/Location */}
                <div className="flex flex-col gap-2 text-xs sm:text-sm text-slate-300 mb-5 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  <div className="flex items-center gap-2">
                    <PinIcon className="w-4 h-4 text-[#0088ff] shrink-0" />
                    <span className="text-slate-300 font-medium">{club.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#10b981] font-semibold">
                    <ClockIcon className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Работаем 24/7</span>
                  </div>
                </div>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0066ff]/20 border border-[#0066ff]/40 text-[11px] text-[#00d4ff] font-bold" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    {club.workstationsCount} ПК ({club.tag})
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 font-medium" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    RTX 5070 / 4070 Ti
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 font-medium" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    Мониторы 240–600 Гц
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 font-medium" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    PS5 Lounge
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 font-medium" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    {club.food.available ? "Бар & Чайная" : "Снеки & Напитки"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => onSelectClub(club.id)}
                  className="flex-1 py-3.5 px-5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#0066ff] hover:bg-[#1a75ff] rounded-xl shadow-[0_0_20px_rgba(0,102,255,0.4)] transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Exo 2',sans-serif" }}
                >
                  <span>ПОДРОБНЕЕ О КЛУБЕ</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenBooking(club.id)}
                  className="p-3.5 rounded-xl bg-white/[0.06] hover:bg-[#0066ff] text-[#00d4ff] hover:text-white border border-white/10 hover:border-[#0066ff] transition-all cursor-pointer shrink-0 shadow-md"
                  title="Забронировать в этом клубе"
                >
                  <PinIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section «ИГРОВЫЕ ЗОНЫ //» (Swipeable Row on Mobile) ─────────────────── */
function ZonesSection({ onSelectClub }: { onSelectClub: (id: number) => void }) {
  const zonesList = [
    {
      id: "comfort",
      name: "COMFORT",
      sub: "Intel i5 + RTX 3070 Ti / 165Hz",
      icon: (
        <svg className="w-5 h-5 text-[#0088ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: "pro",
      name: "PRO",
      sub: "RTX 3070 Ti / 240Hz FAST IPS",
      icon: <TrophyIcon className="w-5 h-5 text-[#0088ff]" />,
    },
    {
      id: "bootcamp",
      name: "BOOTCAMP / VIP",
      sub: "RTX 4070 Ti / 240-390Hz",
      icon: <FlameIcon className="w-5 h-5 text-[#0088ff]" />,
    },
    {
      id: "duo",
      name: "DUO / TRIO",
      sub: "Ryzen 7800X3D + RTX 5070 / 600Hz",
      icon: (
        <svg className="w-5 h-5 text-[#0088ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "ps5",
      name: "PS5 LOUNGE",
      sub: "PlayStation 5 + 4K OLED + Кальян",
      icon: <GamepadIcon className="w-5 h-5 text-[#0088ff]" />,
    },
    {
      id: "bar",
      name: "FOOD & TEA",
      sub: "Горячая пицца, снеки и элитный чай",
      icon: <ZapIcon className="w-5 h-5 text-[#0088ff]" />,
    },
  ];

  return (
    <section id="zones" className="py-14 border-t border-white/[0.06]" style={{ background: "#070b1a" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          whiteText="ИГРОВЫЕ"
          blueText="ЗОНЫ"
          subText="Выбери сетап под свой стиль игры: от комфортного соло до киберспортивных 600 Гц"
          actionText="ВСЕ ЗОНЫ"
          onActionClick={() => onSelectClub(0)}
        />

        {/* 6 Zone Cards (Swipeable on Mobile) */}
        <div className="flex lg:grid lg:grid-cols-6 gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 sm:pb-0">
          {zonesList.map((z) => (
            <div
              key={z.id}
              className="min-w-[210px] lg:min-w-0 p-4 rounded-2xl bg-[#050813] border border-white/[0.08] hover:border-[#0088ff] transition-all duration-300 flex flex-col justify-between group cursor-pointer snap-center shadow-lg"
              onClick={() => onSelectClub(0)}
            >
              <div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit mb-3 group-hover:bg-[#0066ff]/20 transition-colors">
                  {z.icon}
                </div>
                <h3
                  className="text-sm font-bold text-white uppercase tracking-wider mb-1"
                  style={{ fontFamily: "'Russo One',sans-serif" }}
                >
                  {z.name}
                </h3>
                <p className="text-[11px] text-slate-300 font-normal leading-tight" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  {z.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Promotions Section with High Contrast & Correct Posters ────────────── */
function PromotionsOverview({ onOpenClubPage }: { onOpenClubPage: (id: number) => void }) {
  const [selectedClubId, setSelectedClubId] = useState<number>(0);
  const currentClub = CLUBS_DATA[selectedClubId] || CLUBS_DATA[0];

  return (
    <section id="promotions" className="py-20 border-t border-white/[0.06]" style={{ background: "#070b1a" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          whiteText="АКЦИИ И"
          blueText="БОНУСЫ"
          subText="Кешбэк за пополнение, скидка 10% военным/курсантам, накопительная лояльность"
          actionText={`АКЦИИ ${currentClub.shortName}`}
          onActionClick={() => onOpenClubPage(selectedClubId)}
        />

        {/* Club selector tabs (Swipeable on Mobile) */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-none pb-2">
          {CLUBS_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClubId(c.id)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer shrink-0 ${
                selectedClubId === c.id
                  ? "bg-[#0066ff] text-white shadow-lg"
                  : "bg-[#050813] text-slate-300 border border-white/[0.08] hover:text-white"
              }`}
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              {c.shortName}
            </button>
          ))}
        </div>

        {/* Promotions Grid (Swipeable on Mobile) */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
          {currentClub.promotions.map((promo) => (
            <div
              key={promo.id}
              className="min-w-[300px] sm:min-w-0 flex-1 flex flex-col h-full bg-[#050813] border border-white/[0.12] hover:border-[#0066ff]/70 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 snap-center"
            >
              {/* Poster Image with Dark Bottom Gradient */}
              <div className="w-full aspect-video bg-[#050813] overflow-hidden relative border-b border-white/[0.08]">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050813] via-transparent to-transparent opacity-80" />
              </div>

              {/* High-Contrast Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4 bg-[#080c1b]">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white rounded-lg shadow-sm"
                      style={{
                        fontFamily: "'Exo 2',sans-serif",
                        background: promo.badgeColor || "#0066ff",
                      }}
                    >
                      {promo.badge}
                    </span>
                    {promo.highlight && (
                      <span className="text-xs font-bold text-[#0088ff] uppercase" style={{ fontFamily: "'Russo One',sans-serif" }}>
                        {promo.highlight}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-lg font-bold text-white mb-2 leading-snug"
                    style={{ fontFamily: "'Russo One',sans-serif" }}
                  >
                    {promo.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-4 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    {promo.description}
                  </p>

                  {/* Cashback Tiers */}
                  {promo.tiers && (
                    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#0066ff]/10 border border-[#0066ff]/30 mb-3">
                      <div className="text-[11px] uppercase font-bold tracking-wider text-[#00d4ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                        Таблица бонусов:
                      </div>
                      {promo.tiers.map((t) => (
                        <div
                          key={t.label}
                          className="flex items-center justify-between py-1 border-b border-white/[0.08] last:border-none text-xs"
                          style={{ fontFamily: "'Exo 2',sans-serif" }}
                        >
                          <span className="font-semibold text-white">{t.label}</span>
                          <span className="font-bold text-[#00d4ff]">{t.bonus}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Loyalty Ranks */}
                  {promo.ranks && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {promo.ranks.map((r) => (
                        <div
                          key={r.rank}
                          className="p-2.5 rounded-xl bg-[#050813] border border-white/[0.08]"
                        >
                          <div className="text-xs font-bold" style={{ color: r.color, fontFamily: "'Russo One',sans-serif" }}>
                            {r.rank}
                          </div>
                          <div className="text-[11px] text-slate-400" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                            {r.time}
                          </div>
                          <div className="text-xs font-bold text-white mt-1" style={{ fontFamily: "'Russo One',sans-serif" }}>
                            Скидка {r.discount}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section «ТАРИФЫ И ЦЕНЫ //» ─────────────────────────────────────────── */
function PricingSection({ onOpenBooking }: { onOpenBooking: (clubId?: number) => void }) {
  const [selectedClubId, setSelectedClubId] = useState<number>(0);
  const club = CLUBS_DATA.find((c) => c.id === selectedClubId) || CLUBS_DATA[0];

  // Helper to split and render readable prices
  const renderPriceFormatted = (priceStr: string) => {
    const match = priceStr.match(/^([\d\s]+)\s*(.*)$/);
    if (match) {
      const num = match[1].trim();
      const unit = match[2].trim();
      return (
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-white text-lg sm:text-xl font-black tracking-tight" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            {num}
          </span>
          {unit && (
            <span className="text-[#00d4ff] font-bold text-xs sm:text-sm tracking-wide">
              {unit}
            </span>
          )}
        </div>
      );
    }
    return (
      <span className="text-white text-base font-bold" style={{ fontFamily: "'Exo 2',sans-serif" }}>
        {priceStr}
      </span>
    );
  };

  return (
    <section id="pricing" className="py-20" style={{ background: "#050813" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          whiteText="ТАРИФЫ И"
          blueText="ЦЕНЫ"
          subText="Актуальная стоимость пакетов игрового времени и PlayStation 5 по филиалам"
        />

        {/* Club selection tabs (Primary & Prominent) */}
        <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-none pb-2">
          {CLUBS_DATA.map((c) => {
            const active = selectedClubId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClubId(c.id)}
                className={`px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all rounded-2xl cursor-pointer shrink-0 flex items-center gap-2.5 ${
                  active
                    ? "bg-[#0066ff] text-white shadow-[0_0_25px_rgba(0,102,255,0.75)] border border-[#00d4ff]/60 scale-[1.02]"
                    : "bg-[#080c1b] text-slate-300 border border-white/[0.08] hover:text-white hover:border-[#0066ff]/50"
                }`}
                style={{ fontFamily: "'Exo 2',sans-serif" }}
              >
                <PinIcon className={`w-4 h-4 ${active ? "text-[#00d4ff]" : "text-[#0088ff]"}`} />
                <span>{c.shortName}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                  active ? "bg-black/30 text-white" : "bg-white/5 text-slate-400"
                }`}>
                  {c.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Unified Card with ALL Prices */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#080c1b] border border-white/[0.1] shadow-2xl">
          {/* Header of selected club */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <p className="text-xl sm:text-2xl text-white font-bold" style={{ fontFamily: "'Russo One',sans-serif" }}>
                {club.name}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                {club.address} · <span className="text-[#10b981] font-semibold">Работаем 24/7</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#promotions"
                className="hidden sm:inline-flex text-xs sm:text-sm text-[#00d4ff] hover:underline items-center gap-1.5 font-bold"
                style={{ fontFamily: "'Exo 2',sans-serif" }}
              >
                <FlameIcon className="w-4 h-4 text-[#0088ff]" />
                <span>Акции и бонусы →</span>
              </a>
              <button
                onClick={() => onOpenBooking(club.id)}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0066ff] hover:bg-[#1a75ff] rounded-xl shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all cursor-pointer"
                style={{ fontFamily: "'Exo 2',sans-serif" }}
              >
                Забронировать место
              </button>
            </div>
          </div>

          {/* 1. PC Pricing Table (All Zones) */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <GamepadIcon className="w-4 h-4 text-[#0088ff]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                Игровой ПК · Все зоны и тарифы
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: 480 }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        width: "30%",
                        padding: "14px 16px",
                        fontFamily: "'Exo 2',sans-serif",
                        fontSize: 12,
                        color: "#94a3b8",
                        textAlign: "left",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      ПАКЕТ ВРЕМЕНИ
                    </th>
                    {club.pricing.pc.zones.map((z) => (
                      <th
                        key={z}
                        style={{
                          padding: "14px 16px",
                          fontFamily: "'Exo 2',sans-serif",
                          fontSize: 13,
                          fontWeight: "bold",
                          color: "#ffffff",
                          textAlign: "center",
                          borderBottom: "2px solid #0066ff",
                          borderLeft: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(0,102,255,0.12)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {z}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {club.pricing.pc.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="transition-colors duration-150 hover:bg-[#0066ff]/5"
                    >
                      <td style={{ padding: "4px 0" }}>
                        <div
                          className="flex flex-col items-start justify-center px-4 py-3 rounded-xl shadow-sm"
                          style={{ background: row.color, minHeight: 54 }}
                        >
                          <span style={{ fontFamily: "'Russo One',sans-serif", fontSize: 15, color: "#fff", lineHeight: 1.1 }}>
                            {row.label}
                          </span>
                          {row.sub && (
                            <span
                              style={{
                                fontFamily: "'Exo 2',sans-serif",
                                fontSize: 11,
                                color: "rgba(255,255,255,0.85)",
                                marginTop: 3,
                              }}
                            >
                              {row.sub}
                            </span>
                          )}
                        </div>
                      </td>
                      {row.prices.map((p, pi) => (
                        <td key={pi} style={{ padding: "4px 0 4px 6px" }}>
                          <div
                            className="flex items-center justify-center px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#0088ff]/40 transition-colors"
                            style={{ minHeight: 54 }}
                          >
                            {renderPriceFormatted(p)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. PS5 Lounge Table */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GamepadIcon className="w-4 h-4 text-[#0088ff]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                PlayStation 5 Lounge
              </span>
            </div>
            <div className="overflow-x-auto">
              <table style={{ minWidth: 320 }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        width: 190,
                        padding: "12px 14px",
                        fontFamily: "'Exo 2',sans-serif",
                        fontSize: 12,
                        color: "#94a3b8",
                        textAlign: "left",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      ПАКЕТ ВРЕМЕНИ
                    </th>
                    {club.pricing.ps5.zones.map((z) => (
                      <th
                        key={z}
                        style={{
                          padding: "12px 24px",
                          fontFamily: "'Exo 2',sans-serif",
                          fontSize: 13,
                          fontWeight: "bold",
                          color: "#ffffff",
                          textAlign: "center",
                          borderBottom: "2px solid #0066ff",
                          borderLeft: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(0,102,255,0.12)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {z}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {club.pricing.ps5.rows.map((row, ri) => (
                    <tr key={ri}>
                      <td style={{ padding: "4px 0" }}>
                        <div
                          className="flex flex-col items-start justify-center px-4 py-3 rounded-xl shadow-sm"
                          style={{ background: row.color, minHeight: 52 }}
                        >
                          <span style={{ fontFamily: "'Russo One',sans-serif", fontSize: 14, color: "#fff" }}>
                            {row.label}
                          </span>
                          {row.sub && (
                            <span style={{ fontFamily: "'Exo 2',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                              {row.sub}
                            </span>
                          )}
                        </div>
                      </td>
                      {row.prices.map((p, pi) => (
                        <td key={pi} style={{ padding: "4px 0 4px 6px" }}>
                          <div className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#0088ff]/40 transition-colors min-h-[52px]">
                            {renderPriceFormatted(p)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Food, Drinks & Tea Bar Section ─────────────────────────────────────── */
function FoodBarSection({ onSelectClub }: { onSelectClub: (id: number) => void }) {
  const [categoryTab, setCategoryTab] = useState<"pizza" | "snacks" | "drinks" | "tea">("pizza");

  return (
    <section id="food" className="py-20 border-t border-white/[0.06]" style={{ background: "#070b1a" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          whiteText="БАР И"
          blueText="КУХНЯ"
          subText="Горячая пицца, снеки, энергетики и китайская чайная церемония прямо за ваше игровое место"
        />

        {/* Club availability indicator */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 rounded-2xl bg-[#080c1b] border border-[#0066ff]/35 w-fit text-xs text-slate-300 shadow-lg" style={{ fontFamily: "'Exo 2',sans-serif" }}>
          <span className="text-[#00d4ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <PizzaIcon className="w-4 h-4 text-[#0088ff]" />
            <span>Кухня и бар доступны в клубах:</span>
          </span>
          <button
            onClick={() => onSelectClub(0)}
            className="px-3 py-1 rounded-lg bg-[#0066ff]/20 hover:bg-[#0066ff] text-white font-bold border border-[#0066ff]/40 transition-colors cursor-pointer"
          >
            ул. Ломоносова, 84
          </button>
          <button
            onClick={() => onSelectClub(1)}
            className="px-3 py-1 rounded-lg bg-[#0066ff]/20 hover:bg-[#0066ff] text-white font-bold border border-[#0066ff]/40 transition-colors cursor-pointer"
          >
            ул. 20-летия Октября, 101
          </button>
          <span className="text-slate-400 text-[11px] sm:ml-2">
            (в филиале на ул. Ключникова — вендинг и напитки)
          </span>
        </div>

        {/* Category Tabs (Swipeable on Mobile) */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-none pb-2">
          {[
            { id: "pizza", label: "Горячая пицца", icon: <PizzaIcon className="w-4 h-4" /> },
            { id: "snacks", label: "Горячие снеки", icon: <SnackIcon className="w-4 h-4" /> },
            { id: "drinks", label: "Энергетики & Напитки", icon: <ZapIcon className="w-4 h-4" /> },
            { id: "tea", label: "Чайная церемония", icon: <TeaIcon className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer shrink-0 ${
                categoryTab === tab.id
                  ? "bg-[#0066ff] text-white shadow-lg"
                  : "bg-[#050813] text-slate-300 border border-white/[0.08] hover:text-white"
              }`}
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Food & Drink Product Grid (Swipeable on Mobile) */}
        {categoryTab === "pizza" && (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
            {COMMON_FOOD_MENU.pizza.map((item) => (
              <div
                key={item.title}
                className="min-w-[270px] sm:min-w-0 flex-1 p-5 rounded-2xl bg-[#050813] border border-white/[0.1] hover:border-[#0088ff] transition-all flex flex-col justify-between shadow-xl group snap-center"
              >
                <div>
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-[#080c1b]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {item.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#0066ff] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-base font-bold text-white uppercase leading-snug" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {item.title}
                    </h4>
                    <span className="text-base sm:text-lg font-bold text-[#00d4ff] shrink-0 whitespace-nowrap" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  <span>Пицца 30 см</span>
                  <span className="text-[#0088ff] font-semibold">Подача за ПК 24/7</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {categoryTab === "snacks" && (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
            {COMMON_FOOD_MENU.snacks.map((item) => (
              <div
                key={item.title}
                className="min-w-[270px] sm:min-w-0 flex-1 p-5 rounded-2xl bg-[#050813] border border-white/[0.1] hover:border-[#0088ff] transition-all flex flex-col justify-between shadow-xl group snap-center"
              >
                <div>
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-[#080c1b]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {item.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#0066ff] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-white uppercase" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {item.title}
                    </h4>
                    <span className="text-base font-bold text-[#00d4ff]" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  <span>Горячий перекус</span>
                  <span className="text-[#0088ff] font-semibold">Готовится за 5 мин</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {categoryTab === "drinks" && (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
            {COMMON_FOOD_MENU.drinks?.map((item) => (
              <div
                key={item.title}
                className="min-w-[270px] sm:min-w-0 flex-1 p-5 rounded-2xl bg-[#050813] border border-white/[0.1] hover:border-[#0088ff] transition-all flex flex-col justify-between shadow-xl group snap-center"
              >
                <div>
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-[#080c1b]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {item.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#10b981] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-white uppercase" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {item.title}
                    </h4>
                    <span className="text-base font-bold text-[#00d4ff]" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  <span>Холодный бар</span>
                  <span className="text-[#10b981] font-semibold">Всегда в наличии</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {categoryTab === "tea" && (
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
            {COMMON_FOOD_MENU.tea.map((teaGroup) => (
              <div
                key={teaGroup.category}
                className="min-w-[300px] sm:min-w-0 flex-1 p-6 rounded-2xl bg-[#050813] border border-white/[0.1] hover:border-[#0088ff] transition-all flex flex-col justify-between shadow-xl group snap-center"
              >
                <div>
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-[#080c1b]">
                    <img
                      src={teaGroup.image}
                      alt={teaGroup.category}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-lg bg-[#0066ff] text-white text-sm font-bold shadow-md" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {teaGroup.price}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white uppercase mb-2" style={{ fontFamily: "'Russo One',sans-serif" }}>
                    {teaGroup.category}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    {teaGroup.desc}
                  </p>

                  <ul className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
                    {teaGroup.items.map((it) => (
                      <li key={it} className="text-xs text-slate-300 flex items-center gap-2 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0088ff] shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  <span>Заварочный чайник</span>
                  <span className="text-[#0088ff] font-medium">Китайская церемония</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── SmartGamer App Promo Section ───────────────────────────────────────── */
function SmartGamerSection() {
  const SMARTGAMER_STORES = {
    ios: "https://apps.apple.com/ru/app/smartgamer/id6482296507",
    android: "https://play.google.com/store/apps/details?id=com.smartgamer.app",
  };

  return (
    <section className="py-16 border-t border-white/[0.06]" style={{ background: "#050813" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#080c1b] via-[#0b1028] to-[#080c1b] border border-[#0066ff]/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src="./smartgamer.webp"
              alt="SmartGamer Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-[0_0_40px_rgba(0,102,255,0.4)] border-2 border-white/10 shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066ff]/20 text-[#00d4ff] text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span>SmartGamer Online</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Russo One',sans-serif" }}>
                SmartGamer · Бронь со смартфона
              </h3>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                Выбирай свободные ПК в реальном времени на схеме клуба, пополняй счёт через СБП без комиссии и активируй сессию в один клик.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full sm:w-auto">
            <a
              href={SMARTGAMER_STORES.ios}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#0088ff] hover:bg-white/10 transition-all text-white shadow-xl cursor-pointer"
            >
              <AppleIcon className="w-6 h-6" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400">Скачать на</span>
                <span className="text-sm font-semibold" style={{ fontFamily: "'Exo 2',sans-serif" }}>App Store</span>
              </div>
            </a>

            <a
              href={SMARTGAMER_STORES.android}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#0088ff] hover:bg-white/10 transition-all text-white shadow-xl cursor-pointer"
            >
              <PlayStoreIcon className="w-5 h-5 text-[#10b981]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400">Скачать на</span>
                <span className="text-sm font-semibold" style={{ fontFamily: "'Exo 2',sans-serif" }}>Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Photo Showcase Gallery Section ─────────────────────────────────────── */
function PhotoShowcaseSection({ onOpenPhoto }: { onOpenPhoto: (url: string, address: string) => void }) {
  const [activeTab, setActiveTab] = useState<number | "all">("all");

  const photosList = activeTab === "all"
    ? [
        { url: "./photos/lomonosova/photo-3.jpg", address: "Воронеж, ул. Ломоносова, 84" },
        { url: "./photos/lomonosova/photo-2.jpg", address: "Воронеж, ул. Ломоносова, 84" },
        { url: "./photos/lomonosova/photo-6.jpg", address: "Воронеж, ул. Ломоносова, 84" },
        { url: "./photos/lomonosova/photo-4.jpg", address: "Воронеж, ул. Ломоносова, 84" },
        { url: "./photos/20let/photo-1.jpg", address: "Воронеж, ул. 20-летия Октября, 101" },
        { url: "./photos/20let/photo-2.jpg", address: "Воронеж, ул. 20-летия Октября, 101" },
        { url: "./photos/20let/photo-3.jpg", address: "Воронеж, ул. 20-летия Октября, 101" },
        { url: "./photos/shilovo/photo-1.jpg", address: "Воронеж, ул. Ключникова, 1" },
        { url: "./photos/shilovo/photo-2.jpg", address: "Воронеж, ул. Ключникова, 1" },
      ]
    : CLUBS_DATA[activeTab].gallery.map((url) => ({
        url,
        address: CLUBS_DATA[activeTab].address,
      }));

  return (
    <section id="gallery" className="py-20" style={{ background: "#050813" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          whiteText="ФОТОГАЛЕРЕЯ"
          blueText="ЗАЛОВ"
          subText="Реальные фотографии игровых зон, мощных сетапов и интерьера клубов STRIKE"
        />

        {/* Filter Tabs (Swipeable on Mobile) */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-none pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer shrink-0 ${
              activeTab === "all"
                ? "bg-[#0066ff] text-white shadow-lg"
                : "bg-[#080c1b] text-slate-300 border border-white/[0.08] hover:text-white"
            }`}
            style={{ fontFamily: "'Exo 2',sans-serif" }}
          >
            Все клубы
          </button>
          {CLUBS_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer shrink-0 ${
                activeTab === c.id
                  ? "bg-[#0066ff] text-white shadow-lg"
                  : "bg-[#080c1b] text-slate-300 border border-white/[0.08] hover:text-white"
              }`}
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              {c.shortName}
            </button>
          ))}
        </div>

        {/* Photos Grid (Swipeable on Mobile) */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
          {photosList.map((item) => (
            <div
              key={item.url}
              onClick={() => onOpenPhoto(item.url, item.address)}
              className="min-w-[280px] sm:min-w-0 flex-1 group relative h-64 rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#0088ff] transition-all duration-300 cursor-pointer shadow-xl bg-[#080c1b] snap-center"
            >
              <img
                src={item.url}
                alt={item.address}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white tracking-wide" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  <PinIcon className="w-3.5 h-3.5 text-[#0088ff] shrink-0" />
                  <span>{item.address}</span>
                </div>
                <span className="text-[11px] text-[#0088ff] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Увеличить ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contacts & Interactive Map ─────────────────────────────────────────── */
function ContactsSection({
  selectedClubId,
  onSelectClub,
  onOpenBooking,
}: {
  selectedClubId: number;
  onSelectClub: (id: number) => void;
  onOpenBooking: (id: number) => void;
}) {
  return (
    <section id="contacts" className="py-20 border-t border-white/[0.06]" style={{ background: "#070b1a" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          whiteText="КАРТА И"
          blueText="ЛОКАЦИИ"
          subText="Точные координаты клубов STRIKE в Воронеже с возможностью мгновенного построения маршрута"
        />

        <ClubMap
          activeClubId={selectedClubId}
          onSelectClub={onSelectClub}
          onOpenBooking={onOpenBooking}
        />
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer({ onSelectClub }: { onSelectClub: (id: number) => void }) {
  return (
    <footer className="border-t py-12" style={{ background: "#050813", borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <StrikeLogo size={36} />

        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {CLUBS_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectClub(c.id)}
              className="text-xs text-slate-400 hover:text-[#0088ff] transition-colors cursor-pointer bg-transparent border-none p-0"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              {c.shortName}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
          © {new Date().getFullYear()} STRIKE CYBER CLUB. Все права защищены · 24/7
        </p>
      </div>
    </footer>
  );
}

/* ─── Main App Component ─────────────────────────────────────────────────── */
export default function App() {
  const [activeClubId, setActiveClubId] = useState<number | null>(null);
  const [selectedMapClubId, setSelectedMapClubId] = useState<number>(0);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingClubId, setBookingClubId] = useState<number | null>(null);

  // Photo Lightbox State
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxAddress, setLightboxAddress] = useState<string>("");

  const handleOpenPhoto = (url: string, address: string) => {
    setLightboxUrl(url);
    setLightboxAddress(address);
  };

  const handleOpenBooking = (clubId?: number) => {
    setBookingClubId(clubId ?? null);
    setIsBookingOpen(true);
  };

  const handleSelectClub = (clubId: number) => {
    setActiveClubId(clubId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateHome = () => {
    setActiveClubId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ background: "#050813", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Photo Lightbox */}
      <PhotoLightbox
        isOpen={!!lightboxUrl}
        imageUrl={lightboxUrl}
        title={lightboxAddress}
        onClose={() => setLightboxUrl(null)}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialClubId={bookingClubId}
      />

      <Navbar
        activeClubId={activeClubId}
        onNavigateHome={handleNavigateHome}
        onSelectClub={handleSelectClub}
        onOpenBooking={handleOpenBooking}
      />

      {activeClubId === null ? (
        /* ─── Main Landing Page ─── */
        <>
          <Hero />
          <FeatureRibbon />
          <ClubsSection onSelectClub={handleSelectClub} onOpenBooking={handleOpenBooking} />
          <ContactsSection
            selectedClubId={selectedMapClubId}
            onSelectClub={setSelectedMapClubId}
            onOpenBooking={handleOpenBooking}
          />
          <ZonesSection onSelectClub={handleSelectClub} />
          <PromotionsOverview onOpenClubPage={handleSelectClub} />
          <PricingSection onOpenBooking={handleOpenBooking} />
          <FoodBarSection onSelectClub={handleSelectClub} />
          <SmartGamerSection />
          <PhotoShowcaseSection onOpenPhoto={handleOpenPhoto} />
        </>
      ) : (
        /* ─── Dedicated Club Page ─── */
        <ClubView
          club={CLUBS_DATA[activeClubId]}
          onBack={handleNavigateHome}
          onSelectClub={handleSelectClub}
          onOpenBooking={handleOpenBooking}
          onOpenPhoto={handleOpenPhoto}
        />
      )}

      <Footer onSelectClub={handleSelectClub} />
    </div>
  );
}
