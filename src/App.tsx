import React, { useEffect, useState, useCallback } from "react";
import MotorBox from "./components/MotorBox";
import Tank from "./components/Tank";
import { PipeH, PipeV } from "./components/Pipeline";
import { fetchMotorData} from "./services/supabaseService";
import { MotorState } from "./types/MotorTypes";
import "./styles/dashboard.css";

export default function App() {
  const [data, setData] = useState<MotorState>({
    tank1: 0,
    M1: 0,
    B1: 0,
    M2: 0,
    B2: 0,
    M3: 0,
    tank2: 0,
  });

  const [timestamps, setTimestamps] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    const res = await fetchMotorData();
    if (Object.keys(res).length) {
      // Update motor states
      const newData: MotorState = { ...data };
      const newTimestamps: Record<string, string> = {};
      for (const [id, record] of Object.entries(res)) {
        if (id in newData) {
          newData[id as keyof MotorState] = record.state;
          newTimestamps[id] = record.updatedAt;
        }
      }
      setData(newData);
      setTimestamps(newTimestamps);
    }
  }, [data]);

  useEffect(() => {
    loadData();
    const i = setInterval(loadData, 3000);
    return () => clearInterval(i);
  }, [loadData]);

  const active = Object.values(data).filter(v => v === 1).length;
  const inactive = Object.values(data).filter(v => v === 0).length;

  // All 7 motors – use exactly the keys from MotorState
  const motorsList: (keyof MotorState)[] = ["M1", "B1", "M2", "B2", "M3", "tank1", "tank2"];

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="header">
        <h1>🏭 ETP Dashboard</h1>
        <div className="live">LIVE</div>
        <div className="time">{new Date().toLocaleTimeString()}</div>
      </div>

      {/* ROW 1 */}
      <div className="row">
        <Tank label="Tank 1" active={data.tank1} />
        <PipeH />
        <MotorBox label="M1" active={data.M1} />
        <PipeH />
        <MotorBox label="B1" active={data.B1} />
        <PipeH />
        <MotorBox label="M2" active={data.M2} />
        <PipeH />
        <MotorBox label="B2" active={data.B2} />
      </div>

      {/* CONNECTOR */}
      <div className="row">
        <PipeV />
      </div>

      {/* ROW 2 */}
      <div className="row">
        <MotorBox label="M3" active={data.M3} />
        <PipeH />
        <Tank label="Tank 2" active={data.tank2} />
      </div>

      {/* SUMMARY */}
      <div className="summary">
        <div className="card">Active: <strong>{active}</strong></div>
        <div className="card">Offline: <strong>{inactive}</strong></div>
      </div>

      {/* BOTTOM-LEFT TABLE – each motor shows its own updated_at */}
      <div className="motor-last-updated">
        <h3>Motor Last Updated</h3>
        <table>
          <thead>
            <tr>
              <th>Motor</th>
              <th>Last Updated At</th>
            </tr>
          </thead>
          <tbody>
            {motorsList.map(motor => (
              <tr key={motor}>
                <td>{motor}</td>
                <td>
                  {timestamps[motor]
                    ? new Date(timestamps[motor]).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}