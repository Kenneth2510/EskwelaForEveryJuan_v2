import { ArrowRight, BookOpen, Brain, Video, FileText, GraduationCap, Users, Award, Play, Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useState } from "react";

// Hero Section Component
const HeroSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size for conditional rendering
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Modern Learning Platform SVG Illustration
    const LearningPlatformSVG = () => (
        <svg viewBox="0 0 600 400" className="w-full h-full">
            <defs>
                <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#800000" />
                    <stop offset="100%" stopColor="#600000" />
                </linearGradient>
                <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#800000" opacity="0.1" />
                    <stop offset="100%" stopColor="#800000" opacity="0.3" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="shadow">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#800000" floodOpacity="0.2" />
                </filter>
            </defs>

            {/* Enhanced Background Elements */}
            <circle cx="500" cy="80" r="30" fill="#800000" opacity="0.1" className="animate-pulse" />
            <circle cx="80" cy="320" r="20" fill="#800000" opacity="0.15" className="animate-bounce" />
            <circle cx="520" cy="350" r="25" fill="#800000" opacity="0.1" className="animate-ping" />
            <circle cx="50" cy="100" r="15" fill="#800000" opacity="0.08" className="animate-pulse" style={{animationDelay: '1s'}} />
            <circle cx="550" cy="250" r="18" fill="#800000" opacity="0.12" className="animate-bounce" style={{animationDelay: '2s'}} />

            {/* Floating Geometric Shapes */}
            <polygon points="30,50 50,30 70,50 50,70" fill="#800000" opacity="0.1" className="animate-spin" style={{animationDuration: '10s'}} />
            <rect x="520" y="40" width="20" height="20" rx="4" fill="#800000" opacity="0.15" className="animate-pulse" style={{animationDelay: '0.5s'}} transform="rotate(45 530 50)" />

            {/* Main Device - Laptop */}
            <g transform="translate(120, 140)" filter="url(#shadow)">
                {/* Laptop Base */}
                <rect x="0" y="80" width="360" height="120" rx="8" fill="#374151" />
                <rect x="10" y="90" width="340" height="100" rx="4" fill="#1f2937" />

                {/* Laptop Screen */}
                <rect x="50" y="15" width="260" height="165" rx="8" fill="#111827" />
                <rect x="60" y="25" width="240" height="145" rx="4" fill="url(#screenGradient)" />

                {/* Enhanced Screen Content */}
                <rect x="80" y="45" width="200" height="10" rx="5" fill="url(#brandGradient)" />
                <circle cx="90" cy="50" r="4" fill="white" />
                <text x="105" y="54" fill="white" fontSize="8" fontFamily="Arial">Learning Dashboard</text>

                {/* Navigation Bar */}
                <rect x="80" y="65" width="30" height="6" rx="3" fill="#cbd5e1" />
                <rect x="120" y="65" width="40" height="6" rx="3" fill="#800000" />
                <rect x="170" y="65" width="35" height="6" rx="3" fill="#cbd5e1" />
                <rect x="215" y="65" width="35" height="6" rx="3" fill="#cbd5e1" />

                {/* Course Cards with Icons */}
                <g>
                    <rect x="80" y="80" width="50" height="35" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="90" cy="90" r="4" fill="#3b82f6" />
                    <text x="85" y="108" fill="#374151" fontSize="6">Math</text>
                    <text x="85" y="113" fill="#6b7280" fontSize="4">75%</text>
                </g>

                <g>
                    <rect x="140" y="80" width="50" height="35" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="150" cy="90" r="4" fill="#10b981" />
                    <text x="143" y="108" fill="#374151" fontSize="6">Science</text>
                    <text x="143" y="113" fill="#6b7280" fontSize="4">92%</text>
                </g>

                <g>
                    <rect x="200" y="80" width="50" height="35" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="210" cy="90" r="4" fill="#f59e0b" />
                    <text x="200" y="108" fill="#374151" fontSize="6">History</text>
                    <text x="200" y="113" fill="#6b7280" fontSize="4">68%</text>
                </g>

                {/* Progress Section */}
                <text x="80" y="135" fill="#374151" fontSize="8" fontWeight="bold">Weekly Progress</text>
                <rect x="80" y="140" width="170" height="8" rx="4" fill="#e2e8f0" />
                <rect x="80" y="140" width="128" height="8" rx="4" fill="url(#brandGradient)" className="animate-pulse" />
                <text x="255" y="147" fill="#800000" fontSize="7" fontWeight="bold">75%</text>

                {/* Achievement Badges */}
                <circle cx="90" cy="160" r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                <circle cx="110" cy="160" r="6" fill="#34d399" stroke="#10b981" strokeWidth="1" />
                <circle cx="130" cy="160" r="6" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1" />
                <text x="145" y="165" fill="#6b7280" fontSize="6">+12 badges earned</text>

                {/* Keyboard */}
                <rect x="70" y="190" width="220" height="3" rx="1.5" fill="#4b5563" />
                <rect x="80" y="186" width="12" height="2" rx="1" fill="#6b7280" />
                <rect x="95" y="186" width="12" height="2" rx="1" fill="#6b7280" />
                <rect x="200" y="186" width="80" height="2" rx="1" fill="#6b7280" />
            </g>

            {/* Floating Elements - Enhanced */}
            {/* Video Call Icon */}
            <g transform="translate(80, 90)" className="animate-bounce" style={{animationDelay: '0s'}}>
                <circle r="28" fill="white" stroke="#800000" strokeWidth="2" filter="url(#glow)" />
                <rect x="-10" y="-7" width="20" height="14" rx="3" fill="#800000" />
                <polygon points="-2,-3 8,1 -2,5" fill="white" />
                <circle cx="6" cy="-5" r="2" fill="#ef4444" className="animate-pulse" />
            </g>

            {/* Book/Course Icon */}
            <g transform="translate(480, 110)" className="animate-bounce" style={{animationDelay: '1s'}}>
                <circle r="28" fill="white" stroke="#800000" strokeWidth="2" filter="url(#glow)" />
                <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#800000" />
                <line x1="-8" y1="-4" x2="8" y2="-4" stroke="white" strokeWidth="1.5" />
                <line x1="-8" y1="0" x2="8" y2="0" stroke="white" strokeWidth="1" />
                <line x1="-8" y1="3" x2="5" y2="3" stroke="white" strokeWidth="1" />
                <circle cx="8" cy="8" r="3" fill="#10b981" />
                <text x="8" y="11" textAnchor="middle" fill="white" fontSize="4">42</text>
            </g>

            {/* Certificate/Achievement Icon */}
            <g transform="translate(470, 290)" className="animate-bounce" style={{animationDelay: '2s'}}>
                <circle r="28" fill="white" stroke="#800000" strokeWidth="2" filter="url(#glow)" />
                <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#800000" />
                <circle cx="0" cy="0" r="4" fill="white" />
                <polygon points="0,-10 3,-5 8,-5 4,-1 5,5 0,2 -5,5 -4,-1 -8,-5 -3,-5" fill="white" />
                <rect x="-6" y="6" width="12" height="2" rx="1" fill="white" />
                <rect x="-4" y="9" width="8" height="1" rx="0.5" fill="white" />
            </g>

            {/* Brain/AI Icon - Enhanced */}
            <g transform="translate(90, 290)" className="animate-bounce" style={{animationDelay: '3s'}}>
                <circle r="28" fill="white" stroke="#800000" strokeWidth="2" filter="url(#glow)" />
                <path d="M-10,-6 Q-10,-10 -5,-10 Q0,-12 5,-10 Q10,-10 10,-6 Q10,0 8,3 Q10,6 10,10 Q5,10 0,8 Q-5,10 -10,10 Q-10,6 -8,3 Q-10,0 -10,-6 Z" fill="#800000" />
                <circle cx="-4" cy="-3" r="1.5" fill="white" />
                <circle cx="4" cy="-3" r="1.5" fill="white" />
                <path d="M-6,2 Q0,4 6,2" stroke="white" strokeWidth="1" fill="none" />
                <circle cx="12" cy="-8" r="3" fill="#3b82f6" className="animate-pulse" />
                <text x="12" y="-6" textAnchor="middle" fill="white" fontSize="4">AI</text>
            </g>

            {/* Students/Community Icon */}
            <g transform="translate(520, 180)" className="animate-bounce" style={{animationDelay: '4s'}}>
                <circle r="28" fill="white" stroke="#800000" strokeWidth="2" filter="url(#glow)" />
                <circle cx="-4" cy="-3" r="4" fill="#800000" />
                <circle cx="4" cy="-3" r="4" fill="#800000" />
                <circle cx="0" cy="2" r="3" fill="#800000" />
                <rect x="-8" y="6" width="16" height="6" rx="3" fill="#800000" />
                <circle cx="22" cy="-10" r="4" fill="#f59e0b" />
                <text x="22" y="-7" textAnchor="middle" fill="white" fontSize="5">1K+</text>
            </g>

            {/* Assignment/Quiz Icon */}
            <g transform="translate(40, 180)" className="animate-bounce" style={{animationDelay: '5s'}}>
                <circle r="25" fill="white" stroke="#800000" strokeWidth="2" filter="url(#glow)" />
                <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#800000" />
                <rect x="-6" y="-4" width="12" height="1" rx="0.5" fill="white" />
                <rect x="-6" y="-1" width="8" height="1" rx="0.5" fill="white" />
                <rect x="-6" y="2" width="10" height="1" rx="0.5" fill="white" />
                <circle cx="6" cy="-4" r="1" fill="#10b981" />
                <circle cx="6" cy="-1" r="1" fill="#10b981" />
                <circle cx="6" cy="2" r="1" fill="#ef4444" />
            </g>

            {/* Enhanced Mobile Devices */}
            <g transform="translate(40, 200)" filter="url(#shadow)">
                <rect width="30" height="50" rx="8" fill="#374151" />
                <rect x="3" y="5" width="24" height="40" rx="4" fill="url(#screenGradient)" />
                <rect x="5" y="10" width="20" height="3" rx="1.5" fill="url(#brandGradient)" />
                <rect x="5" y="16" width="12" height="1.5" rx="0.75" fill="#cbd5e1" />
                <rect x="5" y="20" width="16" height="1.5" rx="0.75" fill="#cbd5e1" />
                <rect x="5" y="24" width="10" height="1.5" rx="0.75" fill="#cbd5e1" />

                {/* App Icons */}
                <circle cx="8" cy="30" r="2" fill="#3b82f6" />
                <circle cx="14" cy="30" r="2" fill="#10b981" />
                <circle cx="20" cy="30" r="2" fill="#f59e0b" />
                <circle cx="8" cy="36" r="2" fill="#ef4444" />
                <circle cx="14" cy="36" r="2" fill="#8b5cf6" />

                {/* Notification badge */}
                <circle cx="22" cy="8" r="3" fill="#ef4444" />
                <text x="22" y="10" textAnchor="middle" fill="white" fontSize="4">3</text>
            </g>

            <g transform="translate(510, 200)" filter="url(shadow)">
                <rect width="45" height="30" rx="6" fill="#374151" />
                <rect x="3" y="3" width="39" height="24" rx="3" fill="url(#screenGradient)" />
                <rect x="5" y="6" width="35" height="3" rx="1.5" fill="url(#brandGradient)" />
                <rect x="5" y="12" width="20" height="1.5" rx="0.75" fill="#cbd5e1" />
                <rect x="5" y="16" width="25" height="1.5" rx="0.75" fill="#cbd5e1" />
                <rect x="5" y="20" width="15" height="1.5" rx="0.75" fill="#cbd5e1" />

                {/* Video player */}
                <rect x="28" y="11" width="10" height="8" rx="2" fill="#1f2937" />
                <polygon points="31,13 35,15 31,17" fill="#800000" />
            </g>

            {/* Desktop Monitor */}
            <g transform="translate(450, 70)" filter="url(#shadow)">
                <rect width="80" height="50" rx="4" fill="#374151" />
                <rect x="3" y="3" width="74" height="40" rx="2" fill="url(#screenGradient)" />
                <rect x="6" y="8" width="68" height="4" rx="2" fill="url(#brandGradient)" />
                <rect x="6" y="16" width="40" height="2" rx="1" fill="#cbd5e1" />
                <rect x="6" y="20" width="50" height="2" rx="1" fill="#cbd5e1" />
                <rect x="6" y="24" width="35" height="2" rx="1" fill="#cbd5e1" />

                {/* Charts/Graphs */}
                <rect x="50" y="16" width="22" height="15" rx="2" fill="white" stroke="#e2e8f0" />
                <rect x="52" y="27" width="3" height="2" fill="#800000" />
                <rect x="56" y="25" width="3" height="4" fill="#800000" />
                <rect x="60" y="22" width="3" height="7" fill="#800000" />
                <rect x="64" y="20" width="3" height="9" fill="#800000" />
                <rect x="68" y="18" width="3" height="11" fill="#800000" />

                {/* Monitor Stand */}
                <rect x="35" y="50" width="10" height="8" rx="2" fill="#6b7280" />
                <rect x="25" y="58" width="30" height="3" rx="1.5" fill="#6b7280" />
            </g>

            {/* Smartwatch */}
            <g transform="translate(60, 60)">
                <rect width="20" height="25" rx="8" fill="#374151" />
                <rect x="2" y="3" width="16" height="19" rx="6" fill="#1f2937" />
                <circle cx="10" cy="12" r="6" fill="url(#screenGradient)" />
                <arc cx="10" cy="12" r="4" fill="none" stroke="#800000" strokeWidth="1" strokeDasharray="8,2" className="animate-spin" style={{animationDuration: '3s'}} />
                <text x="10" y="14" textAnchor="middle" fill="#800000" fontSize="3">85%</text>
            </g>

            {/* Enhanced Connecting Lines and Data Flow */}
            <path d="M200 230 Q300 190 400 230" stroke="#800000" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
            </path>

            <path d="M180 290 Q300 330 420 290" stroke="#800000" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite" />
            </path>

            <path d="M120 140 Q200 100 300 120" stroke="#800000" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="3,3">
                <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
            </path>

            <path d="M480 140 Q520 100 560 140" stroke="#800000" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="3,3">
                <animate attributeName="stroke-dashoffset" values="6;0" dur="1.5s" repeatCount="indefinite" />
            </path>

            {/* Data Particles */}
            <circle r="2" fill="#800000" opacity="0.6">
                <animateMotion dur="4s" repeatCount="indefinite" path="M200 230 Q300 190 400 230" />
            </circle>
            <circle r="1.5" fill="#800000" opacity="0.8">
                <animateMotion dur="3s" repeatCount="indefinite" path="M180 290 Q300 330 420 290" />
            </circle>
            <circle r="1" fill="#800000" opacity="0.7">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M120 140 Q200 100 300 120" />
            </circle>

            {/* Cloud Storage Icon */}
            <g transform="translate(300, 50)">
                <ellipse cx="0" cy="0" rx="25" ry="15" fill="white" stroke="#800000" strokeWidth="2" opacity="0.9" filter="url(#glow)" />
                <ellipse cx="-8" cy="-3" rx="12" ry="8" fill="white" stroke="#800000" strokeWidth="1.5" />
                <ellipse cx="8" cy="-3" rx="12" ry="8" fill="white" stroke="#800000" strokeWidth="1.5" />
                <path d="M-5,3 L-2,6 L2,6 L5,3" stroke="#800000" strokeWidth="1.5" fill="none" />
                <path d="M0,6 L0,9" stroke="#800000" strokeWidth="1.5" />
                <circle cx="18" cy="-8" r="4" fill="#10b981" />
                <text x="18" y="-6" textAnchor="middle" fill="white" fontSize="4">∞</text>
            </g>
        </svg>
    );

    return (
        <section className="relative flex min-h-[80vh] items-center mt-20 overflow-hidden px-4 pt-24 pb-16 sm:pt-32 sm:pb-20">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#800000]/10 via-gray-50/70 to-[#800000]/5 animate-gradient"></div>

            <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
                    {/* Left Side - Text Content (UNCHANGED) */}
                    <div className="space-y-6 sm:space-y-8 animate-fade-in">
                        <h1 className="text-4xl font-black leading-tight text-[#111111] sm:text-5xl lg:text-6xl xl:text-7xl">
                            Education for
                            <span className="block text-[#800000]">Every Juan</span>
                        </h1>
                        <p className="max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg sm:max-w-xl">
                            Your school's learning management system for seamless course access, interactive lessons, and certified achievements.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <a href="/login">
                                <button
                                    className="group transform rounded-lg bg-[#800000] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#600000] sm:px-8 sm:py-4 sm:text-lg"
                                    aria-label="Start Learning Today"
                                >
                                    Start Learning Today
                                    <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1 sm:h-6 sm:w-6" />
                                </button>
                            </a>
                        </div>
                    </div>

                    {/* Right Side - Modern Learning Platform Illustration */}
                    <div className="relative flex justify-center lg:justify-end">
                        {isMobile ? (
                            <div className="relative w-full max-w-[300px] h-[200px] rounded-3xl bg-gradient-to-br from-[#800000]/5 to-[#800000]/10 p-6 shadow-xl backdrop-blur-sm border border-[#800000]/10">
                                <div className="text-center space-y-4 h-full flex flex-col justify-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#800000]/10 animate-pulse">
                                        <Monitor className="h-8 w-8 text-[#800000]" aria-hidden="true" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">
                                        Cross-Platform Learning
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Access from any device, anywhere
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full max-w-[600px] h-[400px]">
                                {/* Main SVG Illustration */}
                                <div className="relative w-full h-full transform hover:scale-105 transition-all duration-700 ease-out">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#800000]/5 to-[#800000]/10 rounded-3xl blur-xl"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#800000]/10 p-8 h-full">
                                        <LearningPlatformSVG />
                                    </div>
                                </div>

                                {/* Additional Feature Badges - More elements */}
                                <div className="absolute -top-4 -right-4 transform rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300">
                                    <div className="flex items-center space-x-2 rounded-xl bg-white px-3 py-2 shadow-lg border border-[#800000]/10">
                                        <Video className="h-4 w-4 text-[#800000]" aria-hidden="true" />
                                        <span className="text-xs font-semibold text-gray-700">Live Classes</span>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -left-4 transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300">
                                    <div className="flex items-center space-x-2 rounded-xl bg-white px-3 py-2 shadow-lg border border-[#800000]/10">
                                        <GraduationCap className="h-4 w-4 text-[#800000]" aria-hidden="true" />
                                        <span className="text-xs font-semibold text-gray-700">Certificates</span>
                                    </div>
                                </div>
{/*
                                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 hidden lg:block">
                                    <div className="flex items-center space-x-2 rounded-xl bg-white px-3 py-2 shadow-lg border border-[#800000]/10">
                                        <Brain className="h-4 w-4 text-[#800000]" aria-hidden="true" />
                                        <span className="text-xs font-semibold text-gray-700">AI Tutor</span>
                                    </div>
                                </div> */}

                                <div className="absolute top-8 -left-6 transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 hidden lg:block">
                                    <div className="flex items-center space-x-2 rounded-xl bg-white px-3 py-2 shadow-lg border border-[#800000]/10">
                                        <FileText className="h-4 w-4 text-[#800000]" aria-hidden="true" />
                                        <span className="text-xs font-semibold text-gray-700">Rich Content</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-16 -right-8 transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300">
                                    <div className="flex items-center space-x-2 rounded-xl bg-white px-3 py-2 shadow-lg border border-[#800000]/10">
                                        <Award className="h-4 w-4 text-[#800000]" aria-hidden="true" />
                                        <span className="text-xs font-semibold text-gray-700">500+ Courses</span>
                                    </div>
                                </div>

                                <div className="absolute top-32 -right-12 transform rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 hidden xl:block">
                                    <div className="flex items-center space-x-2 rounded-xl bg-white px-3 py-2 shadow-lg border border-[#800000]/10">
                                        <Play className="h-4 w-4 text-[#800000]" aria-hidden="true" />
                                        <span className="text-xs font-semibold text-gray-700">HD Videos</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-32 -left-12 transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 hidden xl:block">
                                    <div className="flex items-center space-x-2 rounded-xl bg-white px-3 py-2 shadow-lg border border-[#800000]/10">
                                        <BookOpen className="h-4 w-4 text-[#800000]" aria-hidden="true" />
                                        <span className="text-xs font-semibold text-gray-700">Study Groups</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
