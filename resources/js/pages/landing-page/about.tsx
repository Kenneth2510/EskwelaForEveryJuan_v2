import { GraduationCap } from "lucide-react";

// About Section Component
const AboutSection = () => {
    return (
        <section id="about" className="bg-white px-4 py-24">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* Left Side - Content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center rounded-full bg-[#800000]/10 px-4 py-2">
                                <span className="text-sm font-medium text-[#800000]">About Our Platform</span>
                            </div>

                            <h2 className="text-4xl leading-tight font-black text-[#111111] lg:text-5xl">Empowering Learning for Every Filipino</h2>

                            <div className="space-y-4 leading-relaxed text-gray-600">
                                <p>
                                    EskwelaForEveryJuan is more than just a learning platform – it's a comprehensive educational ecosystem designed
                                    specifically for Filipino learners and educators. We believe that quality education should be accessible to
                                    everyone, regardless of location or background.
                                </p>
                                <p>
                                    Our platform combines cutting-edge technology with proven pedagogical methods to deliver an engaging, effective
                                    learning experience. From K-12 supplementary courses to professional development programs, we offer a diverse
                                    range of educational content tailored to Filipino culture and learning preferences.
                                </p>
                                <p>
                                    Founded by educators and technologists who understand the unique challenges and opportunities within the
                                    Philippine education landscape, we're committed to bridging the digital divide and making world-class education
                                    accessible to every Juan.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="rounded-xl bg-gray-50 p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-[#800000]">2019</div>
                                <div className="text-sm text-gray-600">Founded</div>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-[#800000]">7,107</div>
                                <div className="text-sm text-gray-600">Islands Reached</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Visual */}
                    <div className="relative">
                        <div className="flex min-h-[500px] items-center justify-center rounded-2xl bg-[#EEEEEE] p-8">
                            <div className="space-y-6 text-center">
                                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#800000] shadow-lg">
                                    <GraduationCap className="h-12 w-12 text-white" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-[#111111]">Mission & Vision</h3>
                                    <div className="space-y-3 text-gray-600">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-2 w-2 rounded-full bg-[#800000]"></div>
                                            <span className="text-sm">Accessible Education</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="h-2 w-2 rounded-full bg-[#800000]"></div>
                                            <span className="text-sm">Cultural Relevance</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="h-2 w-2 rounded-full bg-[#800000]"></div>
                                            <span className="text-sm">Technology Integration</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="h-2 w-2 rounded-full bg-[#800000]"></div>
                                            <span className="text-sm">Community Building</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
