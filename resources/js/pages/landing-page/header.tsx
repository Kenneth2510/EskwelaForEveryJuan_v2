import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";


// Header Component
const Header = ({ activeSection, setActiveSection }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'about', label: 'About' },
        { id: 'features', label: 'Features' },
        { id: 'faqs', label: 'FAQs' },
    ];

    const handleNavClick = (id) => {
        setActiveSection(id);
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="fixed top-6 left-1/2 z-50 w-[90%] max-w-6xl -translate-x-1/2 transform">
            <div className="rounded-full border border-gray-200/50 bg-white/90 shadow-lg backdrop-blur-xl">
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title */}
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-[#111111]">EskwelaForEveryJuan</span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden items-center space-x-8 md:flex">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`group relative font-medium text-gray-700 transition-colors hover:text-[#800000] ${
                                        activeSection === item.id ? 'text-[#800000]' : ''
                                    }`}
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#800000] transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            ))}
                        </nav>
                        {/* Login Button */}
                        <div className="flex items-center space-x-4">
                            <button className="rounded-full bg-[#800000] px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#600000] hover:shadow-lg">
                                Get Started
                            </button>
                            <button
                                className="rounded-full p-2 transition-colors hover:bg-gray-100 md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="mt-4 border-t border-gray-200 px-4 pb-4 md:hidden">
                            {navItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`block py-2 font-medium text-gray-700 transition-colors hover:text-[#800000] ${
                                        activeSection === item.id ? 'text-[#800000]' : ''
                                    }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
