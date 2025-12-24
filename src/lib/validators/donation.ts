import { z } from "zod";
import { FoodType } from "@/types/donation";

export const donationSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(250, { message: "Description cannot exceed 250 characters" }),

  food_type: z.nativeEnum(FoodType, {
    message: "Please select a valid food type",
  }),

  // Using coerce handles string-to-number conversion automatically
  quantity: z.coerce
    .number()
    .positive({ message: "Quantity must be greater than 0" })
    .max(1000, { message: "Quantity cannot exceed 1000kg" }),

  pickup_address: z
    .string()
    .min(5, { message: "Pickup address is required (min 5 chars)" }),

  expires_at: z
    .string()
    .refine((date) => new Date(date) > new Date(), {
      message: "Expiration time must be in the future",
    }),
});

export type DonationFormValues = z.infer<typeof donationSchema>;
