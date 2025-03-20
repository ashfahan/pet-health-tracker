import { differenceInYears, differenceInMonths, isFuture, isPast, isToday, addDays } from "date-fns"
import { STATUS_TYPES } from "@/lib/constants"
import type { Vaccination, Medication, Appointment } from "@/lib/types"

/**
 * Calculate age from birth date in years and months
 */
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

/**
 * Get vaccination status based on due date and administered date
 */
export function getVaccinationStatus(vaccination: Vaccination): string {
  const dueDate = new Date(vaccination.dueDate)

  if (vaccination.administeredDate) {
    return STATUS_TYPES.COMPLETED
  } else if (isPast(dueDate) && !isToday(dueDate)) {
    return STATUS_TYPES.OVERDUE
  } else if (isToday(dueDate) || isPast(addDays(dueDate, -7))) {
    return STATUS_TYPES.DUE_SOON
  } else {
    return STATUS_TYPES.UPCOMING
  }
}

/**
 * Get medication status based on start and end dates
 */
export function getMedicationStatus(medication: Medication): string {
  const startDate = new Date(medication.startDate)
  const endDate = new Date(medication.endDate)

  if (isPast(endDate) && !isToday(endDate)) {
    return STATUS_TYPES.COMPLETED
  } else if (!isPast(startDate) && !isToday(startDate)) {
    return STATUS_TYPES.UPCOMING
  } else {
    return STATUS_TYPES.ACTIVE
  }
}

/**
 * Get appointment status based on date
 */
export function getAppointmentStatus(appointment: Appointment): string {
  const appointmentDate = new Date(appointment.date)

  if (isFuture(appointmentDate) || isToday(appointmentDate)) {
    return STATUS_TYPES.UPCOMING
  } else {
    return STATUS_TYPES.COMPLETED
  }
}

/**
 * Sort vaccinations by status and due date
 */
export function sortVaccinations(vaccinations: Vaccination[]): Vaccination[] {
  return [...vaccinations].sort((a, b) => {
    // Completed vaccinations at the bottom
    if (a.administeredDate && !b.administeredDate) return 1
    if (!a.administeredDate && b.administeredDate) return -1

    // Then sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
}

/**
 * Sort medications by status and start date
 */
export function sortMedications(medications: Medication[]): Medication[] {
  return [...medications].sort((a, b) => {
    const statusA = getMedicationStatus(a)
    const statusB = getMedicationStatus(b)

    // Active first, then upcoming, then completed
    if (statusA === STATUS_TYPES.ACTIVE && statusB !== STATUS_TYPES.ACTIVE) return -1
    if (statusA !== STATUS_TYPES.ACTIVE && statusB === STATUS_TYPES.ACTIVE) return 1
    if (statusA === STATUS_TYPES.UPCOMING && statusB === STATUS_TYPES.COMPLETED) return -1
    if (statusA === STATUS_TYPES.COMPLETED && statusB === STATUS_TYPES.UPCOMING) return 1

    // Then sort by start date
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })
}

/**
 * Sort appointments by date (future first, then past)
 */
export function sortAppointments(appointments: Appointment[]): Appointment[] {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    // Future appointments first
    if (isFuture(dateA) && !isFuture(dateB)) return -1
    if (!isFuture(dateA) && isFuture(dateB)) return 1

    // Then sort by date (newest first for future, oldest first for past)
    if (isFuture(dateA) && isFuture(dateB)) {
      return dateA.getTime() - dateB.getTime() // Ascending for future
    } else {
      return dateB.getTime() - dateA.getTime() // Descending for past
    }
  })
}

/**
 * Filter items by pet ID
 */
export function filterByPet<T extends { petId: string }>(items: T[], petId: string | null): T[] {
  if (!petId) return []
  return items.filter((item) => item.petId === petId)
}

/**
 * Get upcoming items (vaccinations, medications, appointments)
 */
export function getUpcomingItems<T>(items: T[], getStatus: (item: T) => string, limit = 3): T[] {
  return items
    .filter((item) => {
      const status = getStatus(item)
      return status === STATUS_TYPES.UPCOMING || status === STATUS_TYPES.DUE_SOON || status === STATUS_TYPES.ACTIVE
    })
    .slice(0, limit)
}

