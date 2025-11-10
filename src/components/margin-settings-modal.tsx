'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { ReportData } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MarginSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ReportData;
  setFormData: Dispatch<SetStateAction<ReportData>>;
}

export function MarginSettingsModal({
  isOpen,
  onClose,
  formData,
  setFormData,
}: MarginSettingsModalProps) {
  const handleMarginInputChange = (side: 'top' | 'bottom' | 'left' | 'right', value: string) => {
    const key = `margin${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof ReportData;
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Page Margin Settings</DialogTitle>
          <DialogDescription>
            Set custom margins for your report (e.g., "1in", "2.54cm").
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <Label>Page Margins</Label>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="margin-top" className="text-xs text-muted-foreground">Top</Label>
                  <Input id="margin-top" value={formData.marginTop} onChange={(e) => handleMarginInputChange('top', e.target.value)} placeholder="e.g., 1in" />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="margin-bottom" className="text-xs text-muted-foreground">Bottom</Label>
                  <Input id="margin-bottom" value={formData.marginBottom} onChange={(e) => handleMarginInputChange('bottom', e.target.value)} placeholder="e.g., 1in" />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="margin-left" className="text-xs text-muted-foreground">Left</Label>
                  <Input id="margin-left" value={formData.marginLeft} onChange={(e) => handleMarginInputChange('left', e.g.target.value)} placeholder="e.g., 1in" />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="margin-right" className="text-xs text-muted-foreground">Right</Label>
                  <Input id="margin-right" value={formData.marginRight} onChange={(e) => handleMarginInputChange('right', e.target.value)} placeholder="e.g., 1in" />
              </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
