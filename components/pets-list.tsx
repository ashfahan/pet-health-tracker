"use client"

import { useState } from "react"
import type { Pet } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils/ui-utils"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getAvatarFallback } from "@/lib/utils/ui-utils"

interface PetsListProps {
  pets: Pet[]
  selectedPetId: string | null
  onSelectPet: (id: string) => void
}

export function PetsList({ pets, selectedPetId, onSelectPet }: PetsListProps) {
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
              className={cn(
                "w-full justify-start gap-2",
                pet.id === selectedPetId && "bg-accent text-accent-foreground",
              )}
              onClick={() => onSelectPet(pet.id)}
              aria-current={pet.id === selectedPetId ? "page" : undefined}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={pet.profilePicture} alt={`${pet.name}'s profile picture`} />
                <AvatarFallback>{getAvatarFallback(pet.name)}</AvatarFallback>
              </Avatar>
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

