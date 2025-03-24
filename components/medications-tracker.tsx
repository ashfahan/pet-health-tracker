"use client"
import { useState } from "react"
import type { Pet, Medication } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { getMedicationStatus, sortMedications } from "@/lib/utils/date-utils"
import { getBadgeVariant, getStatusLabel } from "@/lib/utils"
import { toast } from "sonner"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import { MedicationDialog } from "@/components/dialogs/medication-dialog"

interface MedicationsTrackerProps {
  pet: Pet
  medications: Medication[]
  onAdd: (medication: Medication) => void
  onUpdate: (medication: Medication) => void
  onDelete: (id: string) => void
}

export function MedicationsTracker({ pet, medications, onAdd, onUpdate, onDelete }: MedicationsTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null)
  const [medicationToEdit, setMedicationToEdit] = useState<Medication | null>(null)

  const handleAddMedication = (medication: Medication) => {
    // Show toast notification
    toast.success("Medication added", {
      description: `${medication.name} has been added to ${pet.name}'s records.`,
    })

    // Add the medication
    onAdd(medication)
  }

  const handleEditMedication = (medication: Medication) => {
    setMedicationToEdit(medication)
    setIsEditDialogOpen(true)
  }

  const handleUpdateMedication = (updatedMedication: Medication) => {
    // Update the medication
    onUpdate(updatedMedication)
  }

  const initiateDelete = (medication: Medication) => {
    setMedicationToDelete(medication)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!medicationToDelete) return

    // Delete the medication
    onDelete(medicationToDelete.id)

    // Close dialog and reset state
    setDeleteDialogOpen(false)
    setMedicationToDelete(null)
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
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Add Medication</span>
          <span className="sr-only">Add a new medication for {pet.name}</span>
        </Button>
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
                    <TableCell className="font-medium">
                      <div>{medication.name}</div>
                      {medication.updatedAt && (
                        <div className="text-xs text-muted-foreground">
                          Updated {formatDistanceToNow(new Date(medication.updatedAt), { addSuffix: true })}
                        </div>
                      )}
                    </TableCell>
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
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditMedication(medication)}
                          aria-label={`Edit ${medication.name} medication record`}
                        >
                          <Edit className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => initiateDelete(medication)}
                          aria-label={`Delete ${medication.name} medication record`}
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
                    No medications recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <MedicationDialog
        pet={pet}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddMedication}
        mode="add"
      />

      {/* Edit Dialog */}
      {medicationToEdit && (
        <MedicationDialog
          pet={pet}
          medication={medicationToEdit}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateMedication}
          mode="edit"
        />
      )}

      <ConfirmDeleteDialog
        title="Delete Medication"
        description={`Are you sure you want to delete ${medicationToDelete?.name}? This action cannot be undone.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

