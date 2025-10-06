import { ChevronDown } from "lucide-react";
import { useState } from "react";


// FAQ Section Component
const FAQSection = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqs = [
    {
      question: "How do I enroll in a course?",
      answer:
        "Students are enrolled by their school admin or by entering a course code provided by their instructor. Contact your instructor or admin to get started.",
    },
    {
      question: "What types of lessons are available?",
      answer:
        "Lessons are interactive and tailored to your school’s curriculum, including videos, quizzes, and reading materials designed to enhance your learning experience.",
    },
    {
      question: "How do I complete activities and exams?",
      answer:
        "Activities and exams are accessed through your course dashboard. Complete them as assigned, and your progress will be tracked automatically.",
    },
    {
      question: "How can I earn a certificate?",
      answer:
        "Upon successfully completing all course lessons, activities, and exams, you’ll receive a certificate from your school, verifiable through the LMS.",
    },
    {
      question: "How do instructors create a course?",
      answer:
        "Instructors can use our intuitive course builder to design content, including lessons and assessments, tailored to their teaching goals.",
    },
    {
      question: "What is the course approval process?",
      answer:
        "After creating a course, instructors submit it to the school admin for review. Once approved, the course can be deployed for student enrollment.",
    },
    {
      question: "How do instructors support students?",
      answer:
        "Instructors can monitor student progress, provide personalized feedback, and answer questions through the LMS’s communication tools.",
    },
    {
      question: "What should I do if I have technical issues?",
      answer:
        "Contact your school’s LMS support team via email or the helpdesk link in the platform for assistance with any technical difficulties.",
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
