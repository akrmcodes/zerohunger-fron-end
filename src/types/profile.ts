/**
 * Profile Types
 * Type definitions for user profile management
 */

import { z } from "zod";

// =============================================================================
// DTOs
// =============================================================================

/**
 * Data Transfer Object for updating user profile
 */
export interface UpdateProfileDTO {
    name?: string;
    phone?: string;
    latitude?: number | null;
    longitude?: number | null;
}

/**
 * Profile completion status
 */
export interface ProfileCompletion {
    percentage: number;
    missingFields: string[];
    isComplete: boolean;
}

/**
 * User statistics for profile display
 */
export interface UserStats {
    donationsCreated: number;
    claimsFulfilled: number;
    totalKgSaved: number;
    impactScore: number;
}

// =============================================================================
// Zod Schemas
// =============================================================================

export const profileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    phone: z
        .string()
        .regex(/^[+]?[\d\s-()]{7,20}$/, "Please enter a valid phone number")
        .or(z.literal(""))
        .default(""),
    latitude: z
        .number()
        .min(-90, "Invalid latitude")
        .max(90, "Invalid latitude")
        .nullable()
        .optional(),
    longitude: z
        .number()
        .min(-180, "Invalid longitude")
        .max(180, "Invalid longitude")
        .nullable()
        .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// =============================================================================
// Role Display Helpers
// =============================================================================

export const ROLE_CONFIG = {
    donor: {
        label: "Donor",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: "Heart",
        description: "Food hero saving meals from waste",
    },
    volunteer: {
        label: "Volunteer",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "Truck",
        description: "Delivery champion connecting donors to recipients",
    },
    recipient: {
        label: "Recipient",
        color: "bg-violet-100 text-violet-800 border-violet-200",
        icon: "Users",
        description: "Community partner fighting hunger",
    },
} as const;

export type UserRole = keyof typeof ROLE_CONFIG;

// =============================================================================
// Profile Completion Calculator
// =============================================================================

export function calculateProfileCompletion(user: {
    name?: string;
    phone?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}): ProfileCompletion {
    const fields = [
        { key: "name", label: "Name", value: user.name },
        { key: "phone", label: "Phone number", value: user.phone },
        { key: "location", label: "Location", value: user.latitude && user.longitude },
    ];

    const completedFields = fields.filter((f) => !!f.value);
    const missingFields = fields.filter((f) => !f.value).map((f) => f.label);
    const percentage = Math.round((completedFields.length / fields.length) * 100);

    return {
        percentage,
        missingFields,
        isComplete: percentage === 100,
    };
}
