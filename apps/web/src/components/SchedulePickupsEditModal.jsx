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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MapView from '@/components/MapView';
import { operatorContactDirectory, scheduledPickupVehicleOptions } from '@/lib/dummyData';

const getDefaultValues = (pickup) => ({
  operatorName: pickup?.operatorName || '',
  vehicleId:
    pickup?.selectedVehicleId ||
    scheduledPickupVehicleOptions.find((vehicle) => vehicle.label === pickup?.vehicle)?.id ||
    '',
  additionalVehicleSize: pickup?.additionalVehicleRequirement?.vehicleSize || '',
  additionalVehicleCapacity: pickup?.additionalVehicleRequirement?.capacity || '',
  additionalVehicleRequiredAt: pickup?.additionalVehicleRequirement?.requiredAt || '',
  pocName: pickup?.poc?.name || '',
  pocPhone: pickup?.poc?.phone || '',
  marketReason: pickup?.marketVehicleRequest?.reason || '',
  reason: '',
});

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

const SchedulePickupsEditModal = ({ isOpen, onClose, pickup, onSave }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues(pickup),
  });
  const [showAdditionalVehicle, setShowAdditionalVehicle] = useState(false);
  const [showMarketSourcing, setShowMarketSourcing] = useState(false);
  const vehicleId = watch('vehicleId');
  const additionalVehicleSize = watch('additionalVehicleSize');
  const additionalVehicleCapacity = watch('additionalVehicleCapacity');
  const additionalVehicleRequiredAt = watch('additionalVehicleRequiredAt');
  const isSubPrq = pickup?.prqMode === 'Sub-Scheduled' || Boolean(pickup?.parentPickupId || pickup?.subPrqSequence);

  useEffect(() => {
    reset(getDefaultValues(pickup));
    setShowAdditionalVehicle(
      !isSubPrq && Boolean(pickup?.additionalVehicleRequirement || pickup?.additionalVehicleDetails || pickup?.subPrqId)
    );
    setShowMarketSourcing(Boolean(pickup?.marketVehicleRequest));
  }, [isSubPrq, pickup, reset]);

  const selectedVehicle = useMemo(
    () => scheduledPickupVehicleOptions.find((vehicle) => vehicle.id === vehicleId),
    [vehicleId]
  );
  const activeVehicle = showMarketSourcing ? null : selectedVehicle;
  const routePreview = activeVehicle?.routeToBranch
    ? [
        {
          color: '#2563eb',
          takenLocations: activeVehicle.routeToBranch.takenLocations,
          plannedLocations: activeVehicle.routeToBranch.plannedLocations,
        },
      ]
    : [];

  const onSubmit = (data) => {
    if (!pickup) return;
    const primaryVehicle = scheduledPickupVehicleOptions.find((vehicle) => vehicle.id === data.vehicleId);

    if (!showMarketSourcing && !primaryVehicle) {
      setError('vehicleId', {
        type: 'manual',
        message: 'Select a vehicle or raise a market sourcing request.',
      });
      return;
    }
    if (showMarketSourcing && !data.marketReason.trim()) {
      setError('marketReason', {
        type: 'manual',
        message: 'Reason for market sourcing is required.',
      });
      return;
    }

    onSave({
      ...pickup,
      operatorName: data.operatorName,
      operatorContact: operatorContactDirectory[data.operatorName] || pickup.operatorContact,
      vehicle: showMarketSourcing ? 'Market vehicle requested' : primaryVehicle.label,
      selectedVehicleId: showMarketSourcing ? '' : primaryVehicle.id,
      driver: showMarketSourcing ? 'Awaiting market assignment' : primaryVehicle.driver.name,
      driverContact: showMarketSourcing
        ? { name: 'Awaiting assignment', phone: 'Vehicle to be sourced' }
        : primaryVehicle.driver,
      transporterDetails: showMarketSourcing ? null : primaryVehicle.transporter,
      liveVehicleRoute: showMarketSourcing ? null : primaryVehicle.routeToBranch,
      etaToBranch: showMarketSourcing
        ? 'Awaiting market vehicle confirmation'
        : primaryVehicle.etaToBranch,
      branchLocation: showMarketSourcing ? pickup.branchLocation || null : primaryVehicle.branch,
      additionalVehicleId: '',
      additionalVehicleRequirement:
        !isSubPrq && showAdditionalVehicle
          ? {
              vehicleSize: data.additionalVehicleSize,
              capacity: data.additionalVehicleCapacity,
              requiredAt: data.additionalVehicleRequiredAt,
            }
          : null,
      additionalVehicleDetails:
        !isSubPrq && showAdditionalVehicle
          ? {
              id: `${pickup.pickupId}-requirement`,
              label: `${data.additionalVehicleSize || 'Vehicle'} | ${data.additionalVehicleCapacity || 'Capacity pending'}`,
              driver: { name: 'Awaiting allocation', phone: 'To be assigned' },
              transporter: null,
              routeToBranch: null,
              etaToBranch: data.additionalVehicleRequiredAt || 'Requirement time pending',
              branch: pickup.branchLocation || null,
              requirement: {
                vehicleSize: data.additionalVehicleSize,
                capacity: data.additionalVehicleCapacity,
                requiredAt: data.additionalVehicleRequiredAt,
              },
            }
          : null,
      subPrqId:
        !isSubPrq && showAdditionalVehicle && data.additionalVehicleSize
          ? `${pickup.pickupId}S1`
          : '',
      marketVehicleRequest: showMarketSourcing
        ? { reason: data.marketReason.trim(), status: 'Requested' }
        : null,
      poc: { name: data.pocName, phone: data.pocPhone },
      editReason: data.reason.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-[92vh] max-h-[92vh] flex-col overflow-hidden p-0 sm:max-w-[1100px]">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>Edit Scheduled Pickup</DialogTitle>
          <DialogDescription>
            Update assignment details for{' '}
            <span className="font-medium text-foreground">{pickup?.pickupId}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-4">
            <AuditSummary pickup={pickup} />

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardContent className="grid gap-4 p-5 md:grid-cols-4">
                    <Info label="Pickup" value={pickup?.pickupId} />
                    <Info label="Customer" value={pickup?.customerName} />
                    <Info label="Current Status" value={pickup?.status} />
                    <Info
                      label="Slot"
                      value={pickup?.slot ? new Date(pickup.slot).toLocaleString() : '-'}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Vehicle Planning</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Operator Name</Label>
                        <Input {...register('operatorName')} readOnly className="bg-muted/40 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex min-h-6 items-center justify-between gap-3">
                          <Label className="whitespace-nowrap leading-none">Primary Vehicle</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto shrink-0 px-0 text-xs font-medium"
                            onClick={() => setShowMarketSourcing((current) => !current)}
                          >
                            {showMarketSourcing ? 'Use Branch Vehicle' : 'Source Market Vehicle'}
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
                                if (showMarketSourcing) setShowMarketSourcing(false);
                              }}
                              value={field.value || undefined}
                              disabled={showMarketSourcing}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle" />
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
                        {errors.vehicleId ? (
                          <p className="text-sm text-destructive">{errors.vehicleId.message}</p>
                        ) : null}
                      </div>
                    </div>

                    {showMarketSourcing ? (
                      <div className="space-y-2 rounded-xl border border-amber-300/60 bg-amber-50/60 p-4">
                        <Label>Reason for Market Vehicle Request</Label>
                        <Textarea
                          {...register('marketReason')}
                          className="min-h-[90px] resize-none"
                        />
                        {errors.marketReason ? (
                          <p className="text-sm text-destructive">{errors.marketReason.message}</p>
                        ) : null}
                      </div>
                    ) : null}

                    {isSubPrq ? (
                      <div className="rounded-xl border border-dashed bg-muted/15 p-4 text-sm text-muted-foreground">
                        Sub-PRQs cannot generate another sub-PRQ. Update the assigned vehicle here if needed.
                      </div>
                    ) : (
                      <div className="rounded-xl border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">Additional Vehicle / Sub PRQ</p>
                            <p className="text-sm text-muted-foreground">
                              Generate a split pickup when a second vehicle is required.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant={showAdditionalVehicle ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => setShowAdditionalVehicle((current) => !current)}
                          >
                            {showAdditionalVehicle ? 'Remove' : 'Add Additional Vehicle'}
                          </Button>
                        </div>
                        {showAdditionalVehicle ? (
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Vehicle Size</Label>
                              <Controller
                                name="additionalVehicleSize"
                                control={control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select vehicle size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {['10 ft', '14 ft', '17 ft', '20 ft', '24 ft', '32 ft'].map((size) => (
                                        <SelectItem key={size} value={size}>
                                          {size}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Capacity Required</Label>
                              <Input
                                {...register('additionalVehicleCapacity')}
                                placeholder="e.g. 2.5 T / 180 boxes"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Time Of Requirement</Label>
                              <Input type="datetime-local" {...register('additionalVehicleRequiredAt')} />
                            </div>
                            <div className="space-y-2">
                              <Label>Generated Sub PRQ</Label>
                              <Input
                                value={additionalVehicleSize ? `${pickup?.pickupId}S1` : ''}
                                readOnly
                                placeholder={`Will be created as ${pickup?.pickupId}S1`}
                              />
                            </div>
                            <p className="md:col-span-2 text-xs text-muted-foreground">
                              Sub-PRQ will be generated from this requirement. Vehicle allocation can happen separately.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">POC & Update Note</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>POC Name</Label>
                        <Input {...register('pocName')} />
                      </div>
                      <div className="space-y-2">
                        <Label>POC Phone</Label>
                        <Input {...register('pocPhone')} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-edit-reason">
                        Reason for Changes <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="schedule-edit-reason"
                        {...register('reason', { required: 'Reason is required to save changes.' })}
                        className="min-h-[96px] resize-none"
                      />
                      {errors.reason ? (
                        <p className="text-sm text-destructive">{errors.reason.message}</p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Transporter Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeVehicle ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Info label="Vehicle" value={activeVehicle.label} />
                          <Info label="Driver" value={activeVehicle.driver.name} />
                          <Info label="Transporter" value={activeVehicle.transporter.name} />
                          <Info
                            label="Transporter Contact"
                            value={activeVehicle.transporter.phone}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Info
                            label="Coordinator"
                            value={activeVehicle.transporter.coordinator}
                          />
                          <Info label="Service Lane" value={activeVehicle.transporter.lane} />
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {showMarketSourcing
                          ? 'Vehicle will be assigned after market sourcing.'
                          : 'Select a vehicle to load transporter details.'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Live Route to Branch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
                      <Info
                        label="ETA To Branch"
                        value={activeVehicle?.etaToBranch || 'Awaiting vehicle allocation'}
                      />
                      <Info
                        label="Destination Branch"
                        value={
                          activeVehicle?.branch.name ||
                          pickup?.branchLocation?.name ||
                          'Will be assigned after sourcing'
                        }
                      />
                    </div>
                    {routePreview.length > 0 ? (
                      <MapView routes={routePreview} height="320px" />
                    ) : (
                      <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                        Select a vehicle to load the live branch approach map.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
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

export default SchedulePickupsEditModal;
