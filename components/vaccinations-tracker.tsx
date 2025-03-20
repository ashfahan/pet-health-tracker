"use client"

import type React from "react"
import { useState } from "react"
import type { Pet, Vaccination } from "@/lib/types"
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
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils/ui-utils"
import { Badge } from "@/components/ui/badge"
import { generateId } from "@/lib/utils/data-utils"
import { getVaccinationStatus, sortVaccinations } from "@/lib/utils/date-utils"
import { getBadgeVariant, getStatusLabel } from "@/lib/utils/ui-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VaccinationsTrackerProps {
  pet: Pet
  vaccinations: Vaccination[]
  onAdd: (vaccination: Vaccination) => void
  onDelete: (id: string) => void
}

export function VaccinationsTracker({ pet, vaccinations, onAdd, onDelete }: VaccinationsTrackerProps) {
  const [name, setName] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [notes, setNotes] = useState("")
  const [administeredDate, setAdministeredDate] = useState<Date | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Vaccination name is required"
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    if (administeredDate && administeredDate > new Date()) {
      newErrors.administeredDate = "Administered date cannot be in the future"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    if (!validateForm()) {
      return
    }

    const newVaccination: Vaccination = {
      id: generateId(),
      petId: pet.id,
      name,
      dueDate: dueDate as Date,
      administeredDate,
      notes: notes || undefined,
      createdAt: new Date(),
    }

    onAdd(newVaccination)
    setSubmitSuccess(true)

    setTimeout(() => {
      setIsDialogOpen(false)
      setSubmitSuccess(false)

      // Reset form
      setName("")
      setDueDate(undefined)
      setNotes("")
      setAdministeredDate(undefined)
      setIsSubmitted(false)
    }, 1500)
  }

  // Sort vaccinations by due date (most recent first)
  const sortedVaccinations = sortVaccinations(vaccinations)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Vaccinations</h2>
          <p className="text-muted-foreground">Track your pet's vaccination schedule</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Add Vaccination</span>
              <span className="sr-only">Add a new vaccination record for {pet.name}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Vaccination Record</DialogTitle>
              <DialogDescription>Track vaccinations for {pet.name}</DialogDescription>
            </DialogHeader>

            {submitSuccess && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertDescription>Vaccination added successfully!</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                  Vaccination Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Rabies, Distemper"
                  className={errors.name ? "border-destructive" : ""}
                  aria-invalid={!!errors.name}
                  aria-required="true"
                />
                {errors.name && isSubmitted && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className={errors.dueDate ? "text-destructive" : ""}>
                  Due Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground",
                        errors.dueDate && "border-destructive",
                      )}
                      aria-invalid={!!errors.dueDate}
                      aria-required="true"
                      aria-label="Select due date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
                {errors.dueDate && isSubmitted && <p className="text-sm text-destructive">{errors.dueDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="administeredDate" className={errors.administeredDate ? "text-destructive" : ""}>
                  Administered Date (Optional)
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="administeredDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !administeredDate && "text-muted-foreground",
                        errors.administeredDate && "border-destructive",
                      )}
                      aria-invalid={!!errors.administeredDate}
                      aria-label="Select administered date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      {administeredDate ? format(administeredDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={administeredDate}
                      onSelect={setAdministeredDate}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {errors.administeredDate && isSubmitted && (
                  <p className="text-sm text-destructive">{errors.administeredDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional information, veterinarian, etc."
                  rows={3}
                  aria-label="Additional notes about the vaccination"
                />
              </div>

              <Button type="submit" className="w-full">
                Add Vaccination
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
                <TableHead>Vaccination</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Administered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVaccinations.length > 0 ? (
                sortedVaccinations.map((vaccination) => (
                  <TableRow key={vaccination.id}>
                    <TableCell className="font-medium">{vaccination.name}</TableCell>
                    <TableCell>{format(new Date(vaccination.dueDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(getVaccinationStatus(vaccination))}>
                        {getStatusLabel(getVaccinationStatus(vaccination))}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vaccination.administeredDate
                        ? format(new Date(vaccination.administeredDate), "MMM d, yyyy")
                        : "Not yet"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(vaccination.id)}
                        aria-label={`Delete ${vaccination.name} vaccination record`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No vaccinations recorded yet
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

