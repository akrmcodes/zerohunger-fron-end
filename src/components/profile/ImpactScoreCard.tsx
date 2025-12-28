"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Award, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// =============================================================================
// Props
// =============================================================================

interface ImpactScoreCardProps {
    score: number;
    className?: string;
}

// =============================================================================
// Animation Variants
// =============================================================================

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 25,
        },
    },
};

const scoreVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 400,
            damping: 20,
            delay: 0.2,
        },
    },
};

const glowVariants = {
    animate: {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const,
        },
    },
};

const sparkleVariants = {
    animate: (i: number) => ({
        y: [0, -8, 0],
        opacity: [0.4, 1, 0.4],
        scale: [0.8, 1.2, 0.8],
        transition: {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut" as const,
        },
    }),
};

const orbVariants = {
    animate: (i: number) => ({
        rotate: 360,
        transition: {
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear" as const,
        },
    }),
};

// =============================================================================
// Helper Functions
// =============================================================================

function getScoreLevel(score: number): {
    level: string;
    color: string;
    bgColor: string;
    description: string;
} {
    if (score >= 1000) {
        return {
            level: "Legend",
            color: "text-amber-500",
            bgColor: "from-amber-500/20 to-orange-500/20",
            description: "A true hero in the fight against hunger",
        };
    }
    if (score >= 500) {
        return {
            level: "Champion",
            color: "text-violet-500",
            bgColor: "from-violet-500/20 to-purple-500/20",
            description: "Making a significant impact in your community",
        };
    }
    if (score >= 100) {
        return {
            level: "Rising Star",
            color: "text-emerald-500",
            bgColor: "from-emerald-500/20 to-teal-500/20",
            description: "Great progress on your food rescue journey",
        };
    }
    return {
        level: "Newcomer",
        color: "text-blue-500",
        bgColor: "from-blue-500/20 to-sky-500/20",
        description: "Welcome! Every action counts",
    };
}

// =============================================================================
// Component
// =============================================================================

export function ImpactScoreCard({ score, className }: ImpactScoreCardProps) {
    const { level, color, bgColor, description } = useMemo(
        () => getScoreLevel(score),
        [score]
    );

    const sparklePositions = useMemo(
        () => [
            { top: "10%", left: "15%" },
            { top: "20%", right: "20%" },
            { bottom: "25%", left: "10%" },
            { bottom: "15%", right: "15%" },
            { top: "40%", left: "5%" },
            { top: "35%", right: "8%" },
        ],
        []
    );

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            <Card className="relative overflow-hidden border-0 shadow-xl">
                {/* Background gradient */}
                <div
                    className={cn(
                        "absolute inset-0 bg-linear-to-br",
                        bgColor
                    )}
                />

                {/* Animated glow */}
                <motion.div
                    variants={glowVariants}
                    animate="animate"
                    className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl"
                />

                {/* Orbiting decorations */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={orbVariants}
                        animate="animate"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{
                            width: 120 + i * 40,
                            height: 120 + i * 40,
                        }}
                    >
                        <div
                            className="absolute rounded-full bg-white/20"
                            style={{
                                width: 6 - i,
                                height: 6 - i,
                                top: 0,
                                left: "50%",
                            }}
                        />
                    </motion.div>
                ))}

                {/* Floating sparkles */}
                {sparklePositions.map((pos, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={sparkleVariants}
                        animate="animate"
                        className={cn("absolute", color)}
                        style={pos}
                    >
                        <Sparkles className="size-4 opacity-60" />
                    </motion.div>
                ))}

                <CardContent className="relative p-6 sm:p-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Level badge */}
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className={cn(
                                "mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1",
                                "bg-white/70 backdrop-blur-sm text-sm font-semibold",
                                "border border-white/50 shadow-sm",
                                color
                            )}
                        >
                            <Award className="size-4" />
                            {level}
                        </motion.div>

                        {/* Score display */}
                        <motion.div
                            variants={scoreVariants}
                            className="relative mb-3"
                        >
                            <span
                                className={cn(
                                    "text-6xl font-black tabular-nums tracking-tight sm:text-7xl",
                                    color
                                )}
                            >
                                {score.toLocaleString()}
                            </span>
                        </motion.div>

                        {/* Label */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2 text-slate-600"
                        >
                            <Zap className="size-5" />
                            <span className="text-lg font-semibold">Impact Points</span>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-3 text-sm text-slate-500 max-w-xs"
                        >
                            {description}
                        </motion.p>

                        {/* Progress hint */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-4 flex items-center gap-1.5 text-xs text-slate-400"
                        >
                            <TrendingUp className="size-3.5" />
                            <span>Keep donating to increase your score!</span>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default ImpactScoreCard;
