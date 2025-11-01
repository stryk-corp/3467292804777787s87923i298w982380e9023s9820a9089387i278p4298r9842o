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

    // Chapter 4 Data
    projectIntro: "During my SIWES training, I worked on a Multi-Screen UI design project and a basic Calculator app using Flutter and Dart.",
    project1_intro: "The first project focused on designing a multi-screen user interface for an authentication system. The application consisted of four screens:\n1. Welcome Screen\n2. Sign-In Screen\n3. Sign-Up Screen\n4. Home Screen\nThis project helped me understand Flutter’s widget-based architecture, UI state management, navigation, and user input handling. Below is a detailed breakdown of the implementation.",
    project1_desc: "User\nWelcome Screen\nSign In\nSign Up\nEmail:: \nPassword:\nSwitch Screen\nHome Screen\nValidate cardinality\nFull Name:\nEmail:\nPassword\nService",
    project1_useCaseDiagram: [],
    project1_useCaseCaption: "Use Case Diagram for a Login user interface",
    project1_welcomeScreen: "The Welcome Screen is the first interface displayed when the app runs. It provides users with two options:\n• Sign In – For users who already have an account.\n• Sign Up – For new users who want to register.\nThis screen serves as the entry point, guiding users to the appropriate authentication path.",
    project1_welcomeScreenImages: [],
    project1_welcomeScreenCaption: "Welcome Screen and the related code snippet",
    project1_signInScreen: "If the user selects Sign In, they are directed to the Sign-In Screen, which consists of:\n• Email Input Field – Users enter their registered email.\n• Password Input Field – Users provide their password.\n• Sign In Button – When clicked, the app validates the inputs.",
    project1_validation: "Validation and Error Handling:\n• If the email or password field is left empty, an error message is displayed.\n• If valid credentials are provided, a loading delay of 3 seconds occurs, during which a message pops up stating, \"You’ll be logged in shortly.\"\n• After the delay, the user is redirected to the Home Screen.\nAdditionally, users who do not have an account can click on a Sign Up option at the bottom of the screen to navigate to the registration page.",
    project1_signInImages: [],
    project1_signInCaption: "Sign in Screen/Validation and Error handling with the related code snippet",
    project1_signUpScreen: "The Sign-Up Screen allows new users to register by providing:\n• Full Name\n• Email\n• Password\nValidation and Error Handling:\n• If any field is left empty, an error message is displayed, prompting the user to enter the required details.\n• Upon successful form submission, a pop-up message appears, notifying the user to complete their registration via Gmail before gaining full access.",
    project1_signUpImages: [],
    project1_signUpCaption: "Sign up Screen with the code snippet",
    project1_homeScreen: "The Home Screen serves as the main interface users see after successfully signing in. While the UI design was the primary focus of the project, this screen could later be expanded with additional functionalities like user dashboards, profiles, or navigation menus.",
    project1_homeScreenImages: [],
    project1_homeScreenCaption: "The main Home Screen and code snippet",
    project1_tools: "To build the UI, I used the following tools and technologies:\n• Flutter SDK – For designing and developing the user interface.\n• Dart Programming Language – For writing the application logic.\n• Visual Studio Code – As the development environment.\n• Flutter Hot Reload – For instant previewing of UI changes during development.",
    
    project2_intro: "During my SIWES training, I also worked on a basic calculator project using Flutter and Dart. The project aimed to create a simple yet functional calculator that could perform basic arithmetic operations such as addition, subtraction, multiplication, and division. To ensure proper code organization, I created two Dart files within the lib directory of my Visual Studio Code workspace. One file was responsible for managing the button layout and assigning functions, while the other handled the core functionality and UI display. This project helped me gain a deeper understanding of Dart programming, Flutter UI components, state management, and user interaction handling. Below is a detailed breakdown of the implementation.",
    project2_desc: "",
    project2_structure: "The calculator application was structured into two main Dart files:\n• Button Class File: This file was responsible for defining and organizing all button-related functionalities. It assigned the first number, various mathematical operators, the second number, and other functional keys such as clear and equals to their respective display texts. The file ensured that when a button was pressed, the correct value or operation was registered.\n• Main Functionality File: This file contained the primary logic and UI design of the calculator. It implemented the user interface, handled button interactions, and displayed the results accordingly.",
    project2_ui: "The UI was designed using Flutter widgets to ensure a clean and responsive layout. The following key components were used:\n• Display Screen: A text widget was used to display user input and results dynamically. It updated in real-time as users pressed buttons.\n• Button Grid: A GridView was implemented to arrange the calculator buttons in a structured format. Each button was assigned a function to handle user interaction.\n• Number and Operator Buttons: Buttons for digits (0-9) and operators (+, -, *, /) were included. When pressed, they updated the display screen accordingly.\n• Equals Button: This button triggered the calculation process, displaying the final result.\n• Clear Button: This button reset the calculator, clearing both the input and result display.",
    project2_core: "The core functionality of the calculator was implemented using basic Dart programming concepts such as:\n• Variables to store the first number, second number, and selected operator.\n• Conditional statements to determine which mathematical operation to perform based on the selected operator.\n• State management using setState() to update the UI dynamically when the user interacts with buttons.\n• Parsing and converting user input from string to numeric format for calculations.",
    project2_codeSnippetImages: [],
    project2_codeSnippetCaption: "Code Snippet for the Basic Calculator App",
    project2_tools: "To develop the calculator application, the following tools and technologies were utilized:\n• Flutter SDK – For building the UI and managing interactions.\n• Dart Programming Language – For implementing the logic and handling calculations.\n• Visual Studio Code – As the development environment.\n• Flutter Hot Reload – For real-time testing and debugging."
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
