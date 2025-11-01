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

const TOTAL_STEPS = 4;

export default function ReportForm({ formData, setFormData }: ReportFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [loadingStates, setLoadingStates] = useState({
    profile: false,
    sections: false,
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
    async function autoGenerateSections() {
      const requiredFields = [
        'placeOfAttachment', 'supervisorNames', 'departmentName', 'fieldOfStudy',
        'attachmentLocation', 'primarySkill', 'framework', 'programmingLanguage', 'careerPath'
      ];
      const allFieldsFilled = requiredFields.every(field => !!debouncedFormData[field as keyof ReportData]);

      if (allFieldsFilled && !loadingStates.sections) {
        setLoadingStates(prev => ({...prev, sections: true}));
        try {
            const result = await generateReportSections(debouncedFormData);
            setFormData(prev => ({
                ...prev,
                acknowledgementText: result.acknowledgementText,
                abstractText: result.abstractText,
            }));
            toast({ title: "Success", description: "Acknowledgement and Abstract generated automatically." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to auto-generate sections." });
        } finally {
            setLoadingStates(prev => ({...prev, sections: false}));
        }
      }
    }

    if (currentStep >= 3) {
        autoGenerateSections();
    }
  }, [debouncedFormData, currentStep]);


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
    if (!suggestionValue || formData[field]) return null;

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
                        <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g., Chima Courage Chiemeka" /></div>
                        <div><Label htmlFor="regNumber">Registration Number</Label><Input id="regNumber" value={formData.regNumber} onChange={handleInputChange} placeholder="e.g., 2021/247172" /></div>
                        <div><Label htmlFor="universityName">University Name</Label><Input id="universityName" value={formData.universityName} onChange={handleInputChange} placeholder="e.g., University of Nigeria, Nsukka" /></div>
                        <div><Label htmlFor="facultyName">Faculty Name</Label><Input id="facultyName" value={formData.facultyName} onChange={handleInputChange} placeholder="e.g., Faculty of Physical Sciences" /></div>
                        <div><Label htmlFor="departmentName">Department Name</Label><Input id="departmentName" value={formData.departmentName} onChange={handleInputChange} placeholder="e.g., Department of Computer Science" /></div>
                        <div><Label htmlFor="courseCode">Course Code</Label><Input id="courseCode" value={formData.courseCode} onChange={handleInputChange} placeholder="e.g., COS 384" /></div>
                        <div className="flex space-x-4">
                            <div className="w-1/2"><Label htmlFor="reportMonth">Report Month</Label><Input id="reportMonth" value={formData.reportMonth} onChange={handleInputChange} placeholder="e.g., February" /></div>
                            <div className="w-1/2"><Label htmlFor="reportYear">Report Year</Label><Input type="number" id="reportYear" value={formData.reportYear} onChange={handleInputChange} placeholder="e.g., 2025" /></div>
                        </div>
                    </div>
                </div>
            )}
            
            {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Attachment Information</h2>
                     <div className="space-y-6">
                        <div><Label htmlFor="placeOfAttachment">Place of Attachment</Label><Input id="placeOfAttachment" value={formData.placeOfAttachment} onChange={handleInputChange} placeholder="e.g., Nanocodes Programming Limited" /></div>
                        <div><Label htmlFor="attachmentLocation">Attachment Location (Address)</Label><Input id="attachmentLocation" value={formData.attachmentLocation} onChange={handleInputChange} placeholder="e.g., 31 Enugu Road, Nsukka" /></div>
                        <div><Label htmlFor="supervisorNames">Supervisor Names (comma separated)</Label><Input id="supervisorNames" value={formData.supervisorNames} onChange={handleInputChange} placeholder="e.g., Mr. Ebuka Chikodinaka" /></div>
                        <div><Label htmlFor="ceoName">CEO/Manager Name</Label><Input id="ceoName" value={formData.ceoName} onChange={handleInputChange} placeholder="e.g., Mr. Harrison Ozioko" /></div>
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
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Technical Details</h2>
                    <p className="text-muted-foreground -mt-4">Provide these details to help the AI write a better report.</p>
                     <div className="space-y-6">
                        <div><Label htmlFor="fieldOfStudy">Field of Study/Work</Label><Input id="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleInputChange} placeholder="e.g., Software Development" /><SuggestionPill field="fieldOfStudy" /></div>
                        <div><Label htmlFor="primarySkill">Primary Skill Area</Label><Input id="primarySkill" value={formData.primarySkill} onChange={handleInputChange} placeholder="e.g., App Development" /><SuggestionPill field="primarySkill" /></div>
                        <div><Label htmlFor="technologiesUsed">Technologies Used (comma separated)</Label><Input id="technologiesUsed" value={formData.technologiesUsed} onChange={handleInputChange} placeholder="e.g., Dart, Flutter, VS Code" /><SuggestionPill field="technologiesUsed" /></div>
                        <div><Label htmlFor="programmingLanguage">Primary Programming Language</Label><Input id="programmingLanguage" value={formData.programmingLanguage} onChange={handleInputChange} placeholder="e.g., Dart" /><SuggestionPill field="programmingLanguage" /></div>
                        <div><Label htmlFor="framework">Primary Framework</Label><Input id="framework" value={formData.framework} onChange={handleInputChange} placeholder="e.g., Flutter" /><SuggestionPill field="framework" /></div>
                        <div><Label htmlFor="careerPath">Desired Career Path</Label><Input id="careerPath" value={formData.careerPath} onChange={handleInputChange} placeholder="e.g., Mobile App Development" /><SuggestionPill field="careerPath" /></div>
                    </div>
                </div>
            )}

            {currentStep === 4 && (
                 <div className="space-y-6 animate-in fade-in-0 duration-300">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Report Content</h2>
                     <div className="flex items-center text-sm text-muted-foreground mb-4">
                        {loadingStates.sections ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span>Auto-generating Acknowledgement & Abstract...</span></> : <span>Acknowledgement & Abstract will be auto-generated.</span>}
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
                            <Label htmlFor="challengesText">Challenges Encountered & Solutions</Label>
                            <Textarea id="challengesText" value={formData.challengesText} onChange={handleInputChange} placeholder="Describe the technical challenges you faced and how you solved them..." className="min-h-[150px]" />
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
