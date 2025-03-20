"use client"

import { AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PetOverview } from "@/components/pet-overview"
import { VaccinationsTracker } from "@/components/vaccinations-tracker"
import { MedicationsTracker } from "@/components/medications-tracker"
import { AppointmentsTracker } from "@/components/appointments-tracker"
import { PetsList } from "@/components/pets-list"
import { PetForm } from "@/components/pet-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { generateSampleData } from "@/lib/utils/data-utils"
import type { Pet, Appointment, Medication, Vaccination } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { filterByPet } from "@/lib/utils/date-utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { STORAGE_KEYS } from "@/lib/constants"
import { Edit, Plus, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function PetDashboard() {
  const [pets, setPets] = useLocalStorage<Pet[]>(STORAGE_KEYS.PETS, [])
  const [vaccinations, setVaccinations] = useLocalStorage<Vaccination[]>(STORAGE_KEYS.VACCINATIONS, [])
  const [medications, setMedications] = useLocalStorage<Medication[]>(STORAGE_KEYS.MEDICATIONS, [])
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, [])
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Select the first pet by default or when pets change
  // Only run this effect when pets array length changes, not on every change to the pets array
  useEffect(() => {
    // Only update selectedPetId if it's null and there are pets, or if there are no pets
    if ((pets.length > 0 && selectedPetId === null) || pets.length === 0) {
      setSelectedPetId(pets.length > 0 ? pets[0].id : null)
    }
  }, [pets.length, selectedPetId])

  const selectedPet = selectedPetId ? pets.find((pet) => pet.id === selectedPetId) || null : null

  const loadSampleData = () => {
    const { samplePets, sampleVaccinations, sampleMedications, sampleAppointments } = generateSampleData()
    setPets(samplePets)
    setVaccinations(sampleVaccinations)
    setMedications(sampleMedications)
    setAppointments(sampleAppointments)
    // Don't set selectedPetId here, let the useEffect handle it
  }

  const addPet = (pet: Pet) => {
    setPets([...pets, pet])
    setSelectedPetId(pet.id)
    setAddDialogOpen(false)
  }

  const updatePet = (updatedPet: Pet) => {
    setPets(pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)))
    setEditDialogOpen(false)
  }

  const deletePet = () => {
    if (!selectedPetId) return

    // Delete pet and all related records
    setPets(pets.filter((pet) => pet.id !== selectedPetId))
    setVaccinations(vaccinations.filter((v) => v.petId !== selectedPetId))
    setMedications(medications.filter((m) => m.petId !== selectedPetId))
    setAppointments(appointments.filter((a) => a.petId !== selectedPetId))

    // Select another pet if available
    const remainingPets = pets.filter((pet) => pet.id !== selectedPetId)
    setSelectedPetId(remainingPets.length > 0 ? remainingPets[0].id : null)
    setDeleteDialogOpen(false)
  }

  const addVaccination = (vaccination: Vaccination) => {
    setVaccinations([...vaccinations, vaccination])
  }

  const addMedication = (medication: Medication) => {
    setMedications([...medications, medication])
  }

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment])
  }

  const deleteVaccination = (id: string) => {
    setVaccinations(vaccinations.filter((v) => v.id !== id))
  }

  const deleteMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id))
  }

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Pet Health Tracker</h1>
          <p className="text-muted-foreground">
            Manage your pets' health information, vaccinations, medications, and vet appointments
          </p>
        </div>
        <ThemeToggle />
      </header>

      {pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-16">
          <h2 className="text-xl font-semibold">Welcome to Pet Health Tracker</h2>
          <p className="text-center text-muted-foreground">
            Start by adding your first pet or load sample data to explore the application.
          </p>
          <div className="flex gap-2">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  Add Your First Pet
                  <span className="sr-only">Add a new pet to start tracking their health</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Pet</DialogTitle>
                  <DialogDescription>
                    Enter your pet's details to start tracking their health information.
                  </DialogDescription>
                </DialogHeader>
                <PetForm onSubmit={addPet} mode="add" />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={loadSampleData}>
              Generate Sample Data
              <span className="sr-only">Load sample data to explore the application</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <aside className="flex flex-col space-y-4">
            <PetsList pets={pets} selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Add New Pet
                  <span className="sr-only">Add another pet to your account</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Pet</DialogTitle>
                  <DialogDescription>
                    Enter your pet's details to start tracking their health information.
                  </DialogDescription>
                </DialogHeader>
                <PetForm onSubmit={addPet} mode="add" />
              </DialogContent>
            </Dialog>
          </aside>

          {selectedPet && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
                <div className="flex gap-2">
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                        Edit Profile
                        <span className="sr-only">Edit {selectedPet.name}'s profile</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Pet Profile</DialogTitle>
                        <DialogDescription>Update {selectedPet.name}'s information</DialogDescription>
                      </DialogHeader>
                      <PetForm pet={selectedPet} onSubmit={updatePet} mode="edit" />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                        Delete
                        <span className="sr-only">Delete {selectedPet.name}'s profile</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {selectedPet.name}'s profile and all associated records including
                          vaccinations, medications, and appointments.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={deletePet}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <PetOverview
                    pet={selectedPet}
                    vaccinations={filterByPet(vaccinations, selectedPetId)}
                    medications={filterByPet(medications, selectedPetId)}
                    appointments={filterByPet(appointments, selectedPetId)}
                  />
                </TabsContent>

                <TabsContent value="vaccinations" className="space-y-6">
                  <VaccinationsTracker
                    pet={selectedPet}
                    vaccinations={filterByPet(vaccinations, selectedPetId)}
                    onAdd={addVaccination}
                    onDelete={deleteVaccination}
                  />
                </TabsContent>

                <TabsContent value="medications" className="space-y-6">
                  <MedicationsTracker
                    pet={selectedPet}
                    medications={filterByPet(medications, selectedPetId)}
                    onAdd={addMedication}
                    onDelete={deleteMedication}
                  />
                </TabsContent>

                <TabsContent value="appointments" className="space-y-6">
                  <AppointmentsTracker
                    pet={selectedPet}
                    appointments={filterByPet(appointments, selectedPetId)}
                    onAdd={addAppointment}
                    onDelete={deleteAppointment}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

