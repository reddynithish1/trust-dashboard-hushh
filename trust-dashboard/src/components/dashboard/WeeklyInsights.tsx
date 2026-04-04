import React, { useState } from 'react';
import { useDashboard } from '../../data/DashboardContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Sensor color palette
const SENSOR_COLORS: Record<string, string> = {
  camera: '#3b82f6',
  microphone: '#f59e0b',
  location: '#10b981',
  storage: '#8b5cf6',
  contacts: '#f43f5e',
};

const SENSOR_LABELS: Record<string, string> = {
  camera: 'Camera',
  microphone: 'Microphone',
  location: 'Location',
  storage: 'Storage',
  contacts: 'Contacts',
};

const SENSORS = ['camera', 'microphone', 'location', 'storage', 'contacts'] as const;

type AppMetric = {
  appName: string;
  camera: number;
  microphone: number;
  location: number;
  storage: number;
  contacts: number;
  totalOps: number;
  riskTrend: 'Increasing' | 'Stable' | 'Decreasing';
};

// --- Stacked Bar Chart ---
const StackedBarChart = ({ data }: { data: AppMetric[] }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const maxOps = Math.max(...data.map(d => d.totalOps), 1);
  const BAR_HEIGHT = 36;
  const GAP = 20;
  const LABEL_WIDTH = 90;
  const svgHeight = data.length * (BAR_HEIGHT + GAP);

  return (
    <div className="relative" style={{ overflowX: 'auto' }}>
      <svg width="100%" height={svgHeight} viewBox={`0 0 500 ${svgHeight}`} preserveAspectRatio="none">
        {data.map((app, i) => {
          const y = i * (BAR_HEIGHT + GAP);
          let xOffset = LABEL_WIDTH;
          const availableWidth = 500 - LABEL_WIDTH - 10;

          return (
            <g key={app.appName}>
              {/* App Name Label */}
              <text x={0} y={y + BAR_HEIGHT / 2 + 5} fontSize="13" fontWeight="600" fill="var(--text-primary)">{app.appName}</text>
              {/* Stacked Segments */}
              {SENSORS.map(sensor => {
                const val = app[sensor];
                const segWidth = (val / maxOps) * availableWidth;
                const rect = (
                  <rect
                    key={sensor}
                    x={xOffset}
                    y={y}
                    width={segWidth}
                    height={BAR_HEIGHT}
                    fill={SENSOR_COLORS[sensor]}
                    rx="4"
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => {
                      const svgRect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
                      setTooltip({
                        x: e.clientX - (svgRect?.left ?? 0),
                        y: e.clientY - (svgRect?.top ?? 0) - 40,
                        content: `${app.appName} • ${SENSOR_LABELS[sensor]}: ${val}`,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
                xOffset += segWidth;
                return rect;
              })}
              {/* Total label */}
              <text x={xOffset + 5} y={y + BAR_HEIGHT / 2 + 5} fontSize="12" fill="var(--text-secondary)" fontWeight="500">{app.totalOps}</text>
            </g>
          );
        })}
      </svg>
      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute glass-panel"
          style={{ left: tooltip.x, top: tooltip.y, padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', zIndex: 100 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

// --- Grouped Bar Chart (Per-Sensor per App) ---
const GroupedBarChart = ({ data }: { data: AppMetric[] }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const maxVal = Math.max(...data.flatMap(d => SENSORS.map(s => d[s])), 1);
  const CHART_H = 180;
  const BAR_W = 12;
  const GROUP_GAP = 28;
  const SENSOR_GAP = 3;
  const groupWidth = SENSORS.length * (BAR_W + SENSOR_GAP) + GROUP_GAP;
  const totalWidth = data.length * groupWidth + 20;

  return (
    <div className="relative" style={{ overflowX: 'auto' }}>
      <svg width={totalWidth} height={CHART_H + 40} style={{ minWidth: '100%' }}>
        {/* Y-axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map(factor => {
          const y = CHART_H - factor * CHART_H;
          return (
            <g key={factor}>
              <line x1="0" y1={y} x2={totalWidth} y2={y} stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="4 4" />
              <text x="2" y={y - 3} fontSize="10" fill="var(--text-secondary)">{Math.round(factor * maxVal)}</text>
            </g>
          );
        })}
        {data.map((app, gi) => {
          const groupX = gi * groupWidth + 16;
          return (
            <g key={app.appName}>
              {/* Group label */}
              <text x={groupX + (groupWidth - GROUP_GAP) / 2} y={CHART_H + 18} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-primary)">{app.appName}</text>
              {SENSORS.map((sensor, si) => {
                const val = app[sensor];
                const barH = (val / maxVal) * CHART_H;
                const x = groupX + si * (BAR_W + SENSOR_GAP);
                const y = CHART_H - barH;
                return (
                  <rect
                    key={sensor}
                    x={x}
                    y={y}
                    width={BAR_W}
                    height={barH || 2}
                    fill={SENSOR_COLORS[sensor]}
                    rx="3"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => {
                      const svgRect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
                      setTooltip({
                        x: e.clientX - (svgRect?.left ?? 0),
                        y: e.clientY - (svgRect?.top ?? 0) - 40,
                        content: `${SENSOR_LABELS[sensor]}: ${val}`,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div
          className="pointer-events-none absolute glass-panel"
          style={{ left: tooltip.x, top: tooltip.y, padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', zIndex: 100 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

// --- SVG Donut Chart ---
const DonutChart = ({ data }: { data: AppMetric[] }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const sensorTotals = SENSORS.map(s => ({
    key: s,
    label: SENSOR_LABELS[s],
    value: data.reduce((acc, d) => acc + d[s], 0),
    color: SENSOR_COLORS[s],
  }));
  const total = sensorTotals.reduce((acc, d) => acc + d.value, 0) || 1;

  const cx = 80, cy = 80, R = 60, r = 36;
  let cumAngle = -Math.PI / 2;

  const slices = sensorTotals.map((sensor, i) => {
    const angle = (sensor.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(cumAngle);
    const y1 = cy + R * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + R * Math.cos(cumAngle);
    const y2 = cy + R * Math.sin(cumAngle);
    const ix1 = cx + r * Math.cos(cumAngle);
    const iy1 = cy + r * Math.sin(cumAngle);
    const prevAngle = cumAngle - angle;
    const ix2 = cx + r * Math.cos(prevAngle);
    const iy2 = cy + r * Math.sin(prevAngle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${r} ${r} 0 ${large} 0 ${ix2} ${iy2} Z`;
    return { ...sensor, d, i, pct: ((sensor.value / total) * 100).toFixed(1) };
  });

  const active = activeIdx !== null ? slices[activeIdx] : null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <svg width={160} height={160} style={{ flexShrink: 0 }}>
        {slices.map(s => (
          <path
            key={s.key}
            d={s.d}
            fill={s.color}
            opacity={activeIdx === null || activeIdx === s.i ? 1 : 0.35}
            style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseEnter={() => setActiveIdx(s.i)}
            onMouseLeave={() => setActiveIdx(null)}
          />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text-primary)">{active ? active.pct + '%' : total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="var(--text-secondary)">{active ? active.label : 'total'}</text>
      </svg>
      <div className="flex flex-col gap-3 flex-1">
        {slices.map(s => (
          <div key={s.key} className="flex items-center gap-3 cursor-pointer" onMouseEnter={() => setActiveIdx(s.i)} onMouseLeave={() => setActiveIdx(null)}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.value} <span style={{ opacity: 0.65 }}>({s.pct}%)</span></span>
            <div style={{ width: 60, height: 8, background: 'var(--glass-border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main WeeklyInsights Component ---
export const WeeklyInsights = () => {
  const { weeklyMetrics, metrics } = useDashboard();
  const totalSensorOps = weeklyMetrics.reduce((acc, curr) => acc + curr.totalOps, 0);
  const sorted = [...weeklyMetrics].sort((a, b) => b.totalOps - a.totalOps);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Sensor Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Detailed per-app hardware access graphs and distribution.</p>
        </div>
        <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>This Week</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalSensorOps} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>pings</span></p>
          </div>
          <div style={{ height: 32, width: 1, background: 'var(--glass-border)' }} />
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Avg Trust</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.overallTrustScore}</p>
          </div>
        </div>
      </div>

      {/* Section 1: Stacked Horizontal Bar — App Frequency */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Application Hardware Frequency</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Stacked by sensor type — hover for details</p>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {SENSORS.map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: SENSOR_COLORS[s] }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{SENSOR_LABELS[s]}</span>
              </div>
            ))}
          </div>
        </div>
        <StackedBarChart data={sorted} />
      </div>

      {/* Section 2: Grouped Bar Chart — per-sensor breakdown */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Per-App Sensor Breakdown</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Compare each sensor across all apps — hover bars for values</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {SENSORS.map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: SENSOR_COLORS[s] }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{SENSOR_LABELS[s]}</span>
              </div>
            ))}
          </div>
        </div>
        <GroupedBarChart data={sorted} />
      </div>

      {/* Section 3: Sensor Distribution Donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Global Sensor Distribution</h3>
          <DonutChart data={sorted} />
        </div>

        {/* Section 4: Risk Trend Summary per App */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Risk Trends by App</h3>
          <div className="flex flex-col gap-4">
            {sorted.map(app => {
              const sensorBreakdown = SENSORS.filter(s => app[s] > 0).map(s => ({ sensor: s, val: app[s] }));
              return (
                <div key={app.appName} className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.35)' }}>
                  <div className="flex justify-between items-center mb-3">
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{app.appName}</span>
                    <div className="flex items-center gap-1.5">
                      {app.riskTrend === 'Increasing' && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-risky)' }}><TrendingUp size={14} /> Increasing</span>}
                      {app.riskTrend === 'Decreasing' && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-safe)' }}><TrendingDown size={14} /> Decreasing</span>}
                      {app.riskTrend === 'Stable' && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-moderate)' }}><Minus size={14} /> Stable</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {sensorBreakdown.map(({ sensor, val }) => {
                      const pct = Math.round((val / app.totalOps) * 100);
                      return (
                        <div key={sensor} className="flex items-center gap-3">
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: 76, fontWeight: 500 }}>{SENSOR_LABELS[sensor]}</span>
                          <div style={{ flex: 1, height: 8, background: 'var(--glass-border)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: SENSOR_COLORS[sensor], borderRadius: 4, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', width: 28, textAlign: 'right', fontWeight: 600, color: SENSOR_COLORS[sensor] }}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
