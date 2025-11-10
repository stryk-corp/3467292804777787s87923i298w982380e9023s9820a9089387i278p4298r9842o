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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
    setFormData(prev => ({ ...prev, textAlign: value }));
  };

  const handleFontFamilyChange = (value: string) => {
    setFormData(prev => ({ ...prev, fontFamily: value }));
  };

  const handleFontSizeChange = (value: string) => {
    setFormData(prev => ({ ...prev, fontSize: value }));
  };

  const handleLineHeightChange = (value: string) => {
    setFormData(prev => ({ ...prev, lineHeight: value }));
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

          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={formData.fontFamily} onValueChange={handleFontFamilyChange}>
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter (Default)</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select value={formData.fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10pt">10 pt</SelectItem>
                  <SelectItem value="11pt">11 pt</SelectItem>
                  <SelectItem value="12pt">12 pt</SelectItem>
                  <SelectItem value="13pt">13 pt</SelectItem>
                  <SelectItem value="14pt">14 pt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="line-height">Line Spacing</Label>
              <Select value={formData.lineHeight} onValueChange={handleLineHeightChange}>
                <SelectTrigger id="line-height">
                  <SelectValue placeholder="Select spacing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Single</SelectItem>
                  <SelectItem value="1.5">1.5</SelectItem>
                  <SelectItem value="2">Double</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
