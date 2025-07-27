import { ArrowRight, Award, Clock, GraduationCap, Heart, Shield, Zap } from "lucide-react";

// Features Section Component
const FeaturesSection = () => {
    const features = [
        {
            title: 'Interactive Learning Experience',
            description: 'Engage with multimedia content, live quizzes, and hands-on projects designed to maximize retention.',
            icon: <Zap className="h-8 w-8" />,
        },
        {
            title: 'Expert Instructors',
            description: 'Learn from industry leaders and certified professionals who bring real-world experience.',
            icon: <GraduationCap className="h-8 w-8" />,
        },
        {
            title: 'Flexible Schedule',
            description: 'Study at your own pace with 24/7 access to course materials and mobile learning support.',
            icon: <Clock className="h-8 w-8" />,
        },
        {
            title: 'Secure Platform',
            description: 'Your data and progress are protected with enterprise-grade security measures.',
            icon: <Shield className="h-8 w-8" />,
        },
        {
            title: 'Certified Learning',
            description: 'Earn certificates that are valued by employers and can be verified through our system.',
            icon: <Award className="h-8 w-8" />,
        },
        {
            title: 'Learning Community',
            description: 'Connect with peers, join study groups, and build lasting professional networks.',
            icon: <Heart className="h-8 w-8" />,
        },
    ];

    return (
        <section id="features" className="bg-white px-4 py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <div className="mb-6 inline-flex items-center rounded-full bg-[#800000]/10 px-4 py-2">
                        <span className="text-sm font-medium text-[#800000]">Platform Features</span>
                    </div>
                    <h2 className="mb-6 text-4xl font-black text-[#111111] lg:text-5xl">Why Choose EskwelaForEveryJuan</h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                        Discover the powerful features that make our platform the perfect choice for your educational journey.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={index} className="group">
                            <div className="transform rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 group-hover:border-[#800000]/20 hover:-translate-y-2 hover:shadow-xl">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#EEEEEE] text-[#800000] transition-all duration-300 group-hover:bg-[#800000] group-hover:text-white">
                                    {feature.icon}
                                </div>

                                <h3 className="mb-4 text-xl font-bold text-[#111111]">{feature.title}</h3>
                                <p className="mb-6 leading-relaxed text-gray-600">{feature.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-[#800000]"></div>
                                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#800000]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
