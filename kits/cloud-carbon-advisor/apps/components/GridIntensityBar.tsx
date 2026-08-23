"use client";

// A two-bar comparison of grid carbon intensity: where the workload runs now
// vs. the cleanest region it could move to. The visual that makes "your
// electricity is dirty, not your workload" obvious at a glance.

type Props = {
  currentLabel: string;
  currentIntensity: number;
  cleanerLabel?: string;
  cleanerIntensity?: number;
};

const SCALE_MAX = 800; // gCO2e/kWh — roughly the dirtiest grid in the tables

function pct(v: number): number {
  return Math.max(2, Math.min(100, (v / SCALE_MAX) * 100));
}

export function GridIntensityBar({ currentLabel, currentIntensity, cleanerLabel, cleanerIntensity }: Props) {
  return (
    <div className="space-y-2">
      <Bar label={currentLabel} intensity={currentIntensity} tone="high" />
      {cleanerLabel !== undefined && cleanerIntensity !== undefined && (
        <Bar label={cleanerLabel} intensity={cleanerIntensity} tone="low" />
      )}
    </div>
  );
}

function Bar({ label, intensity, tone }: { label: string; intensity: number; tone: "high" | "low" }) {
  const color = tone === "high" ? "var(--sev-high)" : "var(--accent)";
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-[11px] text-muted" title={label}>
        {label}
      </span>
      <div className="relative h-2.5 flex-1 rounded-full bg-bg/70 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct(intensity)}%`, background: color }}
        />
      </div>
      <span className="w-24 shrink-0 text-right text-[11px] tabular-nums text-muted">
        {intensity} g/kWh
      </span>
    </div>
  );
}
