"use client"

import type React from "react"

import { useState } from "react"
import type { Pet, Medication } from "@/lib/types"
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
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils/ui-utils"
import { Badge } from "@/components/ui/badge"
import { generateId } from "@/lib/utils/data-utils"
import { getMedicationStatus, sortMedications } from "@/lib/utils/date-utils"
import { getBadgeVariant, getStatusLabel } from "@/lib/utils/ui-utils"
import { MEDICATION_FREQUENCIES } from "@/lib/constants"

interface MedicationsTrackerProps {
  pet: Pet
  medications: Medication[]
  onAdd: (medication: Medication) => void
  onDelete: (id: string) => void
}

export function MedicationsTracker({ pet, medications, onAdd, onDelete }: MedicationsTrackerProps) {
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [notes, setNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !dosage || !frequency || !startDate || !endDate) return

    const newMedication: Medication = {
      id: generateId(),
      petId: pet.id,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      notes,
      createdAt: new Date(),
    }

    onAdd(newMedication)
    setIsDialogOpen(false)

    // Reset form
    setName("")
    setDosage("")
    setFrequency("")
    setStartDate(new Date())
    setEndDate(undefined)
    setNotes("")
  }

  // Sort medications by status and start date
  const sortedMedications = sortMedications(medications)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Medications</h2>
          <p className="text-muted-foreground">Manage your pet's medication schedule</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Add Medication</span>
              <span className="sr-only">Add a new medication for {pet.name}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
              <DialogDescription>Add a medication for {pet.name}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Antibiotics, Pain medication"
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 5mg, 1 tablet"
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency} required>
                  <SelectTrigger id="frequency" aria-required="true">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                        aria-label="Select start date"
                        aria-required="true"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                        aria-label="Select end date"
                        aria-required="true"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => (startDate ? date < startDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional information, instructions, etc."
                  rows={3}
                  aria-label="Additional notes about the medication"
                />
              </div>

              <Button type="submit" className="w-full">
                Add Medication
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
                <TableHead>Medication</TableHead>
                <TableHead>Dosage & Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMedications.length > 0 ? (
                sortedMedications.map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell className="font-medium">{medication.name}</TableCell>
                    <TableCell>
                      <div>{medication.dosage}</div>
                      <div className="text-sm text-muted-foreground">{medication.frequency}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {format(new Date(medication.startDate), "MMM d")} -{" "}
                        {format(new Date(medication.endDate), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(getMedicationStatus(medication))}>
                        {getStatusLabel(getMedicationStatus(medication))}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(medication.id)}
                        aria-label={`Delete ${medication.name} medication record`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No medications recorded yet
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

