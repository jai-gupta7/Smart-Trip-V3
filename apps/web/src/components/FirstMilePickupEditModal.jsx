import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  operatorContactDirectory,
  pickupStatusOptions,
  scheduledPickupTripsInProgress,
} from '@/lib/dummyData';

const CREATE_NEW_TRIP_VALUE = '__create_new__';
const ASSIGNMENT_MODES = {
  NONE: 'none',
  EXISTING: 'existing',
  NEW: 'new',
};

const getAssignmentMode = () => ASSIGNMENT_MODES.NONE;

const getDefaultValues = (pickup, type) => {
  if (!pickup) {
    return {
      status: '',
      pickupDateTime: '',
      customerLocation: '',
      contactName: '',
      contactPhone: '',
      operatorName: '',
      tripAssignment: CREATE_NEW_TRIP_VALUE,
    };
  }

  if (type === 'potential') {
    return {
      status: pickup.prqStatus || '',
      pickupDateTime: pickup.pickupDateTime || '',
      customerLocation: pickup.customerLocation?.name || '',
      contactName: pickup.poc?.name || '',
      contactPhone: pickup.poc?.phone || '',
      operatorName: pickup.operatorName || '',
      tripAssignment: CREATE_NEW_TRIP_VALUE,
    };
  }

  return {
    status: pickup.status || '',
    pickupDateTime: pickup.pickupSlot || '',
    customerLocation: pickup.customerAddress?.name || '',
    contactName: pickup.contact?.name || '',
    contactPhone: pickup.contact?.phone || '',
    operatorName: pickup.operatorName || '',
    tripAssignment: pickup.assignedTripId || CREATE_NEW_TRIP_VALUE,
  };
};

