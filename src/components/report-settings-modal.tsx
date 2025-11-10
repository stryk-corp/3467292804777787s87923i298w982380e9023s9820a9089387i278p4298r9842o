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
  
  const handleMarginChange = (preset: 'normal' | 'narrow' | 'moderate' | 'wide') => {
    const presets = {
      normal: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
      narrow: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      moderate: { top: '1in', right: '0.75in', bottom: '1in', left: '0.75in' },
      wide: { top: '1in', right: '2in', bottom: '1in', left: '2in' },
    };
    const { top, right, bottom, left } = presets[preset];
    setFormData(prev => ({
      ...prev,
      marginTop: top,
      marginRight: right,
      marginBottom: bottom,
      marginLeft: left,
    }));
  };

  const getCurrentMarginPreset = () => {
    const { marginTop, marginRight, marginBottom, marginLeft } = formData;
    if (marginTop === '1in' && marginRight === '1in' && marginBottom === '1in' && marginLeft === '1in') return 'normal';
    if (marginTop === '0.5in' && marginRight === '0.5in' && marginBottom === '0.5in' && marginLeft === '0.5in') return 'narrow';
    if (marginTop === '1in' && marginRight === '0.75in' && marginBottom === '1in' && marginLeft === '0.75in') return 'moderate';
    if (marginTop === '1in' && marginRight === '2in' && marginBottom === '1in' && marginLeft === '2in') return 'wide';
    return 'normal'; // Default fallback
  };


  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];


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
                  {fontSizes.map(size => (
                    <SelectItem key={size} value={`${size}pt`}>{size} pt</SelectItem>
                  ))}
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
          
           <div className="space-y-3">
            <Label>Page Margins</Label>
            <RadioGroup
              value={getCurrentMarginPreset()}
              onValueChange={(v) => handleMarginChange(v as any)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="normal" id="margin-normal" className="peer sr-only" />
                <Label htmlFor="margin-normal" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Normal
                  <span className="text-xs text-muted-foreground mt-1">T/B: 1", L/R: 1"</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="narrow" id="margin-narrow" className="peer sr-only" />
                <Label htmlFor="margin-narrow" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Narrow
                  <span className="text-xs text-muted-foreground mt-1">T/B: 0.5", L/R: 0.5"</span>
                </Label>
              </div>
               <div>
                <RadioGroupItem value="moderate" id="margin-moderate" className="peer sr-only" />
                <Label htmlFor="margin-moderate" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Moderate
                  <span className="text-xs text-muted-foreground mt-1">T/B: 1", L/R: 0.75"</span>
                </Label>
              </div>
               <div>
                <RadioGroupItem value="wide" id="margin-wide" className="peer sr-only" />
                <Label htmlFor="margin-wide" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Wide
                  <span className="text-xs text-muted-foreground mt-1">T/B: 1", L/R: 2"</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
