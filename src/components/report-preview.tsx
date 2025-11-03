'use client';

import type { Dispatch, SetStateAction } from 'react';
import { ReportData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ImageSelector } from '@/components/image-selector';

interface ReportPreviewProps {
  formData: ReportData;
  setFormData: Dispatch<SetStateAction<ReportData>>;
}

const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <span className="preview-placeholder">{children}</span>
);

function formatPreviewText(text: string | undefined | null) {
  if (!text) return null;

  const html = text
    .replace(/</g, "&lt;").replace(/>/g, "&gt;") // Basic HTML escape
    .replace(/\n/g, '<br />') // Convert newlines to <br>
    .replace(/### (.*?)(<br \/>|$)/g, '<h3>$1</h3>') // Convert ### headings
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** text
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/• (.*$)/gim, '<li class="ml-8 list-disc">$1</li>');

  return { __html: html };
}

export default function ReportPreview({ formData, setFormData }: ReportPreviewProps) {
  const previewData = {
    ...formData,
    acknowledgementHtml: formatPreviewText(formData.acknowledgementText),
    abstractHtml: formatPreviewText(formData.abstractText),
    companyProfileHtml: formatPreviewText(formData.companyProfile),
    scopeOfSpecializationHtml: formatPreviewText(formData.scopeOfSpecialization),
    skillsChapterHtml: formatPreviewText(formData.skillsChapterText),
    challengesHtml: formatPreviewText(formData.challengesText),
    organogramAbbreviationsHtml: formatPreviewText(formData.organogramAbbreviations),
    conclusionHtml: formatPreviewText(formData.conclusionText),

    // Chapter 4
    projectIntroHtml: formatPreviewText(formData.projectIntro),
    project1_introHtml: formatPreviewText(formData.project1_intro),
    project1_descHtml: formatPreviewText(formData.project1_desc),
    project1_welcomeScreenHtml: formatPreviewText(formData.project1_welcomeScreen),
    project1_signInScreenHtml: formatPreviewText(formData.project1_signInScreen),
    project1_validationHtml: formatPreviewText(formData.project1_validation),
    project1_signUpScreenHtml: formatPreviewText(formData.project1_signUpScreen),
    project1_homeScreenHtml: formatPreviewText(formData.project1_homeScreen),
    project1_toolsHtml: formatPreviewText(formData.project1_tools),
    project2_introHtml: formatPreviewText(formData.project2_intro),
    project2_descHtml: formatPreviewText(formData.project2_desc),
    project2_structureHtml: formatPreviewText(formData.project2_structure),
    project2_uiHtml: formatPreviewText(formData.project2_ui),
    project2_coreHtml: formatPreviewText(formData.project2_core),
    project2_toolsHtml: formatPreviewText(formData.project2_tools),
  };
  
  const handleAttachmentImagesChange = (images: string[]) => {
    setFormData(prev => ({...prev, attachmentImages: images}));
  };

  const handleAttachmentCaptionChange = (caption: string) => {
    setFormData(prev => ({ ...prev, attachmentCaption: caption }));
  };

  const handleProfileImagesChange = (images: string[]) => {
    setFormData(prev => ({...prev, profileImages: images}));
  };

  const handleProfileCaptionChange = (caption: string) => {
    setFormData(prev => ({ ...prev, profileCaption: caption }));
  };
  
  const handleOrganogramImageChange = (images: string[]) => {
    setFormData(prev => ({...prev, organogramImage: images}));
  };

  const handleOrganogramCaptionChange = (caption: string) => {
    setFormData(prev => ({ ...prev, organogramCaption: caption }));
  };

  // Chapter 4 handlers
  const createHandler = <K extends keyof ReportData>(key: K) => (value: ReportData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const handleProject1UseCaseDiagramChange = createHandler('project1_useCaseDiagram');
  const handleProject1UseCaseCaptionChange = createHandler('project1_useCaseCaption');
  const handleProject1WelcomeScreenImagesChange = createHandler('project1_welcomeScreenImages');
  const handleProject1WelcomeScreenCaptionChange = createHandler('project1_welcomeScreenCaption');
  const handleProject1SignInImagesChange = createHandler('project1_signInImages');
  const handleProject1SignInCaptionChange = createHandler('project1_signInCaption');
  const handleProject1SignUpImagesChange = createHandler('project1_signUpImages');
  const handleProject1SignUpCaptionChange = createHandler('project1_signUpCaption');
  const handleProject1HomeScreenImagesChange = createHandler('project1_homeScreenImages');
  const handleProject1HomeScreenCaptionChange = createHandler('project1_homeScreenCaption');
  const handleProject2CodeSnippetImagesChange = createHandler('project2_codeSnippetImages');
  const handleProject2CodeSnippetCaptionChange = createHandler('project2_codeSnippetCaption');


  const figures = [
    { images: previewData.attachmentImages, prefix: "1.1", caption: previewData.attachmentCaption },
    { images: previewData.profileImages, prefix: "1.2", caption: previewData.profileCaption },
    { images: previewData.organogramImage, prefix: "2.1", caption: previewData.organogramCaption },
    { images: previewData.project1_useCaseDiagram, prefix: "4.1.1", caption: previewData.project1_useCaseCaption },
    { images: previewData.project1_welcomeScreenImages, prefix: "4.1.2", caption: previewData.project1_welcomeScreenCaption },
    { images: previewData.project1_signInImages, prefix: "4.1.3", caption: previewData.project1_signInCaption },
    { images: previewData.project1_signUpImages, prefix: "4.1.4", caption: previewData.project1_signUpCaption },
    { images: previewData.project1_homeScreenImages, prefix: "4.1.5", caption: previewData.project1_homeScreenCaption },
    { images: previewData.project2_codeSnippetImages, prefix: "4.1.6", caption: previewData.project2_codeSnippetCaption },
  ].filter(fig => fig.images.length > 0);


  return (
    <Card id="preview-content" className="w-full max-w-[8.5in] min-h-[11in] mx-auto p-8 sm:p-12 md:p-16 text-foreground shadow-lg">
      <style jsx global>{`
        #preview-content h1, #preview-content h2, #preview-content h3, #preview-content h4 {
            font-weight: 700;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: hsl(var(--foreground));
        }
        #preview-content h1 { font-size: 1.8rem; text-align: center; border-bottom: 2px solid hsl(var(--border)); padding-bottom: 1rem; }
        #preview-content h2 { font-size: 1.4rem; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.5rem; }
        #preview-content h3 { font-size: 1.1rem; font-weight: 600; }
        #preview-content h4 { font-size: 1.0rem; font-weight: 600; }
        #preview-content p, #preview-content li { font-size: 1rem; line-height: 1.6; margin-bottom: 1rem; }
        #preview-content .prose ul { list-style-type: none; padding: 0; }
        #preview-content div > h3:first-child {
            margin-top: 0;
        }
        #preview-content .text-left { text-align: left; }
        #preview-content .text-left h2,
        #preview-content .text-left h3 {
            border-bottom: none;
            text-align: left;
        }
      `}</style>

      {/* Cover Page */}
      <div id="cover-page" className="text-center flex flex-col justify-between min-h-[9in]">
        <div></div> {/* Spacer */}
        <div className="title-block mt-8">
          <p className="font-medium uppercase">{previewData.universityName || <Placeholder>University Name</Placeholder>}</p>
          <p className="font-medium uppercase">FACULTY OF {previewData.facultyName || <Placeholder>Faculty Name</Placeholder>}</p>
          <p className="font-medium uppercase">DEPARTMENT OF {previewData.departmentName || <Placeholder>Department Name</Placeholder>}</p>
          <br />
          <h1 className="text-xl font-bold border-none p-0 m-2">STUDENTS INDUSTRIAL WORK EXPERIENCE SCHEME (SIWES)</h1>
          <h1 className="text-xl font-bold border-none p-0 m-2">TECHNICAL SIWES REPORT ({previewData.courseCode || <Placeholder>Course Code</Placeholder>})</h1>
          <br />
          <p>PLACE OF ATTACHMENT:</p>
          <p className="font-bold uppercase">{previewData.placeOfAttachment || <Placeholder>Place of Attachment</Placeholder>}</p>
        </div>
        <div className="student-block mb-8">
          <p>BY</p>
          <p className="font-bold uppercase">{previewData.fullName || <Placeholder>Full Name</Placeholder>}</p>
          <p className="font-bold uppercase">REG NO: {previewData.regNumber || <Placeholder>Reg Number</Placeholder>}</p>
          <br />
          <p className="font-bold uppercase">{previewData.reportMonth || <Placeholder>Month</Placeholder>}, {previewData.reportYear || <Placeholder>Year</Placeholder>}</p>
        </div>
      </div>

      {/* Acknowledgement */}
      <div style={{ pageBreakBefore: 'always' }} className="text-left">
        <h2 className="text-center">ACKNOWLEDGEMENT</h2>
        {previewData.acknowledgementHtml ? (
            <div dangerouslySetInnerHTML={previewData.acknowledgementHtml}></div>
        ) : (
            <p><Placeholder>This section will be automatically generated based on your inputs.</Placeholder></p>
        )}
      </div>

      {/* Abstract */}
      <div style={{ pageBreakBefore: 'always' }} className="text-left">
        <h2 className="text-center">ABSTRACT</h2>
        {previewData.abstractHtml ? (
            <div dangerouslySetInnerHTML={previewData.abstractHtml}></div>
        ) : (
            <p><Placeholder>This section will be automatically generated based on your inputs.</Placeholder></p>
        )}
      </div>

      {/* Table of Contents */}
      <div style={{ pageBreakBefore: 'always' }} className="prose prose-sm text-left">
        <h2>TABLE OF CONTENTS</h2>
        <p className="text-sm leading-relaxed">
            Cover Page<br />
            Acknowledgement<br />
            Abstract<br />
            Table of Contents<br />
            List of Figures<br />
            <br />
            <strong>Chapter One: Introduction</strong><br />
            1.1 Brief History of SIWES<br />
            1.2 Objectives and Aims of SIWES<br />
            1.3 Place of Attachment<br />
            1.4 Brief Profile of Place of Attachment<br />
            1.5 Scope of Specialization<br />
            <br />
            <strong>Chapter Two: Organizational Structure of Placement of Attachment</strong><br />
            2.1 Vision<br />
            2.2 Mission<br />
            2.3 Value<br />
            2.4 Organogram<br />
            <br />
            <strong>Chapter Three: Skills Learnt</strong><br />
            3.1 Description of Skills<br />
            3.2 Tools and Technologies used<br />
            <br />
            <strong>Chapter Four: Project Developed</strong><br />
            4.1 Introduction<br />
            4.2 Project 1<br />
            4.3 Project 2<br />
            <br />
            <strong>Chapter Five: Conclusion</strong><br />
            5.1 Challenges Encountered<br />
            5.2 Conclusion<br />
        </p>
      </div>
      
      {/* List of Figures */}
       <div style={{ pageBreakBefore: 'always' }} className="text-left">
            <h2>LIST OF FIGURES</h2>
            <div className="prose prose-sm">
                {figures.length > 0 ? (
                    figures.map((fig, index) => (
                        <p key={index} className="text-sm leading-relaxed">
                            Figure {fig.prefix}: {fig.caption}
                        </p>
                    ))
                ) : (
                    <p><Placeholder>Figures will be listed here as you add them to the report.</Placeholder></p>
                )}
            </div>
        </div>

      {/* Chapter 1 */}
      <div style={{ pageBreakBefore: 'always' }} className="text-left">
        <h2 className="text-center">CHAPTER 1: INTRODUCTION</h2>
        <h3>1.1 Brief History of SIWES</h3>
        <p>The Students Industrial Work Experience Scheme (SIWES) is a skills training program designed to equip students from universities, polytechnics, and other higher institutions with practical industry experience. It provides hands-on exposure to equipment and machinery that are often unavailable in academic institutions.</p>
        <h3>1.2 Objectives of SIWES</h3>
        <p>SIWES aims to bridge the gap between theory and practice, provide students with an opportunity to apply their knowledge in real-world situations, and expose them to work methods and techniques in handling equipment and machinery that may not be available in their institutions.</p>
        <h3>1.3 PLACE OF ATTACHMENT</h3>
        <p>My Industrial Training was undertaken at <strong>{previewData.placeOfAttachment || <Placeholder>Place of Attachment</Placeholder>}</strong>.</p>
        <ImageSelector
          images={previewData.attachmentImages}
          caption={previewData.attachmentCaption}
          onImagesChange={handleAttachmentImagesChange}
          onCaptionChange={handleAttachmentCaptionChange}
          maxImages={3}
          figurePrefix="1.1"
        />
        <h3>1.4 BRIEF PROFILE OF PLACE OF ATTACHMENT</h3>
        {previewData.companyProfileHtml ? (
            <div dangerouslySetInnerHTML={previewData.companyProfileHtml}></div>
        ) : (
            <p><Placeholder>This section will be filled in by the AI profile generator.</Placeholder></p>
        )}
        <p>Founded and managed by <strong>{previewData.ceoName || <Placeholder>CEO Name</Placeholder>}</strong>, the company is located at <strong>{previewData.attachmentLocation || <Placeholder>Attachment Location</Placeholder>}</strong>.</p>
        <ImageSelector
          images={previewData.profileImages}
          caption={previewData.profileCaption}
          onImagesChange={handleProfileImagesChange}
          onCaptionChange={handleProfileCaptionChange}
          maxImages={3}
          figurePrefix="1.2"
        />
        <h3>1.5 SCOPE OF SPECIALIZATION</h3>
        {previewData.scopeOfSpecializationHtml ? (
             <div dangerouslySetInnerHTML={previewData.scopeOfSpecializationHtml} className="prose"></div>
        ) : (
            <p><Placeholder>This section will be filled in by the AI profile generator.</Placeholder></p>
        )}
      </div>

      {/* Chapter 2 */}
      <div style={{ pageBreakBefore: 'always' }} className="text-left">
        <h2 className="text-center">CHAPTER 2: ORGANIZATIONAL STRUCTURE OF PLACEMENT OF ATTACHMENT</h2>
        <h3>2.1 VISION:</h3>
        <p>{previewData.companyVision || <Placeholder>Enter company vision in Step 3.</Placeholder>}</p>
        <h3>2.2 MISSION:</h3>
        <p>{previewData.companyMission || <Placeholder>Enter company mission in Step 3.</Placeholder>}</p>
        <h3>2.3 VALUE:</h3>
        <p>{previewData.companyValues || <Placeholder>Enter company values in Step 3.</Placeholder>}</p>
        
        <h3>2.4 ORGANOGRAM</h3>
        <ImageSelector
            images={previewData.organogramImage}
            caption={previewData.organogramCaption}
            onImagesChange={handleOrganogramImageChange}
            onCaptionChange={handleOrganogramCaptionChange}
            maxImages={1}
            figurePrefix="2.1"
        />
        {previewData.organogramAbbreviationsHtml ? (
            <div dangerouslySetInnerHTML={previewData.organogramAbbreviationsHtml} className="prose"></div>
        ) : (
            <p><Placeholder>Enter Organogram abbreviations in step 3...</Placeholder></p>
        )}
      </div>

      {/* Chapter 3 */}
      <div style={{ pageBreakBefore: 'always' }} className="text-left">
        <h2 className="text-center">CHAPTER 3: SKILLS LEARNT</h2>
        {previewData.skillsChapterHtml ? (
          <div dangerouslySetInnerHTML={previewData.skillsChapterHtml}></div>
        ) : (
          <p><Placeholder>This section will be automatically generated based on your inputs in Step 4.</Placeholder></p>
        )}
      </div>

      {/* Chapter 4 */}
      <div style={{ pageBreakBefore: 'always' }} className="text-left">
        <h2 className="text-center">CHAPTER 4: PROJECT DEVELOPED</h2>
        <h3>4.1 INTRODUCTION</h3>
        <div dangerouslySetInnerHTML={previewData.projectIntroHtml || {__html: "<p><Placeholder>Enter project intro in Step 5.</Placeholder></p>"}}></div>
        
        <h4>4.1.1 Project 1</h4>
        <div dangerouslySetInnerHTML={previewData.project1_introHtml || {__html: "<p><Placeholder>Describe project 1 in Step 5.</Placeholder></p>"}}></div>
        
        <h4>4.1.2 Project Description</h4>
        <div>
          <div dangerouslySetInnerHTML={previewData.project1_descHtml || {__html: "<p><Placeholder>Describe project 1 details in Step 5.</Placeholder></p>"}}></div>
          <ImageSelector images={previewData.project1_useCaseDiagram} onImagesChange={handleProject1UseCaseDiagramChange} caption={previewData.project1_useCaseCaption} onCaptionChange={handleProject1UseCaseCaptionChange} figurePrefix="4.1.1" maxImages={1} />
        </div>
        
        <h4>4.1.2.1 A Key Feature</h4>
        <div>
          <div dangerouslySetInnerHTML={previewData.project1_welcomeScreenHtml || {__html: "<p><Placeholder>Describe a key feature or screen in Step 5.</Placeholder></p>"}}></div>
          <ImageSelector images={previewData.project1_welcomeScreenImages} onImagesChange={handleProject1WelcomeScreenImagesChange} caption={previewData.project1_welcomeScreenCaption} onCaptionChange={handleProject1WelcomeScreenCaptionChange} figurePrefix="4.1.2" />
        </div>

        <h4>4.1.2.2 Another Feature</h4>
        <div dangerouslySetInnerHTML={previewData.project1_signInScreenHtml || {__html: "<p><Placeholder>Describe another feature or screen in Step 5.</Placeholder></p>"}}></div>
        
        <h4>4.1.2.3 Challenges and Solutions</h4>
        <div>
          <div dangerouslySetInnerHTML={previewData.project1_validationHtml || {__html: "<p><Placeholder>Describe any challenges for this project in Step 5.</Placeholder></p>"}}></div>
          <ImageSelector images={previewData.project1_signInImages} onImagesChange={handleProject1SignInImagesChange} caption={previewData.project1_signInCaption} onCaptionChange={handleProject1SignInCaptionChange} figurePrefix="4.1.3" />
        </div>

        <h4>4.1.2.4 Another Part of the Project</h4>
        <div>
          <div dangerouslySetInnerHTML={previewData.project1_signUpScreenHtml || {__html: "<p><Placeholder>Describe another part of the project in Step 5.</Placeholder></p>"}}></div>
          <ImageSelector images={previewData.project1_signUpImages} onImagesChange={handleProject1SignUpImagesChange} caption={previewData.project1_signUpCaption} onCaptionChange={handleProject1SignUpCaptionChange} figurePrefix="4.1.4" />
        </div>
        
        <h4>4.1.2.5 Final State/Main View</h4>
        <div>
          <div dangerouslySetInnerHTML={previewData.project1_homeScreenHtml || {__html: "<p><Placeholder>Describe the final state or main view of the project in Step 5.</Placeholder></p>"}}></div>
          <ImageSelector images={previewData.project1_homeScreenImages} onImagesChange={handleProject1HomeScreenImagesChange} caption={previewData.project1_homeScreenCaption} onCaptionChange={handleProject1HomeScreenCaptionChange} figurePrefix="4.1.5" />
        </div>
        
        <h4>4.1.3 Tools and Technologies Used</h4>
        <div dangerouslySetInnerHTML={previewData.project1_toolsHtml || {__html: "<p><Placeholder>List tools for project 1 in Step 5.</Placeholder></p>"}}></div>
        
        <h3>4.2 Project 2</h3>
        <div dangerouslySetInnerHTML={previewData.project2_introHtml || {__html: "<p><Placeholder>Introduce project 2 in Step 5.</Placeholder></p>"}}></div>
        
        <h4>4.2.1 Project Description</h4>
        <div dangerouslySetInnerHTML={previewData.project2_descHtml || {__html: "<p><Placeholder>Describe project 2 in Step 5.</Placeholder></p>"}}></div>

        <h4>4.2.1.1 Project Structure</h4>
        <div dangerouslySetInnerHTML={previewData.project2_structureHtml || {__html: "<p><Placeholder>Describe the project's structure in Step 5.</Placeholder></p>"}}></div>
        
        <h4>4.2.1.2 User Interface</h4>
        <div dangerouslySetInnerHTML={previewData.project2_uiHtml || {__html: "<p><Placeholder>Describe the project's UI in Step 5.</Placeholder></p>"}}></div>

        <h4>4.2.1.3 Core Functionality</h4>
        <div>
            <div dangerouslySetInnerHTML={previewData.project2_coreHtml || {__html: "<p><Placeholder>Describe the project's core functionality in Step 5.</Placeholder></p>"}}></div>
            <ImageSelector images={previewData.project2_codeSnippetImages} onImagesChange={handleProject2CodeSnippetImagesChange} caption={previewData.project2_codeSnippetCaption} onCaptionChange={handleProject2CodeSnippetCaptionChange} figurePrefix="4.1.6" />
        </div>
        
        <h3>4.3 Tools and Technologies Used</h3>
        <div dangerouslySetInnerHTML={previewData.project2_toolsHtml || {__html: "<p><Placeholder>List tools for project 2 in Step 5.</Placeholder></p>"}}></div>
      </div>


      {/* Chapter 5 */}
      <div style={{ pageBreakBefore: 'always' }} className="text-left">
        <h2 className="text-center">CHAPTER 5: CHALLENGES ENCOUNTERED AND CONCLUSION</h2>
        <h3>5.1 Challenges Encountered and Solutions</h3>
         {previewData.challengesHtml ? (
             <div dangerouslySetInnerHTML={previewData.challengesHtml} className="prose"></div>
         ) : (
             <p><Placeholder>Describe the challenges you faced in Step 6.</Placeholder></p>
         )}
        <h3>5.2 Conclusion</h3>
        {previewData.conclusionHtml ? (
            <div dangerouslySetInnerHTML={previewData.conclusionHtml}></div>
        ) : (
            <p><Placeholder>Summarize your experience in Step 6.</Placeholder></p>
        )}
      </div>

    </Card>
  );
}
