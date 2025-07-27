import { Award, Clock, FileText, Globe, Heart, PlayCircle } from "lucide-react";
import { useState } from "react";

// How It Works Component
const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState('learner');

  const learnerSteps = [
    {
      title: "Enroll in Course",
      description: "Get enrolled by your admin or use a course code provided by your instructor.",
      icon: <Globe className="w-8 h-8" />
    },
    {
      title: "Take Lessons",
      description: "Access interactive lessons tailored to your school’s curriculum.",
      icon: <PlayCircle className="w-8 h-8" />
    },
    {
      title: "Complete Activities & Exams",
      description: "Engage in activities and exams to test your knowledge and skills.",
      icon: <FileText className="w-8 h-8" />
    },
    {
      title: "Earn Certificate",
      description: "Receive a certificate upon successful course completion.",
      icon: <Award className="w-8 h-8" />
    }
  ];

  const instructorSteps = [
    {
      title: "Create Course",
      description: "Design your course content using our intuitive tools.",
      icon: <FileText className="w-8 h-8" />
    },
    {
      title: "Await Approval",
      description: "Submit your course for admin review and approval.",
      icon: <Clock className="w-8 h-8" />
    },
    {
      title: "Deploy Course",
      description: "Make your course available for students to enroll via admin or course code.",
      icon: <PlayCircle className="w-8 h-8" />
    },
    {
      title: "Support Learners",
      description: "Guide students through lessons, activities, and exams with personalized feedback.",
      icon: <Heart className="w-8 h-8" />
    }
  ];

  const currentSteps = activeTab === 'learner' ? learnerSteps : instructorSteps;

  return (
    <section className="py-24 px-4 bg-[#EEEEEE]/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-[#111111] mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how students and instructors can use our school’s LMS to achieve educational goals.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('learner')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'learner'
                  ? 'bg-[#800000] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#800000]'
              }`}
            >
              For Learners
            </button>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'instructor'
                  ? 'bg-[#800000] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#800000]'
              }`}
            >
              For Instructors
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentSteps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < currentSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gray-300"></div>
              )}

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 bg-[#800000] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                <div className="bg-[#EEEEEE] rounded-xl w-16 h-16 flex items-center justify-center mb-6 text-[#800000]">
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-[#111111] mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
