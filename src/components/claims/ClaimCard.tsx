"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, ExternalLink, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/donations/StatusBadge";
import { cn } from "@/lib/utils";
import { Claim } from "@/types/claim";
import { Donation, DonationStatus } from "@/types/donation";

export interface ClaimWithDonation extends Claim {
    donation?: Donation;
}

interface ClaimCardProps {
    claim: ClaimWithDonation;
    index?: number;
}

const statusAccent: Record<string, string> = {
    active: "border-l-4 border-l-emerald-500",
    picked_up: "border-l-4 border-l-blue-500",
    delivered: "border-l-4 border-l-slate-400",
    cancelled: "border-l-4 border-l-rose-500",
};

const cardVariants = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.22 } }),
};

function mapClaimStatusToDonationStatus(status: Claim["status"]): DonationStatus {
    switch (status) {
        case "active":
            return DonationStatus.Claimed;
        case "picked_up":
            return DonationStatus.PickedUp;
        case "delivered":
            return DonationStatus.Delivered;
        case "cancelled":
            return DonationStatus.Cancelled;
        default:
            return DonationStatus.Pending;
    }
}

export function ClaimCard({ claim, index = 0 }: ClaimCardProps) {
    const donation = claim.donation;
    const statusClass = statusAccent[claim.status] ?? "border-l-4 border-l-slate-300";
    const badgeStatus = donation?.status ?? mapClaimStatusToDonationStatus(claim.status);

    const pickupCode = useMemo(() => {
        const codeCandidate = [
            donation?.claim && "pickup_code" in (donation.claim as unknown as Record<string, unknown>)
                ? (donation.claim as { pickup_code?: string | number }).pickup_code
                : undefined,
            donation?.pickup_code,
            claim.id,
            donation?.id,
        ].find((value) => value !== null && value !== undefined);

        return String(codeCandidate ?? claim.id).slice(-6).padStart(6, "0");
    }, [claim.id, donation?.claim, donation?.pickup_code, donation?.id]);

    const donorName = donation?.donor && "name" in donation.donor ? String((donation.donor as { name?: string }).name ?? "") : "Donor";
    const donorInitials = donorName ? donorName.slice(0, 2).toUpperCase() : "DN";
    const donorPhone = donation?.donor && "phone" in donation.donor ? (donation.donor as { phone?: string | null }).phone ?? undefined : undefined;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pickupCode);
            toast.success("Pickup code copied");
        } catch {
            toast.error("Unable to copy code");
        }
    };

    const handleNavigate = () => {
        const lat = donation?.latitude;
        const lng = donation?.longitude;
        const address = donation?.pickup_address;

        let url = "";
        if (lat && lng && (lat !== 0 || lng !== 0)) {
            url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        } else if (address) {
            url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        }

        if (!url) {
            toast.error("No location data available");
            return;
        }
        window.open(url, "_blank");
    };

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -3 }}
        >
            <Card className={cn("h-full overflow-hidden border border-border/70 shadow-sm transition-shadow hover:shadow-md", statusClass)}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold leading-tight line-clamp-1">
                                {donation?.title ?? "Donation"}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">Claim #{claim.id}</p>
                        </div>
                        <StatusBadge status={badgeStatus} />
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 pb-4">
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarFallback className="text-xs font-semibold">{donorInitials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium leading-tight">{donorName || "Donor"}</p>
                                <p className="text-xs text-muted-foreground">Donor</p>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="icon-sm"
                            variant="ghost"
                            className="text-primary"
                            disabled={!donorPhone}
                            aria-label="Call donor"
                        >
                            <a href={donorPhone ? `tel:${donorPhone}` : undefined}>
                                <Phone className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>

                    {donation?.pickup_address && (
                        <div className="flex items-start justify-between gap-3 rounded-lg border border-dashed border-border/80 px-3 py-2">
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                                <div>
                                    <p className="text-sm font-medium leading-tight">Pickup Location</p>
                                    <p className="line-clamp-2 text-xs text-muted-foreground">{donation.pickup_address}</p>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" onClick={handleNavigate} className="text-primary">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Get directions</span>
                            </Button>
                        </div>
                    )}

                    {(claim.status === "active" || claim.status === "picked_up") && (
                        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-primary/80">Pickup Code</p>
                                <p className="text-2xl font-semibold tracking-[0.3em] text-primary">{pickupCode}</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={handleCopy} aria-label="Copy pickup code">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div className="text-xs text-muted-foreground">
                        Updated {new Date(claim.updated_at ?? claim.created_at).toLocaleString()}
                    </div>
                    <Button asChild size="sm" variant="outline">
                        <Link href={`/donations/${claim.donation_id}`} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            View Details
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
