"use client";

import { useEffect, useState } from "react";

const toBengaliDigits = (n: number) =>
  n
    .toString()
    .padStart(2, "0")
    .replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

export default function CountdownTimer({
  targetHours = 2,
}: {
  targetHours?: number;
}) {
  const [remaining, setRemaining] = useState(targetHours * 3600);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : targetHours * 3600));
    }, 1000);
    return () => clearInterval(id);
  }, [targetHours]);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <div className="flex items-center gap-1 font-mono text-label-mono-lg text-cyan">
      {[hours, minutes, seconds].map((unit, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded bg-cyan-soft border border-cyan/30 px-1.5 py-0.5 tabular-nums">
            {toBengaliDigits(unit)}
          </span>
          {i < 2 && <span className="text-on-surface-variant">:</span>}
        </span>
      ))}
    </div>
  );
}
