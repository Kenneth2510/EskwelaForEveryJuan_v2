import { ChevronDown } from "lucide-react";
import { useState } from "react";


// FAQ Section Component
const FAQSection = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqs = [
        {
            question: 'How do I get started with EskwelaForEveryJuan?',
            answer: 'Getting started is simple! Just create a free account, browse our course catalog, and enroll in courses that interest you. You can start learning immediately after enrollment.',
        },
        {
            question: 'Are the certificates recognized by employers?',
            answer: 'Yes, our certificates are industry-recognized and include verification features. Many of our partner companies accept our certificates for hiring and promotion decisions.',
        },
        {
            question: 'Can I access courses on mobile devices?',
            answer: 'Absolutely! Our platform is fully responsive and optimized for mobile learning. You can access all course materials, videos, and assessments on any device.',
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept various payment methods including credit cards, PayPal, GCash, and bank transfers. We also offer flexible payment plans for certain courses.',
        },
        {
            question: 'How do I become an instructor on the platform?',
            answer: 'To become an instructor, apply through our instructor portal with your credentials and course proposal. Our team will review your application and guide you through the onboarding process.',
        },
        {
            question: 'Is there a refund policy?',
            answer: "Yes, we offer a 30-day money-back guarantee for most courses. If you're not satisfied with a course, you can request a full refund within the first 30 days.",
        },
        {
            question: 'Do you offer live classes or just recorded content?',
            answer: 'We offer both! Our platform includes live interactive sessions with instructors as well as self-paced recorded content that you can access anytime.',
        },
        {
            question: 'How long do I have access to purchased courses?',
            answer: 'Once you purchase a course, you have lifetime access to the content, including any future updates and additional materials added by the instructor.',
        },
        {
            question: 'Is there customer support available?',
            answer: 'Yes, we provide 24/7 customer support through chat, email, and phone. Our support team is always ready to help with any questions or technical issues.',
        },
        {
            question: 'Can I get college credit for completed courses?',
            answer: 'Some of our courses are eligible for college credit through our partner institutions. Check the individual course descriptions for credit eligibility information.',
        },
    ];

    return (
        <section id="faqs" className="bg-[#EEEEEE]/30 px-4 py-24">
            <div className="mx-auto max-w-4xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-6 text-4xl font-black text-[#111111] lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-600">Find answers to common questions about our platform and services.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <button
                                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                className="flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-gray-50"
                            >
                                <h3 className="pr-4 text-lg font-semibold text-[#111111]">{faq.question}</h3>
                                <ChevronDown
                                    className={`h-5 w-5 flex-shrink-0 text-[#800000] transition-transform duration-300 ${
                                        openFAQ === index ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            <div className={`overflow-hidden px-8 transition-all duration-300 ${openFAQ === index ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                                <p className="border-t border-gray-100 pt-6 leading-relaxed text-gray-600">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
