"use client"

import { PetForm } from "@/components/pet-form"
import type { Pet } from "@/lib/types"

interface AddPetFormProps {
  onSubmit: (pet: Pet) => void
}

export function AddPetForm({ onSubmit }: AddPetFormProps) {
  return <PetForm onSubmit={onSubmit} mode="add" />
}

