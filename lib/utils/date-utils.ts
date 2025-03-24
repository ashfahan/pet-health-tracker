import { differenceInYears, differenceInMonths, isPast, isToday, addDays } from "date-fns"

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
      return `${years} ${years === 1 ? "year" : "years"}, ${remainingMonths} ${
        remainingMonths === 1 ? "month" : "months"
      }`
    }
  }
}

/**
 * Get vaccination status based on due date and administered date
 */
export function getVaccinationStatus(vaccination: any): string {
  const dueDate = new Date(vaccination.dueDate)

  if (vaccination.administeredDate) {
    return "completed"
  } else if (isPast(dueDate) && !isToday(dueDate)) {
    return "overdue"
  } else if (isToday(dueDate) || isPast(addDays(dueDate, -7))) {
    return "due-soon"
  } else {
    return "upcoming"
  }
}

/**
 * Get medication status based on start and end dates
 */
export function getMedicationStatus(medication: any): string {
  const startDate = new Date(medication.startDate)
  const endDate = new Date(medication.endDate)
  const now = new Date()

  if (isPast(endDate) && !isToday(endDate)) {
    return "completed"
  } else if (!isPast(startDate) && !isToday(startDate)) {
    return "upcoming"
  } else {
    return "active"
  }
}

/**
 * Get appointment status based on date
 */
export function getAppointmentStatus(appointment: any): string {
  const appointmentDate = new Date(appointment.date)

  if (!isPast(appointmentDate) || isToday(appointmentDate)) {
    return "upcoming"
  } else {
    return "completed"
  }
}

/**
 * Sort vaccinations by status and due date
 */
export function sortVaccinations(vaccinations: any[]): any[] {
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
export function sortMedications(medications: any[]): any[] {
  return [...medications].sort((a, b) => {
    const statusA = getMedicationStatus(a)
    const statusB = getMedicationStatus(b)

    // Active first, then upcoming, then completed
    if (statusA === "active" && statusB !== "active") return -1
    if (statusA !== "active" && statusB === "active") return 1
    if (statusA === "upcoming" && statusB === "completed") return -1
    if (statusA === "completed" && statusB === "upcoming") return 1

    // Then sort by start date
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })
}

/**
 * Sort appointments by date (future first, then past)
 */
export function sortAppointments(appointments: any[]): any[] {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    const now = new Date()

    // Future appointments first
    if (!isPast(dateA) && isPast(dateB)) return -1
    if (isPast(dateA) && !isPast(dateB)) return 1

    // Then sort by date (newest first for future, oldest first for past)
    if (!isPast(dateA) && !isPast(dateB)) {
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
      return status === "upcoming" || status === "due-soon" || status === "active"
    })
    .slice(0, limit)
}

