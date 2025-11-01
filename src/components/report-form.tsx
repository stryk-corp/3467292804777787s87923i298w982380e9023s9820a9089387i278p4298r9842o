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

import { generateCompanyProfile } from '@/ai/flows/generate-company-profile';
import { generateReportSections } from '@/ai/flows/generate-report-sections';
import { provideAISuggestions } from '@/ai/flows/provide-ai-suggestions';
import { generateSkillsChapter } from '@/ai/flows/generate-skills-chapter';

interface ReportFormProps {
  formData: ReportData;
  setFormData: Dispatch<SetStateAction<ReportData>>;
}

type Suggestion = {
    fieldOfStudy?: string;
    primarySkill?: string;
    technologiesUsed?: string;
    programmingLanguage?: string;
    framework?: string;
    careerPath?: string;
}

const TOTAL_STEPS = 6;

export default function ReportForm({ formData, setFormData }: ReportFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [loadingStates, setLoadingStates] = useState({
    profile: false,
    sections: false,
    skills: false,
  });
  const [suggestions, setSuggestions] = useState<Suggestion>({});
  const { toast } = useToast();

  const suggestionQuery = useMemo(() => ({
      departmentName: formData.departmentName,
      fieldOfStudy: formData.fieldOfStudy,
      primarySkill: formData.primarySkill
  }), [formData.departmentName, formData.fieldOfStudy, formData.primarySkill]);
  
  const [debouncedSuggestionQuery] = useDebounce(suggestionQuery, 1000);
  const [debouncedFormData] = useDebounce(formData, 1500);

  useEffect(() => {
    async function fetchSuggestions() {
        if (debouncedSuggestionQuery.departmentName || debouncedSuggestionQuery.fieldOfStudy || debouncedSuggestionQuery.primarySkill) {
            try {
                const result = await provideAISuggestions(debouncedSuggestionQuery);
                setSuggestions(result);
            } catch (error) {
                console.error("AI Suggestion Error:", error);
            }
        }
    }
    fetchSuggestions();
  }, [debouncedSuggestionQuery]);

  useEffect(() => {
    async function autoGenerateContent() {
      const requiredFields = [
        'placeOfAttachment', 'supervisorNames', 'departmentName', 'fieldOfStudy',
        'attachmentLocation', 'primarySkill', 'framework', 'programmingLanguage', 'careerPath'
      ];
      const allFieldsFilled = requiredFields.every(field => !!debouncedFormData[field as keyof ReportData]);

      if (allFieldsFilled) {
        // Generate Ack and Abstract
        if (!loadingStates.sections && !formData.acknowledgementText && !formData.abstractText) {
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
        if (!loadingStates.skills && !formData.skillsChapterText) {
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
      }
    }

    if (currentStep >= 4) {
        autoGenerateContent();
    }
  }, [debouncedFormData, currentStep, formData.acknowledgementText, formData.abstractText, formData.skillsChapterText, setFormData, toast, loadingStates]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    startTransition(() => {
      setFormData((prev) => ({ ...prev, [id]: value }));
    });
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
        toast({
            title: "Report Generation Finished!",
            description: "You can now copy or print your report from the preview.",
        });
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
        <div className="mb-8">
            <p className="text-sm font-medium text-primary">Step {currentStep} of {TOTAL_STEPS}</p>
            <Progress value={(currentStep / TOTAL_STEPS) * 100} className="w-full h-2 mt-2" />
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
                        <div><Label htmlFor="courseCode">Course Code</Label><Input id="courseCode" value={formData.courseCode} onChange={handleInputChange} placeholder="e.g., CPE 501" /></div>
                        <div className="flex space-x-4">
                            <div className="w-1/2"><Label htmlFor="reportMonth">Report Month</Label><Input id="reportMonth" value={formData.reportMonth} onChange={handleInputChange} placeholder="e.g., August" /></div>
                            <div className="w-1/2"><Label htmlFor="reportYear">Report Year</Label><Input type="number" id="reportYear" value={formData.reportYear} onChange={handleInputChange} placeholder="e.g., 2024" /></div>
                        </div>
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
                      <div><Label htmlFor="companyVision">Company Vision</Label><Textarea id="companyVision" value={formData.companyVision} onChange={handleInputChange} placeholder="Enter the company's vision statement..." /></div>
                      <div><Label htmlFor="companyMission">Company Mission</Label><Textarea id="companyMission" value={formData.companyMission} onChange={handleInputChange} placeholder="Enter the company's mission statement..." /></div>
                      <div><Label htmlFor="companyValues">Company Values</Label><Textarea id="companyValues" value={formData.companyValues} onChange={handleInputChange} placeholder="Enter the company's core values..." /></div>
                      <div><Label htmlFor="organogramAbbreviations">Organogram Abbreviations</Label><Textarea id="organogramAbbreviations" value={formData.organogramAbbreviations} onChange={handleInputChange} placeholder="e.g. CEO - Chief Executive Officer" className="min-h-[120px]" /></div>
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
                    </div>
                    <div className="space-y-4 border-l-2 border-primary/20 pl-4 pt-4">
                        <h3 className="text-lg font-semibold">Project 1</h3>
                        <Textarea id="project1_intro" value={formData.project1_intro} onChange={handleInputChange} placeholder="Give your first project a title and introduce it here..." className="min-h-[100px]" />
                        <Textarea id="project1_desc" value={formData.project1_desc} onChange={handleInputChange} placeholder="Describe the project's features and architecture..."/>
                        <Textarea id="project1_welcomeScreen" value={formData.project1_welcomeScreen} onChange={handleInputChange} placeholder="Describe a key feature or screen..."/>
                        <Textarea id="project1_signInScreen" value={formData.project1_signInScreen} onChange={handleInputChange} placeholder="Describe another feature or screen..."/>
                        <Textarea id="project1_validation" value={formData.project1_validation} onChange={handleInputChange} placeholder="Explain any challenges and solutions for this project..."/>
                        <Textarea id="project1_signUpScreen" value={formData.project1_signUpScreen} onChange={handleInputChange} placeholder="Describe another part of the project..."/>
                        <Textarea id="project1_homeScreen" value={formData.project1_homeScreen} onChange={handleInputChange} placeholder="Describe the final state or main view of the project..."/>
                        <Textarea id="project1_tools" value={formData.project1_tools} onChange={handleInputChange} placeholder="List the tools and technologies used for this project..."/>
                    </div>
                    <div className="space-y-4 border-l-2 border-primary/20 pl-4 pt-4">
                        <h3 className="text-lg font-semibold">Project 2</h3>
                        <Textarea id="project2_intro" value={formData.project2_intro} onChange={handleInputChange} placeholder="Give your second project a title and introduce it here..." className="min-h-[100px]" />
                        <Textarea id="project2_desc" value={formData.project2_desc} onChange={handleInputChange} placeholder="Describe the project's features and architecture..."/>
                        <Textarea id="project2_structure" value={formData.project2_structure} onChange={handleInputChange} placeholder="Describe the project's structure..." />
                        <Textarea id="project2_ui" value={formData.project2_ui} onChange={handleInputChange} placeholder="Describe the User Interface design and key components..." />
                        <Textarea id="project2_core" value={formData.project2_core} onChange={handleInputChange} placeholder="Describe the core logic and functionality of the project..." />
                        <Textarea id="project2_tools" value={formData.project2_tools} onChange={handleInputChange} placeholder="List the tools and technologies used for this project..." />
                    </div>
                </div>
            )}

            {currentStep === 6 && (
                 <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Report Content</h2>
                     <div className="flex items-center text-sm text-muted-foreground mb-4">
                        {(loadingStates.sections || loadingStates.skills) && <><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span>Auto-generating sections...</span></>}
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
                        </div>
                        <div>
                            <Label htmlFor="conclusionText">Conclusion</Label>
                            <Textarea id="conclusionText" value={formData.conclusionText} onChange={handleInputChange} placeholder="Summarize your experience and key learnings..." className="min-h-[150px]" />
                        </div>
                    </div>
                </div>
            )}

             <div className="mt-10 flex justify-between">
                <Button type="button" onClick={handlePrev} variant="outline" disabled={currentStep === 1}>Previous</Button>
                <Button type="button" onClick={handleNext} variant="default">{currentStep === TOTAL_STEPS ? 'Finish' : 'Next'}</Button>
            </div>
        </form>
    </div>
  );
}
