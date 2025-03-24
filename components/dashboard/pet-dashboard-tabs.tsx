"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PetOverview } from "@/components/pet-overview"
import { VaccinationsTracker } from "@/components/vaccinations-tracker"
import { MedicationsTracker } from "@/components/medications-tracker"
import { AppointmentsTracker } from "@/components/appointments-tracker"
import type { Pet, Vaccination, Medication, Appointment } from "@/lib/types"

interface PetDashboardTabsProps {
  pet: Pet
  vaccinations: Vaccination[]
  medications: Medication[]
  appointments: Appointment[]
  activeTab: string
  onTabChange: (value: string) => void
  onAddVaccination: (vaccination: Vaccination) => void
  onUpdateVaccination: (vaccination: Vaccination) => void
  onDeleteVaccination: (id: string) => void
  onAddMedication: (medication: Medication) => void
  onUpdateMedication: (medication: Medication) => void
  onDeleteMedication: (id: string) => void
  onAddAppointment: (appointment: Appointment) => void
  onUpdateAppointment: (appointment: Appointment) => void
  onDeleteAppointment: (id: string) => void
}

export function PetDashboardTabs({
  pet,
  vaccinations,
  medications,
  appointments,
  activeTab,
  onTabChange,
  onAddVaccination,
  onUpdateVaccination,
  onDeleteVaccination,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
}: PetDashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-fit">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
        <TabsTrigger value="medications">Medications</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 p-0 border-none">
        <PetOverview pet={pet} vaccinations={vaccinations} medications={medications} appointments={appointments} />
      </TabsContent>

      <TabsContent value="vaccinations" className="mt-4 p-0 border-none">
        <VaccinationsTracker
          pet={pet}
          vaccinations={vaccinations}
          onAdd={onAddVaccination}
          onUpdate={onUpdateVaccination}
          onDelete={onDeleteVaccination}
        />
      </TabsContent>

      <TabsContent value="medications" className="mt-4 p-0 border-none">
        <MedicationsTracker
          pet={pet}
          medications={medications}
          onAdd={onAddMedication}
          onUpdate={onUpdateMedication}
          onDelete={onDeleteMedication}
        />
      </TabsContent>

      <TabsContent value="appointments" className="mt-4 p-0 border-none">
        <AppointmentsTracker
          pet={pet}
          appointments={appointments}
          onAdd={onAddAppointment}
          onUpdate={onUpdateAppointment}
          onDelete={onDeleteAppointment}
        />
      </TabsContent>
    </Tabs>
  )
}

