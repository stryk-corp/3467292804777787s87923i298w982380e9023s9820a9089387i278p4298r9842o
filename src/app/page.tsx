'use client';

import { useState } from 'react';
import ReportForm from '@/components/report-form';
import ReportPreview from '@/components/report-preview';
import type { ReportData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const previewContainer = document.getElementById('preview-content');
    if (!previewContainer) return;
  
    setIsDownloading(true);
  
    const originalBackgroundColor = previewContainer.style.backgroundColor;
    previewContainer.style.backgroundColor = 'white';
  
    // A4 page dimensions in pixels at 96 DPI.
    const a4Width = 794;
    const a4Height = 1123;
    const pdf = new jsPDF('p', 'px', 'a4');
    const pdfInternals = (pdf as any).internal;
    const pdfPageHeight = pdfInternals.pageSize.getHeight();
    const pdfPageWidth = pdfInternals.pageSize.getWidth();

    const sections = [
        'cover-page', 'acknowledgement-page', 'abstract-page', 
        'toc-page', 'lof-page', 'chapter-1-page', 'chapter-2-page', 
        'chapter-3-page', 'chapter-4-page', 'chapter-5-page'
    ];
  
    for (let i = 0; i < sections.length; i++) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        if (!element) continue;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: a4Width,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / pdfPageWidth;
        const scaledHeight = imgHeight / ratio;

        if (i > 0) {
            pdf.addPage();
        }

        if (sectionId === 'cover-page') {
            // Fit cover page to a single page
             pdf.addImage(imgData, 'PNG', 0, 0, pdfPageWidth, pdfPageHeight);
        } else {
            let position = 0;
            let heightLeft = scaledHeight;

            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, scaledHeight);
                heightLeft -= pdfPageHeight;
                position -= pdfPageHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                }
            }
        }
    }
  
    pdf.save('SIWES-Report.pdf');
  
    previewContainer.style.backgroundColor = originalBackgroundColor;
    setIsDownloading(false);
  };

  return (
    <div id="main-container" className="flex flex-col items-center w-full min-h-screen bg-background p-4 sm:p-8">
      <div id="form-container" className="w-full max-w-4xl">
        <Card className="bg-card/80 border-0 shadow-none">
          <CardHeader className="p-2 md:p-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-foreground">SIWES AI Pro</CardTitle>
              <Button variant="outline" onClick={handleDownloadPdf} disabled={isDownloading} className="ml-4">
                {isDownloading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">Downloading...</span>
                  </>
                ) : (
                   <>
                    <Download className="h-5 w-5" />
                    <span className="ml-2 sr-only sm:not-sr-only">Download PDF</span>
                  </>
                )}
              </Button>
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
