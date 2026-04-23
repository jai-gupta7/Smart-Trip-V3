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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MapView from '@/components/MapView';
import {
  operatorContactDirectory,
  operators,
  scheduledPickupTripsInProgress,
  scheduledPickupVehicleOptions,
} from '@/lib/dummyData';
import { Clock3, FileStack, MapPinned, Route, Truck, UserRound } from 'lucide-react';

const CREATE_NEW_TRIP_VALUE = '__create_new__';

const getDefaultValues = (pickup) => ({
  operatorName: pickup?.operatorName || '',
  tripAssignment: pickup?.assignedTripId || CREATE_NEW_TRIP_VALUE,
  vehicleId: pickup?.selectedVehicleId || '',
  additionalVehicleId: pickup?.additionalVehicleId || '',
  generatedSubPrqId: pickup?.subPrqId || '',
  pocName: pickup?.poc?.name || '',
  pocPhone: pickup?.poc?.phone || '',
  updateReason: '',
  marketReason: pickup?.marketVehicleRequest?.reason || '',
});

const generateSubPrqId = (pickupId, sequence) => `${pickupId || 'PRQ'}S${sequence}`;

const InfoField = ({ label, value, muted = false }) => (
  <div className="space-y-1">
    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <p className={muted ? 'text-sm text-muted-foreground' : 'text-sm font-medium text-foreground'}>{value || '-'}</p>
  </div>
);

