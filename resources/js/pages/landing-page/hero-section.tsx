import { ArrowRight, Award, CheckCircle, FileText, GraduationCap } from "lucide-react";

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="pt-32 pb-24 px-4 relative overflow-hidden min-h-screen flex items-center">
      {/* Background with semi-transparent overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-[#EEEEEE]/30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black text-[#111111] leading-tight">
                Education for
                <span className="block text-[#800000]">Every Juan</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Your school’s learning management system for seamless course access, interactive lessons, and certified achievements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-[#800000] hover:bg-[#600000] text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Start Learning Today
                <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side - Visual Container */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 min-h-[500px] overflow-hidden">
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 bg-[#800000] rounded-xl p-3 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>

              <div className="absolute top-1/2 left-6 bg-gray-100 rounded-xl p-3 shadow-lg">
                <FileText className="w-6 h-6 text-[#800000]" />
              </div>

              <div className="absolute bottom-6 right-6 bg-gray-100 rounded-xl p-3 shadow-lg">
                <Award className="w-6 h-6 text-[#800000]" />
              </div>

              {/* Central Content */}
              <div className="text-center h-full flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-[#800000] rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#111111]">Interactive Learning Hub</h3>
                <p className="text-gray-600 max-w-sm leading-relaxed">
                  Engage with lessons, activities, and exams tailored for your school’s curriculum.
                </p>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
