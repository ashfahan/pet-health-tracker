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
import { MEDICATION_FREQUENCIES } from "@/lib/constants"
import type { Pet, Medication } from "@/lib/types"
import { toast } from "sonner"

interface MedicationFormProps {
  pet: Pet
  medication?: Medication
  onSubmit: (medication: Medication) => void
  onCancel?: () => void
  mode: "add" | "edit"
}

function MedicationForm({ pet, medication, onSubmit, onCancel, mode }: MedicationFormProps) {
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<{
    name: string
    dosage: string
    frequency: string
    startDate: Date | undefined
    endDate: Date | undefined
    notes: string
  }>({
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      startDate: new Date(),
      endDate: new Date(),
      notes: "",
    },
  })

  // Initialize form with medication data if in edit mode
  useEffect(() => {
    if (medication && mode === "edit") {
      reset({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: new Date(medication.startDate),
        endDate: new Date(medication.endDate),
        notes: medication.notes || "",
      })
    }
  }, [medication, mode, reset])

  const startDate = watch("startDate")
  const endDate = watch("endDate")
  const frequency = watch("frequency")

  const handleFormSubmit = (data: {
    name: string
    dosage: string
    frequency: string
    startDate: Date | undefined
    endDate: Date | undefined
    notes: string
  }) => {
    // Dismiss any existing toasts
    toast.dismiss()

    if (mode === "add") {
      const newMedication: Medication = {
        id: nanoid(),
        petId: pet.id,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.startDate as Date,
        endDate: data.endDate as Date,
        notes: data.notes || undefined,
        createdAt: new Date(),
      }

      // Regular toast for add mode
      toast.success("Medication added", {
        description: `${data.name} has been added to ${pet.name}'s records.`,
      })

      onSubmit(newMedication)
    } else {
      // Store the original medication for undo functionality
      const originalMedication = { ...medication! }

      const updatedMedication: Medication = {
        ...medication!,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.startDate as Date,
        endDate: data.endDate as Date,
        notes: data.notes || undefined,
        updatedAt: new Date(),
      }

      // Show toast with undo option for edit mode
      toast.success("Medication updated", {
        description: `${data.name} has been updated in ${pet.name}'s records.`,
        action: {
          label: "Undo",
          onClick: () => {
            // Revert to the original medication data
            onSubmit(originalMedication)
            toast.success("Update reverted", {
              description: `Changes to ${originalMedication.name} have been undone.`,
            })
          },
        },
      })

      onSubmit(updatedMedication)
    }

    // Reset form if adding
    if (mode === "add") {
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      {/* Name and Dosage in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="name" className="text-xs font-medium block mb-1">
            Medication Name
          </label>
          <Input
            id="name"
            placeholder="e.g., Amoxicillin"
            {...register("name", { required: "Required" })}
            className="h-9"
          />
          {errors.name && <span className="text-xs font-medium text-destructive">{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="dosage" className="text-xs font-medium block mb-1">
            Dosage
          </label>
          <Input
            id="dosage"
            placeholder="e.g., 10mg, 1 tablet"
            {...register("dosage", { required: "Required" })}
            className="h-9"
          />
          {errors.dosage && <span className="text-xs font-medium text-destructive">{errors.dosage.message}</span>}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label htmlFor="frequency" className="text-xs font-medium block mb-1">
          Frequency
        </label>
        <Select value={frequency} onValueChange={(value) => setValue("frequency", value)}>
          <SelectTrigger id="frequency" className="h-9">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {MEDICATION_FREQUENCIES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.frequency && <span className="text-xs font-medium text-destructive">{errors.frequency.message}</span>}
      </div>

      {/* Start Date and End Date in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="startDate" className="text-xs font-medium block mb-1">
            Start Date
          </label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn("w-full h-9 pl-3 text-left font-normal", !startDate && "text-muted-foreground")}
                type="button"
              >
                {startDate ? format(startDate, "PP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setValue("startDate", date)
                  setStartDateOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && <span className="text-xs font-medium text-destructive">{errors.startDate.message}</span>}
        </div>

        <div>
          <label htmlFor="endDate" className="text-xs font-medium block mb-1">
            End Date
          </label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn("w-full h-9 pl-3 text-left font-normal", !endDate && "text-muted-foreground")}
                type="button"
              >
                {endDate ? format(endDate, "PP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setValue("endDate", date)
                  setEndDateOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.endDate && <span className="text-xs font-medium text-destructive">{errors.endDate.message}</span>}
        </div>
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
          {mode === "add" ? "Add Medication" : "Update Medication"}
        </Button>
      </div>
    </form>
  )
}

interface MedicationDialogProps {
  pet: Pet
  medication?: Medication
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (medication: Medication) => void
  mode: "add" | "edit"
}

export function MedicationDialog({ pet, medication, open, onOpenChange, onSubmit, mode }: MedicationDialogProps) {
  const handleSubmit = (data: Medication) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Medication" : "Edit Medication"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Add a medication for" : "Update medication details for"} {pet.name}
          </DialogDescription>
        </DialogHeader>
        <MedicationForm
          pet={pet}
          medication={medication}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  )
}

