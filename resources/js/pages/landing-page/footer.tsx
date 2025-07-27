import { BookOpen, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

// Footer Component
const Footer = () => {
    return (
        <footer className="bg-[#111111] px-4 py-16 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">EskwelaForEveryJuan</span>
                        </div>
                        <p className="leading-relaxed text-gray-400">
                            Empowering every Filipino with accessible, quality education through innovative technology.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-colors hover:text-[#800000]"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-colors hover:text-[#800000]"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-colors hover:text-[#800000]"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-colors hover:text-[#800000]"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#about" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#faqs" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="/courses" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    Courses
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/blog" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="/help" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-2">
                                <Mail className="h-5 w-5 text-[#800000]" />
                                <a href="mailto:support@eskwelaforeveryjuan.com" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    support@eskwelaforeveryjuan.com
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-5 w-5 text-[#800000]" />
                                <a href="tel:+63212345678" className="text-gray-400 transition-colors hover:text-[#800000]">
                                    +63 2 1234 5678
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-[#800000]" />
                                <span className="text-gray-400">123 Education St., Manila, Philippines</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 text-center">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} EskwelaForEveryJuan. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