const AuditSummary = ({ pickup }) => (
  <Card className="border-border/80 shadow-none">
    <CardHeader className="pb-3">
      <CardTitle className="text-base">Latest Edit Snapshot</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Last Edited By</p>
          <p className="mt-1 font-medium">{pickup?.lastEditedBy || 'No edits recorded'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Edit Timestamp</p>
          <p className="mt-1 font-medium">
            {pickup?.lastEditedAt ? new Date(pickup.lastEditedAt).toLocaleString() : 'No edits recorded'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Edit Count</p>
          <p className="mt-1 font-medium">{pickup?.editCount || 0}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {pickup?.editedValues?.length ? (
          pickup.editedValues.map((value) => (
            <span key={value} className="rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium">
              {value}
            </span>
          ))
        ) : (
          <p className="text-muted-foreground">No edits recorded yet.</p>
        )}
      </div>
    </CardContent>
  </Card>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-medium">{value || '-'}</p>
  </div>
);

const AssignmentModeButton = ({ active, title, description, onClick }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
      active
        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
        : 'border-border bg-background hover:border-primary/50 hover:bg-muted/30'
    }`}
  >
    <span className="block font-medium">{title}</span>
    <span className={`mt-1 block text-xs ${active ? 'text-primary-foreground/85' : 'text-muted-foreground'}`}>
      {description}
    </span>
  </button>
);

const FirstMilePickupEditModal = ({ isOpen, onClose, pickup, type, onSave }) => {
  const { control, handleSubmit, register, reset, watch, setValue } = useForm({
    defaultValues: getDefaultValues(null, type),
  });
  const [assignmentMode, setAssignmentMode] = useState(ASSIGNMENT_MODES.NEW);

  useEffect(() => {
    reset(getDefaultValues(pickup, type));
    setAssignmentMode(getAssignmentMode(pickup));
  }, [pickup, reset, type]);

  const isPotential = type === 'potential';
  const canAssignTrip = !isPotential && pickup?.prqMode === 'Potential';
  const tripAssignment = watch('tripAssignment');
  const selectedTrip = useMemo(
    () =>
      assignmentMode === ASSIGNMENT_MODES.EXISTING
        ? scheduledPickupTripsInProgress.find((trip) => trip.id === tripAssignment)
        : null,
    [assignmentMode, tripAssignment]
  );

  const onSubmit = (data) => {
    if (!pickup) return;

    if (isPotential) {
      onSave({
        ...pickup,
        pickupDateTime: data.pickupDateTime,
        customerLocation: { name: data.customerLocation },
        poc: { name: data.contactName, phone: data.contactPhone },
        prqStatus: data.status,
      });
      onClose();
      return;
    }

    onSave({
      ...pickup,
      pickupSlot: data.pickupDateTime,
      customerAddress: { name: data.customerLocation },
      contact: { name: data.contactName, phone: data.contactPhone },
      status: data.status,
      operatorName: pickup.operatorName,
      operatorContact: pickup.operatorContact || operatorContactDirectory[pickup.operatorName],
      assignedTripId:
        !canAssignTrip || assignmentMode === ASSIGNMENT_MODES.NONE
          ? pickup.assignedTripId
          : assignmentMode === ASSIGNMENT_MODES.NEW
          ? CREATE_NEW_TRIP_VALUE
          : data.tripAssignment,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`${isPotential ? 'sm:max-w-[520px]' : 'sm:max-w-[760px]'} flex h-[90vh] max-h-[90vh] flex-col overflow-hidden p-0`}
      >
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>{isPotential ? 'Edit Pickup' : 'Edit Regular Pickup'}</DialogTitle>
          <DialogDescription>
            Update operational details for{' '}
            <span className="font-medium text-foreground">{isPotential ? pickup?.pickupId : pickup?.prqId}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-4">
            <AuditSummary pickup={pickup} />

            {isPotential ? (
              <>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          {pickupStatusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pickup Date & Time</Label>
                  <Input type="datetime-local" {...register('pickupDateTime')} />
                </div>
                <div className="space-y-2">
                  <Label>Customer Location</Label>
                  <Input {...register('customerLocation')} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>POC Name</Label>
                    <Input {...register('contactName')} />
                  </div>
                  <div className="space-y-2">
                    <Label>POC Phone</Label>
                    <Input {...register('contactPhone')} />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardContent className="grid gap-4 p-5 md:grid-cols-4">
                    <Info label="PRQ" value={pickup?.prqId} />
                    <Info label="Customer" value={pickup?.customer} />
                    <Info label="PRQ Mode" value={pickup?.prqMode} />
                    <Info label="Status" value={pickup?.status} />
                  </CardContent>
                </Card>

                  {canAssignTrip ? (
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Trip Assignment</CardTitle>
                        </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label>Assignment Mode</Label>
                              <div className="grid gap-3 md:grid-cols-3">
                                <AssignmentModeButton
                                  active={assignmentMode === ASSIGNMENT_MODES.NONE}
                                  title="No Assignment Change"
                                  description="Keep this PRQ as-is."
                                  onClick={() => setAssignmentMode(ASSIGNMENT_MODES.NONE)}
                                />
                                <AssignmentModeButton
                                  active={assignmentMode === ASSIGNMENT_MODES.EXISTING}
                                  title="Assign To Existing Trip"
                                  description="Add this PRQ to an active route."
                                  onClick={() => {
                                    setAssignmentMode(ASSIGNMENT_MODES.EXISTING);
                                    const fallbackTripId = scheduledPickupTripsInProgress[0]?.id;
                                    if (tripAssignment === CREATE_NEW_TRIP_VALUE && fallbackTripId) {
                                      setValue('tripAssignment', fallbackTripId, { shouldDirty: true });
                                    }
                                  }}
                                />
                                <AssignmentModeButton
                                  active={assignmentMode === ASSIGNMENT_MODES.NEW}
                                  title="Create New Trip"
                                  description="Start a fresh trip for this PRQ."
                                  onClick={() => {
                                    setAssignmentMode(ASSIGNMENT_MODES.NEW);
                                    setValue('tripAssignment', CREATE_NEW_TRIP_VALUE, { shouldDirty: true });
                                  }}
                                />
                              </div>
                            </div>

                            {assignmentMode === ASSIGNMENT_MODES.EXISTING ? (
                              <div className="space-y-2">
                                <Label>Existing Trip</Label>
                                <Controller
                                  name="tripAssignment"
                                  control={control}
                                  render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select existing trip" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {scheduledPickupTripsInProgress.map((trip) => (
                                          <SelectItem key={trip.id} value={trip.id}>
                                            {trip.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              </div>
                            ) : null}

                            <div className="space-y-2">
                              {assignmentMode === ASSIGNMENT_MODES.NONE ? (
                                <div className="rounded-xl border border-dashed bg-muted/15 p-4 text-sm text-muted-foreground">
                                  No assignment change selected. Save will only update the edited pickup details.
                                </div>
                              ) : selectedTrip ? (
                                <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-4">
                                  <Info label="Trip" value={selectedTrip.name} />
                                  <Info label="Branch" value={selectedTrip.branchName} />
                                  <Info label="PRQs" value={selectedTrip.prqCount} />
                                  <Info label="Utilization" value={selectedTrip.utilization} />
                                </div>
                              ) : (
                                <div className="rounded-xl border border-dashed bg-muted/15 p-4 text-sm text-muted-foreground">
                                  New trip creation selected. The system will create a fresh trip when this edit is saved.
                                </div>
                              )}
                            </div>
                          </CardContent>
                    </Card>
                  ) : null}

                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Pickup Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                              {pickupStatusOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pickup Slot</Label>
                      <Input type="datetime-local" {...register('pickupDateTime')} />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer Address</Label>
                      <Input {...register('customerLocation')} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>POC Name</Label>
                        <Input {...register('contactName')} />
                      </div>
                      <div className="space-y-2">
                        <Label>POC Phone</Label>
                        <Input {...register('contactPhone')} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FirstMilePickupEditModal;
