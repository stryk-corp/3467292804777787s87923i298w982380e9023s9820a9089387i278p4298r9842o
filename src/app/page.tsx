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
    const reportContainer = document.getElementById('preview-content');
    if (!reportContainer) return;

    setIsDownloading(true);

    const originalBackgroundColor = reportContainer.style.backgroundColor;
    reportContainer.style.backgroundColor = 'white';

    const canvas = await html2canvas(reportContainer, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
    });

    reportContainer.style.backgroundColor = originalBackgroundColor;

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
    });

    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    const ratio = imgWidth / pdfPageWidth;
    const scaledImgHeight = imgHeight / ratio;

    let heightLeft = scaledImgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, scaledImgHeight);
    heightLeft -= pdfPageHeight;

    while (heightLeft > 0) {
        position -= pdfPageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, scaledImgHeight);
        heightLeft -= pdfPageHeight;
    }

    pdf.save('SIWES-Report.pdf');
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
