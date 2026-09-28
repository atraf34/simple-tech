import {
  Bot, Wifi, Cpu, Radio, Cog, BatteryCharging, Wrench, Layers,
  CircuitBoard, Zap, Camera, Cable, Gauge, Thermometer, Plug, Package,
  Lightbulb, Monitor,
} from "lucide-react";

export const CATEGORY_ICONS = {
  bot: Bot, wifi: Wifi, cpu: Cpu, radio: Radio, cog: Cog, battery: BatteryCharging,
  wrench: Wrench, layers: Layers, board: CircuitBoard, zap: Zap, camera: Camera,
  cable: Cable, gauge: Gauge, thermo: Thermometer, plug: Plug, package: Package,
  light: Lightbulb, monitor: Monitor,
} as const;

// fg = icon/text colour, bg = soft tint, ring = border
export const CATEGORY_COLORS: Record<string, { fg: string; bg: string; ring: string }> = {
  emerald: { fg: "#059669", bg: "#E6F9F2", ring: "#A7EBD0" },
  blue: { fg: "#2563EB", bg: "#E8F0FF", ring: "#BFD3FB" },
  violet: { fg: "#7C3AED", bg: "#F1EAFE", ring: "#D6C4F8" },
  cyan: { fg: "#0891B2", bg: "#E0F7FB", ring: "#A5E3EE" },
  amber: { fg: "#D97706", bg: "#FEF3DC", ring: "#F6D9A0" },
  orange: { fg: "#EA580C", bg: "#FFEBDD", ring: "#F9C9A5" },
  rose: { fg: "#E11D48", bg: "#FFE4EA", ring: "#F8B4C3" },
  pink: { fg: "#DB2777", bg: "#FCE7F3", ring: "#F5B5D5" },
};

export function categoryColor(key?: string) {
  return CATEGORY_COLORS[key ?? ""] ?? CATEGORY_COLORS.emerald;
}

export function CategoryIcon({
  icon, color, size = 36, className = "",
}: { icon: string; color?: string; size?: number; className?: string }) {
  const Icon = (CATEGORY_ICONS as Record<string, typeof Bot>)[icon] ?? Layers;
  const c = categoryColor(color);
  return (
    <span
      className={`shrink-0 flex items-center justify-center rounded-full border ${className}`}
      style={{ width: size, height: size, background: c.bg, color: c.fg, borderColor: c.ring }}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={1.9} />
    </span>
  );
}
