import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { STATUS_TYPES } from "@/lib/constants"

/**
 * Combine class names with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get badge variant based on status
 */
export function getBadgeVariant(status: string): "default" | "secondary" | "outline" | "destructive" | "warning" {
  switch (status) {
    case STATUS_TYPES.ACTIVE:
      return "default"
    case STATUS_TYPES.UPCOMING:
      return "secondary"
    case STATUS_TYPES.COMPLETED:
      return "outline"
    case STATUS_TYPES.OVERDUE:
      return "destructive"
    case STATUS_TYPES.DUE_SOON:
      return "warning"
    default:
      return "outline"
  }
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case STATUS_TYPES.ACTIVE:
      return "Active"
    case STATUS_TYPES.UPCOMING:
      return "Upcoming"
    case STATUS_TYPES.COMPLETED:
      return "Completed"
    case STATUS_TYPES.OVERDUE:
      return "Overdue"
    case STATUS_TYPES.DUE_SOON:
      return "Due Soon"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

/**
 * Get pet type label
 */
export function getPetTypeLabel(type: string): string {
  return type.replace("_", " ").toLowerCase()
}

/**
 * Get avatar fallback text
 */
export function getAvatarFallback(name: string): string {
  return name.substring(0, 2).toUpperCase()
}

