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
    attachmentLocation: '',
    supervisorNames: 'Mr. Ebuka Chikodinaka, Mr. Harrison Ozioko',
    ceoName: '',
    companyProfile: '',
    scopeOfSpecialization: '',
    companyVision: '',
    companyMission: '',
    companyValues: '',
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
    challengesText: ``,
    conclusionText: ``,
    attachmentImages: [],
    attachmentCaption: 'Place of Attachment (Nanocodes Programming)',
    profileImages: [],
    profileCaption: 'Company Office Environment',

    // Chapter 4 Data
    projectIntro: "",
    project1_intro: "",
    project1_desc: "",
    project1_useCaseDiagram: [],
    project1_useCaseCaption: "Use Case Diagram for a Login user interface",
    project1_welcomeScreen: "",
    project1_welcomeScreenImages: [],
    project1_welcomeScreenCaption: "Welcome Screen and the related code snippet",
    project1_signInScreen: "",
    project1_validation: "",
    project1_signInImages: [],
    project1_signInCaption: "Sign in Screen/Validation and Error handling with the related code snippet",
    project1_signUpScreen: "",
    project1_signUpImages: [],
    project1_signUpCaption: "Sign up Screen with the code snippet",
    project1_homeScreen: "",
    project1_homeScreenImages: [],
    project1_homeScreenCaption: "The main Home Screen and code snippet",
    project1_tools: "",
    
    project2_intro: "",
    project2_desc: "",
    project2_structure: "",
    project2_ui: "",
    project2_core: "",
    project2_codeSnippetImages: [],
    project2_codeSnippetCaption: "Code Snippet for the Basic Calculator App",
    project2_tools: ""
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
