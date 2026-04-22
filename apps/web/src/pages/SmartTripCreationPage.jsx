import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import BayOperationalDetailsView from '@/components/BayOperationalDetailsView';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  getSmartTripDrivers,
  getSmartTripVehicles,
} from '@/lib/dummyData';
import {
  smartTripLoadingProgress,
  smartTripOnRouteVehicleColorById,
  smartTripOnRouteVehicles,
} from '@/lib/smartTripOpsData';
import {
  cloneTrips,
  getVehicleSizeRank,
  matchesTripView,
  summarizeTripForView,
} from '@/lib/smartTripUtils';
import { toast } from 'sonner';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  PencilLine,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
  UserRound,
  Package,
  Box,
  Phone,
} from 'lucide-react';

const DetailMetric = ({ label, value, helper }) => (
  <div className="rounded-xl border bg-muted/20 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
  </div>
);

const TruckProgressFill = ({ progress }) => {
  const getFillId = (p) => {
    if (p >= 80) return "url(#stripe-pattern-green)";
    if (p >= 50) return "url(#stripe-pattern-orange)";
    return "url(#stripe-pattern-red)";
  };

  const getFillHex = (p) => {
    if (p >= 80) return "#10b981";
    if (p >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const fillWidth = Math.max(0, (288 * progress) / 100);

  return (
    <div className="w-[85%] mx-auto h-32 relative flex items-center justify-center">
      <svg viewBox="0 0 400 120" className="w-full h-full drop-shadow-sm">
        <defs>
          <pattern id="stripe-pattern-red" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="20" fill="#f87171" />
            <rect x="10" width="10" height="20" fill="#ef4444" />
          </pattern>
          <pattern id="stripe-pattern-orange" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="20" fill="#fbbf24" />
            <rect x="10" width="10" height="20" fill="#f59e0b" />
          </pattern>
          <pattern id="stripe-pattern-green" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="20" fill="#34d399" />
            <rect x="10" width="10" height="20" fill="#10b981" />
          </pattern>
          
          <clipPath id="trailer-clip">
            <rect x="101" y="11" width="288" height="78" />
          </clipPath>
          
          <clipPath id={`empty-clip-${progress}`}>
            <rect x={101 + fillWidth} y="11" width={288 - fillWidth} height="78" />
          </clipPath>
          
          <clipPath id={`fill-clip-${progress}`}>
            <rect x="101" y="11" width={fillWidth} height="78" />
          </clipPath>
        </defs>

        {/* Shadow under truck */}
        <ellipse cx="200" cy="110" rx="160" ry="6" fill="#e5e7eb" opacity="0.6" />
        
        {/* Trailer Container Outline */}
        <polygon points="100,10 390,10 390,90 100,90" fill="#ffffff" stroke="#1b2a47" strokeWidth="2" />
        
        {/* Dynamic Fill Area */}
        <g clipPath="url(#trailer-clip)">
          <rect 
            x="101" y="11" 
            height="78" 
            width={fillWidth} 
            fill={getFillId(progress)}
            className="transition-all duration-700 ease-in-out" 
          />
        </g>

        {/* Base Text mapped strictly to the empty un-filled region */}
        <g clipPath={`url(#empty-clip-${progress})`}>
          <text 
            x="245" y="55" 
            fontFamily="sans-serif" 
            fontSize="14" 
            fontWeight="600" 
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {progress > 0 && progress < 100 ? (
              <>
                <tspan fill={getFillHex(progress)}>{100 - progress}% </tspan>
                <tspan fill="#64748b">Capacity Left</tspan>
              </>
            ) : (
              <tspan fill="#64748b">{progress === 0 ? 'No Load' : 'Fully Loaded'}</tspan>
            )}
          </text>
        </g>

        {/* Text mapped strictly to the filled colored region (rendered pure white!) */}
        {progress > 0 && (
          <g clipPath={`url(#fill-clip-${progress})`}>
            <text 
              x="245" y="55" 
              fontFamily="sans-serif" 
              fontSize="14" 
              fontWeight="600" 
              fill="#ffffff" 
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {progress > 0 && progress < 100 ? `${100 - progress}% Capacity Left` : 'Fully Loaded'}
            </text>
          </g>
        )}

        {/* Trailer Bottom Chassis */}
        <rect x="100" y="90" width="290" height="4" fill="#1b2a47" />
        
        {/* Trailer Details / Mudguards */}
        <rect x="180" y="94" width="25" height="4" fill="#1b2a47" rx="1" />
        
        {/* Truck Cabin (Custom Illustration Match) */}
        <g id="custom-cabin">
          {/* Main Cabin Body */}
          <path d="M 100 90 L 100 10 C 100 6 97 4 93 4 L 45 4 C 40 4 36 6 34 11 L 18 41 C 16 44 13 46 10 46 L 4 46 C 1 46 1 48 1 51 L 1 90 Z" fill="#eeb231" />
          
          {/* Dark Blue Trim under door */}
          <path d="M 100 90 L 100 68 L 75 68 A 22 22 0 0 0 43 90 Z" fill="#2c466b" />

          {/* Bumper */}
          <rect x="0" y="76" width="25" height="14" fill="#1b2a47" />

          {/* Cabin Outlines and Lines */}
          <line x1="75" y1="4" x2="75" y2="68" stroke="#1b2a47" strokeWidth="2" />
          <path d="M 43 90 A 22 22 0 0 1 75 68 L 100 68" fill="none" stroke="#1b2a47" strokeWidth="2" />
          <path d="M 38 90 A 27 27 0 0 1 75 62" fill="none" stroke="#1b2a47" strokeWidth="2" />
          <line x1="2" y1="60" x2="35" y2="60" stroke="#1b2a47" strokeWidth="2" />

          {/* Door Handle */}
          <rect x="52" y="55" width="10" height="4" rx="2" fill="none" stroke="#1b2a47" strokeWidth="2" />

          {/* Window */}
          <path d="M 25 45 L 35 15 C 36 12 38 10 42 10 L 65 10 C 68 10 70 12 70 15 L 70 45 Z" fill="#ffffff" stroke="#1b2a47" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Window Split */}
          <line x1="57" y1="10" x2="57" y2="45" stroke="#1b2a47" strokeWidth="1.5" />

          {/* Mirror */}
          <path d="M 18 40 L 10 40 C 8 40 8 38 8 35 L 8 20" fill="none" stroke="#1b2a47" strokeWidth="2" />
          <rect x="6" y="15" width="4" height="12" rx="2" fill="#1b2a47" />

          {/* Headlight */}
          <rect x="-2" y="68" width="6" height="10" rx="3" fill="#ef5350" />

          {/* Front Wheel */}
          <circle cx="65" cy="95" r="16" fill="#1b2a47" />
          <circle cx="65" cy="95" r="6" fill="#ffffff" />
          <circle cx="65" cy="95" r="2" fill="#1b2a47" />
        </g>

        {/* Trailer Wheels (Tri-axle match) */}
        <circle cx="300" cy="95" r="14" fill="#1b2a47" />
        <circle cx="300" cy="95" r="5" fill="#ffffff" />
        <circle cx="300" cy="95" r="1.5" fill="#1b2a47" />

        <circle cx="335" cy="95" r="14" fill="#1b2a47" />
        <circle cx="335" cy="95" r="5" fill="#ffffff" />
        <circle cx="335" cy="95" r="1.5" fill="#1b2a47" />

        <circle cx="370" cy="95" r="14" fill="#1b2a47" />
        <circle cx="370" cy="95" r="5" fill="#ffffff" />
        <circle cx="370" cy="95" r="1.5" fill="#1b2a47" />
      </svg>
    </div>
  );
};

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
        <CardTitle className="text-base leading-snug transition-colors duration-200 group-hover:text-primary group-focus-visible:text-primary">
          {trip.routeName}
        </CardTitle>
        <CardDescription className="mt-1.5 text-xs">{trip.client}</CardDescription>
      </div>
    </CardHeader>

    <CardContent className="space-y-2.5 p-4 pt-0">
      <MapView locations={trip.cardStops} height="132px" interactive={false} />

      <div className="grid grid-cols-3 gap-x-3 gap-y-2 rounded-xl border bg-background px-3 py-2">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.cardStopCount}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Stops</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.distance}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Distance</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.cardWeight}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Est. Weight</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.cardCnCount}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">CN Count</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{trip.cardPrqWeight}</p>
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
          <Label htmlFor={`assignment-change-reason-${type}`}>Reason for change</Label>
          <Textarea
            id={`assignment-change-reason-${type}`}
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

