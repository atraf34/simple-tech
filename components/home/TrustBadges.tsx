import { Truck, ShieldCheck, GraduationCap } from "lucide-react";
import { trustBadges } from "@/lib/data";

const ICONS = { truck: Truck, shield: ShieldCheck, graduation: GraduationCap };

export default function TrustBadges() {
  return (
    <section className="mt-8 mb-6 px-margin md:px-margin-desktop">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {trustBadges.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div
              key={item.title}
              className="flex flex-col items-center text-center gap-1.5 rounded-md border border-outline-soft py-4 px-2"
            >
              <Icon className="h-5 w-5 text-cyan" strokeWidth={1.75} />
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
