import { BookOpen, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Header = ({ activeSection, setActiveSection }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const toggleButtonRef = useRef(null);

    const navItems = [
        { id: "about", label: "About" },
        { id: "features", label: "Features" },
        { id: "faqs", label: "FAQs" },
    ];

    const handleNavClick = (id) => {
        setActiveSection(id);
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Close mobile menu when clicking outside or pressing Escape
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                mobileMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setMobileMenuOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (mobileMenuOpen && event.key === "Escape") {
                setMobileMenuOpen(false);
                toggleButtonRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [mobileMenuOpen]);

    return (
        <header className="fixed top-4 left-1/2 z-50 w-[90%] max-w-7xl -translate-x-1/2 transform sm:top-6">
            <div className="rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg backdrop-blur-xl">
                <div className="px-4 py-4 sm:px-6 sm:py-5">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title */}
                        <div className="flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#800000] sm:h-14 sm:w-14">
                                <BookOpen className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                            </div>
                            <span className="text-lg font-bold text-[#111111] sm:text-xl">
                                EskwelaForEveryJuan
                            </span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden items-center space-x-6 lg:space-x-8 md:flex">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`relative py-2 font-medium text-gray-700 transition-colors hover:text-[#800000] text-sm lg:text-base ${
                                        activeSection === item.id ? "text-[#800000]" : ""
                                    }`}
                                    aria-current={activeSection === item.id ? "page" : undefined}
                                >
                                    {item.label}
                                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-[#800000] transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            ))}
                        </nav>

                        {/* Login Button & Menu Toggle */}
                        <div className="flex items-center space-x-3">
                            <a href="/login">
                                <button
                                    className="rounded-full bg-[#800000] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#600000] hover:shadow-lg sm:px-6 sm:text-base"
                                    aria-label="Get Started"
                                >
                                    Get Started
                                </button>
                            </a>
                            <button
                                ref={toggleButtonRef}
                                className="rounded-full p-3 transition-colors hover:bg-gray-100 md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-7 w-7" />
                                ) : (
                                    <Menu className="h-7 w-7" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <nav
                            ref={menuRef}
                            className="mt-4 animate-slide-down border-t border-gray-200 px-4 pb-5 md:hidden"
                            role="navigation"
                            aria-label="Mobile navigation"
                        >
                            {navItems.map((item, index) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`block py-4 text-lg font-medium text-gray-700 transition-colors hover:text-[#800000] ${
                                        activeSection === item.id ? "text-[#800000]" : ""
                                    } ${index === 0 ? "pt-5" : ""}`}
                                    aria-current={activeSection === item.id ? "page" : undefined}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
