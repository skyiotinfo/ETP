import React from "react";

type Props = {
  label: string;
  active: number;
};

export default function Tank({ label, active }: Props) {
  const level = active ? 80 : 10;

  return (
    <div className={`device tank ${active ? "active" : "inactive"}`}>
      <div className="icon">🧪</div>
      <div className="label">{label}</div>

      <div className="level" style={{ height: `${level}%` }}></div>

      <div className="status">{active ? "RUNNING" : "OFF"}</div>
    </div>
  );
}