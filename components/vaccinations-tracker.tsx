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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !dueDate) return

    const newVaccination: Vaccination = {
      id: generateId(),
      petId: pet.id,
      name,
      dueDate,
      administeredDate,
      notes,
      createdAt: new Date(),
    }

    onAdd(newVaccination)
    setIsDialogOpen(false)

    // Reset form
    setName("")
    setDueDate(undefined)
    setNotes("")
    setAdministeredDate(undefined)
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vaccination Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Rabies, Distemper"
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                      aria-label="Select due date"
                      aria-required="true"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="administeredDate">Administered Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="administeredDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !administeredDate && "text-muted-foreground",
                      )}
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

