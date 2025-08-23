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
                                <div className="mb-2 text-3xl font-bold text-[#800000]">2025</div>
                                <div className="text-sm text-gray-600">Founded</div>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-[#800000]">100+</div>
                                <div className="text-sm text-gray-600">Supported Professors</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Enhanced Learning Management System Illustration */}
                    <div className="relative flex items-center justify-center">
                        {/* Background decorative elements */}
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#800000]/10 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#800000]/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>

                        {/* Main SVG Illustration */}
                        <div className="relative w-full max-w-lg mx-auto">
                            <svg viewBox="0 0 400 400" className="w-full h-auto">
                                {/* Background circle with gradient */}
                                <circle cx="200" cy="200" r="190" fill="url(#bgGradient)" opacity="0.1" filter="url(#glow)"/>

                                {/* Central Dashboard with Holographic Effect */}
                                <g transform="translate(140, 150)">
                                    {/* Monitor Base with 3D effect */}
                                    <rect x="35" y="75" width="40" height="10" rx="5" fill="url(#baseGradient)" filter="url(#shadow)"/>
                                    <rect x="45" y="85" width="20" height="6" rx="3" fill="#333"/>

                                    {/* Monitor Screen with Glow */}
                                    <rect x="10" y="10" width="80" height="65" rx="6" fill="#1a1a1a" filter="url(#glow)"/>
                                    <rect x="13" y="13" width="74" height="59" rx="4" fill="url(#screenGradient)"/>

                                    {/* Holographic Dashboard Interface */}
                                    <g filter="url(#holoGlow)">
                                        <rect x="17" y="17" width="66" height="10" rx="2" fill="url(#holoGradient)" opacity="0.9"/>
                                        <text x="50" y="24" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold" opacity="0.95">ESKWELA DASHBOARD</text>
                                    </g>

                                    {/* Interactive Course Cards with Hover Effect */}
                                    <g className="hover:scale-105 transition-transform duration-300">
                                        <rect x="17" y="30" width="20" height="14" rx="3" fill="white" opacity="0.95" filter="url(#shadow)"/>
                                        <rect x="18" y="32" width="8" height="3" fill="#800000"/>
                                        <rect x="18" y="36" width="12" height="1.5" fill="#666"/>
                                        <rect x="18" y="39" width="10" height="1.5" fill="#666"/>
                                    </g>
                                    <g className="hover:scale-105 transition-transform duration-300">
                                        <rect x="39" y="30" width="20" height="14" rx="3" fill="white" opacity="0.95" filter="url(#shadow)"/>
                                        <rect x="40" y="32" width="8" height="3" fill="#600000"/>
                                        <rect x="40" y="36" width="12" height="1.5" fill="#666"/>
                                        <rect x="40" y="39" width="10" height="1.5" fill="#666"/>
                                    </g>
                                    <g className="hover:scale-105 transition-transform duration-300">
                                        <rect x="61" y="30" width="20" height="14" rx="3" fill="white" opacity="0.95" filter="url(#shadow)"/>
                                        <rect x="62" y="32" width="8" height="3" fill="#A00000"/>
                                        <rect x="62" y="36" width="12" height="1.5" fill="#666"/>
                                        <rect x="62" y="39" width="10" height="1.5" fill="#666"/>
                                    </g>

                                    {/* Animated Progress Bars */}
                                    <rect x="17" y="48" width="66" height="3" rx="1.5" fill="#e5e5e5"/>
                                    <rect x="17" y="48" width="50" height="3" rx="1.5" fill="#10b981">
                                        <animate attributeName="width" values="20;50;20" dur="4s" repeatCount="indefinite"/>
                                    </rect>

                                    <rect x="17" y="54" width="66" height="3" rx="1.5" fill="#e5e5e5"/>
                                    <rect x="17" y="54" width="60" height="3" rx="1.5" fill="#f59e0b">
                                        <animate attributeName="width" values="30;60;30" dur="3.5s" repeatCount="indefinite"/>
                                    </rect>

                                    <rect x="17" y="60" width="66" height="3" rx="1.5" fill="#e5e5e5"/>
                                    <rect x="17" y="60" width="40" height="3" rx="1.5" fill="#ef4444">
                                        <animate attributeName="width" values="10;40;10" dur="4.5s" repeatCount="indefinite"/>
                                    </rect>

                                    {/* User Avatar with Glow */}
                                    <g filter="url(#avatarGlow)">
                                        <circle cx="75" cy="25" r="5" fill="#d1d5db"/>
                                        <circle cx="75" cy="23" r="2" fill="#6b7280"/>
                                        <path d="M72 26 Q75 24 78 26" stroke="#6b7280" strokeWidth="1" fill="none"/>
                                    </g>
                                </g>

                                {/* Student with Laptop - 3D Effect */}
                                <g transform="translate(70, 270)">
                                    <g filter="url(#shadow)">
                                        <circle cx="15" cy="12" r="9" fill="url(#skinGradient)"/>
                                        <path d="M7 8 Q15 2 23 8 Q20 15 15 15 Q10 15 7 8" fill="#2D1810"/>
                                        <rect x="10" y="20" width="12" height="20" rx="6" fill="url(#clothGradient)"/>
                                    </g>

                                    {/* Laptop with Screen Glow */}
                                    <g filter="url(#glow)">
                                        <rect x="25" y="30" width="28" height="18" rx="3" fill="#333"/>
                                        <rect x="26" y="31" width="26" height="14" rx="2" fill="#1e40af"/>
                                    </g>

                                    {/* Video Call Interface */}
                                    <rect x="28" y="33" width="7" height="5" rx="1.5" fill="white" opacity="0.95"/>
                                    <circle cx="31.5" cy="35.5" r="1.2" fill="#D4A574"/>
                                    <rect x="37" y="33" width="7" height="5" rx="1.5" fill="white" opacity="0.95"/>
                                    <circle cx="40.5" cy="35.5" r="1.2" fill="#F4A261"/>
                                    <rect x="46" y="33" width="7" height="5" rx="1.5" fill="white" opacity="0.95"/>
                                    <circle cx="49.5" cy="35.5" r="1.2" fill="#E76F51"/>

                                    <rect x="28" y="40" width="20" height="3" rx="1.5" fill="white" opacity="0.8"/>
                                </g>

                                {/* Mobile Learning - Enhanced Design */}
                                <g transform="translate(290, 110)">
                                    <g filter="url(#shadow)">
                                        <rect x="0" y="0" width="30" height="50" rx="8" fill="#2a2a2a"/>
                                        <rect x="2" y="5" width="26" height="36" rx="3" fill="url(#screenGradient)"/>
                                    </g>

                                    {/* Mobile App Interface */}
                                    <rect x="4" y="7" width="22" height="5" rx="1.5" fill="#800000"/>
                                    <text x="15" y="10.5" textAnchor="middle" fontSize="4" fill="white">LESSONS</text>

                                    {/* Lesson Items with Animation */}
                                    <rect x="4" y="14" width="22" height="4" rx="1.5" fill="white" opacity="0.95">
                                        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
                                    </rect>
                                    <circle cx="7" cy="16" r="1" fill="#10b981"/>
                                    <rect x="10" y="15.5" width="12" height="1" fill="#333"/>

                                    <rect x="4" y="19" width="22" height="4" rx="1.5" fill="white" opacity="0.95">
                                        <animate attributeName="opacity" values="0.7;1;0.7" dur="3.5s" repeatCount="indefinite"/>
                                    </rect>
                                    <circle cx="7" cy="21" r="1" fill="#f59e0b"/>
                                    <rect x="10" y="20.5" width="12" height="1" fill="#333"/>

                                    <rect x="4" y="24" width="22" height="4" rx="1.5" fill="white" opacity="0.95">
                                        <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite"/>
                                    </rect>
                                    <circle cx="7" cy="26" r="1" fill="#ef4444"/>
                                    <rect x="10" y="25.5" width="12" height="1" fill="#333"/>

                                    {/* Play Button with Hover Effect */}
                                    <g className="hover:scale-110 transition-transform duration-300">
                                        <circle cx="15" cy="34" r="4" fill="#800000" opacity="0.9"/>
                                        <polygon points="13,32 13,36 18,34" fill="white"/>
                                    </g>

                                    {/* Home Button */}
                                    <circle cx="15" cy="45" r="2.5" fill="#666"/>
                                </g>

                                {/* Digital Library with 3D Books */}
                                <g transform="translate(80, 80)">
                                    <rect x="0" y="0" width="50" height="40" rx="4" fill="#f8f9fa" filter="url(#shadow)"/>
                                    <rect x="2" y="2" width="46" height="8" rx="2" fill="#800000"/>
                                    <text x="25" y="7" textAnchor="middle" fontSize="5" fill="white">DIGITAL LIBRARY</text>

                                    {/* Books with 3D Effect */}
                                    <rect x="4" y="12" width="7" height="20" rx="1.5" fill="#dc2626" filter="url(#shadow)"/>
                                    <rect x="4.5" y="13" width="6" height="1.5" fill="white" opacity="0.8"/>
                                    <rect x="4.5" y="15" width="5" height="0.8" fill="white" opacity="0.6"/>

                                    <rect x="13" y="10" width="7" height="22" rx="1.5" fill="#059669" filter="url(#shadow)"/>
                                    <rect x="13.5" y="11" width="6" height="1.5" fill="white" opacity="0.8"/>
                                    <rect x="13.5" y="13" width="5" height="0.8" fill="white" opacity="0.6"/>

                                    <rect x="22" y="14" width="7" height="18" rx="1.5" fill="#7c3aed" filter="url(#shadow)"/>
                                    <rect x="22.5" y="15" width="6" height="1.5" fill="white" opacity="0.8"/>
                                    <rect x="22.5" y="17" width="5" height="0.8" fill="white" opacity="0.6"/>

                                    <rect x="31" y="11" width="7" height="21" rx="1.5" fill="#ea580c" filter="url(#shadow)"/>
                                    <rect x="31.5" y="12" width="6" height="1.5" fill="white" opacity="0.8"/>
                                    <rect x="31.5" y="14" width="5" height="0.8" fill="white" opacity="0.6"/>

                                    <rect x="40" y="13" width="7" height="19" rx="1.5" fill="#0891b2" filter="url(#shadow)"/>
                                    <rect x="40.5" y="14" width="6" height="1.5" fill="white" opacity="0.8"/>
                                    <rect x="40.5" y="16" width="5" height="0.8" fill="white" opacity="0.6"/>
                                </g>

                                {/* Quiz Tablet with Interactive Elements */}
                                <g transform="translate(270, 250)">
                                    <rect x="0" y="0" width="40" height="55" rx="5" fill="#2a2a2a" filter="url(#shadow)"/>
                                    <rect x="2" y="4" width="36" height="47" rx="3" fill="#f8f9fa"/>

                                    {/* Quiz Header */}
                                    <rect x="4" y="6" width="32" height="6" rx="2" fill="#800000"/>
                                    <text x="20" y="10.5" textAnchor="middle" fontSize="4" fill="white">QUIZ: MATH 101</text>

                                    {/* Question */}
                                    <rect x="4" y="14" width="32" height="3" rx="1" fill="#333"/>
                                    <rect x="4" y="18" width="25" height="1.5" rx="0.8" fill="#666"/>

                                    {/* Multiple Choice Options with Hover Effect */}
                                    <g className="hover:scale-105 transition-transform duration-300">
                                        <circle cx="6" cy="24" r="2" fill="white" stroke="#800000" strokeWidth="0.8"/>
                                        <rect x="10" y="23" width="20" height="2" fill="#e5e5e5"/>
                                    </g>
                                    <g className="hover:scale-105 transition-transform duration-300">
                                        <circle cx="6" cy="29" r="2" fill="#800000"/>
                                        <rect x="10" y="28" width="20" height="2" fill="#e5e5e5"/>
                                    </g>
                                    <g className="hover:scale-105 transition-transform duration-300">
                                        <circle cx="6" cy="34" r="2" fill="white" stroke="#800000" strokeWidth="0.8"/>
                                        <rect x="10" y="33" width="20" height="2" fill="#e5e5e5"/>
                                    </g>

                                    {/* Submit Button with Animation */}
                                    <rect x="4" y="40" width="32" height="8" rx="4" fill="#10b981">
                                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                                    </rect>
                                    <text x="20" y="45" textAnchor="middle" fontSize="5" fill="white">SUBMIT</text>
                                </g>

                                {/* Enhanced Connection Lines with Animation */}
                                <g stroke="#800000" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="4,4">
                                    <path d="M200 200 L90 290" className="animate-pulse" style={{animationDuration: '2.5s'}}>
                                        <animate attributeName="stroke-dashoffset" values="0;8" dur="2.5s" repeatCount="indefinite"/>
                                    </path>
                                    <path d="M200 200 L305 130" className="animate-pulse" style={{animationDuration: '3s'}}>
                                        <animate attributeName="stroke-dashoffset" values="0;8" dur="3s" repeatCount="indefinite"/>
                                    </path>
                                    <path d="M200 200 L105 97" className="animate-pulse" style={{animationDuration: '3.5s'}}>
                                        <animate attributeName="stroke-dashoffset" values="0;8" dur="3.5s" repeatCount="indefinite"/>
                                    </path>
                                    <path d="M200 200 L290 275" className="animate-pulse" style={{animationDuration: '2s'}}>
                                        <animate attributeName="stroke-dashoffset" values="0;8" dur="2s" repeatCount="indefinite"/>
                                    </path>
                                </g>

                                {/* Floating Notification Badges with Enhanced Animation */}
                                <g className="animate-bounce" style={{animationDuration: '2s'}}>
                                    <circle cx="350" cy="70" r="10" fill="#ef4444" filter="url(#glow)"/>
                                    <text x="350" y="75" textAnchor="middle" fontSize="8" fill="white">3</text>
                                </g>

                                <g className="animate-bounce" style={{animationDuration: '3s', animationDelay: '0.5s'}}>
                                    <circle cx="50" cy="330" r="10" fill="#10b981" filter="url(#glow)"/>
                                    <text x="50" y="335" textAnchor="middle" fontSize="8" fill="white">✓</text>
                                </g>

                                {/* Cloud Sync Indicators with Pulse */}
                                <g className="animate-pulse" style={{animationDuration: '3s'}}>
                                    <ellipse cx="360" cy="170" rx="14" ry="10" fill="#60a5fa" opacity="0.9" filter="url(#glow)"/>
                                    <ellipse cx="355" cy="168" rx="10" ry="7" fill="#60a5fa" opacity="0.7"/>
                                    <ellipse cx="365" cy="168" rx="10" ry="7" fill="#60a5fa" opacity="0.7"/>
                                    <text x="360" y="175" textAnchor="middle" fontSize="8" fill="white">☁</text>
                                </g>

                                {/* Particle Effects */}
                                <g>
                                    <circle cx="100" cy="100" r="3" fill="#800000">
                                        <animate attributeName="cy" values="100;90;100" dur="2s" repeatCount="indefinite"/>
                                        <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/>
                                    </circle>
                                    <circle cx="300" cy="300" r="3" fill="#800000">
                                        <animate attributeName="cy" values="300;290;300" dur="2.5s" repeatCount="indefinite"/>
                                        <animate attributeName="opacity" values="0.2;1;0.2" dur="2.5s" repeatCount="indefinite"/>
                                    </circle>
                                    <circle cx="150" cy="350" r="3" fill="#800000">
                                        <animate attributeName="cx" values="150;140;150" dur="3s" repeatCount="indefinite"/>
                                        <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite"/>
                                    </circle>
                                </g>

                                {/* Definitions for Gradients and Filters */}
                                <defs>
                                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#800000" stopOpacity="0.2"/>
                                        <stop offset="100%" stopColor="#600000" stopOpacity="0.3"/>
                                    </linearGradient>
                                    <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#800000" stopOpacity="0.8"/>
                                        <stop offset="50%" stopColor="#A00000" stopOpacity="0.9"/>
                                        <stop offset="100%" stopColor="#800000" stopOpacity="0.8"/>
                                    </linearGradient>
                                    <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#1e40af" stopOpacity="0.9"/>
                                        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="1"/>
                                    </linearGradient>
                                    <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#333" stopOpacity="1"/>
                                        <stop offset="100%" stopColor="#1a1a1a" stopOpacity="1"/>
                                    </linearGradient>
                                    <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#D4A574" stopOpacity="1"/>
                                        <stop offset="100%" stopColor="#F4A261" stopOpacity="1"/>
                                    </linearGradient>
                                    <linearGradient id="clothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#800000" stopOpacity="1"/>
                                        <stop offset="100%" stopColor="#600000" stopOpacity="1"/>
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                                        <feOffset dx="0" dy="0" result="offsetblur"/>
                                        <feFlood floodColor="#800000" floodOpacity="0.5"/>
                                        <feComposite in2="offsetblur" operator="in"/>
                                        <feMerge>
                                            <feMergeNode/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                    <filter id="holoGlow">
                                        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                                        <feOffset dx="0" dy="0" result="offsetblur"/>
                                        <feFlood floodColor="#800000" floodOpacity="0.7"/>
                                        <feComposite in2="offsetblur" operator="in"/>
                                        <feMerge>
                                            <feMergeNode/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                    <filter id="avatarGlow">
                                        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                                        <feOffset dx="0" dy="0" result="offsetblur"/>
                                        <feFlood floodColor="#d1d5db" floodOpacity="0.5"/>
                                        <feComposite in2="offsetblur" operator="in"/>
                                        <feMerge>
                                            <feMergeNode/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                    <filter id="shadow">
                                        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3"/>
                                    </filter>
                                </defs>
                            </svg>
                        </div>

                        {/* Enhanced Floating Accent Dots */}
                        <div className="absolute top-8 right-8 w-3 h-3 bg-[#800000] rounded-full animate-ping"></div>
                        <div className="absolute bottom-12 left-12 w-4 h-4 bg-[#800000]/60 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                        <div className="absolute top-1/2 right-4 w-2 h-2 bg-[#800000]/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <div className="absolute top-1/4 left-1/4 w-2.5 h-2.5 bg-[#800000]/50 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
