"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { Pet, Appointment, Medication, Vaccination } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { filterByPet } from "@/lib/utils/date-utils"
import { STORAGE_KEYS } from "@/lib/constants"
import { DeletePetDialog } from "@/components/dialogs/delete-pet-dialog"
import { EditPetDialog } from "@/components/dialogs/edit-pet-dialog"
import { PetDashboardTabs } from "@/components/dashboard/pet-dashboard-tabs"
import { deletePet, restorePet, type DeletedPetData } from "@/lib/utils/pet-utils"
import { toast } from "sonner"
import { ArrowLeft, Edit, Moon, Sun, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Constants
const DELETED_PET_KEY = "DELETED_PET_DATA"

// ThemeToggle component
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <Button variant="ghost" size="icon" aria-hidden>
        <div className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">{theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}</span>
    </Button>
  )
}

// PetDashboardHeader component
function PetDashboardHeader({
  pet,
  activeTab,
  onBack,
  onDelete,
  onOpenEditDialog,
}: {
  pet: Pet
  activeTab: string
  onBack: () => void
  onDelete: () => void
  onOpenEditDialog: () => void
}) {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} aria-label="Back to pet selection">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{pet.name}'s Dashboard</h1>
        {/* Descriptive text removed - only shown on home page */}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onOpenEditDialog}>
          <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
          Edit Profile
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}

