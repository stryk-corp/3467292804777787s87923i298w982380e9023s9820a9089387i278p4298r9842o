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
  RadioGroup, RadioGroupItem
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { FileText, Ruler } from 'lucide-react';

interface ReportSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ReportData;
  setFormData: Dispatch<SetStateAction<ReportData>>;
  onFontSettingsClick: () => void;
  onMarginSettingsClick: () => void;
}

export function ReportSettingsModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onFontSettingsClick,
  onMarginSettingsClick,
}: ReportSettingsModalProps) {
  const handleAlignmentChange = (value: 'left' | 'center' | 'justify') => {
    setFormData(prev => ({ ...prev, textAlign: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Settings</DialogTitle>
          <DialogDescription>
            Adjust the structure and appearance of your report.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label>Content Alignment</Label>
            <RadioGroup
              defaultValue={formData.textAlign}
              onValueChange={handleAlignmentChange}
              className="flex gap-4"
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

          <div className="grid grid-cols-2 gap-4 pt-4">
             <Button variant="outline" onClick={onFontSettingsClick}>
                <FileText className="w-4 h-4 mr-2" />
                Typography Settings
             </Button>
             <Button variant="outline" onClick={onMarginSettingsClick}>
                <Ruler className="w-4 h-4 mr-2" />
                Margin Settings
             </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
