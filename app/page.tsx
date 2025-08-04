"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, CheckCircle, ArrowRight, Star, ChevronDown, ChevronUp, Linkedin, Twitter, Facebook } from 'lucide-react';

// Utility to merge class names with explicit types
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// Custom Hook for Intersection Observer with proper TypeScript types
const useIntersectionObserver = (options: IntersectionObserverInit) => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const [node, setNode] = useState<HTMLElement | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Ensure this code runs only in the browser
        if (typeof window.IntersectionObserver === 'undefined') {
            return;
        }

        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new window.IntersectionObserver(([entry]) => setEntry(entry), options);

        const { current: currentObserver } = observer;
        if (node) {
            currentObserver.observe(node);
        }

        return () => {
            if (currentObserver) {
                currentObserver.disconnect();
            }
        };
    }, [node, options]);

    return [setNode, entry] as const;
};

// --- Reusable Components with TypeScript Props ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg';
    const variants = {
        primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl',
        secondary: 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50',
        ghost: 'bg-transparent text-white hover:bg-white/10',
    };
    return (
        <button className={cn(baseClasses, variants[variant], className)} {...props}>
            {children}
        </button>
    );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={cn(
                'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:border-white/40 hover:scale-[1.02]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className, ...props }) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
    const isVisible = !!entry?.isIntersecting;

    return (
        <section
            ref={ref}
            className={cn(
                'py-20 px-4 transition-all duration-1000 transform',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
};


// --- Section Components ---

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = ['Features', 'Pricing', 'Testimonials', 'FAQ'];

    return (
        <nav className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
            isScrolled || isOpen ? 'bg-gray-900/80 backdrop-blur-lg shadow-xl' : 'bg-transparent'
        )}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a href="#" className="text-2xl font-bold text-white tracking-wider">
                            ADmyBRAND <span className="text-blue-400">AI</span>
                        </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link}
                                    href={`#${link.toLowerCase()}`}
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Button variant="secondary" className="text-sm py-2 px-5">Get Started</Button>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                onClick={() => setIsOpen(false)}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        <div className="flex items-center px-5">
                             <Button variant="secondary" className="w-full text-sm">Get Started</Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

const HeroSection = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 text-white">
            <div className="absolute inset-0 bg-black opacity-50"></div>
             <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900/50"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 text-center px-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
                    Unleash Your Marketing Superpowers
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-8">
                    ADmyBRAND AI Suite is your all-in-one platform to automate campaigns, personalize content, and skyrocket your ROI. Stop guessing, start growing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" className="text-lg">
                        Start Your Free Trial <ArrowRight className="inline ml-2" size={20} />
                    </Button>
                    <Button variant="ghost" className="text-lg">
                        Watch Demo
                    </Button>
                </div>
            </div>
        </div>
    );
};

