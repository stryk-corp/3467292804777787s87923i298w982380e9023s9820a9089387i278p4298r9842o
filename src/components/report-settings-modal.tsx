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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ReportSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ReportData;
  setFormData: Dispatch<SetStateAction<ReportData>>;
}

export function ReportSettingsModal({
  isOpen,
  onClose,
  formData,
  setFormData,
}: ReportSettingsModalProps) {

  const handleAlignmentChange = (value: 'left' | 'center' | 'justify') => {
    setFormData((prev) => ({ ...prev, textAlign: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Structure Settings</DialogTitle>
          <DialogDescription>
            Customize the layout and structure of your report.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label>Content Alignment</Label>
              <p className="text-sm text-muted-foreground">
                Align the main content of your report (chapters, sections).
                This does not affect the Cover or TOC pages.
              </p>
              <RadioGroup
                value={formData.textAlign}
                onValueChange={handleAlignmentChange}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="align-left" />
                  <Label htmlFor="align-left">Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="center" id="align-center" />
                  <Label htmlFor="align-center">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="justify" id="align-justify" />
                  <Label htmlFor="align-justify">Justify</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
