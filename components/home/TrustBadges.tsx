import { Truck, ShieldCheck, GraduationCap } from "lucide-react";
import { trustBadges } from "@/lib/data";

const ICONS = { truck: Truck, shield: ShieldCheck, graduation: GraduationCap };
const TINTS = { truck: "#2563EB", shield: "#059669", graduation: "#7C3AED" };

export default function TrustBadges() {
  return (
    <section className="mt-8 mb-6 px-margin md:px-margin-desktop lg:pl-8">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {trustBadges.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div
              key={item.title}
              className="flex flex-col items-center text-center gap-1.5 rounded-lg glass-card py-4 px-2"
            >
              <Icon className="h-6 w-6" style={{ color: TINTS[item.icon] }} strokeWidth={1.75} />
              <p className="text-body-sm font-medium text-on-surface leading-tight">
                {item.title}
              </p>
              <p className="text-label-mono-sm font-mono text-on-surface-variant">
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