// Utility functions for deleted pet data
function saveDeletedPet(data: DeletedPetData): void {
  try {
    localStorage.setItem(DELETED_PET_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving deleted pet data:", error)
  }
}

function getDeletedPet(): DeletedPetData | null {
  try {
    const data = localStorage.getItem(DELETED_PET_KEY)
    if (!data) return null

    const parsedData = JSON.parse(data) as DeletedPetData

    // Convert date strings back to Date objects
    if (parsedData.pet) {
      parsedData.pet.birthDate = new Date(parsedData.pet.birthDate)
      parsedData.pet.createdAt = new Date(parsedData.pet.createdAt)

      // Convert dates in related records
      if (parsedData.vaccinations) {
        parsedData.vaccinations.forEach((v) => {
          v.dueDate = new Date(v.dueDate)
          if (v.administeredDate) v.administeredDate = new Date(v.administeredDate)
          v.createdAt = new Date(v.createdAt)
        })
      }

      if (parsedData.medications) {
        parsedData.medications.forEach((m) => {
          m.startDate = new Date(m.startDate)
          m.endDate = new Date(m.endDate)
          m.createdAt = new Date(m.createdAt)
        })
      }

      if (parsedData.appointments) {
        parsedData.appointments.forEach((a) => {
          a.date = new Date(a.date)
          a.createdAt = new Date(a.createdAt)
        })
      }
    }

    return parsedData
  } catch (error) {
    console.error("Error getting deleted pet data:", error)
    return null
  }
}

function clearDeletedPet(): void {
  try {
    localStorage.removeItem(DELETED_PET_KEY)
  } catch (error) {
    console.error("Error clearing deleted pet data:", error)
  }
}

export default function PetPage({ params }: { params: { petId: string } }) {
  const petId = params.petId
  const [pets, setPets] = useLocalStorage<Pet[]>(STORAGE_KEYS.PETS, [])
  const [vaccinations, setVaccinations] = useLocalStorage<Vaccination[]>(STORAGE_KEYS.VACCINATIONS, [])
  const [medications, setMedications] = useLocalStorage<Medication[]>(STORAGE_KEYS.MEDICATIONS, [])
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, [])
  const [activeTab, setActiveTab] = useState("overview")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Store deleted items for undo functionality
  const [deletedVaccination, setDeletedVaccination] = useState<Vaccination | null>(null)
  const [deletedMedication, setDeletedMedication] = useState<Medication | null>(null)
  const [deletedAppointment, setDeletedAppointment] = useState<Appointment | null>(null)

  const router = useRouter()

  // Find the selected pet
  const selectedPet = pets.find((pet) => pet.id === petId) || null

  // Redirect to home if pet not found
  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      router.push("/")
    }
  }, [selectedPet, pets.length, router])

  // Handle undo delete pet - using React state
  const handleUndoDeletePet = useCallback(() => {
    try {
      const deletedData = getDeletedPet()
      if (!deletedData) {
        console.error("No deleted pet data found")
        toast.error("Unable to restore pet", {
          description: "The deleted pet data could not be found.",
        })
        return
      }

      // Restore the pet and related data
      const { updatedPets, updatedVaccinations, updatedMedications, updatedAppointments } = restorePet(deletedData)

      // Update React state (which will update localStorage via useLocalStorage hook)
      setPets(updatedPets)
      setVaccinations(updatedVaccinations)
      setMedications(updatedMedications)
      setAppointments(updatedAppointments)

      // Clear the deleted data
      clearDeletedPet()

      // Show success toast
      toast.success("Pet restored", {
        description: `${deletedData.pet.name} has been restored with all their records.`,
      })

      // Navigate to the restored pet's dashboard
      router.push(`/pets/${deletedData.pet.id}`)
    } catch (error) {
      console.error("Error in handleUndoDeletePet:", error)
      toast.error("Failed to restore pet", {
        description: "There was an error restoring the pet. Please try again.",
      })
    }
  }, [setPets, setVaccinations, setMedications, setAppointments, router])

  // Update the updatePet function to show toast sooner
  const updatePet = (updatedPet: Pet) => {
    // Close the dialog
    setEditDialogOpen(false)

    // Update pet in state
    setPets(pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)))
  }

  // Function to delete pet with confirmation
  const handleDeletePet = () => {
    if (!selectedPet) return

    try {
      // Delete the pet and get updated data
      const { updatedPets, updatedVaccinations, updatedMedications, updatedAppointments, deletedData } = deletePet(
        petId,
        pets,
        vaccinations,
        medications,
        appointments,
      )

      // Save the deleted data for undo
      saveDeletedPet(deletedData)

      // Update state
      setPets(updatedPets)
      setVaccinations(updatedVaccinations)
      setMedications(updatedMedications)
      setAppointments(updatedAppointments)

      // Close the dialog
      setDeleteDialogOpen(false)

      // Show toast notification after deletion with undo option
      toast.success("Pet deleted", {
        description: `${selectedPet.name} has been removed.`,
        action: {
          label: "Undo",
          onClick: handleUndoDeletePet,
        },
      })

      // Navigate back to the pet selection page
      router.push("/")
    } catch (error) {
      console.error("Error deleting pet:", error)
      toast.error("Failed to delete pet", {
        description: "There was an error deleting the pet. Please try again.",
      })
      setDeleteDialogOpen(false)
    }
  }

  const addVaccination = (vaccination: Vaccination) => {
    setVaccinations([...vaccinations, vaccination])
  }

  const updateVaccination = (updatedVaccination: Vaccination) => {
    setVaccinations(vaccinations.map((v) => (v.id === updatedVaccination.id ? updatedVaccination : v)))
  }

  const addMedication = (medication: Medication) => {
    setMedications([...medications, medication])
  }

  const updateMedication = (updatedMedication: Medication) => {
    setMedications(medications.map((m) => (m.id === updatedMedication.id ? updatedMedication : m)))
  }

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment])
  }

  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(appointments.map((a) => (a.id === updatedAppointment.id ? updatedAppointment : a)))
  }

  // Update the deleteVaccination function to use standard toast
  const deleteVaccination = (id: string) => {
    const vaccinationToDelete = vaccinations.find((v) => v.id === id)
    if (!vaccinationToDelete) return

    // Store the deleted vaccination for potential undo
    setDeletedVaccination(vaccinationToDelete)

    // Update the vaccinations list
    const updatedVaccinations = vaccinations.filter((v) => v.id !== id)
    setVaccinations(updatedVaccinations)

    // Show toast with undo option
    toast.success("Vaccination deleted", {
      description: `${vaccinationToDelete.name} has been removed from ${selectedPet?.name}'s records.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Always restore the item when undo is clicked
          setVaccinations((current) => {
            // Check if the item is already in the list to avoid duplicates
            if (current.some((v) => v.id === vaccinationToDelete.id)) {
              // Silently return the current state without showing a toast
              return current
            }

            // Add the item back to the list
            toast.success("Vaccination restored", {
              description: `${vaccinationToDelete.name} has been restored to ${selectedPet?.name}'s records.`,
            })
            return [...current, vaccinationToDelete]
          })

          // Clear the deleted item reference
          setDeletedVaccination(null)
        },
      },
    })
  }

  // Update the deleteMedication function to use standard toast
  const deleteMedication = (id: string) => {
    const medicationToDelete = medications.find((m) => m.id === id)
    if (!medicationToDelete) return

    // Store the deleted medication for potential undo
    setDeletedMedication(medicationToDelete)

    // Update the medications list
    const updatedMedications = medications.filter((m) => m.id !== id)
    setMedications(updatedMedications)

    // Show toast with undo option
    toast.success("Medication deleted", {
      description: `${medicationToDelete.name} has been removed from ${selectedPet?.name}'s records.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Always restore the item when undo is clicked
          setMedications((current) => {
            // Check if the item is already in the list to avoid duplicates
            if (current.some((m) => m.id === medicationToDelete.id)) {
              // Silently return the current state without showing a toast
              return current
            }

            // Add the item back to the list
            toast.success("Medication restored", {
              description: `${medicationToDelete.name} has been restored to ${selectedPet?.name}'s records.`,
            })
            return [...current, medicationToDelete]
          })

          // Clear the deleted item reference
          setDeletedMedication(null)
        },
      },
    })
  }

  // Update the deleteAppointment function to use standard toast
  const deleteAppointment = (id: string) => {
    const appointmentToDelete = appointments.find((a) => a.id === id)
    if (!appointmentToDelete) return

    // Store the deleted appointment for potential undo
    setDeletedAppointment(appointmentToDelete)

    // Update the appointments list
    const updatedAppointments = appointments.filter((a) => a.id !== id)
    setAppointments(updatedAppointments)

    // Show toast with undo option
    toast.success("Appointment deleted", {
      description: `Appointment with ${appointmentToDelete.vetName} has been removed from ${selectedPet?.name}'s records.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Always restore the item when undo is clicked
          setAppointments((current) => {
            // Check if the item is already in the list to avoid duplicates
            if (current.some((a) => a.id === appointmentToDelete.id)) {
              // Silently return the current state without showing a toast
              return current
            }

            // Add the item back to the list
            toast.success("Appointment restored", {
              description: `Appointment with ${appointmentToDelete.vetName} has been restored to ${selectedPet?.name}'s records.`,
            })
            return [...current, appointmentToDelete]
          })

          // Clear the deleted item reference
          setDeletedAppointment(null)
        },
      },
    })
  }

  if (!selectedPet) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="pt-0 pb-6">
      <div className="container mx-auto space-y-6 pt-0">
        <PetDashboardHeader
          pet={selectedPet}
          activeTab={activeTab}
          onBack={() => router.push("/")}
          onDelete={() => setDeleteDialogOpen(true)}
          onOpenEditDialog={() => setEditDialogOpen(true)}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <PetDashboardTabs
            pet={selectedPet}
            vaccinations={filterByPet(vaccinations, petId)}
            medications={filterByPet(medications, petId)}
            appointments={filterByPet(appointments, petId)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddVaccination={addVaccination}
            onUpdateVaccination={updateVaccination}
            onDeleteVaccination={deleteVaccination}
            onAddMedication={addMedication}
            onUpdateMedication={updateMedication}
            onDeleteMedication={deleteMedication}
            onAddAppointment={addAppointment}
            onUpdateAppointment={updateAppointment}
            onDeleteAppointment={deleteAppointment}
          />
        </div>

        {/* Move these dialogs outside the tabs section */}
        <EditPetDialog pet={selectedPet} open={editDialogOpen} onOpenChange={setEditDialogOpen} onSubmit={updatePet} />

        <DeletePetDialog
          pet={selectedPet}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeletePet}
        />
      </div>
    </div>
  )
}

