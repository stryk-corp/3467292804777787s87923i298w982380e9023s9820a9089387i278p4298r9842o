'use client';

import { useState } from 'react';
import ReportForm from '@/components/report-form';
import ReportPreview from '@/components/report-preview';
import type { ReportData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState<ReportData>({
    fullName: 'Chima Courage Chiemeka',
    regNumber: '2021/247172',
    universityName: 'University of Nigeria, Nsukka',
    facultyName: 'Physical Sciences',
    departmentName: 'Computer Science',
    courseCode: 'COS 384',
    reportMonth: 'February',
    reportYear: new Date().getFullYear().toString(),
    placeOfAttachment: 'Nanocodes Programming Limited',
    attachmentLocation: '31 Enugu Road, Nsukka',
    supervisorNames: 'Mr. Ebuka Chikodinaka, Mr. Harrison Ozioko',
    ceoName: 'Mr. Harrison Ozioko',
    companyProfile: '',
    scopeOfSpecialization: '',
    fieldOfStudy: 'Software Development',
    primarySkill: 'App Development',
    technologiesUsed: 'Dart, Flutter, Firebase, Git',
    programmingLanguage: 'Dart',
    framework: 'Flutter',
    careerPath: 'Mobile App Development',
    acknowledgementText: '',
    abstractText: '',
    challengesText: 'One of the main challenges was adapting to the large, existing codebase for a production application. Initially, understanding the architecture and finding where to make changes was difficult. I overcame this by pair-programming with a senior developer and spending extra time studying the documentation.',
    attachmentImages: [],
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
        <ReportPreview formData={formData} setFormData={setFormData} />
      </div>
    </div>
  );
}
