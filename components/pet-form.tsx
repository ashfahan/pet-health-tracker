"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Pet, PetType, Sex } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils/ui-utils"
import { generateId } from "@/lib/utils/data-utils"
import { PET_TYPES, SEX_OPTIONS } from "@/lib/constants"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PetFormProps {
  pet?: Pet
  onSubmit: (pet: Pet) => void
  mode: "add" | "edit"
}

export function PetForm({ pet, onSubmit, mode }: PetFormProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<PetType | "">("")
  const [breed, setBreed] = useState("")
  const [sex, setSex] = useState<Sex | "">("")
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [weight, setWeight] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [notes, setNotes] = useState("")

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Initialize form with pet data if in edit mode
  useEffect(() => {
    if (pet && mode === "edit") {
      setName(pet.name)
      setType(pet.type)
      setBreed(pet.breed)
      setSex(pet.sex)
      setBirthDate(new Date(pet.birthDate))
      setWeight(pet.weight.toString())
      setProfilePicture(pet.profilePicture)
      setNotes(pet.notes || "")
    }
  }, [pet, mode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Pet name is required"
    }

    if (!type) {
      newErrors.type = "Pet type is required"
    }

    if (!sex) {
      newErrors.sex = "Sex is required"
    }

    if (!birthDate) {
      newErrors.birthDate = "Birth date is required"
    } else if (birthDate > new Date()) {
      newErrors.birthDate = "Birth date cannot be in the future"
    }

    if (weight && isNaN(Number(weight))) {
      newErrors.weight = "Weight must be a number"
    }

    if (profilePicture && !profilePicture.startsWith("http") && !profilePicture.startsWith("/")) {
      newErrors.profilePicture = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    if (!validateForm()) {
      return
    }

    const petData: Pet = {
      id: pet?.id || generateId(),
      name,
      type: type as PetType,
      breed: breed || "Mixed",
      sex: sex as Sex,
      birthDate: birthDate || new Date(),
      weight: weight ? Number.parseFloat(weight) : 0,
      profilePicture: profilePicture || `/placeholder.svg?height=100&width=100`,
      notes: notes || undefined,
      createdAt: pet?.createdAt || new Date(),
    }

    onSubmit(petData)
    setSubmitSuccess(true)

    // Only reset form if adding a new pet
    if (mode === "add") {
      setTimeout(() => {
        setName("")
        setType("")
        setBreed("")
        setSex("")
        setBirthDate(undefined)
        setWeight("")
        setProfilePicture("")
        setNotes("")
        setIsSubmitted(false)
        setSubmitSuccess(false)
      }, 2000)
    } else {
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>
            {mode === "add" ? "Pet added successfully!" : "Pet updated successfully!"}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pet name"
          className={errors.name ? "border-destructive" : ""}
          aria-invalid={!!errors.name}
          aria-required="true"
        />
        {errors.name && isSubmitted && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="type" className={errors.type ? "text-destructive" : ""}>
            Type <span className="text-destructive">*</span>
          </Label>
          <Select value={type} onValueChange={(value) => setType(value as PetType)}>
            <SelectTrigger
              id="type"
              className={errors.type ? "border-destructive" : ""}
              aria-invalid={!!errors.type}
              aria-required="true"
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PET_TYPES.map((petType) => (
                <SelectItem key={petType.value} value={petType.value}>
                  {petType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && isSubmitted && <p className="text-sm text-destructive">{errors.type}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="breed">Breed</Label>
          <Input id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Breed (optional)" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sex" className={errors.sex ? "text-destructive" : ""}>
            Sex <span className="text-destructive">*</span>
          </Label>
          <Select value={sex} onValueChange={(value) => setSex(value as Sex)}>
            <SelectTrigger
              id="sex"
              className={errors.sex ? "border-destructive" : ""}
              aria-invalid={!!errors.sex}
              aria-required="true"
            >
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
          {errors.sex && isSubmitted && <p className="text-sm text-destructive">{errors.sex}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="birthDate" className={errors.birthDate ? "text-destructive" : ""}>
            Birth Date <span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="birthDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !birthDate && "text-muted-foreground",
                  errors.birthDate && "border-destructive",
                )}
                aria-invalid={!!errors.birthDate}
                aria-required="true"
                aria-label="Select birth date"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={setBirthDate}
                initialFocus
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
          {errors.birthDate && isSubmitted && <p className="text-sm text-destructive">{errors.birthDate}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="weight" className={errors.weight ? "text-destructive" : ""}>
          Weight (kg)
        </Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight in kg (optional)"
          className={errors.weight ? "border-destructive" : ""}
          aria-invalid={!!errors.weight}
          aria-label="Pet weight in kilograms"
        />
        {errors.weight && isSubmitted && <p className="text-sm text-destructive">{errors.weight}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profilePicture" className={errors.profilePicture ? "text-destructive" : ""}>
          Profile Picture URL
        </Label>
        <Input
          id="profilePicture"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          placeholder="URL (optional)"
          className={errors.profilePicture ? "border-destructive" : ""}
          aria-invalid={!!errors.profilePicture}
          aria-label="URL for pet profile picture"
        />
        {errors.profilePicture && isSubmitted && <p className="text-sm text-destructive">{errors.profilePicture}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional information (optional)"
          rows={3}
          aria-label="Additional notes about your pet"
        />
      </div>

      <Button type="submit" className="w-full">
        {mode === "add" ? "Add Pet" : "Update Pet"}
      </Button>
    </form>
  )
}

