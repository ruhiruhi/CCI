"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const trafficData = [
  { month: "Jan", visitors: 1200, subscribers: 45 },
  { month: "Feb", visitors: 1800, subscribers: 62 },
  { month: "Mar", visitors: 2400, subscribers: 78 },
  { month: "Apr", visitors: 2100, subscribers: 71 },
  { month: "May", visitors: 3200, subscribers: 95 },
  { month: "Jun", visitors: 3800, subscribers: 112 },
];

const pagesData = [
  { page: "/", views: 4200 },
  { page: "/our-activities", views: 1800 },
  { page: "/impact", views: 1500 },
  { page: "/gallery", views: 1200 },
  { page: "/support", views: 980 },
];

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-warm/8 bg-charcoal/50 p-6">
        <h3 className="mb-4 font-display text-lg text-warm">Traffic & Newsletter Growth</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trafficData}>
            <CartesianGrid stroke="rgba(244,241,234,0.06)" />
            <XAxis dataKey="month" stroke="#6c6c78" fontSize={12} />
            <YAxis stroke="#6c6c78" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "#15151c",
                border: "1px solid rgba(244,241,234,0.1)",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="visitors" stroke="#c9a25a" strokeWidth={2} />
            <Line type="monotone" dataKey="subscribers" stroke="#e3c894" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-warm/8 bg-charcoal/50 p-6">
        <h3 className="mb-4 font-display text-lg text-warm">Popular Pages</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={pagesData} layout="vertical">
            <CartesianGrid stroke="rgba(244,241,234,0.06)" />
            <XAxis type="number" stroke="#6c6c78" fontSize={12} />
            <YAxis dataKey="page" type="category" stroke="#6c6c78" fontSize={12} width={90} />
            <Tooltip
              contentStyle={{
                background: "#15151c",
                border: "1px solid rgba(244,241,234,0.1)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="views" fill="#c9a25a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
