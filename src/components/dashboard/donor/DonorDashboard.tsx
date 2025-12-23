"use client";

import { motion, type Variants } from "framer-motion";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Cell,
    Tooltip,
    type TooltipProps,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stat = {
    title: string;
    value: string;
    helper: string;
    accentClass: string;
};

type StatusDatum = {
    name: string;
    value: number;
    color: string;
};


const stats: Stat[] = [
    { title: "Total Donations", value: "128", helper: "+12% vs last month", accentClass: "bg-emerald-100 text-emerald-800" },
    { title: "Active Donations", value: "14", helper: "+2 this week", accentClass: "bg-blue-100 text-blue-800" },
    { title: "Impact Score", value: "4,500", helper: "Level 5 Donor", accentClass: "bg-amber-100 text-amber-800" },
];

const statusData: StatusDatum[] = [
    { name: "Pending", value: 8, color: "#94a3b8" },
    { name: "Claimed", value: 5, color: "#f59e0b" },
    { name: "Delivered", value: 12, color: "#10b981" },
];

const activityItems = [
    { title: "Donated 20 kg of Apples", time: "2h ago" },
    { title: "Claimed by Ahmed (Volunteer)", time: "4h ago" },
    { title: "Delivered to Community Kitchen", time: "Yesterday" },
    { title: "Donated Fresh Bread", time: "2 days ago" },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function ImpactRing() {
    const progress = 0.78; // mock 78%
    return (
        <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="stroke-emerald-100" strokeWidth="10" fill="none" />
                <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-emerald-500"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${progress * 264} 999`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-slate-900">78%</span>
                <span className="text-xs text-slate-500">to next level</span>
            </div>
        </div>
    );
}

type StatusTooltipProps = TooltipProps<number, string> & {
    payload?: Array<{ name?: string; value?: number }>;
    label?: string | number;
};

function StatusTooltip({ active, payload }: StatusTooltipProps) {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    if (item?.name == null || item?.value == null) return null;

    return (
        <div className="rounded-md border bg-white px-3 py-2 text-sm shadow">
            <p className="font-semibold text-slate-900">{item.name}</p>
            <p className="text-slate-600">{item.value} donations</p>
        </div>
    );
}

export function DonorDashboard() {
    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => {
                    const isImpact = stat.title === "Impact Score";
                    return (
                        <motion.div key={stat.title} variants={itemVariants}>
                            <Card className="h-full border-emerald-100/70 bg-white/90 shadow-sm backdrop-blur">
                                <CardHeader className="flex flex-row items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-sm font-semibold text-slate-600">{stat.title}</CardTitle>
                                        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                        <p className="text-sm text-slate-600">{stat.helper}</p>
                                    </div>
                                    {isImpact ? (
                                        <ImpactRing />
                                    ) : (
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stat.accentClass}`}>{stat.helper}</span>
                                    )}
                                </CardHeader>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="h-full border-emerald-100/70 bg-white/90 shadow-sm backdrop-blur">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {activityItems.map((activity) => (
                                <div key={activity.title} className="flex items-center justify-between rounded-lg border border-emerald-50 bg-emerald-50/60 px-3 py-2">
                                    <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                                    <span className="text-xs text-slate-500">{activity.time}</span>
                                </div>
                            ))}
                            {activityItems.length === 0 && <p className="text-sm text-slate-500">No activity yet. Create your first donation.</p>}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="h-full border-emerald-100/70 bg-white/90 shadow-sm backdrop-blur">
                        <CardHeader>
                            <CardTitle>Donation Status</CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {statusData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<StatusTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
                                {statusData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div variants={itemVariants}>
                <Card className="border-dashed border-2 border-emerald-200 bg-emerald-50/60 shadow-sm">
                    <CardContent className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <PlusCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-slate-900">Donate food now</p>
                                <p className="text-sm text-slate-600">Create a new donation and connect with volunteers instantly.</p>
                            </div>
                        </div>
                        <Button
                            asChild
                            className="bg-emerald-600 px-5 font-semibold text-white shadow hover:bg-emerald-700"
                            variant="default"
                        >
                            <Link href="/donations/create">Create Donation</Link>
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

export default DonorDashboard;
