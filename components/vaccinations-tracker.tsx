"use client"
import { useState } from "react"
import type { Pet, Vaccination } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { getVaccinationStatus, sortVaccinations } from "@/lib/utils/date-utils"
import { getBadgeVariant, getStatusLabel } from "@/lib/utils"
import { toast } from "sonner"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import { VaccinationDialog } from "@/components/dialogs/vaccination-dialog"

interface VaccinationsTrackerProps {
  pet: Pet
  vaccinations: Vaccination[]
  onAdd: (vaccination: Vaccination) => void
  onUpdate: (vaccination: Vaccination) => void
  onDelete: (id: string) => void
}

export function VaccinationsTracker({ pet, vaccinations, onAdd, onUpdate, onDelete }: VaccinationsTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vaccinationToDelete, setVaccinationToDelete] = useState<Vaccination | null>(null)
  const [vaccinationToEdit, setVaccinationToEdit] = useState<Vaccination | null>(null)

  const handleAddVaccination = (vaccination: Vaccination) => {
    // Show toast notification
    toast.success("Vaccination added", {
      description: `${vaccination.name} has been added to ${pet.name}'s records.`,
    })

    // Add the vaccination
    onAdd(vaccination)
  }

  const handleEditVaccination = (vaccination: Vaccination) => {
    setVaccinationToEdit(vaccination)
    setIsEditDialogOpen(true)
  }

  const handleUpdateVaccination = (updatedVaccination: Vaccination) => {
    // Update the vaccination
    onUpdate(updatedVaccination)
  }

  const initiateDelete = (vaccination: Vaccination) => {
    setVaccinationToDelete(vaccination)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!vaccinationToDelete) return

    // Delete the vaccination
    onDelete(vaccinationToDelete.id)

    // Close dialog and reset state
    setDeleteDialogOpen(false)
    setVaccinationToDelete(null)
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
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Add Vaccination</span>
          <span className="sr-only">Add a new vaccination record for {pet.name}</span>
        </Button>
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
                    <TableCell className="font-medium">
                      <div>{vaccination.name}</div>
                      {vaccination.updatedAt && (
                        <div className="text-xs text-muted-foreground">
                          Updated {formatDistanceToNow(new Date(vaccination.updatedAt), { addSuffix: true })}
                        </div>
                      )}
                    </TableCell>
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
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditVaccination(vaccination)}
                          aria-label={`Edit ${vaccination.name} vaccination record`}
                        >
                          <Edit className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => initiateDelete(vaccination)}
                          aria-label={`Delete ${vaccination.name} vaccination record`}
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
                    No vaccinations recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <VaccinationDialog
        pet={pet}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddVaccination}
        mode="add"
      />

      {/* Edit Dialog */}
      {vaccinationToEdit && (
        <VaccinationDialog
          pet={pet}
          vaccination={vaccinationToEdit}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateVaccination}
          mode="edit"
        />
      )}

      <ConfirmDeleteDialog
        title="Delete Vaccination"
        description={`Are you sure you want to delete ${vaccinationToDelete?.name}? This action cannot be undone.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

