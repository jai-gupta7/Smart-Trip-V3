import React, { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { pickupStatusOptions } from '@/lib/dummyData';

const getDefaultValues = (pickup, type) => {
  if (!pickup) {
    return {
      status: '',
      pickupDateTime: '',
      customerLocation: '',
      contactName: '',
      contactPhone: '',
    };
  }

  if (type === 'potential') {
    return {
      status: pickup.prqStatus || '',
      pickupDateTime: pickup.pickupDateTime || '',
      customerLocation: pickup.customerLocation?.name || '',
      contactName: pickup.poc?.name || '',
      contactPhone: pickup.poc?.phone || '',
    };
  }

  return {
    status: pickup.status || '',
    pickupDateTime: pickup.pickupSlot || '',
    customerLocation: pickup.customerAddress?.name || '',
    contactName: pickup.contact?.name || '',
    contactPhone: pickup.contact?.phone || '',
  };
};

const FirstMilePickupEditModal = ({ isOpen, onClose, pickup, type, onSave }) => {
  const { control, handleSubmit, register, reset } = useForm({
    defaultValues: getDefaultValues(null, type),
  });

  useEffect(() => {
    reset(getDefaultValues(pickup, type));
  }, [pickup, reset, type]);

  const onSubmit = (data) => {
    if (!pickup) return;

    if (type === 'potential') {
      onSave({
        ...pickup,
        pickupDateTime: data.pickupDateTime,
        customerLocation: {
          name: data.customerLocation,
        },
        poc: {
          name: data.contactName,
          phone: data.contactPhone,
        },
        prqStatus: data.status,
      });
    } else {
      onSave({
        ...pickup,
        pickupSlot: data.pickupDateTime,
        customerAddress: {
          name: data.customerLocation,
        },
        contact: {
          name: data.contactName,
          phone: data.contactPhone,
        },
        status: data.status,
      });
    }

    onClose();
  };

  const isPotential = type === 'potential';
  const recordLabel = isPotential ? pickup?.pickupId : pickup?.prqId;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit Pickup</DialogTitle>
          <DialogDescription>
            Update status, location, contact, and pickup timing for{' '}
            <span className="font-medium text-foreground">{recordLabel}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
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
            <Label>{isPotential ? 'Pickup Date & Time' : 'Pickup Slot'}</Label>
            <Input type="datetime-local" {...register('pickupDateTime')} />
          </div>

          <div className="space-y-2">
            <Label>Customer Location</Label>
            <Input {...register('customerLocation')} placeholder="Enter customer location" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isPotential ? 'POC Name' : 'Contact Name'}</Label>
              <Input {...register('contactName')} placeholder="Enter contact name" />
            </div>
            <div className="space-y-2">
              <Label>{isPotential ? 'POC Phone' : 'Contact Number'}</Label>
              <Input {...register('contactPhone')} placeholder="Enter contact number" />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
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
