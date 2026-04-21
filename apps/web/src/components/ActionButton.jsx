
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ActionButton = ({ 
  label, 
  onClick, 
  variant = "default", 
  size = "sm",
  icon: Icon,
  requireConfirm = false,
  confirmTitle = "Are you sure?",
  confirmDescription = "This action cannot be undone.",
  className = ""
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (requireConfirm) {
      setOpen(true);
    } else {
      onClick?.();
    }
  };

  const handleConfirm = () => {
    onClick?.();
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={handleClick}
        className={className}
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {label}
      </Button>

      {requireConfirm && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ActionButton;
