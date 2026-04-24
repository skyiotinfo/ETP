import React from "react";

type Props = {
  label: string;
  active: number;
};

export default function MotorBox({ label, active }: Props) {
  return (
    <div className={`device motor ${active ? "active" : "inactive"}`}>
      <div className="icon">⚙️</div>
      <div className="label">{label}</div>
      <div className="status">{active ? "ON" : "OFF"}</div>
      <div className="led"></div>
    </div>
  );
}