export type PetType = "DOG" | "CAT" | "BIRD" | "SMALL_MAMMAL" | "REPTILE" | "FISH" | "OTHER"
export type Sex = "MALE" | "FEMALE" | "UNKNOWN"

export interface Pet {
  id: string
  name: string
  type: PetType
  breed: string
  sex: Sex
  birthDate: Date
  weight: number
  profilePicture: string
  notes?: string
  createdAt: Date
}

export interface Vaccination {
  id: string
  petId: string
  name: string
  dueDate: Date
  administeredDate?: Date
  notes?: string
  createdAt: Date
}

export interface Medication {
  id: string
  petId: string
  name: string
  dosage: string
  frequency: string
  startDate: Date
  endDate: Date
  notes?: string
  createdAt: Date
}

export interface Appointment {
  id: string
  petId: string
  vetName: string
  vetPhone?: string
  date: Date
  reason: string
  notes?: string
  createdAt: Date
}

