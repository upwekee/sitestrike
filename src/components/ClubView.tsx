import { useState } from "react";
import { ClubData, CLUBS_DATA } from "../data/clubsData";
import {
  PinIcon,
  ClockIcon,
  PhoneIcon,
  VkIcon,
  CpuIcon,
  GpuIcon,
  RamIcon,
  MonitorIcon,
  MouseIcon,
  KeyboardIcon,
  HeadphonesIcon,
  PizzaIcon,
  SnackIcon,
  TeaIcon,
  GamepadIcon,
  InfoIcon,
  ArrowLeftIcon,
  NavigationIcon,
  ExternalLinkIcon,
  AppleIcon,
  PlayStoreIcon,
  ZapIcon,
  TableIcon,
  FlameIcon,
} from "./Icons";

interface ClubViewProps {
  club: ClubData;
  onBack: () => void;
  onSelectClub: (clubId: number) => void;
  onOpenBooking: (clubId: number) => void;
  onOpenPhoto?: (url: string, title: string) => void;
}

const SMARTGAMER_STORES = {
  ios: "https://apps.apple.com/ru/app/smartgamer/id6482296507",
  android: "https://play.google.com/store/apps/details?id=com.smartgamer.app",
};

export default function ClubView({
  club,
  onBack,
  onSelectClub,
  onOpenBooking,
  onOpenPhoto,
}: ClubViewProps) {
  const [foodTab, setFoodTab] = useState<"pizza" | "snacks" | "drinks" | "tea">("pizza");

  return (
    <div className="pt-20 pb-28">
      {/* Top Breadcrumb & Quick Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/[0.08]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-[#0088ff] transition-colors cursor-pointer"
            style={{ fontFamily: "'Exo 2',sans-serif" }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>← На главную</span>
          </button>

          {/* Quick club switcher */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Выбрать филиал:
            </span>
            {CLUBS_DATA.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectClub(c.id)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-xl shrink-0 ${
                  club.id === c.id
                    ? "bg-[#0066ff] text-white shadow-md"
                    : "bg-[#080c1b] text-slate-300 border border-white/[0.08] hover:border-[#0066ff] hover:text-white"
                }`}
                style={{ fontFamily: "'Exo 2',sans-serif" }}
              >
                {c.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Club Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div
          className="relative overflow-hidden rounded-3xl border border-[#0066ff]/30 p-6 sm:p-10 lg:p-12 shadow-2xl bg-[#080c1b]"
        >
          {/* Background accent */}
          <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
            <img
              src={club.image}
              alt={club.name}
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080c1b] via-[#080c1b]/80 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-lg"
                  style={{ fontFamily: "'Exo 2',sans-serif", background: "#0066ff" }}
                >
                  {club.tag}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Russo One',sans-serif" }}
              >
                {club.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm text-slate-300 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                <div className="flex items-center gap-2.5">
                  <PinIcon className="w-4 h-4 text-[#0088ff] shrink-0" />
                  <span className="text-white font-medium">{club.address}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#10b981] font-semibold">
                  <ClockIcon className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>Работаем 24/7</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneIcon className="w-4 h-4 text-[#0088ff] shrink-0" />
                  <a href={`tel:${club.phoneRaw}`} className="text-white hover:text-[#0088ff] transition-colors font-medium">
                    {club.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <VkIcon className="w-4 h-4 text-[#0088ff] shrink-0" />
                  <a
                    href={club.vk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0088ff] hover:underline"
                  >
                    ВКонтакте ({club.vkLabel})
                  </a>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onOpenBooking(club.id)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#1a75ff] rounded-xl cursor-pointer shadow-[0_0_25px_rgba(0,102,255,0.7)]"
                style={{
                  fontFamily: "'Exo 2',sans-serif",
                  background: "#0066ff",
                }}
              >
                <span>Забронировать место</span>
              </button>

              <div className="flex gap-2">
                <a
                  href={club.yandexMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 rounded-xl text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.08] hover:border-[#0088ff]"
                  style={{ fontFamily: "'Exo 2',sans-serif" }}
                >
                  <NavigationIcon className="w-3.5 h-3.5 text-[#0088ff]" />
                  <span>Яндекс Карты</span>
                </a>
                <a
                  href={club.twoGisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 rounded-xl text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.08] hover:border-[#0088ff]"
                  style={{ fontFamily: "'Exo 2',sans-serif" }}
                >
                  <ExternalLinkIcon className="w-3.5 h-3.5 text-[#0088ff]" />
                  <span>2ГИС</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick In-page Section Navigation Bar (Ordered: Цены -> Железо -> Акции -> Фото -> Бар -> SmartGamer -> Контакты) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none p-1.5 rounded-2xl bg-[#080c1b] border border-white/[0.08] shadow-lg">
          {[
            { id: "club-pricing", label: "Цены и тарифы", icon: <TableIcon className="w-3.5 h-3.5" /> },
            { id: "club-hardware", label: "Железо и зоны", icon: <CpuIcon className="w-3.5 h-3.5" /> },
            { id: "club-promotions", label: "Акции и бонусы", icon: <FlameIcon className="w-3.5 h-3.5" /> },
            { id: "club-gallery", label: "Фотогалерея", icon: <PinIcon className="w-3.5 h-3.5" /> },
            { id: "club-food", label: "Бар и кухня", icon: <PizzaIcon className="w-3.5 h-3.5" /> },
            { id: "club-smartgamer", label: "SmartGamer", icon: <GamepadIcon className="w-3.5 h-3.5" /> },
            { id: "club-contacts", label: "Контакты", icon: <PhoneIcon className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-[#0066ff] rounded-xl transition-all shrink-0 cursor-pointer"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ─── 1. PRICING & TARIFFS (FIRST) ─────────────────────────────────── */}
      <section id="club-pricing" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 scroll-mt-24">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-5 h-0.5 bg-[#0088ff]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            Стоимость посещения
          </span>
        </div>
        <h2
          className="text-2xl sm:text-4xl font-bold text-white mb-8"
          style={{ fontFamily: "'Russo One',sans-serif" }}
        >
          Тарифы и цены в {club.name}
        </h2>

        <div className="p-6 sm:p-8 bg-[#080c1b] border border-white/[0.08] rounded-3xl shadow-2xl">
          {/* PC Table */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <GamepadIcon className="w-4 h-4 text-[#0088ff]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                Игровой ПК (Цены по зонам)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: 460 }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        width: "30%",
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
                    {club.pricing.pc.zones.map((z) => (
                      <th
                        key={z}
                        style={{
                          padding: "12px 14px",
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
                      {row.prices.map((p, pi) => {
                        const match = p.match(/^([\d\s]+)\s*(.*)$/);
                        const num = match ? match[1].trim() : p;
                        const unit = match ? match[2].trim() : "";
                        return (
                          <td key={pi} style={{ padding: "4px 0 4px 6px" }}>
                            <div
                              className="flex items-center justify-center px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#0088ff]/40 transition-colors"
                              style={{ minHeight: 54 }}
                            >
                              <div className="flex items-baseline justify-center gap-1.5">
                                <span className="text-white text-lg sm:text-xl font-black tracking-tight" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                                  {num}
                                </span>
                                {unit && (
                                  <span className="text-[#00d4ff] font-bold text-xs sm:text-sm">
                                    {unit}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PS5 Table */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GamepadIcon className="w-4 h-4 text-[#0088ff]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                PlayStation 5 Lounge
              </span>
            </div>
            <div className="overflow-x-auto">
              <table style={{ minWidth: 300 }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        width: 180,
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
                      {row.prices.map((p, pi) => {
                        const match = p.match(/^([\d\s]+)\s*(.*)$/);
                        const num = match ? match[1].trim() : p;
                        const unit = match ? match[2].trim() : "";
                        return (
                          <td key={pi} style={{ padding: "4px 0 4px 6px" }}>
                            <div className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#0088ff]/40 transition-colors min-h-[52px]">
                              <div className="flex items-baseline justify-center gap-1.5">
                                <span className="text-white text-lg font-black tracking-tight" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                                  {num}
                                </span>
                                {unit && (
                                  <span className="text-[#00d4ff] font-bold text-xs">
                                    {unit}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. HARDWARE & SPECS (SECOND) ─────────────────────────────────── */}
      <section id="club-hardware" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 scroll-mt-24">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-5 h-0.5 bg-[#0088ff]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            Комплектующие и периферия
          </span>
        </div>
        <h2
          className="text-2xl sm:text-4xl font-bold text-white mb-3"
          style={{ fontFamily: "'Russo One',sans-serif" }}
        >
          Железо по игровым зонам
        </h2>
        <p className="text-sm text-slate-300 mb-8 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
          Все компьютеры настроены на стабильный FPS, оснащены сверхбыстрыми NVMe накопителями и премиальной киберспортивной периферией.
        </p>

        {/* Zones Grid (Swipeable on Mobile) */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0 mb-8">
          {club.hardware.zones.map((zone) => (
            <div
              key={zone.name}
              className="min-w-[280px] sm:min-w-0 flex-1 p-6 bg-[#080c1b] border border-white/[0.08] hover:border-[#0088ff]/60 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-xl snap-center"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[10px] font-bold text-[#0088ff] uppercase tracking-widest block" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                      ЗОНА
                    </span>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {zone.name}
                    </h3>
                  </div>
                  <div
                    className="px-2.5 py-1 text-xs font-bold text-[#0088ff] bg-[#0066ff]/15 border border-[#0066ff]/40 rounded-lg"
                    style={{ fontFamily: "'Russo One',sans-serif" }}
                  >
                    {zone.monitor}
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 text-xs" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  <div className="flex items-start gap-2.5">
                    <GpuIcon className="w-4 h-4 text-[#0088ff] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-medium">Видеокарта</span>
                      <span className="text-sm font-semibold text-white">{zone.gpu}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CpuIcon className="w-4 h-4 text-[#0088ff] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-medium">Процессор</span>
                      <span className="text-xs font-medium text-slate-200">{zone.cpu}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <RamIcon className="w-4 h-4 text-[#0088ff] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-medium">Память</span>
                      <span className="text-xs font-medium text-slate-200">{zone.ram}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MonitorIcon className="w-4 h-4 text-[#0088ff] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-medium">Экран</span>
                      <span className="text-xs font-semibold text-[#0088ff]">{zone.monitor}</span>
                    </div>
                  </div>

                  {zone.mouse && (
                    <div className="flex items-start gap-2.5 pt-2.5 border-t border-white/[0.08]">
                      <MouseIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-medium">Мышь</span>
                        <span className="text-xs text-slate-200">{zone.mouse}</span>
                      </div>
                    </div>
                  )}

                  {zone.keyboard && (
                    <div className="flex items-start gap-2.5">
                      <KeyboardIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-medium">Клавиатура</span>
                        <span className="text-xs text-slate-200">{zone.keyboard}</span>
                      </div>
                    </div>
                  )}

                  {zone.headset && (
                    <div className="flex items-start gap-2.5">
                      <HeadphonesIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-medium">Гарнитура</span>
                        <span className="text-xs text-slate-200">{zone.headset}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.08]">
                <a
                  href="#club-pricing"
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-center block text-slate-300 hover:text-white bg-white/[0.03] hover:bg-[#0066ff] border border-white/[0.08] rounded-xl transition-all"
                  style={{ fontFamily: "'Exo 2',sans-serif" }}
                >
                  Смотреть цены зоны ↑
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. PROMOTIONS & BONUSES (THIRD) ──────────────────────────────── */}
      <section id="club-promotions" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 scroll-mt-24">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-5 h-0.5 bg-[#0088ff]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            Акции и спецпредложения
          </span>
        </div>
        <h2
          className="text-2xl sm:text-4xl font-bold text-white mb-8"
          style={{ fontFamily: "'Russo One',sans-serif" }}
        >
          Бонусы в {club.name}
        </h2>

        {/* Promotions Grid (Swipeable on Mobile) */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
          {club.promotions.map((promo) => (
            <div
              key={promo.id}
              className="min-w-[300px] sm:min-w-0 flex-1 flex flex-col h-full bg-[#050813] border border-white/[0.12] hover:border-[#0066ff]/70 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 snap-center"
            >
              <div className="w-full aspect-video bg-[#050813] overflow-hidden relative border-b border-white/[0.08]">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050813] via-transparent to-transparent opacity-80" />
              </div>

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

                  {/* Terms */}
                  {promo.terms && (
                    <div
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 flex items-start gap-2 leading-relaxed font-normal"
                      style={{ fontFamily: "'Exo 2',sans-serif" }}
                    >
                      <InfoIcon className="w-4 h-4 text-[#0088ff] shrink-0 mt-0.5" />
                      <span>{promo.terms}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. DEDICATED PHOTO GALLERY (FOURTH) ──────────────────────────── */}
      {club.gallery && club.gallery.length > 0 && (
        <section id="club-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-5 h-0.5 bg-[#0088ff]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Фотографии филиала
            </span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Russo One',sans-serif" }}
          >
            Интерьер и сетапы в {club.name}
          </h2>
          <p className="text-sm text-slate-300 mb-8 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            Нажмите на любое фото, чтобы рассмотреть игровое пространство и оборудование в деталях.
          </p>

          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
            {club.gallery.map((imgUrl) => (
              <div
                key={imgUrl}
                onClick={() => onOpenPhoto?.(imgUrl, club.address)}
                className="min-w-[280px] sm:min-w-0 flex-1 group relative h-64 rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#0088ff] transition-all duration-300 cursor-pointer shadow-xl bg-[#080c1b] snap-center"
              >
                <img
                  src={imgUrl}
                  alt={club.address}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white tracking-wide" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    <PinIcon className="w-3.5 h-3.5 text-[#0088ff] shrink-0" />
                    <span>{club.address}</span>
                  </div>
                  <span className="text-[11px] text-[#0088ff] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Увеличить ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 5. FOOD & DRINKS (FIFTH) ─────────────────────────────────────── */}
      <section id="club-food" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 scroll-mt-24">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-5 h-0.5 bg-[#0088ff]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#0088ff]" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            Кухня, бар и чай
          </span>
        </div>
        <h2
          className="text-2xl sm:text-4xl font-bold text-white mb-3"
          style={{ fontFamily: "'Russo One',sans-serif" }}
        >
          Еда и напитки
        </h2>

        {club.food.available && club.food.menu ? (
          <div>
            <p className="text-sm text-slate-300 mb-6 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Заказывайте прямо у администратора. Горячая подача прямо за игровое место 24/7!
            </p>

            {/* Category tabs (Swipeable on Mobile) */}
            <div className="flex gap-2 border-b border-white/[0.08] pb-4 mb-8 overflow-x-auto scrollbar-none">
              {[
                { id: "pizza", label: "Горячая пицца", icon: <PizzaIcon className="w-4 h-4" /> },
                { id: "snacks", label: "Горячие снеки", icon: <SnackIcon className="w-4 h-4" /> },
                { id: "drinks", label: "Энергетики & Напитки", icon: <ZapIcon className="w-4 h-4" /> },
                { id: "tea", label: "Чайная церемония", icon: <TeaIcon className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFoodTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer shrink-0 ${
                    foodTab === tab.id
                      ? "bg-[#0066ff] text-white shadow-md"
                      : "bg-[#080c1b] text-slate-300 border border-white/[0.08] hover:text-white"
                  }`}
                  style={{ fontFamily: "'Exo 2',sans-serif" }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* PIZZA TAB */}
            {foodTab === "pizza" && (
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
                {club.food.menu.pizza.map((item) => (
                  <div
                    key={item.title}
                    className="min-w-[270px] sm:min-w-0 flex-1 p-5 rounded-2xl bg-[#080c1b] border border-white/[0.1] hover:border-[#0088ff] transition-all flex flex-col justify-between shadow-xl group snap-center"
                  >
                    <div>
                      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-[#050813]">
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

            {/* SNACKS TAB */}
            {foodTab === "snacks" && (
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
                {club.food.menu.snacks.map((item) => (
                  <div
                    key={item.title}
                    className="min-w-[270px] sm:min-w-0 flex-1 p-5 rounded-2xl bg-[#080c1b] border border-white/[0.1] hover:border-[#0088ff] transition-all flex flex-col justify-between shadow-xl group snap-center"
                  >
                    <div>
                      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-[#050813]">
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

            {/* DRINKS TAB */}
            {foodTab === "drinks" && (
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
                {club.food.menu.drinks?.map((item) => (
                  <div
                    key={item.title}
                    className="min-w-[270px] sm:min-w-0 flex-1 p-5 rounded-2xl bg-[#080c1b] border border-white/[0.1] hover:border-[#0088ff] transition-all flex flex-col justify-between shadow-xl group snap-center"
                  >
                    <div>
                      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-[#050813]">
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

            {/* TEA TAB */}
            {foodTab === "tea" && (
              <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0">
                {club.food.menu.tea.map((teaGroup) => (
                  <div
                    key={teaGroup.category}
                    className="min-w-[300px] sm:min-w-0 flex-1 p-6 rounded-2xl bg-[#080c1b] border border-white/[0.1] hover:border-[#0088ff] transition-all flex flex-col justify-between shadow-xl group snap-center"
                  >
                    <div>
                      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-[#050813]">
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
        ) : (
          <div className="p-8 sm:p-12 text-center bg-[#080c1b] border border-white/[0.08] rounded-2xl max-w-2xl mx-auto shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#0066ff]/10 text-[#0088ff] flex items-center justify-center mx-auto mb-4">
              <SnackIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Russo One',sans-serif" }}>
              Снеки и прохладительные напитки
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              {club.food.messageIfUnavailable}
            </p>
          </div>
        )}
      </section>

      {/* ─── 6. SMARTGAMER APP DOWNLOAD BANNER (SIXTH) ────────────────────── */}
      <section id="club-smartgamer" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 scroll-mt-24">
        <div
          className="p-8 sm:p-10 rounded-3xl border border-[#0066ff]/40 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(0,102,255,0.15) 0%, rgba(139,92,246,0.08) 100%), #080c1b",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src="/smartgamer.webp"
              alt="SmartGamer"
              className="w-20 h-20 rounded-2xl shadow-xl border border-white/10 shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0066ff]/20 text-[#00d4ff] text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span>SmartGamer Online</span>
              </div>
              <h3
                className="text-2xl sm:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "'Russo One',sans-serif" }}
              >
                Бронируй в {club.shortName} через SmartGamer
              </h3>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                Выбирай любое свободное место прямо на интерактивной схеме зала со своего смартфона, пополняй баланс без очереди и активируй сессию в один клик.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={SMARTGAMER_STORES.ios}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#0088ff] hover:bg-white/[0.08] transition-all text-white shadow-lg"
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
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#0088ff] hover:bg-white/[0.08] transition-all text-white shadow-lg"
            >
              <PlayStoreIcon className="w-5 h-5 text-[#10b981]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400">Скачать на</span>
                <span className="text-sm font-semibold" style={{ fontFamily: "'Exo 2',sans-serif" }}>Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 7. CONTACTS & LOCATION (SEVENTH) ──────────────────────────────── */}
      <section id="club-contacts" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="p-8 sm:p-10 bg-[#080c1b] border border-white/[0.08] rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-2xl">
          <div>
            <span className="text-xs uppercase font-bold text-[#0088ff] tracking-widest block mb-1" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              Связь с администратором и навигация
            </span>
            <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Russo One',sans-serif" }}>
              {club.name}
            </h3>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm text-slate-300 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
              <div className="flex items-center gap-2">
                <PinIcon className="w-4 h-4 text-[#0088ff]" />
                <span className="text-white font-medium">{club.address}</span>
              </div>
              <div className="flex items-center gap-2 text-[#10b981] font-semibold">
                <ClockIcon className="w-4 h-4 text-[#10b981]" />
                <span>Работаем 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-[#0088ff]" />
                <a href={`tel:${club.phoneRaw}`} className="text-white hover:text-[#0088ff] transition-colors font-medium">
                  {club.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onOpenBooking(club.id)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white bg-[#0066ff] hover:bg-[#1a75ff] rounded-xl shadow-lg transition-all cursor-pointer"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              <span>Забронировать</span>
            </button>
            <a
              href={club.yandexMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.08] hover:border-[#0088ff] rounded-xl transition-all"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              <NavigationIcon className="w-4 h-4 text-[#0088ff]" />
              <span>Яндекс Карты</span>
            </a>
            <a
              href={club.twoGisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.08] hover:border-[#0088ff] rounded-xl transition-all"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              <ExternalLinkIcon className="w-4 h-4" />
              <span>2ГИС</span>
            </a>
            <a
              href={club.vk}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white bg-[#0066ff]/20 hover:bg-[#0066ff]/40 border border-[#0066ff]/40 rounded-xl transition-all"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              <VkIcon className="w-4 h-4" />
              <span>VK</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
