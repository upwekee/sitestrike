import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CLUBS_DATA, ClubData } from "../data/clubsData";
import {
  PinIcon,
  PhoneIcon,
  NavigationIcon,
  ExternalLinkIcon,
} from "./Icons";

interface ClubMapProps {
  activeClubId: number;
  onSelectClub: (id: number) => void;
  onOpenBooking: (clubId: number) => void;
}

// Generate pin HTML with exact needle-tip alignment and zoom-adaptive scale
function createGeographicPinSvg(club: ClubData, isActive: boolean, zoomLevel: number): string {
  const primaryColor = isActive ? "#00d4ff" : "#1166ff";
  const glow = isActive
    ? "drop-shadow(0 0 16px rgba(0,212,255,0.95))"
    : "drop-shadow(0 0 8px rgba(17,102,255,0.6))";

  // Scale smoothly on zoom out so markers never look bulky or overlap
  let scale = 1.0;
  if (zoomLevel <= 11) scale = 0.65;
  else if (zoomLevel === 12) scale = 0.78;
  else if (zoomLevel === 13) scale = 0.88;
  else if (zoomLevel >= 15) scale = 1.05;

  return `
    <div style="
      width: 140px;
      height: 76px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      transform-origin: 50% 100%;
      transform: scale(${scale});
      transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1);
      cursor: pointer;
      pointer-events: auto;
    ">
      <!-- Badge above pin -->
      <div style="
        margin-bottom: 4px;
        padding: 3px 8px;
        border-radius: 6px;
        background: rgba(8,8,15,0.96);
        border: 1px solid ${isActive ? "#00d4ff" : "#1e1e38"};
        box-shadow: 0 4px 14px rgba(0,0,0,0.85);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 5px;
        pointer-events: auto;
      ">
        <span style="
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${isActive ? "#00d4ff" : "#1166ff"};
          display: inline-block;
        "></span>
        <span style="
          font-family: 'Russo One', sans-serif;
          font-size: 11px;
          color: #ffffff;
          letter-spacing: 0.04em;
        ">${club.name}</span>
      </div>

      <!-- Pin Icon Body with needle tip at exact bottom center (x: 16px, y: 40px) -->
      <div style="position: relative; width: 32px; height: 40px; filter: ${glow};">
        ${
          isActive
            ? `<div style="
                position: absolute;
                bottom: 0px;
                left: 8px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #00d4ff;
                opacity: 0.75;
                animation: ping 1.4s cubic-bezier(0,0,0.2,1) infinite;
              "></div>`
            : ""
        }
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 39 C16 39 3 24 3 15 C3 7.8 8.8 2 16 2 C23.2 2 29 7.8 29 15 C29 24 16 39 16 39 Z"
            fill="#08080f"
            stroke="${primaryColor}"
            stroke-width="2.6"
          />
          <circle cx="16" cy="15" r="8" fill="${primaryColor}" />
          <circle cx="16" cy="15" r="3.8" fill="#08080f" />
        </svg>
      </div>
    </div>
  `;
}

export default function ClubMap({
  activeClubId,
  onSelectClub,
  onOpenBooking,
}: ClubMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});
  const [currentZoom, setCurrentZoom] = useState(13);

  const activeClub = CLUBS_DATA[activeClubId] || CLUBS_DATA[0];

  // 1. Initialize Leaflet Map with OpenStreetMap
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [activeClub.lat, activeClub.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Add zoom control at bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Standard OpenStreetMap tiles (100% free, zero API key errors)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
    }).addTo(map);

    // Track zoom changes for pin scaling
    map.on("zoomend", () => {
      setCurrentZoom(map.getZoom());
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Synchronize markers, update needle-tip icons and smooth pan on change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Add geographic markers with exact anchor tip [70, 76] on a 140x76 box
    CLUBS_DATA.forEach((club) => {
      const isActive = club.id === activeClubId;
      const icon = L.divIcon({
        html: createGeographicPinSvg(club, isActive, currentZoom),
        className: "custom-leaflet-marker",
        iconSize: [140, 76],
        iconAnchor: [70, 76],
      });

      const marker = L.marker([club.lat, club.lng], {
        icon,
        zIndexOffset: isActive ? 1000 : 100,
      }).addTo(map);

      // On pin click: select club and open Yandex Maps in new tab
      marker.on("click", () => {
        onSelectClub(club.id);
        window.open(club.yandexMapsUrl, "_blank");
      });

      markersRef.current[club.id] = marker;
    });
  }, [activeClubId, currentZoom, onSelectClub]);

  // Pan to active club whenever activeClubId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([activeClub.lat, activeClub.lng], 15, { duration: 0.9 });
  }, [activeClubId, activeClub.lat, activeClub.lng]);

  // Fit all 3 clubs in viewport
  const handleShowAll = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const group = L.featureGroup(Object.values(markersRef.current));
    map.fitBounds(group.getBounds().pad(0.2), { duration: 1 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Interactive Black & White Leaflet Map Container */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
        <div className="relative w-full h-[420px] sm:h-[480px] lg:h-full min-h-[420px] rounded-2xl overflow-hidden border border-[#1e1e38] shadow-2xl bg-[#08080f]">
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

          {/* Top Controls Overlay */}
          <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#08080f]/90 border border-[#1e1e38] backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
              <span
                className="text-[11px] font-bold text-white uppercase tracking-wider"
                style={{ fontFamily: "'Exo 2',sans-serif" }}
              >
                {activeClub.name}
              </span>
            </div>

            <button
              onClick={handleShowAll}
              className="px-3 py-1.5 rounded-lg bg-[#12121f]/90 border border-[#1e1e38] hover:border-[#1166ff] hover:bg-[#1166ff] text-white text-[11px] font-bold uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer"
              style={{ fontFamily: "'Exo 2',sans-serif" }}
            >
              Показать все 3 клуба
            </button>
          </div>

          {/* Direct Yandex Maps open button */}
          <a
            href={activeClub.yandexMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 z-[400] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#1166ff] hover:brightness-125 rounded-lg shadow-xl backdrop-blur-md transition-all flex items-center gap-2"
            style={{ fontFamily: "'Exo 2',sans-serif" }}
          >
            <NavigationIcon className="w-3.5 h-3.5" />
            <span>Открыть в Яндекс Картах ↗</span>
          </a>
        </div>
      </div>

      {/* Club Selector and Details Cards */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
        {CLUBS_DATA.map((club) => {
          const isSelected = club.id === activeClubId;
          return (
            <div
              key={club.id}
              onClick={() => onSelectClub(club.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#12121f] border-[#1166ff] shadow-[0_0_25px_rgba(17,102,255,0.25)]"
                  : "bg-[#0d0d18] border-[#1e1e38] hover:border-[#1166ff]/50 hover:bg-[#12121f]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? "bg-[#1166ff] text-white"
                        : "bg-white/5 text-[#8888bb]"
                    }`}
                    style={{ fontFamily: "'Exo 2',sans-serif" }}
                  >
                    {club.tag}
                  </span>
                  <span className="text-xs text-[#00d4ff] font-semibold" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                    {club.workstationsCount} ПК · 24/7
                  </span>
                </div>

                <h4
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: "'Russo One',sans-serif" }}
                >
                  {club.name}
                </h4>

                <div className="flex flex-col gap-1.5 text-xs text-[#8888bb] mb-4" style={{ fontFamily: "'Exo 2',sans-serif" }}>
                  <div className="flex items-center gap-2">
                    <PinIcon className="w-3.5 h-3.5 text-[#1166ff] shrink-0" />
                    <span className="text-white font-medium">{club.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-3.5 h-3.5 text-[#00d4ff] shrink-0" />
                    <a
                      href={`tel:${club.phoneRaw}`}
                      className="text-white hover:text-[#00d4ff] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {club.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#1e1e38]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenBooking(club.id);
                  }}
                  className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#1166ff] hover:brightness-125 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ fontFamily: "'Exo 2',sans-serif" }}
                >
                  <span>Бронь 24/7</span>
                </button>

                <a
                  href={club.yandexMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 text-xs font-semibold text-[#8888bb] hover:text-white bg-white/[0.03] hover:bg-white/10 border border-[#1e1e38] rounded transition-colors flex items-center gap-1"
                  style={{ fontFamily: "'Exo 2',sans-serif" }}
                  title="Яндекс Карты"
                >
                  <NavigationIcon className="w-3.5 h-3.5 text-[#00d4ff]" />
                  <span>Яндекс</span>
                </a>

                <a
                  href={club.twoGisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 text-xs font-semibold text-[#8888bb] hover:text-white bg-white/[0.03] hover:bg-white/10 border border-[#1e1e38] rounded transition-colors flex items-center gap-1"
                  style={{ fontFamily: "'Exo 2',sans-serif" }}
                  title="2ГИС"
                >
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                  <span>2ГИС</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
