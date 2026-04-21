import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  getSampleTrips,
  getSmartTripDrivers,
  getSmartTripVehicles,
} from '@/lib/dummyData';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  PencilLine,
  ShieldCheck,
  Trash2,
  Truck,
  UserRound,
} from 'lucide-react';

const cloneTrips = () => JSON.parse(JSON.stringify(getSampleTrips()));

const DetailMetric = ({ label, value }) => (
  <div className="rounded-xl border bg-muted/20 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
  </div>
);

const RouteCard = ({ trip, onOpen }) => (
  <Card
    role="button"
    tabIndex={0}
    data-smart-trip-card="true"
    onClick={onOpen}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpen();
      }
    }}
    className="group h-full cursor-pointer overflow-hidden border-border/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
  >
    <CardHeader className="space-y-2 p-4 pb-3">
      <div>
        <div>
          <CardTitle className="text-base leading-snug transition-colors duration-200 group-hover:text-primary group-focus-visible:text-primary">
            {trip.routeName}
          </CardTitle>
          <CardDescription className="mt-1.5 text-xs">
            {trip.client}
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-2.5 p-4 pt-0">
      <MapView locations={trip.stops} height="132px" interactive={false} />

      <div className="grid grid-cols-3 gap-x-3 gap-y-2 rounded-xl border bg-background px-3 py-2">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.stops.length}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Stops</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.distance}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Distance</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.totalWeight}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Est. Weight</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.cnsCount}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">CN Count</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.prqsWeight}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">PRQ Weight</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.idleDispatchTime}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Idle Dispatch</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ChangeAssignmentDialog = ({
  open,
  onOpenChange,
  type,
  options,
  selectedId,
  onSelect,
  reason,
  onReasonChange,
  onSubmit,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Change {type === 'driver' ? 'Driver' : 'Truck'}</DialogTitle>
        <DialogDescription>
          Select a new {type === 'driver' ? 'driver' : 'vehicle'} and capture the reason for this change.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label>{type === 'driver' ? 'Available Drivers' : 'Available Vehicles'}</Label>
          <Select value={selectedId} onValueChange={onSelect}>
            <SelectTrigger>
              <SelectValue placeholder={`Select a ${type}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {type === 'driver'
                    ? `${option.name} | ${option.branch}`
                    : `${option.label} | ${option.number}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Reason for change</Label>
          <Textarea
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Explain why this driver or truck is being changed"
            className="min-h-[120px]"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!selectedId || !reason.trim()}>
          Save Change
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const TripRouteDetail = ({
  trip,
  onBack,
  onApprove,
  onDeleteStop,
  onMoveStop,
  onOpenDriverDialog,
  onOpenVehicleDialog,
}) => {
  const stopsCount = trip.stops.length;

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <div className="border-b bg-muted/10 px-6 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">{trip.routeName}</h2>
              <p className="mt-2 text-muted-foreground">
                {trip.consignmentCount} Consignments | {trip.boxes} Boxes | {trip.totalWeight}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border bg-background px-4 py-3 text-sm">
              <p className="text-muted-foreground">AI Confidence</p>
              <p className="mt-1 font-semibold">{trip.aiConfidence}%</p>
            </div>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={onApprove}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              {trip.status === 'Approved' ? 'Approved' : 'Approve'}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="space-y-8 p-6">
        <section className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Delivery Stops</h3>
              <p className="text-sm text-muted-foreground">
                Rearrange touchpoints or remove a stop before approval.
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Edit sequence
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr,0.95fr]">
            <div className="space-y-4">
              {trip.stops.map((stop, index) => (
                <div key={stop.id} className="rounded-2xl border bg-background p-4 shadow-sm">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{stop.id}</p>
                          <p className="text-sm text-muted-foreground">{stop.address}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                          {stop.type}
                        </span>
                        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                          {stop.client}
                        </span>
                        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                          {stop.timeWindow}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {stop.cns} CNs | {stop.boxes} Boxes | {stop.weight}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMoveStop(index, -1)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4 mr-1.5" />
                        Up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMoveStop(index, 1)}
                        disabled={index === trip.stops.length - 1}
                      >
                        <ChevronDown className="w-4 h-4 mr-1.5" />
                        Down
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDeleteStop(stop.id)}>
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <DetailMetric label="Stops" value={stopsCount} />
                <DetailMetric label="Est. Time" value={trip.estimatedTime} />
                <DetailMetric label="Distance" value={trip.distance} />
              </div>
              <MapView locations={trip.stops} height="520px" />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Driver & Vehicle Assignment</h3>
              <p className="text-sm text-muted-foreground">
                Change the assignment with a recorded reason before approval.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onOpenDriverDialog}>
                <PencilLine className="w-4 h-4 mr-2" />
                Change Driver
              </Button>
              <Button variant="outline" onClick={onOpenVehicleDialog}>
                <PencilLine className="w-4 h-4 mr-2" />
                Change Truck
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/80 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="w-5 h-5 text-primary" />
                  Driver Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="mt-1 text-2xl font-semibold">{trip.driver.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="mt-1 font-medium">{trip.driver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="mt-1 font-medium">{trip.driver.successRate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="mt-1 font-medium">{trip.driver.branch}</p>
                </div>
                {trip.driverChangeReason ? (
                  <div className="md:col-span-2 rounded-xl border bg-muted/20 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reason for driver change</p>
                    <p className="mt-2 text-sm">{trip.driverChangeReason}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Vehicle Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle Number</p>
                    <p className="mt-1 text-2xl font-semibold">{trip.vehicle.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle Type</p>
                    <p className="mt-1 font-medium">{trip.vehicle.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Body Type</p>
                    <p className="mt-1 font-medium">{trip.vehicle.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Capacity</p>
                    <p className="mt-1 font-medium">{trip.vehicle.totalCapacity}</p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle Utilization</span>
                    <span className="font-medium">{trip.vehicleUtilization}%</span>
                  </div>
                  <Progress value={trip.vehicleUtilization} className="mt-3 h-3" />
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">Utilized Capacity</p>
                      <p className="mt-1 font-semibold">{trip.vehicle.utilizedCapacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining Capacity</p>
                      <p className="mt-1 font-semibold">{trip.vehicle.remainingCapacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Distance</p>
                      <p className="mt-1 font-semibold">{trip.distance}</p>
                    </div>
                  </div>
                </div>

                {trip.vehicleChangeReason ? (
                  <div className="rounded-xl border bg-muted/20 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reason for truck change</p>
                    <p className="mt-2 text-sm">{trip.vehicleChangeReason}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

const SmartTripCreationPage = () => {
  const navigate = useNavigate();
  const { routeId } = useParams();

  const [trips, setTrips] = useState(() => cloneTrips());
  const [changeDialog, setChangeDialog] = useState({
    open: false,
    type: 'driver',
    selectedId: '',
    reason: '',
  });

  const smartTripDrivers = useMemo(() => getSmartTripDrivers(), []);
  const smartTripVehicles = useMemo(() => getSmartTripVehicles(), []);
  const activeTrip = trips.find((trip) => trip.id === routeId);

  const updateTrip = (tripId, updater) => {
    setTrips((currentTrips) =>
      currentTrips.map((trip) => (trip.id === tripId ? updater(trip) : trip))
    );
  };

  const handleApprove = (tripId) => {
    updateTrip(tripId, (trip) => ({ ...trip, status: 'Approved' }));
    toast.success('Route approved successfully.');
  };

  const handleDeleteStop = (stopId) => {
    if (!activeTrip) return;

    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      stops: trip.stops.filter((stop) => stop.id !== stopId),
    }));

    toast.success('Touchpoint deleted from route.');
  };

  const handleMoveStop = (index, direction) => {
    if (!activeTrip) return;

    updateTrip(activeTrip.id, (trip) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= trip.stops.length) {
        return trip;
      }

      const nextStops = [...trip.stops];
      [nextStops[index], nextStops[nextIndex]] = [nextStops[nextIndex], nextStops[index]];

      return {
        ...trip,
        stops: nextStops,
      };
    });
  };

  const openChangeDialog = (type) => {
    if (!activeTrip) return;

    setChangeDialog({
      open: true,
      type,
      selectedId: type === 'driver' ? activeTrip.driver.id : activeTrip.vehicle.id,
      reason: '',
    });
  };

  const handleSubmitAssignmentChange = () => {
    if (!activeTrip) return;

    if (changeDialog.type === 'driver') {
      const nextDriver = smartTripDrivers.find((driver) => driver.id === changeDialog.selectedId);
      if (!nextDriver) return;

      updateTrip(activeTrip.id, (trip) => ({
        ...trip,
        driver: nextDriver,
        driverChangeReason: changeDialog.reason.trim(),
      }));

      toast.success('Driver updated successfully.');
    } else {
      const nextVehicle = smartTripVehicles.find((vehicle) => vehicle.id === changeDialog.selectedId);
      if (!nextVehicle) return;

      updateTrip(activeTrip.id, (trip) => ({
        ...trip,
        vehicle: nextVehicle,
        vehicleChangeReason: changeDialog.reason.trim(),
      }));

      toast.success('Truck updated successfully.');
    }

    setChangeDialog((currentDialog) => ({
      ...currentDialog,
      open: false,
      reason: '',
    }));
  };

  return (
    <div className="om-container py-8 space-y-6">
      <BreadcrumbNav />

      {activeTrip ? (
        <TripRouteDetail
          trip={activeTrip}
          onBack={() => navigate('/smart-trip-creation')}
          onApprove={() => handleApprove(activeTrip.id)}
          onDeleteStop={handleDeleteStop}
          onMoveStop={handleMoveStop}
          onOpenDriverDialog={() => openChangeDialog('driver')}
          onOpenVehicleDialog={() => openChangeDialog('vehicle')}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Recommended Smart Routes</h2>
              <p className="text-muted-foreground">
                Review AI-generated route plans, compare utilization, and open a route to fine-tune stops, driver, and truck assignments.
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {trips.length} recommended routes
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trips.map((trip) => (
              <RouteCard
                key={trip.id}
                trip={trip}
                onOpen={() => navigate(`/smart-trip-creation/${trip.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      <ChangeAssignmentDialog
        open={changeDialog.open}
        onOpenChange={(open) => setChangeDialog((currentDialog) => ({ ...currentDialog, open }))}
        type={changeDialog.type}
        options={changeDialog.type === 'driver' ? smartTripDrivers : smartTripVehicles}
        selectedId={changeDialog.selectedId}
        onSelect={(selectedId) => setChangeDialog((currentDialog) => ({ ...currentDialog, selectedId }))}
        reason={changeDialog.reason}
        onReasonChange={(reason) => setChangeDialog((currentDialog) => ({ ...currentDialog, reason }))}
        onSubmit={handleSubmitAssignmentChange}
      />
    </div>
  );
};

export default SmartTripCreationPage;
