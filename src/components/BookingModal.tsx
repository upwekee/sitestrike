import { getAssetUrl } from '../utils/asset';
import React, { useState, useEffect } from "react";
import { CLUBS_DATA, ClubData } from "../data/clubsData";
import {
  PhoneIcon,
  VkIcon,
  AppleIcon,
  PlayStoreIcon,
  CloseIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  PinIcon,
  ClockIcon,
} from "./Icons";

const SMARTGAMER_STORES = {
  ios: "https://apps.apple.com/ru/app/smartgamer/id6482296507",
  android: "https://play.google.com/store/apps/details?id=com.smartgamer.app",
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClubId?: number | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialClubId = null,
}: BookingModalProps) {
  const [selectedClubId, setSelectedClubId] = useState<number | null>(initialClubId);

  useEffect(() => {
    if (isOpen) {
      setSelectedClubId(initialClubId);
    }
  }, [isOpen, initialClubId]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedClub: ClubData | undefined =
    selectedClubId !== null ? CLUBS_DATA[selectedClubId] : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-lg bg-[#080c1b] border border-[#0066ff]/40 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] overflow-y-auto"
        style={{
          boxShadow: "0 0 50px rgba(0,102,255,0.25), inset 0 0 20px rgba(0,102,255,0.05)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer border border-white/10"
          aria-label="Закрыть"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span
              className="text-[11px] font-bold uppercase tracking-widest text-[#00d4ff]"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              Бронирование и связь · 24/7
            </span>
          </div>
          <h3
            className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight"
            style={{ fontFamily: "'Russo One',sans-serif" }}
          >
            {selectedClub ? selectedClub.name : "Забронировать место"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1" style={{ fontFamily: "'Exo 2',sans-serif" }}>
            {selectedClub
              ? "Позвоните администратору клуба, напишите в VK или забронируйте онлайн в SmartGamer"
              : "Выберите клуб или забронируйте онлайн в приложении SmartGamer"}
          </p>
        </div>

        {!selectedClub ? (
          /* ─── Club Selection List ─── */
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              {CLUBS_DATA.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClubId(club.id)}
                  className="p-4 rounded-xl border border-white/10 bg-[#050813] hover:bg-[#0c1024] hover:border-[#0066ff] text-left transition-all group cursor-pointer flex items-center justify-between shadow-lg"
                >
                  <div>
                    <div
                      className="text-sm font-bold text-white group-hover:text-[#0088ff] transition-colors uppercase"
                      style={{ fontFamily: "'Russo One',sans-serif" }}
                    >
                      {club.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                      {club.address}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#0088ff] group-hover:text-[#00d4ff] shrink-0" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    Выбрать →
                  </div>
                </button>
              ))}
            </div>

            {/* SmartGamer App Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0066ff]/15 to-[#8b5cf6]/10 border border-[#0066ff]/40 mt-2">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={getAssetUrl("smartgamer.webp")}
                  alt="SmartGamer"
                  className="w-10 h-10 rounded-xl shadow-md border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold text-white uppercase tracking-wide"
                      style={{ fontFamily: "'Russo One',sans-serif" }}
                    >
                      SmartGamer
                    </span>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold border border-[#10b981]/40"
                      style={{ fontFamily: "'Exo 2',sans-serif" }}
                    >
                      Онлайн-бронь
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-normal" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    Официальное приложение сети STRIKE
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                Бронируй любые компьютеры и зоны во всех клубах STRIKE прямо со смартфона, пополняй баланс без комиссии и следи за скидкой:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={SMARTGAMER_STORES.ios}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#0088ff] hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    <AppleIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[8px] uppercase font-bold text-slate-400">Скачать на</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#0088ff] truncate" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                      App Store
                    </span>
                  </div>
                </a>
                <a
                  href={SMARTGAMER_STORES.android}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#0088ff] hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#10b981]/20 flex items-center justify-center text-[#10b981] shrink-0 group-hover:scale-110 transition-transform">
                    <PlayStoreIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[8px] uppercase font-bold text-slate-400">Скачать на</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#0088ff] truncate" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                      Google Play
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ─── Club Specific Actions ─── */
          <div className="flex flex-col animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setSelectedClubId(null)}
              className="text-xs font-bold tracking-wider text-[#0088ff] uppercase mb-4 flex items-center gap-1.5 hover:text-white transition-colors w-fit cursor-pointer"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Выбрать другой клуб</span>
            </button>

            {/* Club Card Header */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#0066ff]/15 to-transparent border border-[#0066ff]/30 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#0088ff] uppercase" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  {selectedClub.tag} · Воронеж
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1 font-semibold">
                  <ClockIcon className="w-3.5 h-3.5 text-[#0088ff]" />
                  <span>24 / 7 Круглосуточно</span>
                </span>
              </div>
              <div
                className="text-lg font-bold text-white uppercase"
                style={{ fontFamily: "'Russo One',sans-serif" }}
              >
                {selectedClub.name}
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-start gap-1.5" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                <PinIcon className="w-3.5 h-3.5 text-[#0088ff] shrink-0 mt-0.5" />
                <span>{selectedClub.address}</span>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-col gap-2.5 mb-4">
              {/* Phone call button */}
              <a
                href={`tel:${selectedClub.phoneRaw}`}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white text-black hover:bg-[#0088ff] hover:text-white transition-all shadow-lg group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-black/10 group-hover:bg-white/20 flex items-center justify-center text-current shrink-0">
                    <PhoneIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                      Позвонить администратору
                    </span>
                    <span className="text-sm sm:text-base font-extrabold tracking-tight" style={{ fontFamily: "'Russo One',sans-serif" }}>
                      {selectedClub.phone}
                    </span>
                  </div>
                </div>
                <ExternalLinkIcon className="w-4 h-4 opacity-60 group-hover:opacity-100 shrink-0" />
              </a>

              {/* VK Chat button */}
              <a
                href={selectedClub.vk}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#0066ff]/20 border border-[#0066ff]/40 hover:bg-[#0066ff]/35 transition-all text-white group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0066ff]/30 flex items-center justify-center text-[#0088ff] shrink-0">
                    <VkIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#0088ff]">
                      Написать в группу ВКонтакте
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {selectedClub.vkLabel}
                    </span>
                  </div>
                </div>
                <ExternalLinkIcon className="w-4 h-4 text-[#0088ff] group-hover:text-white shrink-0" />
              </a>
            </div>

            {/* SmartGamer App Links */}
            <div className="p-4 rounded-xl bg-[#050813] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span
                    className="text-xs font-bold text-white uppercase tracking-wider"
                    style={{ fontFamily: "'Exo 2',sans-serif" }}
                  >
                    Онлайн-бронь в SmartGamer
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  24/7
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                Скачай мобильное приложение SmartGamer для быстрого выбора свободного места и пополнения баланса:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={SMARTGAMER_STORES.ios}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#0088ff] hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    <AppleIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[8px] uppercase font-bold text-slate-400">Скачать на</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#0088ff] truncate" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                      App Store
                    </span>
                  </div>
                </a>

                <a
                  href={SMARTGAMER_STORES.android}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#0088ff] hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded bg-[#10b981]/20 flex items-center justify-center text-[#10b981] shrink-0 group-hover:scale-110 transition-transform">
                    <PlayStoreIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[8px] uppercase font-bold text-slate-400">Скачать на</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#0088ff] truncate" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                      Google Play
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
