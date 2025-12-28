"use client";

import { motion } from "framer-motion";
import {
    Lock,
    Key,
    Shield,
    AlertTriangle,
    Trash2,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// =============================================================================
// Animation Variants
// =============================================================================

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 25,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring" as const,
            stiffness: 400,
            damping: 25,
        },
    },
};

// =============================================================================
// Settings Item Component
// =============================================================================

interface SettingsItemProps {
    icon: React.ElementType;
    title: string;
    description: string;
    iconBg?: string;
    iconColor?: string;
    action?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

function SettingsItem({
    icon: Icon,
    title,
    description,
    iconBg = "bg-slate-100",
    iconColor = "text-slate-600",
    action,
    onClick,
    disabled = false,
}: SettingsItemProps) {
    return (
        <motion.button
            variants={itemVariants}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors",
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-slate-50 cursor-pointer"
            )}
        >
            <div
                className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                    iconBg
                )}
            >
                <Icon className={cn("size-5", iconColor)} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            {action || <ChevronRight className="size-5 shrink-0 text-slate-400" />}
        </motion.button>
    );
}

// =============================================================================
// Main Component
// =============================================================================

export function AccountSettings() {
    // Placeholder handlers - these would integrate with actual functionality
    const handleChangePassword = () => {
        // TODO: Implement password change modal
        alert("Password change coming soon!");
    };

    const handleTwoFactor = () => {
        // TODO: Implement 2FA setup
        alert("Two-factor authentication coming soon!");
    };

    const handleDeleteAccount = () => {
        // TODO: Implement account deletion flow
        alert("Account deletion requires confirmation. Coming soon!");
    };

    return (
        <div className="space-y-6">
            {/* Security Settings */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                <Card className="border-slate-200/60 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="size-5 text-blue-600" />
                            Security Settings
                        </CardTitle>
                        <CardDescription>
                            Manage your account security and authentication options
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <SettingsItem
                            icon={Key}
                            title="Change Password"
                            description="Update your account password"
                            iconBg="bg-blue-100"
                            iconColor="text-blue-600"
                            onClick={handleChangePassword}
                        />

                        <Separator className="my-2" />

                        <SettingsItem
                            icon={Lock}
                            title="Two-Factor Authentication"
                            description="Add an extra layer of security"
                            iconBg="bg-violet-100"
                            iconColor="text-violet-600"
                            onClick={handleTwoFactor}
                            action={
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                    Recommended
                                </span>
                            }
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
            >
                <Card className="border-red-200/60 bg-red-50/30 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="size-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription className="text-red-600/80">
                            Irreversible actions that affect your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-red-200 bg-white p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Delete Account
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Permanently delete your account and all associated data
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleDeleteAccount}
                                    className="shrink-0 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default AccountSettings;
