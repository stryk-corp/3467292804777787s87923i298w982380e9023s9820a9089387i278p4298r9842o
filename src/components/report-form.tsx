'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useDebounce } from 'use-debounce';
import type { ReportData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import mermaid from 'mermaid';

import { generateCompanyProfile } from '@/ai/flows/generate-company-profile';
import { generateReportSections } from '@/ai/flows/generate-report-sections';
import { provideAISuggestions } from '@/ai/flows/provide-ai-suggestions';
import { generateSkillsChapter } from '@/ai/flows/generate-skills-chapter';
import { generateChapterFive } from '@/ai/flows/generate-chapter-five';
import { generateDiagram } from '@/ai/flows/generate-diagram-flow';

interface ReportFormProps {
  formData: ReportData;
  setFormData: Dispatch<SetStateAction<ReportData>>;
}

type Suggestion = {
    courseCode?: string;
    fieldOfStudy?: string;
    primarySkill?: string;
    technologiesUsed?: string;
    programmingLanguage?: string;
    framework?: string;
    careerPath?: string;
    challengesText?: string;
    conclusionText?: string;
    projectIntro?: string;
    companyVision?: string;
    companyMission?: string;
    companyValues?: string;
    organogramAbbreviations?: string;
    project1_intro?: string;
    project1_desc?: string;
    project1_welcomeScreen?: string;
    project1_signInScreen?: string;
    project1_validation?: string;
    project1_signUpScreen?: string;
    project1_homeScreen?: string;
    project1_tools?: string;
    project2_intro?: string;
    project2_desc?: string;
    project2_structure?: string;
    project2_ui?: string;
    project2_core?: string;
    project2_tools?: string;
}

const TOTAL_STEPS = 6;

export default function ReportForm({ formData, setFormData }: ReportFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [loadingStates, setLoadingStates] = useState({
    profile: false,
    sections: false,
    skills: false,
    chapterFive: false,
    regenerate: false,
    suggestions: false,
    diagram: false,
  });
  const [suggestions, setSuggestions] = useState<Suggestion>({});
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const { toast } = useToast();
  
  const [debouncedFormData] = useDebounce(formData, 1500);

  const requiredFields = useMemo(() => [
    'placeOfAttachment', 'supervisorNames', 'departmentName', 'fieldOfStudy',
    'attachmentLocation', 'primarySkill', 'framework', 'programmingLanguage', 'careerPath',
    'fullName', 'universityName', 'facultyName'
  ], []);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
  }, []);

  useEffect(() => {
    const areAllFieldsFilled = requiredFields.every(field => !!formData[field as keyof ReportData]);
    setAllFieldsFilled(areAllFieldsFilled);
  }, [formData, requiredFields]);

  const handleFetchSuggestions = async () => {
    const hasContext = Object.values(formData).some(val => typeof val === 'string' && val.trim() !== '');
    if (!hasContext) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill in at least one field to get suggestions." });
        return;
    }

    setLoadingStates(prev => ({...prev, suggestions: true}));
    toast({ title: "Getting Suggestions", description: "The AI is thinking..." });
    try {
        const result = await provideAISuggestions(formData);
        setSuggestions(prev => ({ ...prev, ...result }));
        toast({ title: "Suggestions Ready!", description: "AI suggestions have been added to relevant fields." });
    } catch (error) {
        console.error("AI Suggestion Error:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch AI suggestions." });
    } finally {
        setLoadingStates(prev => ({...prev, suggestions: false}));
    }
  };


  const runAutoGeneration = async () => {
    // Generate Ack and Abstract
    if (!loadingStates.sections) {
      setLoadingStates(prev => ({...prev, sections: true}));
      try {
          const result = await generateReportSections(debouncedFormData);
          setFormData(prev => ({
              ...prev,
              acknowledgementText: result.acknowledgementText,
              abstractText: result.abstractText,
          }));
          toast({ title: "Success", description: "Acknowledgement and Abstract generated." });
      } catch (error) {
          console.error(error);
          toast({ variant: "destructive", title: "Error", description: "Failed to auto-generate sections." });
      } finally {
          setLoadingStates(prev => ({...prev, sections: false}));
      }
    }
    
    // Generate Skills Chapter
    if (!loadingStates.skills) {
        setLoadingStates(prev => ({...prev, skills: true}));
        try {
            const result = await generateSkillsChapter(debouncedFormData);
            setFormData(prev => ({
                ...prev,
                skillsChapterText: result.skillsChapterText,
            }));
            toast({ title: "Success", description: "Chapter 3 (Skills Learnt) generated." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to generate Chapter 3." });
        } finally {
            setLoadingStates(prev => ({...prev, skills: false}));
        }
    }

     // Generate Chapter 5
    if (!loadingStates.chapterFive) {
      setLoadingStates(prev => ({...prev, chapterFive: true}));
      try {
          const result = await generateChapterFive(debouncedFormData);
          setFormData(prev => ({
              ...prev,
              challengesText: result.challengesText,
              conclusionText: result.conclusionText,
          }));
          toast({ title: "Success", description: "Chapter 5 (Challenges & Conclusion) generated." });
      } catch (error) {
          console.error(error);
          toast({ variant: "destructive", title: "Error", description: "Failed to generate Chapter 5." });
      } finally {
          setLoadingStates(prev => ({...prev, chapterFive: false}));
      }
    }
  };


  useEffect(() => {
    async function autoGenerateContent() {
      const allRequiredFieldsFilled = requiredFields.every(field => !!debouncedFormData[field as keyof ReportData]);

      if (allRequiredFieldsFilled) {
        // Generate only if the text fields are empty to prevent overwriting user changes
        if (!formData.acknowledgementText && !formData.abstractText && !formData.skillsChapterText && !formData.challengesText && !formData.conclusionText) {
          runAutoGeneration();
        }
      }
    }

    if (currentStep >= 4) {
        autoGenerateContent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFormData, currentStep, requiredFields, formData.acknowledgementText, formData.abstractText, formData.skillsChapterText, formData.challengesText, formData.conclusionText]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    startTransition(() => {
      setFormData((prev) => ({ ...prev, [id]: value }));
    });
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
        await handleRegenerate();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateProfile = async () => {
    if (!formData.placeOfAttachment) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please enter your 'Place of Attachment' in Step 2." });
      return;
    }
    setLoadingStates(prev => ({ ...prev, profile: true }));
    try {
      const { profile, services, attachmentLocation, ceoName } = await generateCompanyProfile({ placeOfAttachment: formData.placeOfAttachment });
      setFormData(prev => ({
        ...prev,
        companyProfile: profile,
        scopeOfSpecialization: services.map(s => `- ${s}`).join('\n'),
        attachmentLocation: attachmentLocation || prev.attachmentLocation,
        ceoName: ceoName || prev.ceoName,
      }));
      toast({ title: "Success", description: "Company profile generated." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate company profile." });
    } finally {
      setLoadingStates(prev => ({ ...prev, profile: false }));
    }
  };
  
  const handleGenerateDiagram = async () => {
    if (!formData.organogramAbbreviations) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide the organogram abbreviations first.',
      });
      return;
    }
    setLoadingStates(prev => ({...prev, diagram: true}));
    toast({title: 'Generating Diagram', description: 'The AI is creating your diagram...'});
    try {
      const {mermaidSyntax} = await generateDiagram({
        description: formData.organogramAbbreviations,
      });

      const { svg } = await mermaid.render('mermaid-graph', mermaidSyntax);

      const svgElement = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
      const viewBox = svgElement.getAttribute('viewBox');
      const width = svgElement.getAttribute('width');
      const height = svgElement.getAttribute('height');
      
      if (width && height && !viewBox) {
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      
      // Remove the transform that centers the diagram
      const gElement = svgElement.querySelector('g');
      if (gElement) {
        gElement.removeAttribute('transform');
      }

      const finalSvg = new XMLSerializer().serializeToString(svgElement);
      const dataUrl = `data:image/svg+xml;base64,${btoa(finalSvg)}`;

      setFormData(prev => ({
        ...prev,
        organogramImage: [dataUrl],
      }));

      toast({title: 'Success!', description: 'Organogram diagram has been generated.'});
    } catch (error) {
      console.error('Diagram Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate the diagram.',
      });
    } finally {
      setLoadingStates(prev => ({...prev, diagram: false}));
    }
  };

  const handleRegenerate = async () => {
    if (!allFieldsFilled) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill all required fields before generating." });
      return;
    }
    setLoadingStates(prev => ({ ...prev, regenerate: true }));
    toast({ title: "Generating Report Content", description: "Please wait while the AI writes the report sections..." });
    
    // Clear existing text to indicate regeneration
    setFormData(prev => ({
        ...prev,
        acknowledgementText: "Generating...",
        abstractText: "Generating...",
        skillsChapterText: "Generating...",
        challengesText: "Generating...",
        conclusionText: "Generating...",
    }));

    try {
      // We can run them in parallel
      await Promise.all([
        (async () => {
          const sectionsResult = await generateReportSections(formData);
          setFormData(prev => ({
            ...prev,
            acknowledgementText: sectionsResult.acknowledgementText,
            abstractText: sectionsResult.abstractText,
          }));
        })(),
        (async () => {
          const skillsResult = await generateSkillsChapter(formData);
          setFormData(prev => ({
            ...prev,
            skillsChapterText: skillsResult.skillsChapterText,
          }));
        })(),
         (async () => {
          const chapterFiveResult = await generateChapterFive(formData);
          setFormData(prev => ({
            ...prev,
            challengesText: chapterFiveResult.challengesText,
            conclusionText: chapterFiveResult.conclusionText,
          }));
        })(),
      ]);
      toast({ title: "Success!", description: "Report sections have been generated." });
    } catch (error) {
      console.error("Regeneration Error:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate content." });
       // Restore previous content on error if needed, or clear it
       setFormData(prev => ({
        ...prev,
        acknowledgementText: prev.acknowledgementText === 'Generating...' ? '' : prev.acknowledgementText,
        abstractText: prev.abstractText === 'Generating...' ? '' : prev.abstractText,
        skillsChapterText: prev.skillsChapterText === 'Generating...' ? '' : prev.skillsChapterText,
        challengesText: prev.challengesText === 'Generating...' ? '' : prev.challengesText,
        conclusionText: prev.conclusionText === 'Generating...' ? '' : prev.conclusionText,
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, regenerate: false }));
    }
  };
  
  const AiButton = ({ onClick, loading, children, ...props }: React.ComponentProps<typeof Button> & { loading: boolean }) => (
      <Button type="button" onClick={onClick} disabled={loading} {...props}>
          {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
          <span className="ml-2">{children}</span>
      </Button>
  );

  const SuggestionPill = ({ field }: { field: keyof Suggestion }) => {
    const suggestionValue = suggestions[field];
    if (!suggestionValue || formData[field as keyof ReportData]) return null;

    const applySuggestion = () => {
        setFormData(prev => ({ ...prev, [field]: suggestionValue }));
        setSuggestions(prev => ({ ...prev, [field]: undefined }));
    };

    return (
        <button
            type="button"
            onClick={applySuggestion}
            className="mt-2 flex items-center gap-2 text-sm text-accent-foreground bg-accent/20 border border-accent/30 px-3 py-1 rounded-full hover:bg-accent/30 transition-colors"
        >
            <Sparkles className="w-3 h-3" />
            Suggestion: {suggestionValue}
        </button>
    );
  };

  return (
    <div className="mt-6">
        <div className="mb-4">
            <p className="text-sm font-medium text-primary">Step {currentStep} of {TOTAL_STEPS}</p>
            <Progress value={(currentStep / TOTAL_STEPS) * 100} className="w-full h-2 mt-2" />
        </div>
        
        <div className="mb-8 text-center">
            <Button type="button" onClick={handleFetchSuggestions} disabled={loadingStates.suggestions} variant="outline" size="sm">
                {loadingStates.suggestions ? <Loader2 className="animate-spin" /> : <Sparkles />}
                <span className="ml-2">Get AI Suggestions</span>
            </Button>
        </div>


        <form>
            {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Basic Information</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g., John Doe" /></div>
                        <div><Label htmlFor="regNumber">Registration Number</Label><Input id="regNumber" value={formData.regNumber} onChange={handleInputChange} placeholder="e.g., 2021/123456" /></div>
                        <div><Label htmlFor="universityName">University Name</Label><Input id="universityName" value={formData.universityName} onChange={handleInputChange} placeholder="e.g., Federal University of Technology" /></div>
                        <div><Label htmlFor="facultyName">Faculty Name</Label><Input id="facultyName" value={formData.facultyName} onChange={handleInputChange} placeholder="e.g., Faculty of Engineering" /></div>
                        <div><Label htmlFor="departmentName">Department Name</Label><Input id="departmentName" value={formData.departmentName} onChange={handleInputChange} placeholder="e.g., Department of Computer Engineering" /></div>
                        <div><Label htmlFor="courseCode">Course Code</Label><Input id="courseCode" value={formData.courseCode} onChange={handleInputChange} placeholder="e.g., CPE 501" /><SuggestionPill field="courseCode"/></div>
                        <div className="flex space-x-4">
                            <div className="w-1/2"><Label htmlFor="reportMonth">Report Month</Label><Input id="reportMonth" value={formData.reportMonth} onChange={handleInputChange} placeholder="e.g., August" /></div>
                            <div className="w-1/2"><Label htmlFor="reportYear">Report Year</Label><Input type="number" id="reportYear" value={formData.reportYear} onChange={handleInputChange} placeholder="e.g., 2024" /></div>
                        </div>
                        <div><Label htmlFor="projectsDescription">All Projects Description</Label><Textarea id="projectsDescription" value={formData.projectsDescription} onChange={handleInputChange} placeholder="Briefly describe the projects you worked on. e.g., 'I built a company dashboard and a blog...'" className="min-h-[120px]" /></div>
                    </div>
                </div>
            )}
            
            {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Company Information</h2>
                     <div className="space-y-6">
                        <div><Label htmlFor="placeOfAttachment">Place of Attachment</Label><Input id="placeOfAttachment" value={formData.placeOfAttachment} onChange={handleInputChange} placeholder="e.g., Tech Innovations Inc." /></div>
                        <div><Label htmlFor="attachmentLocation">Attachment Location (Address)</Label><Input id="attachmentLocation" value={formData.attachmentLocation} onChange={handleInputChange} placeholder="e.g., 123 Tech Avenue, Silicon Valley" /></div>
                        <div><Label htmlFor="supervisorNames">Supervisor Names (comma separated)</Label><Input id="supervisorNames" value={formData.supervisorNames} onChange={handleInputChange} placeholder="e.g., Mr. John Smith, Mrs. Jane Doe" /></div>
                        <div><Label htmlFor="ceoName">CEO/Manager Name</Label><Input id="ceoName" value={formData.ceoName} onChange={handleInputChange} placeholder="e.g., Mr. Alex CEO" /></div>
                        <div>
                            <div className="flex justify-between items-center mb-2"><Label htmlFor="companyProfile">Brief Company Profile</Label><AiButton size="sm" variant="outline" onClick={handleGenerateProfile} loading={loadingStates.profile}>Generate Profile</AiButton></div>
                            <Textarea id="companyProfile" value={formData.companyProfile} onChange={handleInputChange} placeholder="Generated by AI or enter manually..." className="min-h-[120px]" />
                        </div>
                        <div><Label htmlFor="scopeOfSpecialization">Scope of Specialization (Services)</Label><Textarea id="scopeOfSpecialization" value={formData.scopeOfSpecialization} onChange={handleInputChange} placeholder="Generated by AI or enter manually..." className="min-h-[120px]" /></div>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                 <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Organizational Structure</h2>
                    <div className="space-y-6">
                      <div><Label htmlFor="companyVision">Company Vision</Label><Textarea id="companyVision" value={formData.companyVision} onChange={handleInputChange} placeholder="Enter the company's vision statement..." className="min-h-[100px]" /><SuggestionPill field="companyVision"/></div>
                      <div><Label htmlFor="companyMission">Company Mission</Label><Textarea id="companyMission" value={formData.companyMission} onChange={handleInputChange} placeholder="Enter the company's mission statement..." className="min-h-[100px]" /><SuggestionPill field="companyMission"/></div>
                      <div><Label htmlFor="companyValues">Company Values</Label><Textarea id="companyValues" value={formData.companyValues} onChange={handleInputChange} placeholder="Enter the company's core values, separated by commas..." className="min-h-[100px]" /><SuggestionPill field="companyValues"/></div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                           <Label htmlFor="organogramAbbreviations">Organogram Abbreviations</Label>
                           <AiButton size="sm" variant="outline" onClick={handleGenerateDiagram} loading={loadingStates.diagram}>Generate Diagram</AiButton>
                        </div>
                        <Textarea id="organogramAbbreviations" value={formData.organogramAbbreviations} onChange={handleInputChange} placeholder="e.g. CEO - Chief Executive Officer" className="min-h-[120px]" /><SuggestionPill field="organogramAbbreviations"/>
                      </div>
                    </div>
                </div>
            )}

            {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Technical Details</h2>
                    <p className="text-muted-foreground -mt-4">Provide these details to help the AI write a better report.</p>
                     <div className="space-y-6">
                        <div><Label htmlFor="fieldOfStudy">Field of Study/Work</Label><Input id="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleInputChange} placeholder="e.g., Software Development" /><SuggestionPill field="fieldOfStudy" /></div>
                        <div><Label htmlFor="primarySkill">Primary Skill Area</Label><Input id="primarySkill" value={formData.primarySkill} onChange={handleInputChange} placeholder="e.g., Web Development" /><SuggestionPill field="primarySkill" /></div>
                        <div><Label htmlFor="technologiesUsed">Technologies Used (comma separated)</Label><Input id="technologiesUsed" value={formData.technologiesUsed} onChange={handleInputChange} placeholder="e.g., React, Node.js, MongoDB" /><SuggestionPill field="technologiesUsed" /></div>
                        <div><Label htmlFor="programmingLanguage">Primary Programming Language</Label><Input id="programmingLanguage" value={formData.programmingLanguage} onChange={handleInputChange} placeholder="e.g., JavaScript" /><SuggestionPill field="programmingLanguage" /></div>
                        <div><Label htmlFor="framework">Primary Framework</Label><Input id="framework" value={formData.framework} onChange={handleInputChange} placeholder="e.g., Next.js" /><SuggestionPill field="framework" /></div>
                        <div><Label htmlFor="careerPath">Desired Career Path</Label><Input id="careerPath" value={formData.careerPath} onChange={handleInputChange} placeholder="e.g., Full Stack Developer" /><SuggestionPill field="careerPath" /></div>
                    </div>
                </div>
            )}

             {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Projects Developed</h2>
                    <p className="text-muted-foreground -mt-4">Describe the projects you worked on during your internship.</p>
                    <div className="space-y-4 border-l-2 border-primary/20 pl-4">
                      <h3 className="text-lg font-semibold">Overall Project Introduction</h3>
                      <Textarea id="projectIntro" value={formData.projectIntro} onChange={handleInputChange} placeholder="Provide a brief introduction to the projects you worked on. E.g., 'During my SIWES training, I developed two main projects...'" className="min-h-[100px]" />
                      <SuggestionPill field="projectIntro" />
                    </div>
                    <div className="space-y-4 border-l-2 border-primary/20 pl-4 pt-4">
                        <h3 className="text-lg font-semibold">Project 1</h3>
                        <Textarea id="project1_intro" value={formData.project1_intro} onChange={handleInputChange} placeholder="Give your first project a title and introduce it here..." className="min-h-[100px]" />
                        <SuggestionPill field="project1_intro"/>
                        <Textarea id="project1_desc" value={formData.project1_desc} onChange={handleInputChange} placeholder="Describe the project's features and architecture..."/>
                        <SuggestionPill field="project1_desc"/>
                        <Textarea id="project1_welcomeScreen" value={formData.project1_welcomeScreen} onChange={handleInputChange} placeholder="Describe a key feature or screen..."/>
                        <SuggestionPill field="project1_welcomeScreen"/>
                        <Textarea id="project1_signInScreen" value={formData.project1_signInScreen} onChange={handleInputChange} placeholder="Describe another feature or screen..."/>
                        <SuggestionPill field="project1_signInScreen"/>
                        <Textarea id="project1_validation" value={formData.project1_validation} onChange={handleInputChange} placeholder="Explain any challenges and solutions for this project..."/>
                        <SuggestionPill field="project1_validation"/>
                        <Textarea id="project1_signUpScreen" value={formData.project1_signUpScreen} onChange={handleInputChange} placeholder="Describe another part of the project..."/>
                        <SuggestionPill field="project1_signUpScreen"/>
                        <Textarea id="project1_homeScreen" value={formData.project1_homeScreen} onChange={handleInputChange} placeholder="Describe the final state or main view of the project..."/>
                        <SuggestionPill field="project1_homeScreen"/>
                        <Textarea id="project1_tools" value={formData.project1_tools} onChange={handleInputChange} placeholder="List the tools and technologies used for this project..."/>
                        <SuggestionPill field="project1_tools"/>
                    </div>
                    <div className="space-y-4 border-l-2 border-primary/20 pl-4 pt-4">
                        <h3 className="text-lg font-semibold">Project 2</h3>
                        <Textarea id="project2_intro" value={formData.project2_intro} onChange={handleInputChange} placeholder="Give your second project a title and introduce it here..." className="min-h-[100px]" />
                        <SuggestionPill field="project2_intro"/>
                        <Textarea id="project2_desc" value={formData.project2_desc} onChange={handleInputChange} placeholder="Describe the project's features and architecture..."/>
                        <SuggestionPill field="project2_desc"/>
                        <Textarea id="project2_structure" value={formData.project2_structure} onChange={handleInputChange} placeholder="Describe the project's structure..." />
                        <SuggestionPill field="project2_structure"/>
                        <Textarea id="project2_ui" value={formData.project2_ui} onChange={handleInputChange} placeholder="Describe the User Interface design and key components..." />
                        <SuggestionPill field="project2_ui"/>
                        <Textarea id="project2_core" value={formData.project2_core} onChange={handleInputChange} placeholder="Describe the core logic and functionality of the project..." />
                        <SuggestionPill field="project2_core"/>
                        <Textarea id="project2_tools" value={formData.project2_tools} onChange={handleInputChange} placeholder="List the tools and technologies used for this project..." />
                        <SuggestionPill field="project2_tools"/>
                    </div>
                </div>
            )}

            {currentStep === 6 && (
                 <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Report Content</h2>
                     <div className="flex items-center text-sm text-muted-foreground mb-4">
                        {(loadingStates.sections || loadingStates.skills || loadingStates.chapterFive || loadingStates.regenerate) && <><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span>Generating report sections... This may take a moment.</span></>}
                     </div>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="acknowledgementText">Acknowledgement</Label>
                            <Textarea id="acknowledgementText" value={formData.acknowledgementText} onChange={handleInputChange} placeholder="This will be generated automatically based on your inputs..." className="min-h-[150px]" />
                        </div>
                        <div>
                           <Label htmlFor="abstractText">Abstract</Label>
                           <Textarea id="abstractText" value={formData.abstractText} onChange={handleInputChange} placeholder="This will be generated automatically based on your inputs..." className="min-h-[150px]" />
                        </div>
                        <div>
                           <Label htmlFor="skillsChapterText">Chapter 3: Skills Learnt</Label>
                           <Textarea id="skillsChapterText" value={formData.skillsChapterText} onChange={handleInputChange} placeholder="This will be generated automatically based on your inputs..." className="min-h-[150px]" />
                        </div>
                        <div>
                            <Label htmlFor="challengesText">Challenges Encountered & Solutions</Label>
                            <Textarea id="challengesText" value={formData.challengesText} onChange={handleInputChange} placeholder="Describe the technical challenges you faced and how you solved them..." className="min-h-[150px]" />
                            <SuggestionPill field="challengesText" />
                        </div>
                        <div>
                            <Label htmlFor="conclusionText">Conclusion</Label>
                            <Textarea id="conclusionText" value={formData.conclusionText} onChange={handleInputChange} placeholder="Summarize your experience and key learnings..." className="min-h-[150px]" />
                            <SuggestionPill field="conclusionText" />
                        </div>
                    </div>
                </div>
            )}

             <div className="mt-10 flex justify-between items-center">
                <Button type="button" onClick={handlePrev} variant="outline" disabled={currentStep === 1}>Previous</Button>
                
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  variant="default"
                  disabled={loadingStates.regenerate || (currentStep === TOTAL_STEPS && !allFieldsFilled)}
                >
                  {loadingStates.regenerate && <Loader2 className="animate-spin" />}
                  <span className="ml-2">
                    {currentStep === TOTAL_STEPS ? 'Generate Report' : 'Next'}
                  </span>
                </Button>
            </div>
        </form>
    </div>
  );
}

    
