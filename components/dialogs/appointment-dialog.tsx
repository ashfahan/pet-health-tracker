"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { nanoid } from "nanoid"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { APPOINTMENT_REASONS } from "@/lib/constants"
import type { Pet, Appointment } from "@/lib/types"
import { toast } from "sonner"

interface AppointmentFormProps {
  pet: Pet
  appointment?: Appointment
  onSubmit: (appointment: Appointment) => void
  onCancel?: () => void
  mode: "add" | "edit"
}

function AppointmentForm({ pet, appointment, onSubmit, onCancel, mode }: AppointmentFormProps) {
  const [dateOpen, setDateOpen] = useState(false)

  // Format the time for the form
  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<{
    vetName: string
    vetPhone: string
    date: Date | undefined
    time: string
    reason: string
    notes: string
  }>({
    defaultValues: {
      vetName: "",
      vetPhone: "",
      date: new Date(),
      time: "09:00",
      reason: "",
      notes: "",
    },
  })

  // Initialize form with appointment data if in edit mode
  useEffect(() => {
    if (appointment && mode === "edit") {
      const appointmentDate = new Date(appointment.date)
      reset({
        vetName: appointment.vetName,
        vetPhone: appointment.vetPhone || "",
        date: appointmentDate,
        time: formatTimeForInput(appointmentDate),
        reason: appointment.reason,
        notes: appointment.notes || "",
      })
    }
  }, [appointment, mode, reset])

  const date = watch("date")
  const reason = watch("reason")

  const handleFormSubmit = (data: {
    vetName: string
    vetPhone: string
    date: Date | undefined
    time: string
    reason: string
    notes: string
  }) => {
    // Dismiss any existing toasts
    toast.dismiss()

    // Create a date with the combined date and time
    const appointmentDate = new Date(data.date as Date)
    const [hours, minutes] = data.time.split(":").map(Number)
    appointmentDate.setHours(hours, minutes)

    if (mode === "add") {
      const newAppointment: Appointment = {
        id: nanoid(),
        petId: pet.id,
        vetName: data.vetName,
        vetPhone: data.vetPhone || undefined,
        date: appointmentDate,
        reason: data.reason,
        notes: data.notes || undefined,
        createdAt: new Date(),
      }

      // Regular toast for add mode
      toast.success("Appointment scheduled", {
        description: `Appointment with ${data.vetName} has been added to ${pet.name}'s records.`,
      })

      onSubmit(newAppointment)
    } else {
      // Store the original appointment for undo functionality
      const originalAppointment = { ...appointment! }

      const updatedAppointment: Appointment = {
        ...appointment!,
        vetName: data.vetName,
        vetPhone: data.vetPhone || undefined,
        date: appointmentDate,
        reason: data.reason,
        notes: data.notes || undefined,
        updatedAt: new Date(),
      }

      // Show toast with undo option for edit mode
      toast.success("Appointment updated", {
        description: `Appointment with ${data.vetName} has been updated in ${pet.name}'s records.`,
        action: {
          label: "Undo",
          onClick: () => {
            // Revert to the original appointment data
            onSubmit(originalAppointment)
            toast.success("Update reverted", {
              description: `Changes to appointment with ${originalAppointment.vetName} have been undone.`,
            })
          },
        },
      })

      onSubmit(updatedAppointment)
    }

    // Reset form if adding
    if (mode === "add") {
      reset({
        ...data,
        vetName: "",
        vetPhone: "",
        reason: "",
        notes: "",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      {/* Vet Name and Phone in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="vetName" className="text-xs font-medium block mb-1">
            Veterinarian Name
          </label>
          <Input
            id="vetName"
            placeholder="e.g., Dr. Smith"
            {...register("vetName", { required: "Required" })}
            className="h-9"
          />
          {errors.vetName && <span className="text-xs font-medium text-destructive">{errors.vetName.message}</span>}
        </div>

        <div>
          <label htmlFor="vetPhone" className="text-xs font-medium block mb-1">
            Phone (optional)
          </label>
          <Input id="vetPhone" placeholder="e.g., 555-123-4567" {...register("vetPhone")} className="h-9" />
          {errors.vetPhone && <span className="text-xs font-medium text-destructive">{errors.vetPhone.message}</span>}
        </div>
      </div>

      {/* Date and Time in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="date" className="text-xs font-medium block mb-1">
            Date
          </label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn("w-full h-9 pl-3 text-left font-normal", !date && "text-muted-foreground")}
                type="button"
              >
                {date ? format(date, "PP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setValue("date", date)
                  setDateOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && <span className="text-xs font-medium text-destructive">{errors.date.message}</span>}
        </div>

        <div>
          <label htmlFor="time" className="text-xs font-medium block mb-1">
            Time
          </label>
          <Input id="time" type="time" {...register("time", { required: "Required" })} className="h-9" />
          {errors.time && <span className="text-xs font-medium text-destructive">{errors.time.message}</span>}
        </div>
      </div>

      {/* Reason */}
      <div>
        <label htmlFor="reason" className="text-xs font-medium block mb-1">
          Reason for Visit
        </label>
        <Select value={reason} onValueChange={(value) => setValue("reason", value)}>
          <SelectTrigger id="reason" className="h-9">
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
        {errors.reason && <span className="text-xs font-medium text-destructive">{errors.reason.message}</span>}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="text-xs font-medium block mb-1">
          Notes
        </label>
        <Textarea id="notes" placeholder="Additional information" className="resize-none h-20" {...register("notes")} />
        {errors.notes && <span className="text-xs font-medium text-destructive">{errors.notes.message}</span>}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm">
          {mode === "add" ? "Schedule Appointment" : "Update Appointment"}
        </Button>
      </div>
    </form>
  )
}

interface AppointmentDialogProps {
  pet: Pet
  appointment?: Appointment
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (appointment: Appointment) => void
  mode: "add" | "edit"
}

export function AppointmentDialog({ pet, appointment, open, onOpenChange, onSubmit, mode }: AppointmentDialogProps) {
  const handleSubmit = (data: Appointment) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Schedule Appointment" : "Edit Appointment"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Schedule a vet appointment for" : "Update appointment details for"} {pet.name}
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm
          pet={pet}
          appointment={appointment}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  )
}

