
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { operators, vehicles, drivers } from '@/lib/dummyData';

const SchedulePickupsEditModal = ({ isOpen, onClose, pickup, onSave }) => {
  const { control, register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      operatorName: '',
      vehicle: '',
      driver: '',
      pocName: '',
      pocPhone: '',
      reason: ''
    }
  });

  // Watch the reason field to conditionally disable the submit button
  const reasonValue = watch('reason');
  const isSubmitDisabled = !reasonValue || reasonValue.trim().length === 0;

  useEffect(() => {
    if (pickup) {
      reset({
        operatorName: pickup.operatorName || '',
        vehicle: pickup.vehicle || '',
        driver: pickup.driver || '',
        pocName: pickup.poc?.name || '',
        pocPhone: pickup.poc?.phone || '',
        reason: '' // Reset reason field each time modal opens
      });
    }
  }, [pickup, reset]);

  const onSubmit = (data) => {
    const updatedPickup = {
      ...pickup,
      operatorName: data.operatorName,
      vehicle: data.vehicle,
      driver: data.driver,
      poc: { 
        name: data.pocName, 
        phone: data.pocPhone 
      }
      // Note: We don't strictly need to save 'reason' to the pickup object unless the API requires it,
      // but we ensure it was filled per requirements.
    };
    
    onSave(updatedPickup);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Details</DialogTitle>
          <DialogDescription>
            Update scheduling and operator details for pickup <span className="font-medium text-foreground">{pickup?.pickupId}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Operator Name</Label>
              <Controller
                name="operatorName"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op} value={op}>{op}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Controller
                name="vehicle"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Driver Name</Label>
              <Controller
                name="driver"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>POC Name</Label>
                <Input {...register('pocName')} placeholder="Contact person name" />
              </div>
              <div className="space-y-2">
                <Label>POC Phone</Label>
                <Input {...register('pocPhone')} placeholder="Contact phone number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for Changes <span className="text-destructive">*</span>
              </Label>
              <Textarea 
                id="reason"
                {...register('reason', { required: 'Reason is required to save changes' })} 
                placeholder="Explain the reason for these changes..."
                className="resize-none h-24"
              />
              {errors.reason && (
                <p className="text-sm text-destructive font-medium">{errors.reason.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-8 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              Save Changes
            </Button>
          </DialogFooter>
          
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePickupsEditModal;