const FeaturesSection = () => {
    const features = [
        { icon: '🎯', title: 'AI-Powered Ad Targeting', description: 'Automatically find and target your most profitable customer segments with predictive analytics.' },
        { icon: '✍️', title: 'Content Generation', description: 'Create high-converting copy for ads, emails, and social media in seconds.' },
        { icon: '📊', title: 'Predictive Analytics', description: 'Forecast campaign performance and get actionable insights to optimize your strategy.' },
        { icon: '📧', title: 'Smart Email Automation', description: 'Deliver personalized email sequences that nurture leads and drive conversions.' },
        { icon: '📈', title: 'Competitor Analysis', description: 'Monitor your competition’s strategy and identify opportunities to outperform them.' },
        { icon: '💬', title: 'Social Media Management', description: 'Schedule posts, engage with your audience, and track performance across all platforms.' },
    ];

    return (
        <AnimatedSection id="features" className="bg-gray-900 text-white">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Why Choose ADmyBRAND AI?</h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">Everything you need to dominate your market, all in one intelligent platform.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="p-8 text-center">
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-300">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const PricingSection = () => {
    const tiers = [
        { name: 'Starter', price: '49', features: ['5 AI Campaigns', 'Basic Analytics', 'Content Generation (10k words)', 'Email Support'], popular: false },
        { name: 'Pro', price: '99', features: ['Unlimited Campaigns', 'Advanced Analytics', 'Content Generation (50k words)', 'Priority Support', 'Competitor Analysis'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Dedicated Account Manager', 'API Access', 'Custom Integrations'], popular: false },
    ];

    return (
        <AnimatedSection id="pricing" className="bg-gray-800 text-white">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Flexible Pricing for Teams of All Sizes</h2>
                    <p className="text-lg text-gray-400">Choose the plan that&apos;s right for you.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {tiers.map((tier) => (
                        <Card key={tier.name} className={cn(
                            'p-8 text-center relative',
                            tier.popular ? 'border-blue-400 scale-105 bg-white/20' : ''
                        )}>
                            {tier.popular && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <div className="my-4">
                                <span className="text-5xl font-extrabold">${tier.price}</span>
                                <span className="text-gray-400">{tier.name !== 'Enterprise' && '/month'}</span>
                            </div>
                            <ul className="space-y-4 text-left my-8">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <CheckCircle className="text-green-400 mr-3" size={20} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button variant={tier.popular ? 'primary' : 'secondary'} className="w-full">
                                {tier.name === 'Enterprise' ? 'Contact Sales' : 'Choose Plan'}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        { name: 'Sarah Johnson', role: 'CMO, TechCorp', text: 'ADmyBRAND AI has revolutionized our marketing. We\'ve seen a 300% increase in qualified leads in just 3 months. It feels like having a team of data scientists on staff.', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=SJ' },
        { name: 'Mike Chen', role: 'Founder, StartupX', text: 'As a small startup, we need to be smart with our budget. This tool gives us the power of an enterprise marketing suite at a fraction of the cost. The ROI is insane.', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=MC' },
        { name: 'Jessica Rodriguez', role: 'Digital Marketer, E-com Giant', text: 'The content generation feature alone saves me 10+ hours a week. The quality is so good, I barely have to edit it. A total game-changer for our team.', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=JR' },
    ];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(current => (current === testimonials.length - 1 ? 0 : current + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <AnimatedSection id="testimonials" className="bg-gray-900 text-white">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Loved by Marketers Worldwide</h2>
                    <p className="text-lg text-gray-400">Don&apos;t just take our word for it.</p>
                </div>
                <div className="relative w-full max-w-3xl mx-auto h-80">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={cn(
                                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                                index === current ? 'opacity-100' : 'opacity-0'
                            )}
                        >
                            <Card className="p-8 h-full flex flex-col justify-center items-center text-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 border-2 border-blue-400" />
                                <div className="flex mb-2">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="text-yellow-400 fill-current" />)}
                                </div>
                                <p className="text-lg italic text-gray-200 mb-4">&quot;{testimonial.text}&quot;</p>
                                <p className="font-bold text-xl">{testimonial.name}</p>
                                <p className="text-blue-300">{testimonial.role}</p>
                            </Card>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={cn(
                                'w-3 h-3 rounded-full transition-colors',
                                index === current ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                            )}
                        ></button>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};


interface FAQ {
  question: string;
  answer: string;
  open: boolean;
}

interface FAQItemProps {
  faq: FAQ;
  index: number;
  toggleFAQ: (index: number) => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, index, toggleFAQ }) => {
    return (
        <div className="border-b border-white/20 py-4">
            <button
                className="w-full flex justify-between items-center text-left text-xl font-semibold"
                onClick={() => toggleFAQ(index)}
            >
                <span>{faq.question}</span>
                {faq.open ? <ChevronUp /> : <ChevronDown />}
            </button>
            <div
                className={cn(
                    'overflow-hidden transition-all duration-500 ease-in-out',
                    faq.open ? 'max-h-96 mt-4' : 'max-h-0'
                )}
            >
                <p className="text-gray-300">{faq.answer}</p>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([
        { question: 'Is there a free trial available?', answer: 'Yes, we offer a 14-day free trial on our Starter and Pro plans. No credit card required to get started!', open: false },
        { question: 'Can I change my plan later?', answer: 'Absolutely! You can upgrade, downgrade, or cancel your plan at any time from your account dashboard.', open: false },
        { question: 'What integrations do you support?', answer: 'We support integrations with all major marketing platforms, including Google Ads, Facebook Ads, Mailchimp, HubSpot, and Salesforce. Custom integrations are available on our Enterprise plan.', open: false },
        { question: 'Is my data secure?', answer: 'Data security is our top priority. We use industry-standard encryption and security protocols to ensure your data is always safe and protected.', open: false },
    ]);

    const toggleFAQ = (index: number) => {
        setFaqs(faqs.map((faq, i) => {
            if (i === index) {
                return { ...faq, open: !faq.open };
            }
            return { ...faq, open: false };
        }));
    };

    return (
        <AnimatedSection id="faq" className="bg-gray-800 text-white">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} index={index} toggleFAQ={toggleFAQ} />
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">ADmyBRAND AI</h3>
                        <p>Supercharge your marketing with the power of AI.</p>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="hover:text-white"><Twitter /></a>
                            <a href="#" className="hover:text-white"><Facebook /></a>
                            <a href="#" className="hover:text-white"><Linkedin /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><a href="#features" className="hover:text-white">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                            <li><a href="#" className="hover:text-white">Integrations</a></li>
                            <li><a href="#" className="hover:text-white">Updates</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white">About Us</a></li>
                            <li><a href="#" className="hover:text-white">Careers</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                            <li><a href="#" className="hover:text-white">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
                        <p>Subscribe to our newsletter for the latest news and updates.</p>
                        <form className="mt-4 flex">
                            <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 rounded-l-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md text-white">
                                <ArrowRight />
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} ADmyBRAND AI Suite. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};


// --- Main App Component ---
export default function App() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    
    return (
        <div className="bg-gray-900 font-sans">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <PricingSection />
                <TestimonialsSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
}
