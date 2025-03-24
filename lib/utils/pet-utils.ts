import type { Pet, Vaccination, Medication, Appointment } from "@/lib/types"
import { STORAGE_KEYS } from "@/lib/constants"

export interface DeletedPetData {
  pet: Pet
  vaccinations: Vaccination[]
  medications: Medication[]
  appointments: Appointment[]
}

export function deletePet(
  petId: string,
  pets: Pet[],
  vaccinations: Vaccination[],
  medications: Medication[],
  appointments: Appointment[],
): {
  updatedPets: Pet[]
  updatedVaccinations: Vaccination[]
  updatedMedications: Medication[]
  updatedAppointments: Appointment[]
  deletedData: DeletedPetData
} {
  const petToDelete = pets.find((pet) => pet.id === petId)
  if (!petToDelete) {
    throw new Error(`Pet with ID ${petId} not found`)
  }

  const petVaccinations = vaccinations.filter((v) => v.petId === petId)
  const petMedications = medications.filter((m) => m.petId === petId)
  const petAppointments = appointments.filter((a) => a.petId === petId)

  const deletedData: DeletedPetData = {
    pet: petToDelete,
    vaccinations: petVaccinations,
    medications: petMedications,
    appointments: petAppointments,
  }

  const updatedPets = pets.filter((pet) => pet.id !== petId)
  const updatedVaccinations = vaccinations.filter((v) => v.petId !== petId)
  const updatedMedications = medications.filter((m) => m.petId !== petId)
  const updatedAppointments = appointments.filter((a) => a.petId !== petId)

  return {
    updatedPets,
    updatedVaccinations,
    updatedMedications,
    updatedAppointments,
    deletedData,
  }
}

export function restorePet(deletedData: DeletedPetData): {
  updatedPets: Pet[]
  updatedVaccinations: Vaccination[]
  updatedMedications: Medication[]
  updatedAppointments: Appointment[]
} {
  try {
    // Get the current data from localStorage to ensure we're working with the latest data
    const currentPets = JSON.parse(localStorage.getItem(STORAGE_KEYS.PETS) || "[]")
    const currentVaccinations = JSON.parse(localStorage.getItem(STORAGE_KEYS.VACCINATIONS) || "[]")
    const currentMedications = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEDICATIONS) || "[]")
    const currentAppointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || "[]")

    // Restore the pet and related data
    const updatedPets = [...currentPets, deletedData.pet]
    const updatedVaccinations = [...currentVaccinations, ...deletedData.vaccinations]
    const updatedMedications = [...currentMedications, ...deletedData.medications]
    const updatedAppointments = [...currentAppointments, ...deletedData.appointments]

    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(updatedPets))
    localStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(updatedVaccinations))
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(updatedMedications))
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments))

    // Return the updated data for state updates
    return {
      updatedPets,
      updatedVaccinations,
      updatedMedications,
      updatedAppointments,
    }
  } catch (error) {
    console.error("Error restoring pet:", error)
    throw error
  }
}

