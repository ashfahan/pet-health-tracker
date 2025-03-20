import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Pet, Vaccination, Medication, Appointment } from "@/lib/types"
import { CalendarClock, Pill, Syringe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format, isPast, isToday } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { calculateAge } from "@/lib/utils/date-utils"
import { getVaccinationStatus, getMedicationStatus, getUpcomingItems } from "@/lib/utils/date-utils"
import { getBadgeVariant, getStatusLabel, getAvatarFallback, getPetTypeLabel } from "@/lib/utils/ui-utils"
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
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-1/3">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={pet.profilePicture} alt={`${pet.name}'s profile picture`} />
                <AvatarFallback className="text-lg">{getAvatarFallback(pet.name)}</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold">{pet.name}</h3>
              <p className="text-muted-foreground">
                {pet.breed} {getPetTypeLabel(pet.type)}
              </p>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="border rounded p-2">
                  <p className="text-sm text-muted-foreground">Sex</p>
                  <p className="font-medium">{pet.sex.charAt(0) + pet.sex.slice(1).toLowerCase()}</p>
                </div>
                <div className="border rounded p-2">
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{calculateAge(pet.birthDate)}</p>
                </div>
                <div className="border rounded p-2">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{pet.weight > 0 ? `${pet.weight} kg` : "Not recorded"}</p>
                </div>
                <div className="border rounded p-2">
                  <p className="text-sm text-muted-foreground">Birth Date</p>
                  <p className="font-medium">{format(new Date(pet.birthDate), "MMM d, yyyy")}</p>
                </div>
              </div>
              {pet.notes && (
                <div className="mt-4 w-full bg-muted p-3 rounded-md text-left">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{pet.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Syringe className="h-4 w-4" aria-hidden="true" />
              <CardTitle className="text-md">Upcoming Vaccinations</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Pill className="h-4 w-4" aria-hidden="true" />
              <CardTitle className="text-md">Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              <CardTitle className="text-md">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[120px]">
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
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(appointment.date), "h:mm a")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground">No upcoming appointments</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Syringe className="h-4 w-4" aria-hidden="true" />
                <span>Vaccination Status</span>
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Up to date</span>
                  <span className="text-sm font-medium">
                    {
                      vaccinations.filter(
                        (v) => isPast(new Date(v.dueDate)) && !getVaccinationStatus(v).includes("overdue"),
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Overdue</span>
                  <span className="text-sm font-medium text-destructive">
                    {vaccinations.filter((v) => getVaccinationStatus(v) === STATUS_TYPES.OVERDUE).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Recorded</span>
                  <span className="text-sm font-medium">{vaccinations.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Pill className="h-4 w-4" aria-hidden="true" />
                <span>Medication Status</span>
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Active Medications</span>
                  <span className="text-sm font-medium">
                    {medications.filter((m) => getMedicationStatus(m) === STATUS_TYPES.ACTIVE).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Completed</span>
                  <span className="text-sm font-medium">
                    {medications.filter((m) => getMedicationStatus(m) === STATUS_TYPES.COMPLETED).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Recorded</span>
                  <span className="text-sm font-medium">{medications.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                <span>Appointment History</span>
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Upcoming</span>
                  <span className="text-sm font-medium">
                    {appointments.filter((a) => !isPast(new Date(a.date)) || isToday(new Date(a.date))).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Past</span>
                  <span className="text-sm font-medium">
                    {appointments.filter((a) => isPast(new Date(a.date)) && !isToday(new Date(a.date))).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Recorded</span>
                  <span className="text-sm font-medium">{appointments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

