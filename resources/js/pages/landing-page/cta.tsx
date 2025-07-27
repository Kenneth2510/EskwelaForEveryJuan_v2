import { ArrowRight, Award, BookOpen, Clock, Shield } from "lucide-react";

// CTA Section Component
const CTASection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-[#800000] to-[#600000] text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-8 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-4xl lg:text-5xl font-black mb-6">
          Ready to Start Your Learning Journey?
        </h3>

        <p className="text-xl opacity-90 mb-10 leading-relaxed max-w-3xl mx-auto">
          Join your school’s LMS to access tailored courses, engage in interactive lessons, and earn certificates.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <button className="group bg-white text-[#800000] hover:bg-gray-100 px-10 py-4 rounded-lg text-lg font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            Start Learning Free
            <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/20">
          <div className="flex items-center space-x-2 text-white/90">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure & Trusted</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Certified Courses</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
