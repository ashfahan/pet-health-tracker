"use client"

import type React from "react"

import { useState } from "react"
import type { Pet, Appointment } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock, Plus, Trash2 } from "lucide-react"
import { format, isAfter, isToday } from "date-fns"
import { cn } from "@/lib/utils/ui-utils"
import { Badge } from "@/components/ui/badge"
import { generateId } from "@/lib/utils/data-utils"
import { sortAppointments } from "@/lib/utils/date-utils"
import { getBadgeVariant } from "@/lib/utils/ui-utils"
import { APPOINTMENT_REASONS, STATUS_TYPES } from "@/lib/constants"

interface AppointmentsTrackerProps {
  pet: Pet
  appointments: Appointment[]
  onAdd: (appointment: Appointment) => void
  onDelete: (id: string) => void
}

export function AppointmentsTracker({ pet, appointments, onAdd, onDelete }: AppointmentsTrackerProps) {
  const [vetName, setVetName] = useState("")
  const [vetPhone, setVetPhone] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vetName || !date || !time || !reason) return

    // Create a date with the combined date and time
    const appointmentDate = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    appointmentDate.setHours(hours, minutes)

    const newAppointment: Appointment = {
      id: generateId(),
      petId: pet.id,
      vetName,
      vetPhone,
      date: appointmentDate,
      reason,
      notes,
      createdAt: new Date(),
    }

    onAdd(newAppointment)
    setIsDialogOpen(false)

    // Reset form
    setVetName("")
    setVetPhone("")
    setDate(new Date())
    setTime("")
    setReason("")
    setNotes("")
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Add Appointment</span>
              <span className="sr-only">Schedule a new appointment for {pet.name}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
              <DialogDescription>Schedule a vet appointment for {pet.name}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vetName">Veterinarian / Clinic</Label>
                  <Input
                    id="vetName"
                    value={vetName}
                    onChange={(e) => setVetName(e.target.value)}
                    placeholder="Name of vet or clinic"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vetPhone">Phone (Optional)</Label>
                  <Input
                    id="vetPhone"
                    value={vetPhone}
                    onChange={(e) => setVetPhone(e.target.value)}
                    placeholder="Phone number"
                    aria-label="Veterinarian phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        aria-label="Select appointment date"
                        aria-required="true"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="pl-10"
                      required
                      aria-required="true"
                      aria-label="Select appointment time"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Select value={reason} onValueChange={setReason} required>
                  <SelectTrigger id="reason" aria-required="true">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_REASONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional information, symptoms, questions to ask, etc."
                  rows={3}
                  aria-label="Additional notes about the appointment"
                />
              </div>

              <Button type="submit" className="w-full">
                Schedule Appointment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(appointment.id)}
                        aria-label={`Delete appointment with ${appointment.vetName}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
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
    </div>
  )
}