const SchedulePickupsEditModal = ({ isOpen, onClose, pickup, onSave, nextSubPrqSequence = 1 }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues(pickup),
  });

  const [showAdditionalVehicle, setShowAdditionalVehicle] = useState(false);
  const [showMarketSourcing, setShowMarketSourcing] = useState(false);
  const [generatedSubPrqId, setGeneratedSubPrqId] = useState('');
  const isSubPrq = pickup?.prqMode === 'Sub-Scheduled';
  const mainPrqId = pickup?.parentPickupId || pickup?.pickupId;

  const tripAssignment = watch('tripAssignment');
  const vehicleId = watch('vehicleId');
  const additionalVehicleId = watch('additionalVehicleId');

  useEffect(() => {
    reset(getDefaultValues(pickup));
    setShowAdditionalVehicle(Boolean(pickup?.additionalVehicleId || pickup?.subPrqId));
    setShowMarketSourcing(Boolean(pickup?.marketVehicleRequest));
    setGeneratedSubPrqId(pickup?.subPrqId || '');
  }, [pickup, reset]);

  const selectedTrip = useMemo(
    () => scheduledPickupTripsInProgress.find((trip) => trip.id === tripAssignment),
    [tripAssignment]
  );

  const selectedVehicle = useMemo(
    () => scheduledPickupVehicleOptions.find((vehicle) => vehicle.id === vehicleId),
    [vehicleId]
  );

  const additionalVehicle = useMemo(
    () => scheduledPickupVehicleOptions.find((vehicle) => vehicle.id === additionalVehicleId),
    [additionalVehicleId]
  );

  const activeVehicle = showMarketSourcing ? null : selectedVehicle;

  const availableAdditionalVehicles = useMemo(
    () => scheduledPickupVehicleOptions.filter((vehicle) => vehicle.id !== vehicleId),
    [vehicleId]
  );

  const routePreview = useMemo(() => {
    if (!activeVehicle?.routeToBranch) {
      return [];
    }

    return [
      {
        color: '#2563eb',
        takenLocations: activeVehicle.routeToBranch.takenLocations,
        plannedLocations: activeVehicle.routeToBranch.plannedLocations,
      },
    ];
  }, [activeVehicle]);

  useEffect(() => {
    if (selectedTrip?.vehicleId && tripAssignment !== CREATE_NEW_TRIP_VALUE && !showMarketSourcing) {
      setValue('vehicleId', selectedTrip.vehicleId, { shouldDirty: true });
      clearErrors('vehicleId');
    }
  }, [selectedTrip, tripAssignment, showMarketSourcing, setValue, clearErrors]);

  const handleGenerateSubPrq = () => {
    if (!additionalVehicleId) {
      setError('additionalVehicleId', { type: 'manual', message: 'Select an additional vehicle first.' });
      return;
    }

    const nextSubPrqId = generateSubPrqId(mainPrqId, nextSubPrqSequence);
    setGeneratedSubPrqId(nextSubPrqId);
    setValue('generatedSubPrqId', nextSubPrqId, { shouldDirty: true });
    clearErrors('additionalVehicleId');
  };

  const handleToggleMarketSourcing = () => {
    const nextValue = !showMarketSourcing;
    setShowMarketSourcing(nextValue);

    if (nextValue) {
      setValue('vehicleId', '');
    } else if (selectedTrip?.vehicleId) {
      setValue('vehicleId', selectedTrip.vehicleId);
    } else if (pickup?.selectedVehicleId) {
      setValue('vehicleId', pickup.selectedVehicleId);
    }
  };

  const onSubmit = (data) => {
    const updateNote = data.updateReason.trim();
    const requestedMarketVehicle = showMarketSourcing;
    const primaryVehicle = scheduledPickupVehicleOptions.find((vehicle) => vehicle.id === data.vehicleId);
    const operatorContact = operatorContactDirectory[data.operatorName] || pickup?.operatorContact || null;
    const additionalVehicleOption = scheduledPickupVehicleOptions.find((vehicle) => vehicle.id === data.additionalVehicleId);
    const resolvedSubPrqId =
      showAdditionalVehicle && data.additionalVehicleId
        ? generatedSubPrqId || generateSubPrqId(mainPrqId, nextSubPrqSequence)
        : '';

    if (!updateNote) {
      setError('updateReason', { type: 'manual', message: 'Reason for changes is required.' });
      return;
    }

    if (requestedMarketVehicle && !data.marketReason.trim()) {
      setError('marketReason', { type: 'manual', message: 'Reason for market sourcing is required.' });
      return;
    }

    if (!requestedMarketVehicle && !primaryVehicle) {
      setError('vehicleId', { type: 'manual', message: 'Select a vehicle or trigger market sourcing.' });
      return;
    }

    const updatedPickup = {
      ...pickup,
      operatorName: isSubPrq ? pickup.operatorName : data.operatorName,
      operatorContact: isSubPrq ? pickup.operatorContact : operatorContact,
      assignedTripId: data.tripAssignment,
      selectedVehicleId: requestedMarketVehicle ? '' : primaryVehicle.id,
      vehicle: requestedMarketVehicle ? 'Market vehicle requested' : primaryVehicle.label,
      driver: requestedMarketVehicle ? 'Awaiting market assignment' : primaryVehicle.driver.name,
      driverContact: requestedMarketVehicle
        ? { name: 'Awaiting assignment', phone: 'Vehicle to be sourced' }
        : primaryVehicle.driver,
      transporterDetails: requestedMarketVehicle ? null : primaryVehicle.transporter,
      liveVehicleRoute: requestedMarketVehicle ? null : primaryVehicle.routeToBranch,
      etaToBranch: requestedMarketVehicle ? 'Awaiting market vehicle confirmation' : primaryVehicle.etaToBranch,
      branchLocation: requestedMarketVehicle ? pickup?.branchLocation || null : primaryVehicle.branch,
      additionalVehicleId: showAdditionalVehicle ? data.additionalVehicleId : '',
      additionalVehicleDetails: showAdditionalVehicle ? additionalVehicleOption || null : null,
      subPrqId: showAdditionalVehicle ? resolvedSubPrqId : '',
      marketVehicleRequest: requestedMarketVehicle
        ? {
            reason: data.marketReason.trim(),
            status: 'Requested',
          }
        : null,
      generatedSubPrqId: resolvedSubPrqId,
      poc: {
        name: data.pocName,
        phone: data.pocPhone,
      },
      editReason: updateNote,
    };

    onSave(updatedPickup);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] overflow-hidden p-0 sm:max-w-[1120px]">
        <DialogHeader className="border-b bg-muted/30 px-6 py-5">
          <DialogTitle>Edit Scheduled Pickup</DialogTitle>
          <DialogDescription>
            Assign pickup <span className="font-medium text-foreground">{pickup?.pickupId}</span> to an active trip or create a new
            trip with the right vehicle plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[calc(92vh-92px)] flex-col">
          <div className="space-y-6 overflow-y-auto px-6 py-6">
            <Card className="shadow-sm">
              <CardContent className="grid gap-4 p-5 md:grid-cols-4">
                <InfoField label="Pickup" value={pickup?.pickupId} />
                <InfoField label="Customer" value={pickup?.customerName} />
                <InfoField label="Scheduled Slot" value={pickup?.slot ? new Date(pickup.slot).toLocaleString() : '-'} />
                <InfoField label="Current Status" value={pickup?.status} />
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Route className="h-4 w-4 text-primary" />
                      Trip Assignment
                    </CardTitle>
                    <CardDescription>Select an in-progress trip or create a fresh feeder trip for this pickup.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Operator Name</Label>
                        {isSubPrq ? (
                          <Input value={pickup?.operatorName || '-'} readOnly className="bg-muted/30" />
                        ) : (
                          <Controller
                            name="operatorName"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value || undefined}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select operator" />
                                </SelectTrigger>
                                <SelectContent>
                                  {operators.map((operator) => (
                                    <SelectItem key={operator} value={operator}>
                                      {operator}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Trip Selection</Label>
                        <Controller
                          name="tripAssignment"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || CREATE_NEW_TRIP_VALUE}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select active trip or create new" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={CREATE_NEW_TRIP_VALUE}>Create New Trip</SelectItem>
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
                    </div>

                    {selectedTrip ? (
                      <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-4">
                        <InfoField label="Trip" value={selectedTrip.name} />
                        <InfoField label="Branch" value={selectedTrip.branchName} />
                        <InfoField label="PRQs In Trip" value={selectedTrip.prqCount} />
                        <InfoField label="Utilization" value={selectedTrip.utilization} />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
                        A new feeder trip will be created once you choose the vehicle plan below.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Truck className="h-4 w-4 text-primary" />
                      Vehicle Planning
                    </CardTitle>
                    <CardDescription>Choose the primary vehicle, add an overflow vehicle if needed, or raise a market request.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label>Primary Vehicle</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={handleToggleMarketSourcing}>
                          {showMarketSourcing ? 'Use Branch Vehicle Instead' : 'Source Market Vehicle'}
                        </Button>
                      </div>
                      <Controller
                        name="vehicleId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              clearErrors('vehicleId');
                              if (showMarketSourcing) {
                                setShowMarketSourcing(false);
                              }
                            }}
                            value={field.value || undefined}
                            disabled={showMarketSourcing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select primary vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                              {scheduledPickupVehicleOptions.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.vehicleId ? <p className="text-sm text-destructive">{errors.vehicleId.message}</p> : null}
                    </div>

                    {showMarketSourcing ? (
                      <div className="space-y-2 rounded-xl border border-amber-300/60 bg-amber-50/60 p-4">
                        <Label htmlFor="marketReason">Reason for Market Vehicle Request</Label>
                        <Textarea
                          id="marketReason"
                          {...register('marketReason')}
                          placeholder="Explain why the preferred branch vehicle is not suitable or unavailable."
                          className="min-h-[96px] resize-none"
                        />
                        {errors.marketReason ? <p className="text-sm text-destructive">{errors.marketReason.message}</p> : null}
                      </div>
                    ) : null}

                    <div className="rounded-xl border bg-muted/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Additional Vehicle / Split PRQ</p>
                          <p className="text-sm text-muted-foreground">Use this when capacity needs a second vehicle and sub PRQ generation.</p>
                        </div>
                        <Button
                          type="button"
                          variant={showAdditionalVehicle ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => {
                            const nextValue = !showAdditionalVehicle;
                            setShowAdditionalVehicle(nextValue);
                            if (!nextValue) {
                              setValue('additionalVehicleId', '');
                              setGeneratedSubPrqId('');
                              setValue('generatedSubPrqId', '');
                            }
                          }}
                        >
                          {showAdditionalVehicle ? 'Remove Additional Vehicle' : 'Add Additional Vehicle'}
                        </Button>
                      </div>

                      {showAdditionalVehicle ? (
                        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                          <div className="space-y-2">
                            <Label>Additional Vehicle</Label>
                            <Controller
                              name="additionalVehicleId"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    clearErrors('additionalVehicleId');
                                  }}
                                  value={field.value || undefined}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select overflow vehicle" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableAdditionalVehicles.map((vehicle) => (
                                      <SelectItem key={vehicle.id} value={vehicle.id}>
                                        {vehicle.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.additionalVehicleId ? (
                              <p className="text-sm text-destructive">{errors.additionalVehicleId.message}</p>
                            ) : null}
                          </div>

                          <div className="flex items-end">
                            <Button type="button" variant="outline" onClick={handleGenerateSubPrq}>
                              <FileStack className="mr-2 h-4 w-4" />
                              Generate Sub PRQ
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {showAdditionalVehicle ? (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Generated Sub PRQ</Label>
                            <Input
                              value={generatedSubPrqId}
                              readOnly
                              placeholder={`Will be created as ${mainPrqId}S${nextSubPrqSequence}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Overflow Vehicle ETA</Label>
                            <Input value={additionalVehicle?.etaToBranch || 'Awaiting overflow vehicle selection'} readOnly />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">POC & Update Note</CardTitle>
                    <CardDescription>Keep the operational contact updated and capture why this change is being made.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>POC Name</Label>
                        <Input {...register('pocName')} placeholder="Contact person name" />
                      </div>
                      <div className="space-y-2">
                        <Label>POC Phone</Label>
                        <Input {...register('pocPhone')} placeholder="Contact number" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="updateReason">
                        Reason for Changes <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="updateReason"
                        {...register('updateReason')}
                        placeholder="Mention why this pickup needs trip, vehicle, or sub PRQ changes."
                        className="min-h-[110px] resize-none"
                      />
                      {errors.updateReason ? <p className="text-sm text-destructive">{errors.updateReason.message}</p> : null}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <UserRound className="h-4 w-4 text-primary" />
                      Selected Vehicle Details
                    </CardTitle>
                    <CardDescription>Driver and transporter details are auto-fetched from the chosen branch vehicle.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeVehicle ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <InfoField label="Vehicle" value={activeVehicle.label} />
                          <InfoField label="Vehicle Type" value={activeVehicle.vehicleType} />
                          <InfoField label="Driver" value={activeVehicle.driver.name} />
                          <InfoField label="Driver Contact" value={activeVehicle.driver.phone} />
                        </div>

                        <div className="rounded-xl border bg-muted/20 p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                            <Truck className="h-4 w-4 text-primary" />
                            Transporter Details
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <InfoField label="Transporter" value={activeVehicle.transporter.name} />
                            <InfoField label="Contact" value={activeVehicle.transporter.phone} />
                            <InfoField label="Coordinator" value={activeVehicle.transporter.coordinator} />
                            <InfoField label="Service Lane" value={activeVehicle.transporter.lane} />
                          </div>
                        </div>

                        {showAdditionalVehicle && additionalVehicle ? (
                          <div className="rounded-xl border border-dashed bg-muted/10 p-4">
                            <p className="text-sm font-medium text-foreground">Additional Vehicle Selected</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {additionalVehicle.label} with ETA {additionalVehicle.etaToBranch} and generated sub PRQ{' '}
                              <span className="font-medium text-foreground">{generatedSubPrqId || 'pending'}</span>.
                            </p>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                        {showMarketSourcing
                          ? 'Market vehicle sourcing has been selected. Live vehicle details will appear once a vehicle is assigned.'
                          : 'Choose a vehicle or attach the pickup to an active trip to auto-fetch transporter details.'}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPinned className="h-4 w-4 text-primary" />
                      Live Route to Branch
                    </CardTitle>
                    <CardDescription>Track the selected vehicle on the feeder route and review the ETA into branch.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">ETA To Branch</p>
                          <p className="text-base font-semibold text-foreground">
                            {activeVehicle?.etaToBranch || 'Awaiting vehicle allocation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Route className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Destination Branch</p>
                          <p className="text-base font-semibold text-foreground">
                            {activeVehicle?.branch.name || pickup?.branchLocation?.name || 'Will be assigned after sourcing'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {routePreview.length > 0 ? (
                      <MapView routes={routePreview} height="320px" />
                    ) : (
                      <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                        Select a vehicle to load the live branch approach map. If you raise a market request, the route will appear after the
                        vehicle is assigned.
                      </div>
                    )}

                    {activeVehicle ? (
                      <div className="grid gap-4 sm:grid-cols-3">
                        <InfoField label="Vehicle Status" value={activeVehicle.currentStatus} />
                        <InfoField label="Branch" value={activeVehicle.branch.name} />
                        <InfoField label="Trip Status" value={selectedTrip?.status || 'New trip to be created'} />
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t bg-background px-6 py-4">
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

export default SchedulePickupsEditModal;