const AddSupportVehicleDialog = ({
  open,
  onOpenChange,
  options,
  selectedId,
  onSelect,
  onSubmit,
  maxVehicleSize,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Add Supporting Vehicle</DialogTitle>
        <DialogDescription>
          Add another vehicle that satisfies the area size cap of {maxVehicleSize}.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label>Eligible vehicles</Label>
        <Select value={selectedId} onValueChange={onSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select supporting vehicle" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {`${option.label} | ${option.number}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!selectedId}>
          Add Vehicle
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const RunningHoursApprovalDialog = ({
  open,
  onOpenChange,
  runningHoursUsed,
  runningHoursLimit,
  reason,
  onReasonChange,
  onSubmit,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Approve Running Hours Exception</DialogTitle>
        <DialogDescription>
          This route exceeds the allowed vehicle running hours. Record the exception reason before approval.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Running hours used: {runningHoursUsed}h | Allowed limit: {runningHoursLimit}h
      </div>

      <div className="space-y-2">
        <Label htmlFor="running-hours-approval-reason">Approval reason</Label>
        <Textarea
          id="running-hours-approval-reason"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          placeholder="Explain why the route can be approved despite exceeding running hours"
          className="min-h-[120px]"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!reason.trim()}>
          Approve Exception
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const RemoveCnDialog = ({ open, onOpenChange, stop, reason, onReasonChange, onSubmit }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Remove CN From Route</DialogTitle>
        <DialogDescription>
          {stop ? `Provide a reason before removing ${stop.id} from the recommended route.` : ''}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <Label htmlFor="remove-cn-reason">Reason for removal</Label>
        <Textarea
          id="remove-cn-reason"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          placeholder="Explain why this CN is being removed from the route."
          rows={4}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button disabled={!reason.trim()} onClick={onSubmit}>
          Remove CN
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const VehicleSourcingPanel = ({
  trip,
  onAutoAssign,
  onSelectNearbyVehicle,
  onSendBranchRequest,
  onRaiseMarketRequest,
}) => {
  const autoVehicle = trip.autoAssignedVehicle;
  const nearbyOptions = trip.nearbyBranchVehicleOptions || [];
  const selectedNearbyVehicle = nearbyOptions.find(
    (vehicle) => vehicle.id === trip.selectedNearbyVehicleId
  );

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader>
        <CardTitle>Vehicle Sourcing</CardTitle>
        <CardDescription>
          Review the system-picked vehicle first. If unavailable, request a nearby branch empty vehicle or raise a market request.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{autoVehicle?.source || 'Auto picked by system'}</p>
              <p className="mt-1 text-xl font-semibold">
                {autoVehicle?.available && autoVehicle?.vehicle
                  ? `${autoVehicle.vehicle.label} | ${autoVehicle.vehicle.number}`
                  : 'No auto-picked vehicle available'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Confidence: {autoVehicle?.confidence || 'N/A'}
              </p>
            </div>
            <Button
              variant={autoVehicle?.available ? 'default' : 'outline'}
              onClick={onAutoAssign}
              disabled={!autoVehicle?.available}
            >
              {autoVehicle?.available ? 'Use Auto Picked Vehicle' : 'Auto Pick Unavailable'}
            </Button>
          </div>

          {autoVehicle?.available && autoVehicle?.vehicle ? (
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Body Type</p>
                <p className="mt-1 font-semibold">{autoVehicle.vehicle.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Capacity</p>
                <p className="mt-1 font-semibold">{autoVehicle.vehicle.totalCapacity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remaining Capacity</p>
                <p className="mt-1 font-semibold">{autoVehicle.vehicle.remainingCapacity}</p>
              </div>
            </div>
          ) : null}
        </div>

        {!autoVehicle?.available ? (
          <div className="grid gap-5 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="rounded-2xl border p-4">
              <p className="text-sm font-medium">Nearby Branch Empty Vehicles</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Select an empty vehicle from the nearest branch and send a branch request.
              </p>

              <div className="mt-4 space-y-4">
                <Select
                  value={trip.selectedNearbyVehicleId || ''}
                  onValueChange={onSelectNearbyVehicle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nearby branch vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {nearbyOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {`${option.branch} | ${option.label} | ${option.number}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedNearbyVehicle ? (
                  <div className="rounded-xl border bg-muted/20 p-3 text-sm">
                    <p className="font-medium">{selectedNearbyVehicle.branch}</p>
                    <p className="mt-1 text-muted-foreground">
                      {selectedNearbyVehicle.label} | {selectedNearbyVehicle.number}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      ETA: {selectedNearbyVehicle.eta} | Capacity: {selectedNearbyVehicle.capacity}
                    </p>
                  </div>
                ) : null}

                <Button onClick={onSendBranchRequest} disabled={!trip.selectedNearbyVehicleId}>
                  Send Branch Request
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <p className="text-sm font-medium">Alternate Request Flow</p>
              <p className="mt-1 text-sm text-muted-foreground">
                If branch vehicles are unavailable or delayed, raise a market vehicle request.
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border bg-muted/20 p-3">
                  <p className="text-muted-foreground">Branch Request Status</p>
                  <p className="mt-1 font-semibold">{trip.branchVehicleRequestStatus || 'Not Sent'}</p>
                </div>
                <div className="rounded-xl border bg-muted/20 p-3">
                  <p className="text-muted-foreground">Market Request Status</p>
                  <p className="mt-1 font-semibold">{trip.marketVehicleRequestStatus || 'Not Raised'}</p>
                </div>
                <Button variant="outline" onClick={onRaiseMarketRequest}>
                  Raise Market Vehicle Request
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

const VehicleConstraintPanel = ({ trip, onOpenAddVehicleDialog, addVehicleDisabled }) => {
  if (!trip.vehicleConstraint) {
    return null;
  }

  const assignedVehicleCount = 1 + (trip.additionalVehicles?.length || 0);
  const requiredVehicleCount = trip.vehicleConstraint.requiredVehicleCount;
  const hasGap = assignedVehicleCount < requiredVehicleCount;
  const primaryViolatesConstraint =
    getVehicleSizeRank(trip.vehicle.label) > getVehicleSizeRank(trip.vehicleConstraint.maxVehicleSize);

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader>
        <CardTitle>Vehicle Size Constraint</CardTitle>
        <CardDescription>
          Master-data rules for {trip.vehicleConstraint.zoneName} require additional routing support.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="font-semibold text-amber-950">Multiple vehicles required</p>
              <p className="text-sm text-amber-900">{trip.vehicleConstraint.reason}</p>
              <p className="text-sm text-amber-900">
                Max allowed size: {trip.vehicleConstraint.maxVehicleSize} | Impacted areas:{' '}
                {trip.vehicleConstraint.impactedAreas.join(', ')}
              </p>
            </div>
            <div className="rounded-xl bg-white/80 px-4 py-3 text-sm">
              <p className="text-muted-foreground">Assigned / Required</p>
              <p className="mt-1 text-xl font-semibold">
                {assignedVehicleCount} / {requiredVehicleCount}
              </p>
            </div>
          </div>
        </div>

        {primaryViolatesConstraint ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Primary route vehicle {trip.vehicle.label} exceeds the allowed size limit for this zone.
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">Primary Vehicle</p>
            <p className="mt-2 text-lg font-semibold">
              {trip.vehicle.label} | {trip.vehicle.number}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Remaining capacity: {trip.vehicle.remainingCapacity}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Supporting Vehicles</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add more vehicles until the route satisfies the area size rule.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAddVehicleDialog}
                disabled={addVehicleDisabled}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Vehicle
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {trip.additionalVehicles?.length ? (
                trip.additionalVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="rounded-lg border bg-muted/20 px-3 py-3 text-sm">
                    <p className="font-medium">
                      {vehicle.label} | {vehicle.number}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Capacity: {vehicle.totalCapacity} | Remaining: {vehicle.remainingCapacity}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                  No supporting vehicles added yet.
                </div>
              )}
            </div>

            {hasGap ? (
              <p className="mt-3 text-sm font-medium text-amber-700">
                {requiredVehicleCount - assignedVehicleCount} more vehicle(s) still required for this route.
              </p>
            ) : (
              <p className="mt-3 text-sm font-medium text-emerald-700">
                Vehicle constraint satisfied for this route.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TripReconciliationTable = ({ trips, onCloseTrip }) => (
  <Card className="border-border/80 shadow-sm">
    <CardHeader>
      <CardTitle>Trip Reconciliation & Closure</CardTitle>
      <CardDescription>
        Review DRS, fulfilment variance, delivery exceptions, and payment actions before closure.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DRS Number</TableHead>
              <TableHead>Vehicle Number</TableHead>
              <TableHead>CN Planned vs Delivered</TableHead>
              <TableHead>PRQ Planned vs Picked</TableHead>
              <TableHead>NRD / Partial Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Action</TableHead>
              <TableHead className="text-right">Closure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">{trip.reconciliation.drsNumber}</TableCell>
                <TableCell>{trip.vehicle.number}</TableCell>
                <TableCell>
                  {trip.reconciliation.cnPlanned} / {trip.reconciliation.cnDelivered}
                </TableCell>
                <TableCell>
                  {trip.reconciliation.prqPlanned} / {trip.reconciliation.prqPicked}
                </TableCell>
                <TableCell>
                  {trip.reconciliation.nrdCount} NRD / {trip.reconciliation.partialDeliveryCount} Partial
                </TableCell>
                <TableCell>{trip.reconciliation.status}</TableCell>
                <TableCell>{trip.reconciliation.paymentAction}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={trip.reconciliation.closureStatus === 'Closed' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => onCloseTrip(trip.id)}
                    disabled={trip.reconciliation.closureStatus === 'Closed'}
                  >
                    {trip.reconciliation.closureStatus === 'Closed' ? 'Closed' : 'Close Trip'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const TripRouteDetail = ({
  trip,
  draggingStopId,
  dragOverStopId,
  onBack,
  onApprove,
  onDeleteStop,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDropStop,
  onOpenDriverDialog,
  onOpenVehicleDialog,
  onAutoAssignVehicle,
  onSelectNearbyVehicle,
  onSendBranchVehicleRequest,
  onRaiseMarketVehicleRequest,
  onOpenAddVehicleDialog,
  addVehicleDisabled,
}) => {
  const visibleStops = trip.cardStops || trip.stops;
  const stopsCount = visibleStops.length;
  const runningHoursExceeded = trip.runningHoursApprovalRequired;
  const routeSummaryMetrics = [
    { label: 'Stops', value: stopsCount },
    { label: 'Est. Time', value: trip.estimatedTime },
    { label: 'Travel', value: trip.travelTime },
    { label: 'Service', value: trip.serviceTime },
    { label: 'Distance', value: trip.distance },
    { label: 'Running', value: `${trip.runningHoursUsed}h`, helper: `Limit ${trip.runningHoursLimit}h` },
  ];

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <div className="border-b bg-muted/10 px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{trip.routeName}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {trip.consignmentCount} Consignments | {trip.boxes} Boxes | {trip.totalWeight}
              </p>
              {trip.filterLabel ? (
                <p className="mt-2 text-sm font-medium text-primary">{trip.filterLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={onApprove}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              {trip.status === 'Approved'
                ? 'Approved'
                : runningHoursExceeded
                  ? 'Approve with Exception'
                  : 'Approve'}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="space-y-5 p-5">
        {runningHoursExceeded ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-950">Exceeded vehicle running hours</p>
                  <p className="mt-1 text-sm text-amber-900">
                    Route is at {trip.runningHoursUsed}h against an allowed limit of {trip.runningHoursLimit}h. Approval requires an exception note.
                  </p>
                </div>
              </div>
              {trip.runningHoursApprovalReason ? (
                <div className="rounded-xl border bg-white/80 px-4 py-3 text-sm">
                  <p className="text-muted-foreground">Recorded override reason</p>
                  <p className="mt-1 font-medium">{trip.runningHoursApprovalReason}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <Card className="border-border/80 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Route Snapshot</CardTitle>
            <CardDescription>Approval summary, timing split, and operating limits at a glance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {routeSummaryMetrics.map((metric) => (
                <DetailMetric
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  helper={metric.helper}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="route-plan" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="route-plan">Route Plan</TabsTrigger>
            <TabsTrigger value="vehicle-strategy">Vehicle Strategy</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="route-plan" className="space-y-4 outline-none">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1.15fr),minmax(360px,0.85fr)]">
              <Card className="border-border/80 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-xl">Delivery Stops</CardTitle>
                      <CardDescription>
                        Drag to resequence the route and remove unnecessary touchpoints.
                      </CardDescription>
                    </div>
                    <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                      {stopsCount} active touchpoints
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
                    {visibleStops.map((stop, index) => {
                      const isDragging = draggingStopId === stop.id;
                      const isDragTarget = dragOverStopId === stop.id && draggingStopId !== stop.id;

                      return (
                        <div
                          key={stop.id}
                          draggable
                          onDragStart={() => onDragStart(stop.id)}
                          onDragEnd={onDragEnd}
                          onDragOver={(event) => event.preventDefault()}
                          onDragEnter={() => onDragEnter(stop.id)}
                          onDrop={(event) => {
                            event.preventDefault();
                            onDropStop(stop.id);
                          }}
                          className={`rounded-2xl border bg-background p-3 shadow-sm transition ${
                            isDragging ? 'opacity-60 ring-2 ring-primary/30' : ''
                          } ${isDragTarget ? 'border-primary/60 bg-primary/5' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                              {index + 1}
                            </div>
                            <div className="mt-1 rounded-md border bg-muted/40 p-1.5 text-muted-foreground">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                  <p className="font-semibold">{stop.id}</p>
                                  <p className="truncate text-sm text-muted-foreground">{stop.address}</p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => onDeleteStop(stop)}>
                                  <Trash2 className="mr-1.5 h-4 w-4" />
                                  Delete
                                </Button>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                                  {stop.type}
                                </span>
                                <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                                  {stop.client}
                                </span>
                                <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                                  {stop.timeWindow}
                                </span>
                                <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                                  {stop.cns} CNs | {stop.boxes} Boxes | {stop.weight}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Map</CardTitle>
                  <CardDescription>
                    View the current route sequence alongside the stops list.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MapView locations={visibleStops} height="640px" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vehicle-strategy" className="space-y-4 outline-none">
            <VehicleConstraintPanel
              trip={trip}
              onOpenAddVehicleDialog={onOpenAddVehicleDialog}
              addVehicleDisabled={addVehicleDisabled}
            />

            <VehicleSourcingPanel
              trip={trip}
              onAutoAssign={onAutoAssignVehicle}
              onSelectNearbyVehicle={onSelectNearbyVehicle}
              onSendBranchRequest={onSendBranchVehicleRequest}
              onRaiseMarketRequest={onRaiseMarketVehicleRequest}
            />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4 outline-none">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold">Driver & Vehicle Assignment</h3>
                <p className="text-sm text-muted-foreground">
                  Update operator, driver, and truck decisions without leaving the route.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={onOpenDriverDialog}>
                  <PencilLine className="mr-2 h-4 w-4" />
                  Change Driver
                </Button>
                <Button variant="outline" onClick={onOpenVehicleDialog}>
                  <PencilLine className="mr-2 h-4 w-4" />
                  Change Truck
                </Button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="border-border/80 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle>Operator & Driver</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">Operator</p>
                    <p className="mt-1 text-lg font-semibold">{trip.operatorContact?.name || 'Unassigned'}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{trip.operatorContact?.phone || 'N/A'}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{trip.operatorContact?.branch || 'N/A'}</p>
                  </div>
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">Driver</p>
                    <p className="mt-1 text-lg font-semibold">{trip.driver.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{trip.driver.phone}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {trip.driver.successRate} success | {trip.driver.branch}
                    </p>
                  </div>
                  {trip.driverChangeReason ? (
                    <div className="rounded-xl border bg-muted/20 p-3 md:col-span-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reason for driver change</p>
                      <p className="mt-2 text-sm">{trip.driverChangeReason}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Vehicle Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border bg-muted/20 p-4">
                      <p className="text-sm text-muted-foreground">Vehicle Number</p>
                      <p className="mt-1 text-lg font-semibold">{trip.vehicle.number}</p>
                    </div>
                    <div className="rounded-xl border bg-muted/20 p-4">
                      <p className="text-sm text-muted-foreground">Vehicle Type</p>
                      <p className="mt-1 text-lg font-semibold">{trip.vehicle.label}</p>
                    </div>
                    <div className="rounded-xl border bg-muted/20 p-4">
                      <p className="text-sm text-muted-foreground">Body Type</p>
                      <p className="mt-1 font-medium">{trip.vehicle.type}</p>
                    </div>
                    <div className="rounded-xl border bg-muted/20 p-4">
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
                        <p className="text-muted-foreground">Utilized</p>
                        <p className="mt-1 font-semibold">{trip.vehicle.utilizedCapacity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const mockOnRouteVehicles = (() => {
  const base = [
    {
    id: "OR-01",
    routeName: "Andheri to Vashi Link",
    vehicleNumber: "MH-02-CD-5566",
    driverName: "Amit Sharma",
    routeDecided: "45 km",
    routeTraveled: "32 km",
    cnPlanned: 120,
    cnDelivered: 85,
    prqPlanned: 15,
    prqPicked: 12,
    noOfStops: 8,
    stopsCompleted: 6,
    exceptionRaised: "Traffic Delay at Toll Naka",
    gateOutTime: "10:15 AM",
    podUploadCount: "4/6",
    cashCollectedActual: "₹ 12,500",
    cashCollectedProjected: "₹ 15,000",
    plannedLocations: [
      { id: "L1", type: "PRQ", address: "Andheri", name: "Andheri", lat: 19.1136, lng: 72.8697 },
      { id: "L1_mid", type: "WAYPOINT", address: "Kurla", name: "Kurla", lat: 19.0728, lng: 72.8826 },
      { id: "L2", type: "CN", address: "Vashi", name: "Vashi", lat: 19.0770, lng: 72.9989 }
    ],
    takenLocations: [
      { id: "L1", type: "PRQ", address: "Andheri", name: "Andheri", lat: 19.1136, lng: 72.8697 },
      { id: "L1_mid", type: "WAYPOINT", address: "Kurla", name: "Kurla", lat: 19.0728, lng: 72.8826 }
    ]
  },
  {
    id: "OR-02",
    routeName: "Bandra to Thane Express",
    vehicleNumber: "MH-47-XY-1234",
    driverName: "Rahul Desai",
    routeDecided: "38 km",
    routeTraveled: "15 km",
    cnPlanned: 90,
    cnDelivered: 40,
    prqPlanned: 5,
    prqPicked: 5,
    noOfStops: 5,
    stopsCompleted: 3,
    exceptionRaised: "",
    gateOutTime: "08:30 AM",
    podUploadCount: "3/3",
    cashCollectedActual: "₹ 8,200",
    cashCollectedProjected: "₹ 8,200",
    plannedLocations: [
      { id: "L3", type: "PRQ", address: "Bandra", name: "Bandra", lat: 19.0596, lng: 72.8295 },
      { id: "L4", type: "CN", address: "Sion", name: "Sion", lat: 19.0390, lng: 72.8619 },
      { id: "L5", type: "CN", address: "Thane", name: "Thane", lat: 19.2183, lng: 72.9781 }
    ],
    takenLocations: [
      { id: "L3", type: "PRQ", address: "Bandra", name: "Bandra", lat: 19.0596, lng: 72.8295 },
      { id: "L4", type: "CN", address: "Sion", name: "Sion", lat: 19.0390, lng: 72.8619 }
    ]
  },
  {
    id: "OR-03",
    routeName: "Navi Mumbai Industrial Transit",
    vehicleNumber: "MH-04-AB-9876",
    driverName: "Sanjay Patil",
    routeDecided: "55 km",
    routeTraveled: "50 km",
    cnPlanned: 150,
    cnDelivered: 145,
    prqPlanned: 20,
    prqPicked: 18,
    noOfStops: 12,
    stopsCompleted: 11,
    exceptionRaised: "Customer Unavailable",
    gateOutTime: "06:45 AM",
    podUploadCount: "9/11",
    cashCollectedActual: "₹ 34,000",
    cashCollectedProjected: "₹ 40,000",
    plannedLocations: [
      { id: "L6", type: "PRQ", address: "Turbhe", name: "Turbhe", lat: 19.0700, lng: 73.0188 },
      { id: "L7", type: "CN", address: "Mahape", name: "Mahape", lat: 19.1026, lng: 73.0150 },
      { id: "L8", type: "PRQ", address: "Rabale", name: "Rabale", lat: 19.1419, lng: 73.0039 }
    ],
    takenLocations: [
      { id: "L6", type: "PRQ", address: "Turbhe", name: "Turbhe", lat: 19.0700, lng: 73.0188 },
      { id: "L7_mid", type: "WAYPOINT", address: "Kopar Khairane", name: "Kopar Khairane", lat: 19.1030, lng: 73.0080 }
    ]
  }
  ];

  const extended = [...base];
  for (let i = 0; i < 6; i++) {
    const parent = base[i % 3];
    
    // Create a random offset between -0.15 and 0.15 for organic dispersal
    const offsetLat = (Math.random() * 0.3) - 0.15;
    const offsetLng = (Math.random() * 0.3) - 0.15;
    
    const clone = JSON.parse(JSON.stringify(parent));
    
    clone.id = `OR-0${i + 4}`;
    clone.routeName = `${parent.routeName} - Run ${Math.floor(i / 3) + 2}`;
    clone.vehicleNumber = `MH-${10 + i}-XX-${1000 + i}`;
    
    clone.plannedLocations.forEach(loc => {
      loc.id += `_${i}`;
      loc.lat += offsetLat;
      loc.lng += offsetLng;
    });
    clone.takenLocations.forEach(loc => {
      loc.id += `_${i}`;
      loc.lat += offsetLat;
      loc.lng += offsetLng;
    });
    
    extended.push(clone);
  }

  return extended;
})();

const SmartTripCreationPage = () => {
  const navigate = useNavigate();
  const { routeId } = useParams();
  const [searchParams] = useSearchParams();

  const [trips, setTrips] = useState(() => cloneTrips());
  const [smartTripTab, setSmartTripTab] = useState('recommended');
  const [selectedOnRouteId, setSelectedOnRouteId] = useState(null);
  const [selectedLoadingCartId, setSelectedLoadingCartId] = useState(null);
  const [loadingBayPage, setLoadingBayPage] = useState(1);
  const [loadingBayPageSize, setLoadingBayPageSize] = useState('10');
  const [draggingStopId, setDraggingStopId] = useState('');
  const [dragOverStopId, setDragOverStopId] = useState('');
  const [changeDialog, setChangeDialog] = useState({
    open: false,
    type: 'driver',
    selectedId: '',
    reason: '',
  });
  const [removeStopDialog, setRemoveStopDialog] = useState({
    open: false,
    stop: null,
    reason: '',
  });
  const [runningHoursDialogOpen, setRunningHoursDialogOpen] = useState(false);
  const [runningHoursReason, setRunningHoursReason] = useState('');
  const [addVehicleDialogOpen, setAddVehicleDialogOpen] = useState(false);
  const [selectedAdditionalVehicleId, setSelectedAdditionalVehicleId] = useState('');

  const smartTripDrivers = useMemo(() => getSmartTripDrivers(), []);
  const smartTripVehicles = useMemo(() => getSmartTripVehicles(), []);
  const tripView = searchParams.get('tripView') || 'all';
  const source = searchParams.get('source') || 'smart-trip';

  const displayedTrips = useMemo(
    () =>
      trips
        .map((trip) => summarizeTripForView(trip, tripView))
        .filter((trip) => trip.cardStops.length > 0),
    [tripView, trips]
  );

  const tripSummary = useMemo(
    () => ({
      totalCN: displayedTrips.reduce((sum, trip) => sum + trip.cardCnCount, 0),
      totalPRQ: displayedTrips.reduce((sum, trip) => sum + trip.cardPrqCount, 0),
      totalTouchPoints: displayedTrips.reduce((sum, trip) => sum + trip.cardStopCount, 0),
      totalRoutes: displayedTrips.length,
      routesPlanned: displayedTrips.filter((trip) => trip.status.toLowerCase().includes('planned')).length,
      routesPending: displayedTrips.filter((trip) => trip.status.toLowerCase().includes('pending')).length,
    }),
    [displayedTrips]
  );

  const activeTrip = useMemo(() => {
    const selectedTrip = trips.find((trip) => trip.id === routeId);

    if (!selectedTrip) {
      return null;
    }

    const summarizedTrip = summarizeTripForView(selectedTrip, tripView);
    const filterLabel =
      tripView === 'prq'
        ? 'Showing PRQ-only route plan'
        : tripView === 'cn'
          ? 'Showing CN-only route plan'
          : '';

    return {
      ...summarizedTrip,
      filterLabel,
    };
  }, [routeId, tripView, trips]);

  const reconciliationTrips = useMemo(
    () =>
      displayedTrips
        .map((displayedTrip) => trips.find((trip) => trip.id === displayedTrip.id))
        .filter(Boolean),
    [displayedTrips, trips]
  );

  const loadingProgressSummary = useMemo(
    () => ({
      totalVehicles: smartTripLoadingProgress.length,
      completed: smartTripLoadingProgress.filter((vehicle) => vehicle.progress === 100).length,
      inProgress: smartTripLoadingProgress.filter(
        (vehicle) => vehicle.progress > 0 && vehicle.progress < 100
      ).length,
      pending: smartTripLoadingProgress.filter((vehicle) => vehicle.progress === 0).length,
    }),
    []
  );

  const visibleLoadingProgress = useMemo(
    () =>
      selectedLoadingCartId
        ? smartTripLoadingProgress.filter((vehicle) => vehicle.id === selectedLoadingCartId)
        : smartTripLoadingProgress,
    [selectedLoadingCartId]
  );

  const visibleOnRouteVehicles = useMemo(
    () =>
      selectedOnRouteId
        ? smartTripOnRouteVehicles.filter((vehicle) => vehicle.id === selectedOnRouteId)
        : smartTripOnRouteVehicles,
    [selectedOnRouteId]
  );

  const onRouteMapRoutes = useMemo(
    () =>
      visibleOnRouteVehicles.map((vehicle) => ({
        plannedLocations: vehicle.plannedLocations,
        takenLocations: vehicle.takenLocations,
        locations: vehicle.locations,
        color: smartTripOnRouteVehicleColorById[vehicle.id] || '#2563eb',
      })),
    [visibleOnRouteVehicles]
  );

  const activeLoadingBay = useMemo(
    () =>
      selectedLoadingCartId
        ? smartTripLoadingProgress.find((vehicle) => vehicle.id === selectedLoadingCartId) || null
        : null,
    [selectedLoadingCartId]
  );

  const activeCartDetails = useMemo(() => {
    if (!selectedLoadingCartId) return [];
    const rows = [];
    const seedId = selectedLoadingCartId.split('-')[1] || '1';
    const customers = ['Amazon', 'Flipkart', 'Reliance Retail', 'Croma', 'Myntra'];
    const locations = [
      'Fortis Hospital, Vasant Kunj, New Delhi, 110025',
      'DLF Cyber City, Gurugram, Haryana, 122002',
      'Sector 62, Noida, Uttar Pradesh, 201301',
      'Okhla Phase 1, New Delhi, 110020',
      'Udyog Vihar, Gurugram, Haryana, 122016',
    ];

    for (let i = 0; i < 10; i += 1) {
      rows.push({
        id: `row-${seedId}-${i}`,
        cnNumber: `CN-10${seedId}${i}75`,
        cnDate: `05-01-202${(i % 3) + 4}`,
        invoice: `INV-10${seedId}CS${275 + i}`,
        extraInvoiceCount: (i % 3) + 1,
        customer: customers[i % customers.length],
        deliveryLocation: locations[i % locations.length],
        boxCount: `${80 + i * 5} Boxes`,
        chargeableWeight: `${40 + i * 3} KG`,
        actualWeight: `${38 + i * 2} KG`,
        status: i % 4 === 0 ? 'Scanned' : 'Pending',
      });
    }
    return rows;
  }, [selectedLoadingCartId]);

  useEffect(() => {
    setLoadingBayPage(1);
  }, [selectedLoadingCartId, loadingBayPageSize]);

  const loadingBayTotalPages = useMemo(() => {
    const pageSize = Number(loadingBayPageSize) || 10;
    return Math.max(1, Math.ceil(activeCartDetails.length / pageSize));
  }, [activeCartDetails.length, loadingBayPageSize]);

  useEffect(() => {
    setLoadingBayPage((currentPage) => Math.min(currentPage, loadingBayTotalPages));
  }, [loadingBayTotalPages]);

  const paginatedLoadingBayRows = useMemo(() => {
    const pageSize = Number(loadingBayPageSize) || 10;
    const startIndex = (loadingBayPage - 1) * pageSize;
    return activeCartDetails.slice(startIndex, startIndex + pageSize);
  }, [activeCartDetails, loadingBayPage, loadingBayPageSize]);

  const availableAdditionalVehicles = useMemo(() => {
    if (!activeTrip?.vehicleConstraint) {
      return [];
    }

    const maxRank = getVehicleSizeRank(activeTrip.vehicleConstraint.maxVehicleSize);
    const usedVehicleIds = new Set([
      activeTrip.vehicle.id,
      ...(activeTrip.additionalVehicles || []).map((vehicle) => vehicle.id),
    ]);

    return smartTripVehicles.filter(
      (vehicle) =>
        !usedVehicleIds.has(vehicle.id) && getVehicleSizeRank(vehicle.label) <= maxRank
    );
  }, [activeTrip, smartTripVehicles]);

  const updateTrip = (tripId, updater) => {
    setTrips((currentTrips) =>
      currentTrips.map((trip) => (trip.id === tripId ? updater(trip) : trip))
    );
  };

  const finalizeApproval = (tripId, overrideReason = '') => {
    updateTrip(tripId, (trip) => ({
      ...trip,
      status: 'Approved',
      runningHoursApprovalReason: overrideReason || trip.runningHoursApprovalReason || '',
    }));
  };

  const handleApprove = (tripId) => {
    const trip = trips.find((item) => item.id === tripId);
    if (!trip) return;

    if (trip.runningHoursApprovalRequired && !trip.runningHoursApprovalReason) {
      setRunningHoursReason('');
      setRunningHoursDialogOpen(true);
      return;
    }

    finalizeApproval(tripId);
    toast.success('Route approved successfully.');
  };

  const handleApproveRunningHoursException = () => {
    if (!activeTrip || !runningHoursReason.trim()) return;

    finalizeApproval(activeTrip.id, runningHoursReason.trim());
    setRunningHoursDialogOpen(false);
    setRunningHoursReason('');
    toast.success('Route approved with running-hours exception.');
  };

  const removeStopFromTrip = (stopId, removalReason = '') => {
    if (!activeTrip) return;

    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      stops: trip.stops.filter((stop) => stop.id !== stopId),
      removedStopLogs: removalReason
        ? [
            ...(trip.removedStopLogs || []),
            {
              stopId,
              reason: removalReason,
              removedAt: new Date().toISOString(),
            },
          ]
        : trip.removedStopLogs,
    }));
  };

  const handleDeleteStop = (stop) => {
    if (!stop) return;

    if (String(stop.id || '').startsWith('CN')) {
      setRemoveStopDialog({
        open: true,
        stop,
        reason: '',
      });
      return;
    }

    removeStopFromTrip(stop.id);

    toast.success('Touchpoint deleted from route.');
  };

  const handleConfirmCnRemoval = () => {
    if (!removeStopDialog.stop || !removeStopDialog.reason.trim()) return;

    removeStopFromTrip(removeStopDialog.stop.id, removeStopDialog.reason.trim());
    setRemoveStopDialog({
      open: false,
      stop: null,
      reason: '',
    });
    toast.success('CN removed from route.');
  };

  const reorderVisibleStops = (trip, sourceStopId, targetStopId) => {
    const visibleStops = trip.stops.filter((stop) => matchesTripView(stop, tripView));
    const sourceIndex = visibleStops.findIndex((stop) => stop.id === sourceStopId);
    const targetIndex = visibleStops.findIndex((stop) => stop.id === targetStopId);

    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
      return trip;
    }

    const reorderedVisibleStops = [...visibleStops];
    const [movedStop] = reorderedVisibleStops.splice(sourceIndex, 1);
    reorderedVisibleStops.splice(targetIndex, 0, movedStop);

    let visibleCursor = 0;

    return {
      ...trip,
      stops: trip.stops.map((stop) =>
        matchesTripView(stop, tripView) ? reorderedVisibleStops[visibleCursor++] : stop
      ),
    };
  };

  const handleDropStop = (targetStopId) => {
    if (!activeTrip || !draggingStopId) return;

    updateTrip(activeTrip.id, (trip) => reorderVisibleStops(trip, draggingStopId, targetStopId));
    setDraggingStopId('');
    setDragOverStopId('');
    toast.success('Route sequence updated.');
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

  const handleUseAutoAssignedVehicle = () => {
    if (!activeTrip?.autoAssignedVehicle?.available || !activeTrip.autoAssignedVehicle.vehicle) return;

    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      vehicle: trip.autoAssignedVehicle.vehicle,
      branchVehicleRequestStatus: 'Not Sent',
      marketVehicleRequestStatus: 'Not Raised',
    }));

    toast.success('Auto-picked vehicle assigned to the route.');
  };

  const handleSelectNearbyVehicle = (vehicleId) => {
    if (!activeTrip) return;

    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      selectedNearbyVehicleId: vehicleId,
    }));
  };

  const handleSendBranchVehicleRequest = () => {
    if (!activeTrip?.selectedNearbyVehicleId) return;

    const branchVehicle = activeTrip.nearbyBranchVehicleOptions?.find(
      (vehicle) => vehicle.id === activeTrip.selectedNearbyVehicleId
    );

    if (!branchVehicle) return;

    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      vehicle: {
        ...trip.vehicle,
        label: branchVehicle.label,
        number: branchVehicle.number,
        totalCapacity: branchVehicle.capacity,
        type: 'Branch Empty Vehicle',
      },
      branchVehicleRequestStatus: `Request sent to ${branchVehicle.branch}`,
      marketVehicleRequestStatus: 'Not Raised',
    }));

    toast.success(`Branch vehicle request sent to ${branchVehicle.branch}.`);
  };

  const handleRaiseMarketVehicleRequest = () => {
    if (!activeTrip) return;

    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      marketVehicleRequestStatus: 'Market request raised',
      branchVehicleRequestStatus:
        trip.branchVehicleRequestStatus === 'Not Sent'
          ? 'Skipped for market sourcing'
          : trip.branchVehicleRequestStatus,
    }));

    toast.success('Market vehicle request raised.');
  };

  const handleAddSupportVehicle = () => {
    if (!activeTrip || !selectedAdditionalVehicleId) return;

    const selectedVehicle = smartTripVehicles.find(
      (vehicle) => vehicle.id === selectedAdditionalVehicleId
    );

    if (!selectedVehicle) return;

    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      additionalVehicles: [...(trip.additionalVehicles || []), selectedVehicle],
    }));

    setAddVehicleDialogOpen(false);
    setSelectedAdditionalVehicleId('');
    toast.success('Supporting vehicle added to the route.');
  };

  const handleCloseTrip = (tripId) => {
    updateTrip(tripId, (trip) => ({
      ...trip,
      reconciliation: {
        ...trip.reconciliation,
        closureStatus: 'Closed',
        status: 'Closed',
        paymentAction: 'Payment Released',
      },
    }));

    toast.success('Trip closed successfully.');
  };

  const addVehicleDisabled =
    !activeTrip?.vehicleConstraint ||
    availableAdditionalVehicles.length === 0 ||
    (1 + (activeTrip.additionalVehicles?.length || 0)) >= activeTrip.vehicleConstraint.requiredVehicleCount;

  return (
    <div className="om-container space-y-6 py-8">
      <BreadcrumbNav />

      <Tabs value={smartTripTab} onValueChange={setSmartTripTab} className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TabsList className="w-full justify-start overflow-x-auto md:w-auto">
            <TabsTrigger value="recommended">Recommended Routes</TabsTrigger>
            <TabsTrigger value="loading-progress">Loading Progress</TabsTrigger>
            <TabsTrigger value="on-route">On-route vehicle</TabsTrigger>
            <TabsTrigger value="reconciliation">Trip Reconciliation & Closure</TabsTrigger>
          </TabsList>

          <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            {source === 'first-mile'
              ? 'First Mile PRQ routing'
              : source === 'last-mile'
                ? 'Last Mile CN routing'
                : `${displayedTrips.length} active routes`}
          </div>
        </div>

        <TabsContent value="recommended" className="outline-none">
          {activeTrip ? (
            <TripRouteDetail
              trip={activeTrip}
              draggingStopId={draggingStopId}
              dragOverStopId={dragOverStopId}
              onBack={() => navigate(`/smart-trip-creation?source=${source}&tripView=${tripView}`)}
              onApprove={() => handleApprove(activeTrip.id)}
              onDeleteStop={handleDeleteStop}
              onDragStart={setDraggingStopId}
              onDragEnd={() => {
                setDraggingStopId('');
                setDragOverStopId('');
              }}
              onDragEnter={setDragOverStopId}
              onDropStop={handleDropStop}
              onOpenDriverDialog={() => openChangeDialog('driver')}
              onOpenVehicleDialog={() => openChangeDialog('vehicle')}
              onAutoAssignVehicle={handleUseAutoAssignedVehicle}
              onSelectNearbyVehicle={handleSelectNearbyVehicle}
              onSendBranchVehicleRequest={handleSendBranchVehicleRequest}
              onRaiseMarketVehicleRequest={handleRaiseMarketVehicleRequest}
              onOpenAddVehicleDialog={() => setAddVehicleDialogOpen(true)}
              addVehicleDisabled={addVehicleDisabled}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">Recommended Smart Routes</h2>
                  <p className="text-muted-foreground">
                    Review predefined routes, compare load balance, and open a route to fine-tune sequence, approvals, and vehicle assignment.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                <DetailMetric label="Total CN" value={tripSummary.totalCN} />
                <DetailMetric label="Total PRQ" value={tripSummary.totalPRQ} />
                <DetailMetric label="Touch Points" value={tripSummary.totalTouchPoints} />
                <DetailMetric label="Total Routes" value={tripSummary.totalRoutes} />
                <DetailMetric label="Routes Planned" value={tripSummary.routesPlanned} />
                <DetailMetric label="Routing Pending" value={tripSummary.routesPending} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayedTrips.map((trip) => (
                  <RouteCard
                    key={trip.id}
                    trip={trip}
                    onOpen={() => {
                      setSmartTripTab('recommended');
                      navigate(`/smart-trip-creation/${trip.id}?source=${source}&tripView=${tripView}`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="loading-progress" className="outline-none space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">{selectedLoadingCartId ? "Bay Operational Details" : "Active Loading Bay"}</h2>
              <p className="text-muted-foreground">
                {selectedLoadingCartId ? "Detailed scanning and invoice breakdown for the selected operations vehicle." : "Monitor real-time vehicle loading status, capacity utilization, and bay assignments."}
              </p>
            </div>
          </div>

          {!selectedLoadingCartId && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailMetric label="Total Vehicle" value={loadingProgressSummary.totalVehicles} />
              <DetailMetric label="Loading Completed" value={loadingProgressSummary.completed} />
              <DetailMetric label="Loading In progress" value={loadingProgressSummary.inProgress} />
              <DetailMetric label="Loading Pending" value={loadingProgressSummary.pending} />
            </div>
          )}

          {!selectedLoadingCartId && (
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {visibleLoadingProgress.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer border-border/80 shadow-sm transition-colors hover:border-primary/50"
                onClick={() => setSelectedLoadingCartId(item.id)}
              >
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-8 border-b border-dashed pb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex bg-emerald-50 text-emerald-600 h-11 w-11 items-center justify-center rounded-full shrink-0">
                        <Package className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Scanned CNs</p>
                        <p className="text-xl font-bold mt-0.5">{item.scannedCNs}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex bg-blue-50 text-blue-600 h-11 w-11 items-center justify-center rounded-full shrink-0">
                        <Box className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Remaining CNs</p>
                        <p className="text-xl font-bold mt-0.5">{item.remainingCNs}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-medium text-muted-foreground">{item.vehicleModel}</p>
                      <div className="flex items-center gap-1.5 rounded border px-2 py-1 shrink-0 bg-background shadow-xs text-xs">
                        <Box className="h-3.5 w-3.5 text-blue-500" />
                        <span className="font-medium text-muted-foreground">{item.truckSize}</span>
                        <span className="text-muted-foreground">| {item.truckDimensions}</span>
                      </div>
                    </div>
                    
                    <div className="relative py-4 flex justify-center">
                      <TruckProgressFill progress={item.progress} />
                    </div>
              
                    <div className="flex items-end gap-4">
                      <div className="shrink-0 space-y-0.5">
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="text-sm font-semibold">{item.capacity}</p>
                      </div>
                      <div className="flex-1 flex items-center gap-3 pb-1">
                        <Progress value={item.progress} className="h-2 w-full" />
                        <span className="text-sm text-muted-foreground font-medium shrink-0">{item.progress}%</span>
                      </div>
                    </div>
                  </div>
              
                  <div className="grid grid-cols-3 gap-y-5 gap-x-3 border-t border-dashed pt-6">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Driver Name</p>
                      <p className="text-sm font-medium">{item.driverName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="text-sm font-medium">{item.successRate}</p>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Driver Contact</p>
                      <p className="flex items-center gap-1.5 text-sm font-medium truncate">
                        <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{item.driverContact}</span>
                      </p>
                    </div>
              
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Dock Name</p>
                      <p className="text-sm font-medium">{item.dockName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Loader Name</p>
                      <p className="text-sm font-medium">{item.loaderName}</p>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Loader Contact</p>
                      <p className="flex items-center gap-1.5 text-sm font-medium truncate">
                        <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{item.loaderContact}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Start Time</p>
                      <p className="text-sm font-medium">{item.loadingStartTime}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Last Scanned CN</p>
                      <p className="text-sm font-medium truncate">{item.lastScannedBox}</p>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Scan Time</p>
                      <p className="text-sm font-medium truncate">{item.lastScannedTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {selectedLoadingCartId && (
            <BayOperationalDetailsView
              activeLoadingBay={activeLoadingBay}
              paginatedRows={paginatedLoadingBayRows}
              loadingBayPage={loadingBayPage}
              loadingBayPageSize={loadingBayPageSize}
              loadingBayTotalPages={loadingBayTotalPages}
              onBack={() => setSelectedLoadingCartId(null)}
              onPageChange={setLoadingBayPage}
              onPageSizeChange={setLoadingBayPageSize}
              progressArtwork={
                <div className="flex justify-center">
                  <TruckProgressFill progress={activeLoadingBay?.progress || 0} />
                </div>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="on-route" className="outline-none space-y-4">
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-4 xl:col-span-1 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedOnRouteId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mb-2 bg-muted/30"
                  onClick={() => setSelectedOnRouteId(null)}
                >
                  &larr; Back to Global Fleet View
                </Button>
              )}
              {visibleOnRouteVehicles.map((item) => {
                const cardColor = smartTripOnRouteVehicleColorById[item.id] || '#2563eb';

                return (
                  <Card 
                    key={item.id} 
                    className="border-border/80 shadow-sm flex flex-col relative overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedOnRouteId(item.id)}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: cardColor }}></div>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-base">{item.routeName}</CardTitle>
                      <CardDescription className="text-xs">{item.vehicleNumber} | Driver: {item.driverName}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 px-4 pb-4">
                      <div className="grid grid-cols-2 gap-2 text-xs h-full content-start">
                        <div className="rounded-lg border bg-muted/20 px-2 py-1.5">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">Distance</p>
                          <p className="mt-0.5 font-semibold">{item.routeTraveled} / {item.routeDecided}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-2 py-1.5">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">Exception</p>
                          <p className="mt-0.5 font-semibold text-amber-600 truncate">{item.exceptionRaised || 'None'}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-2 py-1.5">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">CN Status</p>
                          <p className="mt-0.5 font-semibold">{item.cnDelivered} / {item.cnPlanned}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-2 py-1.5">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">PRQ Status</p>
                          <p className="mt-0.5 font-semibold">{item.prqPicked} / {item.prqPlanned}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-2 py-1.5">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">Stops</p>
                          <p className="mt-0.5 font-semibold">{item.stopsCompleted} / {item.noOfStops} completed</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-2 py-1.5">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">Gate Out Time</p>
                          <p className="mt-0.5 font-semibold">{item.gateOutTime}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-2 py-1.5">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">POD Upload</p>
                          <p className="mt-0.5 font-semibold">{item.podUploadCount}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-2 py-1.5">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">Cash Collected</p>
                          <p className="mt-0.5 font-semibold">{item.cashCollectedActual} <span className="text-muted-foreground font-normal text-[10px]">/ {item.cashCollectedProjected}</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <Card className="border-border/80 shadow-sm overflow-hidden flex flex-col xl:col-span-2 min-h-[600px]">
              <CardHeader className="pb-3 flex-[0_0_auto]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedOnRouteId ? 'Detailed Route Tracker' : 'Fleet Live Route Map'}</CardTitle>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse"></span>
                </div>
                <CardDescription>
                  {selectedOnRouteId 
                    ? 'Comparing planned route trace (dashed) vs. historical taken trace (solid).' 
                    : 'Live location & tracking for all active routes.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 w-full relative p-0 border-t min-h-[500px]">
                <MapView 
                  routes={onRouteMapRoutes} 
                  height="100%" 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reconciliation" className="outline-none">
          <TripReconciliationTable trips={reconciliationTrips} onCloseTrip={handleCloseTrip} />
        </TabsContent>
      </Tabs>

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

      <RunningHoursApprovalDialog
        open={runningHoursDialogOpen}
        onOpenChange={setRunningHoursDialogOpen}
        runningHoursUsed={activeTrip?.runningHoursUsed || 0}
        runningHoursLimit={activeTrip?.runningHoursLimit || 0}
        reason={runningHoursReason}
        onReasonChange={setRunningHoursReason}
        onSubmit={handleApproveRunningHoursException}
      />

      <AddSupportVehicleDialog
        open={addVehicleDialogOpen}
        onOpenChange={(open) => {
          setAddVehicleDialogOpen(open);
          if (!open) {
            setSelectedAdditionalVehicleId('');
          }
        }}
        options={availableAdditionalVehicles}
        selectedId={selectedAdditionalVehicleId}
        onSelect={setSelectedAdditionalVehicleId}
        onSubmit={handleAddSupportVehicle}
        maxVehicleSize={activeTrip?.vehicleConstraint?.maxVehicleSize || 'Allowed size'}
      />

      <RemoveCnDialog
        open={removeStopDialog.open}
        onOpenChange={(open) =>
          setRemoveStopDialog((currentDialog) => ({
            ...currentDialog,
            open,
            ...(open ? {} : { stop: null, reason: '' }),
          }))
        }
        stop={removeStopDialog.stop}
        reason={removeStopDialog.reason}
        onReasonChange={(reason) =>
          setRemoveStopDialog((currentDialog) => ({ ...currentDialog, reason }))
        }
        onSubmit={handleConfirmCnRemoval}
      />
    </div>
  );
};

export default SmartTripCreationPage;
