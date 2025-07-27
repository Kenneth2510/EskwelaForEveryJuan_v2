import { useState } from "react";
import Footer from "./landing-page/footer";
import CTASection from "./landing-page/cta";
import FAQSection from "./landing-page/faq";
import FeaturesSection from "./landing-page/features";
import HowItWorksSection from "./landing-page/how-it-works";
import AboutSection from "./landing-page/about";
import HeroSection from "./landing-page/hero-section";
import Header from "./landing-page/header";


// Main App Component
const App = () => {
    const [activeSection, setActiveSection] = useState('home');

    return (
        <div className="font-sans">
            <Header activeSection={activeSection} setActiveSection={setActiveSection} />
            <main>
                <HeroSection />
                <AboutSection />
                <HowItWorksSection />
                <FeaturesSection />
                <FAQSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default App;
