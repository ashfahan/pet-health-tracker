"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { nanoid } from "nanoid"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PET_TYPES, SEX_OPTIONS } from "@/lib/constants"
import type { Pet, PetType, Sex } from "@/lib/types"
import { toast } from "sonner"

interface PetFormProps {
  pet?: Pet
  onSubmit: (pet: Pet) => void
  onCancel?: () => void
  mode: "add" | "edit"
}

function PetForm({ pet, onSubmit, onCancel, mode }: PetFormProps) {
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

interface EditPetDialogProps {
  pet: Pet
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (pet: Pet) => void
}

export function EditPetDialog({ pet, open, onOpenChange, onSubmit }: EditPetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pet Profile</DialogTitle>
          <DialogDescription>Update {pet.name}'s information</DialogDescription>
        </DialogHeader>
        <PetForm pet={pet} onSubmit={onSubmit} mode="edit" />
      </DialogContent>
    </Dialog>
  )
}

