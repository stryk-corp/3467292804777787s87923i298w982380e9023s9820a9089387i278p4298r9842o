"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

type ContentAlignment = "left" | "center" | "justify"

interface ReportSettingsModalProps {
  children: React.ReactNode
  contentAlignment: ContentAlignment
  onAlignmentChange: (value: ContentAlignment) => void
}

export function ReportSettingsModal({
  children,
  contentAlignment,
  onAlignmentChange,
}: ReportSettingsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Structure Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="alignment" className="text-right">
              Alignment
            </Label>
            <RadioGroup
              id="alignment"
              value={contentAlignment}
              onValueChange={(value) => onAlignmentChange(value as ContentAlignment)}
              className="col-span-3 flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="r1" />
                <Label htmlFor="r1">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="r2" />
                <Label htmlFor="r2">Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="justify" id="r3" />
                <Label htmlFor="r3">Justify</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          {/* Future settings buttons can go here */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
