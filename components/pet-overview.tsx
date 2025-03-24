import type { Pet, Vaccination, Medication, Appointment } from "@/lib/types"
import { CalendarClock, Pill, Syringe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format, isPast, isToday } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { calculateAge } from "@/lib/utils/date-utils"
import { getVaccinationStatus, getMedicationStatus, getUpcomingItems } from "@/lib/utils/date-utils"
import { getBadgeVariant, getStatusLabel, getPetTypeLabel } from "@/lib/utils"
import { STATUS_TYPES } from "@/lib/constants"

interface PetOverviewProps {
  pet: Pet
  vaccinations: Vaccination[]
  medications: Medication[]
  appointments: Appointment[]
}

export function PetOverview({ pet, vaccinations, medications, appointments }: PetOverviewProps) {
  const upcomingVaccinations = getUpcomingItems(vaccinations, getVaccinationStatus)
  const upcomingMedications = getUpcomingItems(medications, getMedicationStatus)
  const upcomingAppointments = getUpcomingItems(appointments, (appointment) =>
    isToday(new Date(appointment.date)) || isPast(new Date(appointment.date))
      ? STATUS_TYPES.COMPLETED
      : STATUS_TYPES.UPCOMING,
  )

  return (
    <div className="space-y-8">
      {/* Pet Profile Header - Full Width */}
      <div className="w-full overflow-hidden bg-background rounded-lg shadow-sm">
        <div className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 bg-muted/20 p-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">{pet.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <h3 className="text-2xl font-bold">{pet.name}</h3>
              <p className="text-muted-foreground">
                {pet.breed} {getPetTypeLabel(pet.type)}
              </p>
            </div>

            <div className="flex-1 p-6">
              <h4 className="text-lg font-semibold mb-4">Pet Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Sex</p>
                  <p className="font-medium">{pet.sex.charAt(0) + pet.sex.slice(1).toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{calculateAge(pet.birthDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{pet.weight > 0 ? `${pet.weight} kg` : "Not recorded"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Birth Date</p>
                  <p className="font-medium">{format(new Date(pet.birthDate), "MMM d, yyyy")}</p>
                </div>
              </div>

              {pet.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm text-muted-foreground">{pet.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="bg-background rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Health Summary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Syringe className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Vaccination Status</span>
            </h4>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Up to date</dt>
                <dd className="text-sm font-medium">
                  {
                    vaccinations.filter(
                      (v) => isPast(new Date(v.dueDate)) && !getVaccinationStatus(v).includes("overdue"),
                    ).length
                  }
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Overdue</dt>
                <dd className="text-sm font-medium text-destructive">
                  {vaccinations.filter((v) => getVaccinationStatus(v) === STATUS_TYPES.OVERDUE).length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Total Recorded</dt>
                <dd className="text-sm font-medium">{vaccinations.length}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Medication Status</span>
            </h4>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Active</dt>
                <dd className="text-sm font-medium">
                  {medications.filter((m) => getMedicationStatus(m) === STATUS_TYPES.ACTIVE).length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Completed</dt>
                <dd className="text-sm font-medium">
                  {medications.filter((m) => getMedicationStatus(m) === STATUS_TYPES.COMPLETED).length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Total Recorded</dt>
                <dd className="text-sm font-medium">{medications.length}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Appointment History</span>
            </h4>
            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Upcoming</dt>
                <dd className="text-sm font-medium">
                  {appointments.filter((a) => !isPast(new Date(a.date)) || isToday(new Date(a.date))).length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Past</dt>
                <dd className="text-sm font-medium">
                  {appointments.filter((a) => isPast(new Date(a.date)) && !isToday(new Date(a.date))).length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Total Recorded</dt>
                <dd className="text-sm font-medium">{appointments.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Health Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg shadow-sm p-6">
          <div className="flex flex-row items-center gap-2 mb-4">
            <Syringe className="h-4 w-4" aria-hidden="true" />
            <h3 className="text-md font-bold">Upcoming Vaccinations</h3>
          </div>
          <ScrollArea className="h-[180px]">
            {upcomingVaccinations.length > 0 ? (
              <ul className="space-y-3">
                {upcomingVaccinations.map((vaccination) => (
                  <li key={vaccination.id} className="flex justify-between items-center">
                    <span className="truncate">{vaccination.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(vaccination.dueDate), "MMM d")}
                      </span>
                      <Badge variant={getBadgeVariant(getVaccinationStatus(vaccination))}>
                        {getStatusLabel(getVaccinationStatus(vaccination))}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">No upcoming vaccinations</p>
            )}
          </ScrollArea>
        </div>

        <div className="bg-background rounded-lg shadow-sm p-6">
          <div className="flex flex-row items-center gap-2 mb-4">
            <Pill className="h-4 w-4" aria-hidden="true" />
            <h3 className="text-md font-bold">Current Medications</h3>
          </div>
          <ScrollArea className="h-[180px]">
            {upcomingMedications.length > 0 ? (
              <ul className="space-y-3">
                {upcomingMedications.map((medication) => (
                  <li key={medication.id} className="flex justify-between items-center">
                    <div>
                      <p className="truncate">{medication.name}</p>
                      <p className="text-xs text-muted-foreground">{medication.dosage}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{medication.frequency}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">No current medications</p>
            )}
          </ScrollArea>
        </div>

        <div className="md:col-span-2 bg-background rounded-lg shadow-sm p-6">
          <div className="flex flex-row items-center gap-2 mb-4">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            <h3 className="text-md font-bold">Upcoming Appointments</h3>
          </div>
          <ScrollArea className="h-[200px]">
            {upcomingAppointments.length > 0 ? (
              <ul className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{appointment.vetName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    </div>
                    <div className="text-right">
                      <p>{format(new Date(appointment.date), "MMM d, yyyy")}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(appointment.date), "h:mm a")}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">No upcoming appointments</p>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

