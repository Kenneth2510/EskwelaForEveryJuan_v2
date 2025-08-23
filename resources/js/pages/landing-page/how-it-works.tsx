import { Award, Clock, FileText, Globe, Heart, PlayCircle } from "lucide-react";
import { useState } from "react";

// How It Works Component
const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState('learner');

  const learnerSteps = [
    {
      title: "Enroll in Course",
      description: "Get enrolled by your admin or use a course code provided by your instructor.",
      icon: <Globe className="w-8 h-8" />,
      svg:
<svg xmlns="http://www.w3.org/2000/svg" width="600.517" height="799.963" viewBox="0 0 600.517 799.963" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" artist="Katerina Limpitsouni" source="https://undraw.co/"><g transform="translate(-747.098 -126.745)"><g transform="translate(747.098 379.185)"><path d="M802.988,365.29l23.524,46.568,70.323,31.973c7.511,12.693,31.378,13.665,33.114,5.461,1.948-9.208-28.985-24.029-28.985-24.029l-58.827-39.789-5.147-34.254Z" transform="translate(-728.409 -193.171)" fill="#ed9da0"/><path d="M730.271,464.215l-4.338,34.7,25.161,1.736,2.6-36.438Z" transform="translate(-652.917 20.404)" fill="#ed9da0"/><path d="M869.811,681.552a68.131,68.131,0,0,1-6.209-7.592C860,668.97,856.8,694.566,856.8,694.566s-3.471,10.411-2.6,15.617,20.821,5.206,24.293,4.341,20.821,0,20.821,0h26.028c22.558-10.411,0-17.352,0-17.352-6.941-.868-30.365-22.558-30.365-22.558l-5.206-9.543c-3.47-.868-6.941,12.146-6.941,12.146Z" transform="translate(-788.989 -167.435)" fill="#090814"/><path d="M790.413,464.616l-4.341,34.7,25.161,1.736,2.6-36.44Z" transform="translate(-778.13 20.437)" fill="#ed9da0"/><path d="M929.947,681.954a68.2,68.2,0,0,1-6.209-7.592c-3.606-4.99-6.805,20.606-6.805,20.606s-3.47,9.544-2.6,14.749,20.821,5.2,24.293,4.341,20.821.868,20.821.868h26.028c22.558-10.411,0-17.352,0-17.352-6.941-.868-30.365-22.558-30.365-22.558l-5.206-9.543c-3.47-.868-6.941,12.146-6.941,12.146Z" transform="translate(-914.191 -167.402)" fill="#090814"/><path d="M894.753,446.716c-3.471,4.341-1.735,19.087-1.735,19.087s-6.073,47.717-3.47,52.055-1.735,7.808-4.341,13.882S880,552.561,880,552.561c-14.749,12.146-13.882,67.672-13.882,67.672l-5.2,49.452c1.735,5.206,26.028,6.073,29.5,5.206s13.882-78.951,13.882-78.951l23.424-44.247s-1.735,117.991-1.735,123.2,23.424,2.6,28.63,2.6,5.206-86.759,5.206-86.759l5.206-22.556,27.763-103.242v-12.15l-4.341-6.073S898.223,442.378,894.753,446.716Z" transform="translate(-853.837 -185.499)" fill="#090814"/><path d="M931.356,251.326c-5.451,12.14-2.224,29.1,8.682,47.717L895.79,278.222l6.941-6.073L901,254.8Z" transform="translate(-838.82 -201.366)" fill="#ed9da0"/><circle cx="26.896" cy="26.896" r="26.896" transform="translate(52.191 10.486)" fill="#ed9da0"/><path d="M929.863,277.511c5.794,3.445,9.26,9.774,11.25,16.215a153.667,153.667,0,0,1,6.6,36.711l2.1,37.3,26.028,98.906c-22.556,19.087-35.566,14.749-65.936-.868s-33.837,5.209-33.837,5.209-2.6-.868,0-3.47,0,0-2.6-2.6,0,0,.868-2.6,0-.868-.868-1.735,3.47-8.682,3.47-8.682L870,386.825l-8.682-91.963c10.411-13.014,39.907-24.293,39.907-24.293l26.9,19.087c8.682,3.47,1.735-10.411,1.735-10.411Z" transform="translate(-837.325 -199.788)" fill="#e6e6e6"/><path d="M930.418,343.937l-3.47,52.055L971.2,459.326c0,14.749,7.808,18.22,7.808,18.22a114.681,114.681,0,0,0,7.808-14.749c4.341-9.544-2.6-17.352-2.6-17.352l-30.365-64.2,13.014-32.1Z" transform="translate(-920.735 -193.771)" fill="#ed9da0"/><path d="M954.811,293.557c-14.749,5.206-17.352,61.6-17.352,61.6,17.352-9.544,38.173,6.073,38.173,6.073s4.341-14.749,9.544-33.835a33.157,33.157,0,0,0-6.941-31.234S969.565,288.353,954.811,293.557Z" transform="translate(-930.385 -198.048)" fill="#e6e6e6"/><path d="M895.049,250.774c3.424-2.739,8.095,2.24,8.095,2.24l2.739-24.653s17.119,2.054,28.076-.685,12.668,9.929,12.668,9.929a87.942,87.942,0,0,0,.343-15.4c-.685-6.161-9.588-12.322-25.337-16.435s-23.966,13.7-23.966,13.7C886.714,224.938,891.625,253.514,895.049,250.774Z" transform="translate(-840.686 -205.153)" fill="#090814"/></g><g transform="translate(948.728 126.745)"><path d="M665.247,269.294h-4.4V148.882A69.692,69.692,0,0,0,591.156,79.19h-255.1a69.692,69.692,0,0,0-69.692,69.692V809.461a69.692,69.692,0,0,0,69.692,69.692h255.1a69.692,69.692,0,0,0,69.692-69.692V354.994h4.4Z" transform="translate(-266.36 -79.19)" fill="#090814"/><path d="M592.235,95.686H558.942a24.726,24.726,0,0,1-22.9,34.065H389.887a24.726,24.726,0,0,1-22.9-34.065H335.894a52.045,52.045,0,0,0-52.045,52.045V807.345a52.044,52.044,0,0,0,52.043,52.044H592.228a52.045,52.045,0,0,0,52.045-52.045V147.731a52.044,52.044,0,0,0-52.039-52.045Z" transform="translate(-264.617 -77.551)" fill="#fff"/><rect width="245.766" height="133.276" rx="4" transform="translate(46.461 185.802)" fill="#800000"/><path d="M4,0H75.2V133.276H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(304.453 185.802)" fill="#800000"/><path d="M30.5,0A30.5,30.5,0,1,1,0,30.5,30.5,30.5,0,0,1,30.5,0Z" transform="translate(46.654 75.255)" fill="#800000"/><path d="M4,0H69a4,4,0,0,1,4,4V25a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(279.654 90.255)" fill="#e6e6e6"/><path d="M4,0H68a4,4,0,0,1,4,4V24a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(46.654 368.255)" fill="#800000"/><path d="M4,0H68a4,4,0,0,1,4,4V24a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(133.654 368.255)" fill="#e6e6e6"/><path d="M4,0H68a4,4,0,0,1,4,4V24a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(220.654 368.255)" fill="#e6e6e6"/><rect width="245.766" height="133.276" rx="4" transform="translate(46.461 185.802)" fill="#800000"/><path d="M4,0H241.766a4,4,0,0,1,4,4V129.276a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(46.461 185.802)" fill="#800000"/><path d="M4,0H301.678a4,4,0,0,1,4,4V221.679a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(46.461 426.078)" fill="#f2f2f2"/><path d="M4,0H88a4,4,0,0,1,4,4V62a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(46.654 680.255)" fill="#f2f2f2"/><path d="M4,0H88a4,4,0,0,1,4,4V62a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(260.654 680.255)" fill="#f2f2f2"/><path d="M4,0H87a4,4,0,0,1,4,4V62a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(154.654 680.255)" fill="#f2f2f2"/></g></g></svg>,
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
