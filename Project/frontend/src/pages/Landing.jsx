import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  CheckCircle,
  BookOpen,
  Brain,
  PenTool,
  BarChart4,
  Award,
  Mail,
  Play,
  ArrowRight,
  Star,
  MessageSquare,
  Shield,
  Clock,
  ArrowUp
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videoRef = useRef(null);

  const videoUrl = "RNS Exam Paper Analyzer - Made with Clipchamp.mp4";
  const thumbnailUrl = "Exam_paper_Analyzer.png";

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleWatchDemo = () => {
    setIsPlaying(true);
    setShowPlayButton(false);
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowPlayButton(true);
    if (videoRef.current) {
      videoRef.current.src = "";
    }
  };

  // Features carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Testimonials rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Demo assessment images
  const demoImages = [
    { title: "Paper Analysis", description: "AI-powered assessment of exam papers" },
    { title: "Handwriting Analysis", description: "Precise evaluation of student handwriting" },
    { title: "Performance Reports", description: "Comprehensive student evaluation reports" },
    { title: "Improvement Tracking", description: "Track growth over multiple assessments" }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "AssessEngine has revolutionized how I evaluate student work. The handwriting analysis is incredibly accurate, and the automated reports save me hours each week.",
      name: "Dr. Sarah Johnson",
      title: "Mathematics Professor, Oxford",
      rating: 5
    },
    {
      quote: "The detailed analytics provide insights I never had before. My students are receiving more targeted feedback, and I'm seeing improved results.",
      name: "Prof. Michael Chen",
      title: "Science Department, Cambridge",
      rating: 5
    },
    {
      quote: "As a school administrator, implementing AssessEngine across our institution has standardized our assessment process while giving teachers more time to focus on teaching.",
      name: "Lisa Thompson",
      title: "Principal, Westfield Academy",
      rating: 5
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      title: "Starter",
      price: "$29",
      period: "per month",
      features: [
        "Up to 100 assessments per month",
        "Basic handwriting analysis",
        "Standard reports",
        "Email support"
      ],
      cta: "Start Free Trial",
      highlighted: false
    },
    {
      title: "Professional",
      price: "$79",
      period: "per month",
      features: [
        "Up to 500 assessments per month",
        "Advanced handwriting analysis",
        "Detailed student reports",
        "Performance tracking",
        "Priority support"
      ],
      cta: "Get Started",
      highlighted: true
    },
    {
      title: "Institution",
      price: "$199",
      period: "per month",
      features: [
        "Unlimited assessments",
        "Advanced handwriting & pattern analysis",
        "Custom reporting",
        "Analytics dashboard",
        "API access",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="font-sans bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-purple-700 transition-all duration-300 animate-bounce"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-md bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-purple-600">
              RNS <span className="text-amber-500">AssessEngine</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-600 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-purple-600 transition-colors">Contact</a>

            <a href="/login">
              <button className="bg-amber-500 text-white px-5 py-2 rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                Get Started
              </button>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-slideDown">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <a href="#features" className="py-2 hover:text-purple-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="py-2 hover:text-purple-600 transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</a>
              <a href="#pricing" className="py-2 hover:text-purple-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <a href="#contact" className="py-2 hover:text-purple-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
              <div className="flex space-x-4 pt-2">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex-1 shadow-md hover:bg-purple-700 transition-all duration-300">
                  Sign In
                </button>
                <a href="/login" className="flex-1">
                  <button className="bg-amber-500 text-white px-4 py-2 rounded-lg w-full shadow-md hover:bg-amber-600 transition-all duration-300">
                    Get Started
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
              <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4 animate-pulse">
                NEW AI TECHNOLOGY
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-purple-600">Transform</span> Paper Assessment With <span className="text-amber-500">AI-Powered</span> Analysis
              </h1>
              <p className="text-lg mb-8 text-gray-600 leading-relaxed">
                Analyze exam papers, evaluate handwriting, and generate comprehensive reports to enhance student performance through precise feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="/login">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-purple-700 transform hover:translate-y-1">
                    Get Started Free
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </a>
                <a href='#how-it-works'><button
                  onClick={handleWatchDemo}
                  className="group border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg transition-all duration-300 font-medium focus:outline-none flex items-center justify-center hover:bg-purple-50"
                >
                  <Play className="mr-2 w-5 h-5 group-hover:animate-pulse" />
                  Watch Demo
                </button></a>
              </div>

              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-500 hover:shadow-2xl">
                <div className="p-3 bg-purple-600 text-white">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-sm">AssessEngine Analysis</div>
                  </div>
                </div>
                <div className="p-6 relative">
                  
                    <div className="relative">
                      <img
                        src={thumbnailUrl}
                        alt="AssessEngine Demo Preview"
                        className=" ml-12 w-150 h-95 object-cover rounded-lg"
                      />
                      </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-xl transition-all duration-300 hover:shadow-md">
                      <div className="font-medium">Handwriting Accuracy</div>
                      <div className="text-purple-600 text-xl font-bold">96%</div>
                      <div className="h-2 bg-gray-200 rounded-full mt-2">
                        <div className="h-2 bg-purple-600 rounded-full animate-progressGrow" style={{ width: '96%' }}></div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl transition-all duration-300 hover:shadow-md">
                      <div className="font-medium">Content Analysis</div>
                      <div className="text-purple-600 text-xl font-bold">89%</div>
                      <div className="h-2 bg-gray-200 rounded-full mt-2">
                        <div className="h-2 bg-purple-600 rounded-full animate-progressGrow" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3 animate-bounce">
                Fast & Accurate!
              </div>
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-32 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-48 right-10 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-8 font-medium">Trusted by educators and institutions worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-gray-400 font-bold text-xl hover:text-purple-600 transition-colors cursor-pointer">OXFORD</div>
            <div className="text-gray-400 font-bold text-xl hover:text-purple-600 transition-colors cursor-pointer">CAMBRIDGE</div>
            <div className="text-gray-400 font-bold text-xl hover:text-purple-600 transition-colors cursor-pointer">HARVARD</div>
            <div className="text-gray-400 font-bold text-xl hover:text-purple-600 transition-colors cursor-pointer">STANFORD</div>
            <div className="text-gray-400 font-bold text-xl hover:text-purple-600 transition-colors cursor-pointer">MIT</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-purple-100 text-purple-600 text-sm font-medium px-4 py-1.5 rounded-full">FEATURES</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Powerful <span className="text-purple-600">Assessment</span> Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our AI-powered engine transforms how educators evaluate exams, provide feedback, and track student progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-100 p-4 inline-flex rounded-xl mb-6">
                <BookOpen className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Paper Analysis</h3>
              <p className="text-gray-600">
                Advanced AI algorithms analyze exam content, structure, and responses for comprehensive evaluation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-100 p-4 inline-flex rounded-xl mb-6">
                <PenTool className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Handwriting Analysis</h3>
              <p className="text-gray-600">
                State-of-the-art recognition technology accurately evaluates student handwriting with precision.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-100 p-4 inline-flex rounded-xl mb-6">
                <BarChart4 className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Detailed Reports</h3>
              <p className="text-gray-600">
                Generate comprehensive performance reports with actionable insights for improvement.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-100 p-4 inline-flex rounded-xl mb-6">
                <Brain className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Feedback</h3>
              <p className="text-gray-600">
                AI-generated personalized feedback helps students understand areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-amber-100 text-amber-600 text-sm font-medium px-4 py-1.5 rounded-full">PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              How <span className="text-purple-600">AssessEngine</span> Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our streamlined process makes assessment efficient and insightful
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-purple-100 transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-20"></div>
                  <span className="text-purple-600 text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Upload</h3>
                <p className="text-gray-600">
                  Simply scan and upload exam papers through our intuitive interface
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-20"></div>
                  <span className="text-purple-600 text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Analyze</h3>
                <p className="text-gray-600">
                  Our AI engine analyzes content, handwriting, and patterns
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-20"></div>
                  <span className="text-purple-600 text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Report</h3>
                <p className="text-gray-600">
                  Receive detailed reports with actionable insights and recommendations
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="bg-gradient-to-r from-purple-50 to-amber-50 rounded-2xl p-8 md:p-10 shadow-lg">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-purple-600">
                    See AssessEngine in Action
                  </h3>
                  <p className="text-gray-700 mb-6 text-lg">
                    Watch how our platform transforms assessment workflows, saves time, and provides valuable insights for educators and students.
                  </p>
                  <button
                    onClick={handleWatchDemo}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium inline-flex items-center shadow-md hover:shadow-lg hover:bg-purple-700"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo (Double Tap)
                  </button>
                </div>

                <div className="md:w-2/6 ml-40">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
                    {!isPlaying ? (
                      <div className="relative group cursor-pointer" onClick={handleWatchDemo}>
                        <img
                          src={thumbnailUrl}
                          alt="AssessEngine Demo"
                          className="w-140 h-79 object-cover rounded-lg transform transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-purple-600 bg-opacity-90 rounded-full w-20 h-20 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        ref={videoRef}
                        width="460"
                        height="315"
                        src=""
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-140 h-79 aspect-video"
                        onEnded={handleVideoEnd}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo/Features Carousel */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-purple-100 text-purple-600 text-sm font-medium px-4 py-1.5 rounded-full">SHOWCASE</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Experience the <span className="text-purple-600">AssessEngine</span> Difference
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our platform provides comprehensive tools for modern assessment needs
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl">
                <img
                  src="/api/placeholder/600/400"
                  alt={demoImages[activeFeature].title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-purple-600">{demoImages[activeFeature].title}</h3>
                  <p className="text-gray-600 mt-3 text-lg">{demoImages[activeFeature].description}</p>
                </div>
              </div>

              <div className="flex justify-center mt-6 space-x-3">
                {demoImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeFeature ? 'bg-purple-600 w-6' : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveFeature(index)}
                    aria-label={`View feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-4 rounded-xl mr-5">
                      <Award className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">99% Accuracy Rate</h3>
                      <p className="text-gray-600">
                        Our advanced algorithms ensure nearly perfect recognition of handwriting and assessment scoring.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-4 rounded-xl mr-5">
                      <Clock className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Time-Saving Automation</h3>
                      <p className="text-gray-600">
                        Reduce assessment time by up to 75% while improving quality and consistency of feedback.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-4 rounded-xl mr-5">
                      <MessageSquare className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Personalized Feedback</h3>
                      <p className="text-gray-600">
                        Generate tailored feedback for each student based on their specific performance and patterns.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-4 rounded-xl mr-5">
                      <Shield className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Secure & Compliant</h3>
                      <p className="text-gray-600">
                        Enterprise-grade security with full GDPR and FERPA compliance for educational data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-amber-100 text-amber-600 text-sm font-medium px-4 py-1.5 rounded-full">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              What <span className="text-purple-600">Educators</span> Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Hear from educators who transformed their assessment process with AssessEngine
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl shadow-lg p-8 md:p-10 relative">
              <div className="absolute top-6 right-8 text-purple-300 opacity-50">
                <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 60L20 30V0H0V30H20L0 60ZM50 60L70 30V0H50V30H70L50 60Z" fill="currentColor"/>
                </svg>
              </div>

              <div className="relative z-10">
                <p className="text-xl md:text-2xl text-gray-700 font-medium mb-8 italic">
                  "{testimonials[activeTestimonial].quote}"
                </p>

                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 overflow-hidden mr-5">
                    <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                      <span className="text-purple-600 text-xl font-bold">
                        {testimonials[activeTestimonial].name.split(' ')[0][0]}
                        {testimonials[activeTestimonial].name.split(' ')[1][0]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-600">{testimonials[activeTestimonial].title}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-500" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-purple-600 w-6' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-purple-100 text-purple-600 text-sm font-medium px-4 py-1.5 rounded-full">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Simple, <span className="text-purple-600">Transparent</span> Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Choose the plan that fits your assessment needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:shadow-xl ${
                  plan.highlighted ? 'border-2 border-purple-500 relative -translate-y-4' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-purple-600 text-white text-center py-2 font-bold text-sm">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 mt-12 shadow-md">
            <h3 className="text-xl font-bold mb-4 text-center">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2 flex items-center">
                  <ChevronRight className="mr-2 text-purple-600 w-5 h-5" />
                  Can I change plans anytime?
                </h4>
                <p className="text-gray-600 pl-7">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2 flex items-center">
                  <ChevronRight className="mr-2 text-purple-600 w-5 h-5" />
                  Is there a free trial?
                </h4>
                <p className="text-gray-600 pl-7">
                  We offer a 14-day free trial on all plans with no credit card required.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2 flex items-center">
                  <ChevronRight className="mr-2 text-purple-600 w-5 h-5" />
                  What kind of support is included?
                </h4>
                <p className="text-gray-600 pl-7">
                  All plans include email support. Higher-tier plans include priority and dedicated support options.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2 flex items-center">
                  <ChevronRight className="mr-2 text-purple-600 w-5 h-5" />
                  Is my data secure?
                </h4>
                <p className="text-gray-600 pl-7">
                  Yes, we use industry-standard encryption and comply with GDPR and FERPA regulations for educational data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your Assessment Process Today
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands of educators using AssessEngine to save time, improve accuracy, and provide better feedback.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/login">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Start Free Trial
                </button>
              </a>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-amber-100 text-amber-600 text-sm font-medium px-4 py-1.5 rounded-full">CONTACT US</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Get in <span className="text-purple-600">Touch</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Have questions? Our team is here to help you get started
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Mail className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <a href="mailto:info@assessengine.com" className="text-purple-600 hover:underline">
                      info@assessengine.com
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-purple-100 p-3 rounded-lg text-purple-600 hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a href="#" className="bg-purple-100 p-3 rounded-lg text-purple-600 hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#" className="bg-purple-100 p-3 rounded-lg text-purple-600 hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#" className="bg-purple-100 p-3 rounded-lg text-purple-600 hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-purple-700 transition-all duration-300 flex items-center"
                >
                  Send Message
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold mb-6">
                RNS <span className="text-amber-500">AssessEngine</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transforming educational assessment with AI-powered analysis of exam papers, handwriting, and personalized student feedback.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-500 text-sm text-center">
              © 2025 RNS AssessEngine. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
