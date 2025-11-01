'use client';

import { ReportData } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface ReportPreviewProps {
  formData: ReportData;
}

const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <span className="preview-placeholder">{children}</span>
);

function formatPreviewText(text: string | undefined | null) {
  if (!text) return null;
  const html = text
    .replace(/</g, "&lt;").replace(/>/g, "&gt;") // Basic HTML escape
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br />');

  return { __html: html };
}

export default function ReportPreview({ formData }: ReportPreviewProps) {
  const previewData = {
    ...formData,
    acknowledgementHtml: formatPreviewText(formData.acknowledgementText),
    abstractHtml: formatPreviewText(formData.abstractText),
    companyProfileHtml: formatPreviewText(formData.companyProfile),
    scopeOfSpecializationHtml: formatPreviewText(formData.scopeOfSpecialization),
    challengesHtml: formatPreviewText(formData.challengesText),
  };

  return (
    <Card id="preview-content" className="w-full max-w-[8.5in] min-h-[11in] mx-auto p-8 sm:p-12 md:p-16 text-foreground shadow-lg">
      <style jsx global>{`
        #preview-content h1, #preview-content h2, #preview-content h3 {
            font-weight: 700;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: hsl(var(--foreground));
        }
        #preview-content h1 { font-size: 1.8rem; text-align: center; border-bottom: 2px solid hsl(var(--border)); padding-bottom: 1rem; }
        #preview-content h2 { font-size: 1.4rem; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.5rem; }
        #preview-content h3 { font-size: 1.1rem; font-weight: 600; }
        #preview-content p, #preview-content li { font-size: 1rem; line-height: 1.6; margin-bottom: 1rem; }
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
      <div style={{ pageBreakBefore: 'always' }}>
        <h2>ACKNOWLEDGEMENT</h2>
        {previewData.acknowledgementHtml ? (
            <p dangerouslySetInnerHTML={previewData.acknowledgementHtml}></p>
        ) : (
            <p><Placeholder>Fill out Step 4 and generate this section.</Placeholder></p>
        )}
      </div>

      {/* Abstract */}
      <div style={{ pageBreakBefore: 'always' }}>
        <h2>ABSTRACT</h2>
        {previewData.abstractHtml ? (
            <p dangerouslySetInnerHTML={previewData.abstractHtml}></p>
        ) : (
            <p><Placeholder>Fill out Step 4 and generate this section.</Placeholder></p>
        )}
      </div>

      {/* Table of Contents */}
      <div style={{ pageBreakBefore: 'always' }} className="prose prose-sm">
        <h2>TABLE OF CONTENTS</h2>
        <p className="text-sm leading-relaxed">
            Cover Page<br />
            Acknowledgement<br />
            Abstract<br />
            Table of Contents<br />
            <br />
            <strong>Chapter One: Introduction</strong><br />
            1.1 Brief History of SIWES<br />
            1.2 Objectives and Aims of SIWES<br />
            1.3 Place of Attachment<br />
            1.4 Brief Profile of Place of Attachment<br />
            1.5 Scope of Specialization<br />
            <br />
            <strong>Chapter Two: Skills Learnt</strong><br />
            2.1 Description of Skills<br />
            2.2 Tools and Technologies used<br />
            <br />
            <strong>Chapter Three: Challenges and Conclusions</strong><br />
            3.1 Challenges Encountered and Solutions<br />
            3.2 Conclusion<br />
        </p>
      </div>
      
      {/* Chapter 1 */}
      <div style={{ pageBreakBefore: 'always' }}>
        <h2>CHAPTER 1: INTRODUCTION</h2>
        <h3>1.1 Brief History of SIWES</h3>
        <p>The Students Industrial Work Experience Scheme (SIWES) is a skills training program designed to equip students from universities, polytechnics, and other higher institutions with practical industry experience. It provides hands-on exposure to equipment and machinery that are often unavailable in academic institutions.</p>
        <h3>1.2 Objectives of SIWES</h3>
        <p>SIWES aims to bridge the gap between theory and practice, provide students with an opportunity to apply their knowledge in real-world situations, and expose them to work methods and techniques in handling equipment and machinery that may not be available in their institutions.</p>
        <h3>1.3 PLACE OF ATTACHMENT</h3>
        <p>My Industrial Training was undertaken at <strong>{previewData.placeOfAttachment || <Placeholder>Place of Attachment</Placeholder>}</strong>.</p>
        <h3>1.4 BRIEF PROFILE OF PLACE OF ATTACHMENT</h3>
        {previewData.companyProfileHtml ? (
            <p dangerouslySetInnerHTML={previewData.companyProfileHtml}></p>
        ) : (
            <p><Placeholder>This section will be filled in by the AI profile generator.</Placeholder></p>
        )}
         <p>Founded and managed by <strong>{previewData.ceoName || <Placeholder>CEO Name</Placeholder>}</strong>, the company is located at <strong>{previewData.attachmentLocation || <Placeholder>Attachment Location</Placeholder>}</strong>.</p>
        <h3>1.5 SCOPE OF SPECIALIZATION</h3>
        {previewData.scopeOfSpecializationHtml ? (
             <div dangerouslySetInnerHTML={previewData.scopeOfSpecializationHtml} className="prose"></div>
        ) : (
            <p><Placeholder>This section will be filled in by the AI profile generator.</Placeholder></p>
        )}
      </div>

      {/* Chapter 2 (dynamic) */}
      <div style={{ pageBreakBefore: 'always' }}>
        <h2>CHAPTER 2: SKILLS LEARNT</h2>
        <h3>2.1 Description of Skills</h3>
        <p>During my attachment, I focused on developing skills in <strong>{previewData.primarySkill || <Placeholder>Primary Skill</Placeholder>}</strong> within the broader field of <strong>{previewData.fieldOfStudy || <Placeholder>Field of Study</Placeholder>}</strong>. The training was comprehensive, covering both theoretical concepts and practical application.</p>
        <h3>2.2 Tools and Technologies Used</h3>
        <p>The primary tools and technologies I worked with include <strong>{previewData.technologiesUsed || <Placeholder>Technologies Used</Placeholder>}</strong>. Specifically, I used the <strong>{previewData.programmingLanguage || <Placeholder>Programming Language</Placeholder>}</strong> language and the <strong>{previewData.framework || <Placeholder>Framework</Placeholder>}</strong> framework to build and manage projects.</p>
      </div>

      {/* Chapter 3 (Challenges and Conclusion) */}
      <div style={{ pageBreakBefore: 'always' }}>
        <h2>CHAPTER 3: CHALLENGES AND CONCLUSION</h2>
        <h3>3.1 Challenges Encountered and Solutions</h3>
         {previewData.challengesHtml ? (
             <div dangerouslySetInnerHTML={previewData.challengesHtml} className="prose"></div>
         ) : (
             <p><Placeholder>Fill out Step 4 and generate this section.</Placeholder></p>
         )}
        <h3>3.2 Conclusion</h3>
        <p>The Students Industrial Work Experience Scheme at <strong>{previewData.placeOfAttachment || <Placeholder>Place of Attachment</Placeholder>}</strong> has been an invaluable and enlightening experience. It provided a practical dimension to my academic studies and has solidified my interest in pursuing a career in <strong>{previewData.careerPath || <Placeholder>Desired Career Path</Placeholder>}</strong>. The hands-on experience and the challenges overcome have equipped me with the confidence and skills necessary for my future professional endeavors.</p>
      </div>

    </Card>
  );
}
