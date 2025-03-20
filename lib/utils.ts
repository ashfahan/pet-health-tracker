import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears, differenceInMonths } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(birthDate: Date): string {
  const now = new Date()
  const birth = new Date(birthDate)

  const years = differenceInYears(now, birth)

  if (years === 0) {
    const months = differenceInMonths(now, birth)
    return `${months} ${months === 1 ? "month" : "months"}`
  } else {
    const remainingMonths = differenceInMonths(now, birth) % 12

    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? "year" : "years"}`
    } else {
      return `${years} ${years === 1 ? "year" : "years"}, ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`
    }
  }
}

