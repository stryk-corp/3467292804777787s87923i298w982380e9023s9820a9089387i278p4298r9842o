'use client';

import { useState } from 'react';
import ReportForm from '@/components/report-form';
import ReportPreview from '@/components/report-preview';
import type { ReportData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState<ReportData>({
    fullName: '',
    regNumber: '',
    universityName: '',
    facultyName: '',
    departmentName: '',
    courseCode: '',
    reportMonth: '',
    reportYear: new Date().getFullYear().toString(),
    placeOfAttachment: '',
    attachmentLocation: '',
    supervisorNames: '',
    ceoName: '',
    companyProfile: '',
    scopeOfSpecialization: '',
    fieldOfStudy: '',
    primarySkill: '',
    technologiesUsed: '',
    programmingLanguage: '',
    framework: '',
    careerPath: '',
    acknowledgementText: '',
    abstractText: '',
    challengesText: '',
  });

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background">
      <div className="w-full md:w-1/2 lg:w-[45%] xl:w-1/3 p-4 md:p-8 form-container md:overflow-y-auto md:h-screen">
        <Card className="bg-card/80 border-0 shadow-none">
          <CardHeader className="p-2 md:p-4">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-foreground">SIWES AI Pro</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Fill in your details, and let AI help you write the perfect report.
            </CardDescription>
          </CardHeader>
        </Card>
        <ReportForm formData={formData} setFormData={setFormData} />
      </div>

      <div className="w-full md:w-1/2 lg:w-[55%] xl:w-2/3 p-4 md:p-8 preview-container bg-muted/40 md:overflow-y-auto md:h-screen">
        <ReportPreview formData={formData} />
      </div>
    </div>
  );
}
