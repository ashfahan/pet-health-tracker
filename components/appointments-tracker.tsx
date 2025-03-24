"use client"
import { useState } from "react"
import type { Pet, Appointment } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { format, formatDistanceToNow, isAfter, isToday } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { sortAppointments } from "@/lib/utils/date-utils"
import { getBadgeVariant } from "@/lib/utils"
import { STATUS_TYPES } from "@/lib/constants"
import { toast } from "sonner"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import { AppointmentDialog } from "@/components/dialogs/appointment-dialog"

interface AppointmentsTrackerProps {
  pet: Pet
  appointments: Appointment[]
  onAdd: (appointment: Appointment) => void
  onUpdate: (appointment: Appointment) => void
  onDelete: (id: string) => void
}

export function AppointmentsTracker({ pet, appointments, onAdd, onUpdate, onDelete }: AppointmentsTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null)
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null)

  const handleAddAppointment = (appointment: Appointment) => {
    // Show toast notification
    toast.success("Appointment scheduled", {
      description: `Appointment with ${appointment.vetName} has been added to ${pet.name}'s records.`,
    })

    // Add the appointment
    onAdd(appointment)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setAppointmentToEdit(appointment)
    setIsEditDialogOpen(true)
  }

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    // Update the appointment
    onUpdate(updatedAppointment)
  }

  const initiateDelete = (appointment: Appointment) => {
    setAppointmentToDelete(appointment)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!appointmentToDelete) return

    // Delete the appointment
    onDelete(appointmentToDelete.id)

    // Close dialog and reset state
    setDeleteDialogOpen(false)
    setAppointmentToDelete(null)
  }

  // Sort appointments by date (future first, then past)
  const sortedAppointments = sortAppointments(appointments)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Appointments</h2>
          <p className="text-muted-foreground">Track your pet's vet appointments</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Add Appointment</span>
          <span className="sr-only">Schedule a new appointment for {pet.name}</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Veterinarian</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppointments.length > 0 ? (
                sortedAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="font-medium">{format(new Date(appointment.date), "MMM d, yyyy")}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(appointment.date), "h:mm a")}
                      </div>
                      {appointment.updatedAt && (
                        <div className="text-xs text-muted-foreground">
                          Updated {formatDistanceToNow(new Date(appointment.updatedAt), { addSuffix: true })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>{appointment.vetName}</div>
                      {appointment.vetPhone && (
                        <div className="text-sm text-muted-foreground">{appointment.vetPhone}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>{appointment.reason}</div>
                      {appointment.notes && (
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{appointment.notes}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          isAfter(new Date(appointment.date), new Date()) || isToday(new Date(appointment.date))
                            ? getBadgeVariant(STATUS_TYPES.UPCOMING)
                            : getBadgeVariant(STATUS_TYPES.COMPLETED)
                        }
                      >
                        {isAfter(new Date(appointment.date), new Date()) || isToday(new Date(appointment.date))
                          ? "Upcoming"
                          : "Past"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditAppointment(appointment)}
                          aria-label={`Edit appointment with ${appointment.vetName}`}
                        >
                          <Edit className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => initiateDelete(appointment)}
                          aria-label={`Delete appointment with ${appointment.vetName}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No appointments recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <AppointmentDialog
        pet={pet}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddAppointment}
        mode="add"
      />

      {/* Edit Dialog */}
      {appointmentToEdit && (
        <AppointmentDialog
          pet={pet}
          appointment={appointmentToEdit}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateAppointment}
          mode="edit"
        />
      )}

      <ConfirmDeleteDialog
        title="Delete Appointment"
        description={`Are you sure you want to delete the appointment with ${appointmentToDelete?.vetName}? This action cannot be undone.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

