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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PageNumberSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ReportData;
  setFormData: Dispatch<SetStateAction<ReportData>>;
}

export function PageNumberSettingsModal({
  isOpen,
  onClose,
  formData,
  setFormData,
}: PageNumberSettingsModalProps) {
  const handlePositionChange = (value: ReportData['pageNumberPosition']) => {
    setFormData(prev => ({ ...prev, pageNumberPosition: value }));
  };

  const handleFormatChange = (value: ReportData['pageNumberFormat']) => {
    setFormData(prev => ({ ...prev, pageNumberFormat: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Page Number Settings</DialogTitle>
          <DialogDescription>
            Customize the position and format of page numbers in your report.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="page-number-position">Position</Label>
            <Select value={formData.pageNumberPosition} onValueChange={handlePositionChange}>
              <SelectTrigger id="page-number-position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-number-format">Format</Label>
            <Select value={formData.pageNumberFormat} onValueChange={handleFormatChange}>
              <SelectTrigger id="page-number-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Page {page}">Page 1</SelectItem>
                <SelectItem value="{page}">1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
