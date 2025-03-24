"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { nanoid } from "nanoid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Moon, Search, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { generateSampleData } from "@/lib/utils/data-utils"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { STORAGE_KEYS, PET_TYPES, SEX_OPTIONS } from "@/lib/constants"
import type { Pet, PetType, Sex } from "@/lib/types"
import { getPetTypeLabel } from "@/lib/utils"
import { calculateAge } from "@/lib/utils/date-utils"
import { toast } from "sonner"
import { useEffect } from "react"

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

// PetForm component
function PetForm({
  pet,
  onSubmit,
  onCancel,
  mode,
}: {
  pet?: Pet
  onSubmit: (pet: Pet) => void
  onCancel?: () => void
  mode: "add" | "edit"
}) {
  const [birthDateOpen, setBirthDateOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<{
    name: string
    type: PetType | ""
    breed: string
    sex: Sex | ""
    birthDate: Date | undefined
    weight: string
    notes: string
  }>({
    defaultValues: {
      name: "",
      type: "",
      breed: "",
      sex: "",
      birthDate: undefined,
      weight: "",
      notes: "",
    },
  })

  // Initialize form with pet data if in edit mode
  useEffect(() => {
    if (pet && mode === "edit") {
      reset({
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        sex: pet.sex,
        birthDate: new Date(pet.birthDate),
        weight: pet.weight.toString(),
        notes: pet.notes || "",
      })
    }
  }, [pet, mode, reset])

  const birthDate = watch("birthDate")

  const handleFormSubmit = (data: {
    name: string
    type: PetType | ""
    breed: string
    sex: Sex | ""
    birthDate: Date | undefined
    weight: string
    notes: string
  }) => {
    // Dismiss any existing toasts
    toast.dismiss()

    const petData: Pet = {
      id: pet?.id || nanoid(),
      name: data.name,
      type: data.type as PetType,
      breed: data.breed || "Mixed",
      sex: data.sex as Sex,
      birthDate: data.birthDate || new Date(),
      weight: data.weight ? Number.parseFloat(data.weight) : 0,
      profilePicture: pet?.profilePicture || "/placeholder.svg?height=100&width=100",
      notes: data.notes || undefined,
      createdAt: pet?.createdAt || new Date(),
      updatedAt: mode === "edit" ? new Date() : undefined,
    }

    // Store the original pet data for undo functionality
    const originalPet = pet

    // Show toast notification with undo option for edit mode
    if (mode === "edit" && originalPet) {
      toast.success("Pet updated", {
        description: `${data.name} has been updated in your pets.`,
        action: {
          label: "Undo",
          onClick: () => {
            // Revert to the original pet data
            onSubmit(originalPet)
            toast.success("Update reverted", {
              description: `Changes to ${originalPet.name} have been undone.`,
            })
          },
        },
      })
    } else {
      // Regular toast for add mode
      toast.success("Pet added", {
        description: `${data.name} has been added to your pets.`,
      })
    }

    onSubmit(petData)

    // Only reset form if adding a new pet
    if (mode === "add") {
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      {/* Name and Type in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="name" className="text-xs font-medium block mb-1">
            Name
          </label>
          <Input id="name" placeholder="Pet's name" {...register("name", { required: "Required" })} className="h-9" />
          {errors.name && <span className="text-xs font-medium text-destructive">{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="type" className="text-xs font-medium block mb-1">
            Type
          </label>
          <Select value={watch("type")} onValueChange={(value) => setValue("type", value as PetType)}>
            <SelectTrigger id="type" className="h-9">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PET_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <span className="text-xs font-medium text-destructive">{errors.type.message}</span>}
        </div>
      </div>

      {/* Breed and Sex in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="breed" className="text-xs font-medium block mb-1">
            Breed
          </label>
          <Input id="breed" placeholder="Breed" {...register("breed")} className="h-9" />
          {errors.breed && <span className="text-xs font-medium text-destructive">{errors.breed.message}</span>}
        </div>

        <div>
          <label htmlFor="sex" className="text-xs font-medium block mb-1">
            Sex
          </label>
          <Select value={watch("sex")} onValueChange={(value) => setValue("sex", value as Sex)}>
            <SelectTrigger id="sex" className="h-9">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              {SEX_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sex && <span className="text-xs font-medium text-destructive">{errors.sex.message}</span>}
        </div>
      </div>

      {/* Birth Date and Weight in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="birthDate" className="text-xs font-medium block mb-1">
            Birth Date
          </label>
          <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="birthDate"
                variant="outline"
                className={cn("w-full h-9 pl-3 text-left font-normal", !birthDate && "text-muted-foreground")}
                type="button"
              >
                {birthDate ? format(birthDate, "PP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={(date) => {
                  setValue("birthDate", date)
                  setBirthDateOpen(false)
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.birthDate && <span className="text-xs font-medium text-destructive">{errors.birthDate.message}</span>}
        </div>

        <div>
          <label htmlFor="weight" className="text-xs font-medium block mb-1">
            Weight (kg)
          </label>
          <Input id="weight" type="number" step="0.1" min="0" {...register("weight")} className="h-9" />
          {errors.weight && <span className="text-xs font-medium text-destructive">{errors.weight.message}</span>}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="text-xs font-medium block mb-1">
          Notes
        </label>
        <Textarea id="notes" placeholder="Additional information" className="resize-none h-20" {...register("notes")} />
        {errors.notes && <span className="text-xs font-medium text-destructive">{errors.notes.message}</span>}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm">
          {mode === "add" ? "Add Pet" : "Update Pet"}
        </Button>
      </div>
    </form>
  )
}

// PetsList component
function PetsList({
  pets,
  selectedPetId,
  onSelectPet,
}: {
  pets: Pet[]
  selectedPetId: string | null
  onSelectPet: (id: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPets = pets.filter((pet) => pet.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pets..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search for pets by name"
        />
      </div>

      <div className="space-y-1">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <Button
              key={pet.id}
              variant="ghost"
              className={cn("w-full justify-start", pet.id === selectedPetId && "bg-accent text-accent-foreground")}
              onClick={() => onSelectPet(pet.id)}
              aria-current={pet.id === selectedPetId ? "page" : undefined}
            >
              <span className="truncate">{pet.name}</span>
            </Button>
          ))
        ) : (
          <p className="py-2 text-center text-sm text-muted-foreground">No pets found</p>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [pets, setPets] = useLocalStorage<Pet[]>(STORAGE_KEYS.PETS, [])
  const [searchQuery, setSearchQuery] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addNewPetDialogOpen, setAddNewPetDialogOpen] = useState(false)
  const [isGeneratingData, setIsGeneratingData] = useState(false)
  const router = useRouter()

  const filteredPets = pets.filter((pet) => pet.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const loadSampleData = () => {
    // Prevent multiple clicks
    if (isGeneratingData) return

    // Set loading state
    setIsGeneratingData(true)

    // Dismiss any existing toasts
    toast.dismiss()

    try {
      // Generate the sample data
      const { samplePets, sampleVaccinations, sampleMedications, sampleAppointments } = generateSampleData()

      // Load the data
      setPets(samplePets)
      localStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(sampleVaccinations))
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(sampleMedications))
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(sampleAppointments))

      // Ensure the success toast is shown
      setTimeout(() => {
        toast.success("Sample data loaded", {
          description: "Sample pets, vaccinations, medications, and appointments have been added successfully.",
        })

        // Reset loading state
        setIsGeneratingData(false)
      }, 500) // Small delay to ensure UI updates are complete
    } catch (error) {
      // Handle any errors
      console.error("Error generating sample data:", error)
      toast.error("Failed to generate sample data", {
        description: "An error occurred while generating sample data.",
      })

      // Reset loading state
      setIsGeneratingData(false)
    }
  }

  const addPet = (pet: Pet) => {
    // Dismiss any existing toasts
    toast.dismiss()

    // Show toast notification IMMEDIATELY when the form is submitted
    toast.success("Pet added", {
      description: `${pet.name} has been added to your pets.`,
    })

    // Close the dialogs
    setAddDialogOpen(false)
    setAddNewPetDialogOpen(false)

    // Add the pet to the list
    setPets([...pets, pet])
  }

  const selectPet = (petId: string) => {
    router.push(`/pets/${petId}`)
  }

  return (
    <div className="pt-0 pb-6">
      <div className="container mx-auto space-y-6 pt-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-0 pb-4 px-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Pet Health Tracker</h1>
            <p className="text-muted-foreground">
              Manage your pets' health information, vaccinations, medications, and vet appointments
            </p>
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto">
            <Button variant="outline" onClick={loadSampleData} disabled={isGeneratingData}>
              {isGeneratingData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Sample Data"
              )}
            </Button>
            <ThemeToggle />
          </div>
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
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search for pets by name"
                />
              </div>
              <Dialog open={addNewPetDialogOpen} onOpenChange={setAddNewPetDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.length > 0 ? (
                filteredPets.map((pet) => (
                  <Card key={pet.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>{pet.name}</CardTitle>
                      <CardDescription>
                        {pet.breed} {getPetTypeLabel(pet.type)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Age:</span> {calculateAge(pet.birthDate)}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Sex:</span> {pet.sex.charAt(0) + pet.sex.slice(1).toLowerCase()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Weight:</span>{" "}
                          {pet.weight > 0 ? `${pet.weight} kg` : "Not recorded"}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => selectPet(pet.id)}
                        aria-label={`View ${pet.name}'s health dashboard`}
                      >
                        View Dashboard
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-muted-foreground">
                  No pets found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

