import { nanoid } from "nanoid"
import type { Pet, Vaccination, Medication, Appointment } from "@/lib/types"
import { addDays, addMonths, subDays, subMonths, subYears } from "date-fns"

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return nanoid()
}

/**
 * Generate sample data for testing
 */
export function generateSampleData() {
  // Create sample pets
  const samplePets: Pet[] = [
    {
      id: generateId(),
      name: "Max",
      type: "DOG",
      breed: "Golden Retriever",
      sex: "MALE",
      birthDate: subYears(new Date(), 3),
      weight: 30.5,
      profilePicture: "/placeholder.svg?height=100&width=100",
      notes: "Friendly and energetic. Allergic to chicken.",
      createdAt: new Date(),
    },
    {
      id: generateId(),
      name: "Luna",
      type: "CAT",
      breed: "Siamese",
      sex: "FEMALE",
      birthDate: subYears(new Date(), 2),
      weight: 4.2,
      profilePicture: "/placeholder.svg?height=100&width=100",
      createdAt: new Date(),
    },
  ]

  // Create sample vaccinations
  const sampleVaccinations: Vaccination[] = [
    {
      id: generateId(),
      petId: samplePets[0].id,
      name: "Rabies",
      dueDate: addMonths(new Date(), 6),
      administeredDate: subMonths(new Date(), 6),
      notes: "3-year vaccine",
      createdAt: new Date(),
    },
    {
      id: generateId(),
      petId: samplePets[0].id,
      name: "DHPP",
      dueDate: subDays(new Date(), 30),
      createdAt: new Date(),
    },
    {
      id: generateId(),
      petId: samplePets[0].id,
      name: "Bordetella",
      dueDate: addDays(new Date(), 10),
      createdAt: new Date(),
    },
    {
      id: generateId(),
      petId: samplePets[1].id,
      name: "FVRCP",
      dueDate: addMonths(new Date(), 2),
      administeredDate: subMonths(new Date(), 10),
      createdAt: new Date(),
    },
  ]

  // Create sample medications
  const sampleMedications: Medication[] = [
    {
      id: generateId(),
      petId: samplePets[0].id,
      name: "Heartworm Prevention",
      dosage: "1 chewable tablet",
      frequency: "Once monthly",
      startDate: subMonths(new Date(), 3),
      endDate: addMonths(new Date(), 9),
      createdAt: new Date(),
    },
    {
      id: generateId(),
      petId: samplePets[0].id,
      name: "Joint Supplement",
      dosage: "2 tablets",
      frequency: "Twice daily",
      startDate: subMonths(new Date(), 1),
      endDate: addMonths(new Date(), 2),
      notes: "Give with food",
      createdAt: new Date(),
    },
    {
      id: generateId(),
      petId: samplePets[1].id,
      name: "Flea & Tick Prevention",
      dosage: "1 applicator",
      frequency: "Once monthly",
      startDate: subMonths(new Date(), 2),
      endDate: addMonths(new Date(), 10),
      createdAt: new Date(),
    },
  ]

  // Create sample appointments
  const sampleAppointments: Appointment[] = [
    {
      id: generateId(),
      petId: samplePets[0].id,
      vetName: "Dr. Johnson",
      vetPhone: "555-123-4567",
      date: addDays(new Date(), 14),
      reason: "Annual Checkup",
      notes: "Need to discuss diet and exercise routine",
      createdAt: new Date(),
    },
    {
      id: generateId(),
      petId: samplePets[0].id,
      vetName: "City Animal Hospital",
      vetPhone: "555-987-6543",
      date: subMonths(new Date(), 2),
      reason: "Vaccination",
      notes: "Rabies vaccine administered",
      createdAt: new Date(),
    },
    {
      id: generateId(),
      petId: samplePets[1].id,
      vetName: "Dr. Martinez",
      vetPhone: "555-456-7890",
      date: addDays(new Date(), 7),
      reason: "Dental",
      createdAt: new Date(),
    },
  ]

  return { samplePets, sampleVaccinations, sampleMedications, sampleAppointments }
}

