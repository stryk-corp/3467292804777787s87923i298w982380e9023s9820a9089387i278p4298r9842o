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
    companyProfile: `Nanocodes Programming Limited is a dynamic software development company specializing in creating innovative solutions for a wide range of clients. They focus on mobile and web application development, leveraging modern technologies to deliver high-quality products.`,
    scopeOfSpecialization: `- Mobile App Development (iOS & Android)\n- Web Application Development\n- UI/UX Design\n- Corporate Training`,
    companyVision: 'Nanocodes Programming aims at using technology to build the country and the society by harnessing the rich resources that the society presents.',
    companyMission: 'To aim to use local resources to build a society with smart cities and advanced technology infrastructures, beginning with tech education and providing services and products to the public. This will gradually evolve society to integrate technology across all necessary sectors.',
    companyValues: 'Our tutorial classes are meticulously crafted to empower you with knowledge and hands-on expert setting you on a trajectory of limitless possibilities.',
    organogramImage: [],
    organogramCaption: 'Place of Attachment Organogram',
    organogramAbbreviations: `CEO – Chief Executive Officer\nPA – Personal Assistant\nCFO – Chief Financial Officer\nCTO – Chief Technology Officer\nCOO – Chief Operating Officer\nPM – Project Manager\nAST. PM – Assistant Project Manager`,
    fieldOfStudy: 'Software Development',
    primarySkill: 'App Development',
    technologiesUsed: 'Dart, Flutter, Firebase, Git, VS Code',
    programmingLanguage: 'Dart',
    framework: 'Flutter',
    careerPath: 'Mobile App Development',
    acknowledgementText: '',
    abstractText: '',
    challengesText: 'One of the main challenges was adapting to the large, existing codebase for a production application. Initially, understanding the architecture and finding where to make changes was difficult. I overcame this by pair-programming with a senior developer and spending extra time studying the documentation.',
    attachmentImages: [],
    attachmentCaption: 'Place of Attachment (Nanocodes Programming)',
    profileImages: [],
    profileCaption: 'Company Office Environment',
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
