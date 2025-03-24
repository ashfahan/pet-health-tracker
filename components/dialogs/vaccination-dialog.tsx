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
import type { Pet, Vaccination } from "@/lib/types"
import { toast } from "sonner"

interface VaccinationFormProps {
  pet: Pet
  vaccination?: Vaccination
  onSubmit: (vaccination: Vaccination) => void
  onCancel?: () => void
  mode: "add" | "edit"
}

function VaccinationForm({ pet, vaccination, onSubmit, onCancel, mode }: VaccinationFormProps) {
  const [dueDateOpen, setDueDateOpen] = useState(false)
  const [administeredDateOpen, setAdministeredDateOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<{
    name: string
    dueDate: Date | undefined
    administeredDate: Date | undefined
    notes: string
  }>({
    defaultValues: {
      name: "",
      dueDate: new Date(),
      administeredDate: undefined,
      notes: "",
    },
  })

  // Initialize form with vaccination data if in edit mode
  useEffect(() => {
    if (vaccination && mode === "edit") {
      reset({
        name: vaccination.name,
        dueDate: new Date(vaccination.dueDate),
        administeredDate: vaccination.administeredDate ? new Date(vaccination.administeredDate) : undefined,
        notes: vaccination.notes || "",
      })
    }
  }, [vaccination, mode, reset])

  const dueDate = watch("dueDate")
  const administeredDate = watch("administeredDate")

  const handleFormSubmit = (data: {
    name: string
    dueDate: Date | undefined
    administeredDate: Date | undefined
    notes: string
  }) => {
    // Dismiss any existing toasts
    toast.dismiss()

    if (mode === "add") {
      const newVaccination: Vaccination = {
        id: nanoid(),
        petId: pet.id,
        name: data.name,
        dueDate: data.dueDate as Date,
        administeredDate: data.administeredDate,
        notes: data.notes || undefined,
        createdAt: new Date(),
      }

      // Regular toast for add mode
      toast.success("Vaccination added", {
        description: `${data.name} has been added to ${pet.name}'s records.`,
      })

      onSubmit(newVaccination)
    } else {
      // Store the original vaccination for undo functionality
      const originalVaccination = { ...vaccination! }

      const updatedVaccination: Vaccination = {
        ...vaccination!,
        name: data.name,
        dueDate: data.dueDate as Date,
        administeredDate: data.administeredDate,
        notes: data.notes || undefined,
        updatedAt: new Date(),
      }

      // Show toast with undo option for edit mode
      toast.success("Vaccination updated", {
        description: `${data.name} has been updated in ${pet.name}'s records.`,
        action: {
          label: "Undo",
          onClick: () => {
            // Revert to the original vaccination data
            onSubmit(originalVaccination)
            toast.success("Update reverted", {
              description: `Changes to ${originalVaccination.name} have been undone.`,
            })
          },
        },
      })

      onSubmit(updatedVaccination)
    }

    // Reset form if adding
    if (mode === "add") {
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      {/* Vaccination Name */}
      <div>
        <label htmlFor="name" className="text-xs font-medium block mb-1">
          Vaccination Name
        </label>
        <Input
          id="name"
          placeholder="e.g., Rabies, DHPP"
          {...register("name", { required: "Required" })}
          className="h-9"
        />
        {errors.name && <span className="text-xs font-medium text-destructive">{errors.name.message}</span>}
      </div>

      {/* Due Date and Administered Date in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="dueDate" className="text-xs font-medium block mb-1">
            Due Date
          </label>
          <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="dueDate"
                variant="outline"
                className={cn("w-full h-9 pl-3 text-left font-normal", !dueDate && "text-muted-foreground")}
                type="button"
              >
                {dueDate ? format(dueDate, "PP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setValue("dueDate", date)
                  setDueDateOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && <span className="text-xs font-medium text-destructive">{errors.dueDate.message}</span>}
        </div>

        <div>
          <label htmlFor="administeredDate" className="text-xs font-medium block mb-1">
            Administered Date
          </label>
          <Popover open={administeredDateOpen} onOpenChange={setAdministeredDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="administeredDate"
                variant="outline"
                className={cn("w-full h-9 pl-3 text-left font-normal", !administeredDate && "text-muted-foreground")}
                type="button"
              >
                {administeredDate ? format(administeredDate, "PP") : <span>Optional</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-2 flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setValue("administeredDate", undefined)
                    setAdministeredDateOpen(false)
                  }}
                >
                  Clear
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={administeredDate}
                onSelect={(date) => {
                  setValue("administeredDate", date)
                  setAdministeredDateOpen(false)
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.administeredDate && (
            <span className="text-xs font-medium text-destructive">{errors.administeredDate.message}</span>
          )}
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
          {mode === "add" ? "Add Vaccination" : "Update Vaccination"}
        </Button>
      </div>
    </form>
  )
}

interface VaccinationDialogProps {
  pet: Pet
  vaccination?: Vaccination
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (vaccination: Vaccination) => void
  mode: "add" | "edit"
}

export function VaccinationDialog({ pet, vaccination, open, onOpenChange, onSubmit, mode }: VaccinationDialogProps) {
  const handleSubmit = (data: Vaccination) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Vaccination Record" : "Edit Vaccination"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Track vaccinations for" : "Update vaccination details for"} {pet.name}
          </DialogDescription>
        </DialogHeader>
        <VaccinationForm
          pet={pet}
          vaccination={vaccination}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  )
}

