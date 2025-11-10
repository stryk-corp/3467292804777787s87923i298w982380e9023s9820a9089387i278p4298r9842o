'use client';

import { useState } from 'react';
import ReportForm from '@/components/report-form';
import ReportPreview from '@/components/report-preview';
import type { ReportData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Printer, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportSettingsModal } from '@/components/report-settings-modal';
import { FontSettingsModal } from '@/components/font-settings-modal';
import { MarginSettingsModal } from '@/components/margin-settings-modal';
import { PageNumberSettingsModal } from '@/components/page-number-settings-modal';

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
    companyVision: '',
    companyMission: '',
    companyValues: '',
    organogramImage: [],
    organogramCaption: 'Place of Attachment Organogram',
    organogramAbbreviations: '',
    fieldOfStudy: '',
    primarySkill: '',
    technologiesUsed: '',
    programmingLanguage: '',
    framework: '',
    careerPath: '',
    acknowledgementText: '',
    abstractText: '',
    skillsChapterText: '',
    challengesText: ``,
    conclusionText: ``,
    attachmentImages: [],
    attachmentCaption: 'Place of Attachment',
    profileImages: [],
    profileCaption: 'Company Office Environment',
    textAlign: 'left',
    fontFamily: 'Inter',
    fontSize: '12pt',
    lineHeight: '1.5',
    marginTop: '1in',
    marginRight: '1in',
    marginBottom: '1in',
    marginLeft: '1in',
    pageNumberPosition: 'bottom-center',
    pageNumberFormat: 'Page {page}',

    // Chapter 4 Data
    projectsDescription: "",
    projectIntro: "",
    project1_intro: "",
    project1_desc: "",
    project1_useCaseDiagram: [],
    project1_useCaseCaption: "Use Case Diagram for Project 1",
    project1_welcomeScreen: "",
    project1_welcomeScreenImages: [],
    project1_welcomeScreenCaption: "Welcome Screen and code snippet",
    project1_signInScreen: "",
    project1_validation: "",
    project1_signInImages: [],
    project1_signInCaption: "Sign in Screen/Validation and code snippet",
    project1_signUpScreen: "",
    project1_signUpImages: [],
    project1_signUpCaption: "Sign up Screen with code snippet",
    project1_homeScreen: "",
    project1_homeScreenImages: [],
    project1_homeScreenCaption: "Home Screen and code snippet",
    project1_tools: "",
    
    project2_intro: "",
    project2_desc: "",
    project2_structure: "",
    project2_ui: "",
    project2_core: "",
    project2_codeSnippetImages: [],
    project2_codeSnippetCaption: "Code Snippet for Project 2",
    project2_tools: ""
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFontSettingsOpen, setIsFontSettingsOpen] = useState(false);
  const [isMarginSettingsOpen, setIsMarginSettingsOpen] = useState(false);
  const [isPageNumberSettingsOpen, setIsPageNumberSettingsOpen] = useState(false);

  const printPreview = () => {
    try {
      const styleId = 'dynamic-print-style';
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
  
      const style = document.createElement('style');
      style.id = styleId;
  
      let pageCounterStyle = 'decimal';
      let pageNumberFormat = formData.pageNumberFormat;
      
      if (pageNumberFormat.includes('{page_roman_lower}')) {
        pageCounterStyle = 'lower-roman';
        pageNumberFormat = pageNumberFormat.replace('{page_roman_lower}', '{page}');
      } else if (pageNumberFormat.includes('{page_roman_upper}')) {
        pageCounterStyle = 'upper-roman';
        pageNumberFormat = pageNumberFormat.replace('{page_roman_upper}', '{page}');
      }
      
      const parts = pageNumberFormat.split('{page}');
      const prefix = parts[0] ? `"${parts[0]}"` : '';
      const suffix = parts[1] ? `"${parts[1]}"` : '';
      const counter = `counter(page, ${pageCounterStyle})`;
      
      const pageNumberContent = [prefix, counter, suffix].filter(Boolean).join(' ');

      style.innerHTML = `
        @page { 
          margin-top: ${formData.marginTop}; 
          margin-right: ${formData.marginRight}; 
          margin-bottom: ${formData.marginBottom}; 
          margin-left: ${formData.marginLeft};
          
          @${formData.pageNumberPosition} {
            content: ${pageNumberContent};
          }
        } 
        
        @page :first {
          @${formData.pageNumberPosition} {
            content: "";
          }
        }
        
        @media print { 
          body * { 
            visibility: hidden !important; 
          } 
          #preview-content, #preview-content * { 
            visibility: visible !important; 
          } 
          #preview-content { 
            position: static !important; 
            margin: 0 !important; 
            width: auto !important; 
          } 
        }`;
      document.head.appendChild(style);
  
      window.print();
    } catch (err) {
      // Fallback for any unexpected errors
      window.print();
    }
  };

  return (
    <div id="main-container" className="flex flex-col items-center w-full min-h-screen bg-background p-4 sm:p-8">
      <ReportSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onFontSettingsClick={() => setIsFontSettingsOpen(true)}
        onMarginSettingsClick={() => setIsMarginSettingsOpen(true)}
        onPageNumberSettingsClick={() => setIsPageNumberSettingsOpen(true)}
      />
      <FontSettingsModal
        isOpen={isFontSettingsOpen}
        onClose={() => setIsFontSettingsOpen(false)}
        formData={formData}
        setFormData={setFormData}
      />
      <MarginSettingsModal
        isOpen={isMarginSettingsOpen}
        onClose={() => setIsMarginSettingsOpen(false)}
        formData={formData}
        setFormData={setFormData}
      />
      <PageNumberSettingsModal
        isOpen={isPageNumberSettingsOpen}
        onClose={() => setIsPageNumberSettingsOpen(false)}
        formData={formData}
        setFormData={setFormData}
      />

      <div id="form-container" className="w-full max-w-4xl">
        <Card className="bg-card/80 border-0 shadow-none">
          <CardHeader className="p-2 md:p-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-foreground">SIWES AI Pro</CardTitle>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="ml-2 sr-only sm:not-sr-only">Settings</span>
                </Button>
                <Button variant="default" onClick={printPreview}>
                  <Printer className="h-5 w-5" />
                  <span className="ml-2 sr-only sm:not-sr-only">Print</span>
                </Button>
              </div>
            </div>
            <CardDescription className="text-muted-foreground">
              Fill in your details, and let AI help you write the perfect report.
            </CardDescription>
          </CardHeader>
        </Card>
        <ReportForm formData={formData} setFormData={setFormData} />
      </div>

      <div className="w-full mt-8">
        <ReportPreview formData={formData} setFormData={setFormData} />
      </div>
    </div>
  );
}
