"use client"

import type React from "react"

import { useState } from "react"
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

interface AddPetFormProps {
  onSubmit: (pet: Pet) => void
}

export function AddPetForm({ onSubmit }: AddPetFormProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<PetType | "">("")
  const [breed, setBreed] = useState("")
  const [sex, setSex] = useState<Sex | "">("")
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [weight, setWeight] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !type || !sex) return

    const newPet: Pet = {
      id: generateId(),
      name,
      type: type as PetType,
      breed: breed || "Mixed",
      sex: sex as Sex,
      birthDate: birthDate || new Date(),
      weight: weight ? Number.parseFloat(weight) : 0,
      profilePicture: profilePicture || `/placeholder.svg?height=100&width=100`,
      notes,
      createdAt: new Date(),
    }

    onSubmit(newPet)

    // Reset form
    setName("")
    setType("")
    setBreed("")
    setSex("")
    setBirthDate(undefined)
    setWeight("")
    setProfilePicture("")
    setNotes("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pet name"
          required
          aria-required="true"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as PetType)} required>
            <SelectTrigger id="type" aria-required="true">
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
        </div>

        <div className="grid gap-2">
          <Label htmlFor="breed">Breed</Label>
          <Input id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Breed (optional)" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sex">Sex</Label>
          <Select value={sex} onValueChange={(value) => setSex(value as Sex)} required>
            <SelectTrigger id="sex" aria-required="true">
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
        </div>

        <div className="grid gap-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="birthDate"
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !birthDate && "text-muted-foreground")}
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
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight in kg (optional)"
          aria-label="Pet weight in kilograms"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profilePicture">Profile Picture URL</Label>
        <Input
          id="profilePicture"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          placeholder="URL (optional)"
          aria-label="URL for pet profile picture"
        />
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
        Add Pet
      </Button>
    </form>
  )
}

