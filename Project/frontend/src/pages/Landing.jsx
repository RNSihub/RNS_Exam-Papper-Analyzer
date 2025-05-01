import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle, BookOpen, Brain, PenTool, BarChart4, Award, Mail } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef(null);
  
  const videoUrl = "https://www.youtube.com/embed/CEhVifRTPr0?autoplay=1";
  const thumbnailUrl = "https://st.adda247.com/https://www.adda247.com/jobs/wp-content/uploads/sites/2/2022/08/05203544/How-To-Excel-In-An-Interview-1.png";

  const handleWatchDemo = () => {
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
    }
  };
  const handlePlayVideo = () => {
    setIsPlaying(true);
    setShowPlayButton(false);
    if (videoRef.current) {
      videoRef.current.src = "https://www.youtube.com/embed/CEhVifRTPr0?autoplay=1";
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

  // Demo assessment images
  const demoImages = [
    { title: "Paper Analysis", description: "AI-powered assessment of exam papers" },
    { title: "Handwriting Analysis", description: "Precise evaluation of student handwriting" },
    { title: "Performance Reports", description: "Comprehensive student evaluation reports" },
    { title: "Improvement Tracking", description: "Track growth over multiple assessments" }
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
    <div className="font-sans bg-[#FAFAFB] text-gray-800">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm animate__animated animate__fadeInDown">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#5D3FD3]">
              RNS <span className="text-[#FFAC3E]">AssessEngine</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-[#5D3FD3] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#5D3FD3] transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-[#5D3FD3] transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-[#5D3FD3] transition-colors">Contact</a>
            <button className="bg-[#5D3FD3] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
              Sign In
            </button>
            <button className="bg-[#FFAC3E] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
              Get Started
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="md:hidden bg-white border-t border-gray-200 animate__animated animate__fadeIn">
            <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
              <a href="#features" className="py-2 hover:text-[#5D3FD3]">Features</a>
              <a href="#how-it-works" className="py-2 hover:text-[#5D3FD3]">How It Works</a>
              <a href="#pricing" className="py-2 hover:text-[#5D3FD3]">Pricing</a>
              <a href="#contact" className="py-2 hover:text-[#5D3FD3]">Contact</a>
              <div className="flex space-x-4 pt-2">
                <button className="bg-[#5D3FD3] text-white px-4 py-2 rounded-lg flex-1">
                  Sign In
                </button>
                <button className="bg-[#FFAC3E] text-white px-4 py-2 rounded-lg flex-1">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F0EBF8] to-[#FAFAFB] py-16 md:py-20 animate__animated animate__fadeIn">
        <div className="container mx-auto px-2">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="text-[#5D3FD3]">Transform</span> Paper Assessment With <span className="text-[#FFAC3E]">AI-Powered</span> Analysis
              </h1>
              <p className="text-lg mb-6 text-gray-600">
                Analyze exam papers, evaluate handwriting, and generate comprehensive reports to enhance student performance through precise feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#5D3FD3] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center">
                  Get Started Free
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                <button
            onClick={handleWatchDemo}
            className="inline-block border-2 border-[#5D3FD3] text-[#5D3FD3] px-6 py-3 rounded-lg hover:bg-[#F0EBF8] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#5D3FD3] focus:ring-offset-2"
          >
            Watch Demo
          </button>

              </div>

              <div className="mt-8 flex items-center text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-[#28C76F] mr-2" />
                <span>No credit card required</span>
                <span className="mx-3">•</span>
                <CheckCircle className="w-5 h-5 text-[#28C76F] mr-2" />
                <span>14-day free trial</span>
              </div>
            </div>

            <div className="md:w-1/2 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate__animated animate__zoomIn">
        <div className="p-4 bg-[#5D3FD3] text-white">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#E63946] mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFAC3E] mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C76F]"></div>
            <div className="ml-4 text-sm">AssessEngine Analysis</div>
          </div>
        </div>
        <div className="p-6">
          <iframe
            ref={videoRef}
            width="400"
            height="100"
            src=""
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className=" ml-4 w-135 h-100 md:h-80 rounded-[12px]"
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-[#F0EBF8] p-3 rounded-lg animate__animated animate__fadeInUp">
              <div className="font-medium">Handwriting Accuracy</div>
              <div className="text-[#5D3FD3] text-lg font-bold">96%</div>
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div className="h-2 bg-[#5D3FD3] rounded" style={{ width: '96%' }}></div>
              </div>
            </div>

            <div className="bg-[#F0EBF8] p-3 rounded-lg animate__animated animate__fadeInUp">
              <div className="font-medium">Content Analysis</div>
              <div className="text-[#5D3FD3] text-lg font-bold">89%</div>
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div className="h-2 bg-[#5D3FD3] rounded" style={{ width: '89%' }}></div>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 bg-[#FFAC3E] text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3 animate__animated animate__bounceIn">
        Fast & Accurate!
      </div>
    </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white animate__animated animate__fadeIn">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">Trusted by educators and institutions worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {/* Replace with actual logos */}
            <div className="text-gray-400 font-bold text-xl animate__animated animate__zoomIn">OXFORD</div>
            <div className="text-gray-400 font-bold text-xl animate__animated animate__zoomIn">CAMBRIDGE</div>
            <div className="text-gray-400 font-bold text-xl animate__animated animate__zoomIn">HARVARD</div>
            <div className="text-gray-400 font-bold text-xl animate__animated animate__zoomIn">STANFORD</div>
            <div className="text-gray-400 font-bold text-xl animate__animated animate__zoomIn">MIT</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-[#FAFAFB] animate__animated animate__fadeIn">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Powerful <span className="text-[#5D3FD3]">Assessment</span> Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered engine transforms how educators evaluate exams, provide feedback, and track student progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate__animated animate__fadeInUp">
              <div className="bg-[#F0EBF8] p-3 inline-block rounded-lg mb-4">
                <BookOpen className="text-[#5D3FD3] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Paper Analysis</h3>
              <p className="text-gray-600">
                Advanced AI algorithms analyze exam content, structure, and responses for comprehensive evaluation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate__animated animate__fadeInUp">
              <div className="bg-[#F0EBF8] p-3 inline-block rounded-lg mb-4">
                <PenTool className="text-[#5D3FD3] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Handwriting Analysis</h3>
              <p className="text-gray-600">
                State-of-the-art recognition technology accurately evaluates student handwriting with precision.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate__animated animate__fadeInUp">
              <div className="bg-[#F0EBF8] p-3 inline-block rounded-lg mb-4">
                <BarChart4 className="text-[#5D3FD3] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Reports</h3>
              <p className="text-gray-600">
                Generate comprehensive performance reports with actionable insights for improvement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate__animated animate__fadeInUp">
              <div className="bg-[#F0EBF8] p-3 inline-block rounded-lg mb-4">
                <Brain className="text-[#5D3FD3] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Feedback</h3>
              <p className="text-gray-600">
                AI-generated personalized feedback helps students understand areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white animate__animated animate__fadeIn">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              How <span className="text-purple-600">AssessEngine</span> Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes assessment efficient and insightful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center transform transition duration-300 hover:scale-105 animate__animated animate__fadeInUp">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload</h3>
              <p className="text-gray-600">
                Simply scan and upload exam papers through our intuitive interface
              </p>
            </div>

            <div className="text-center transform transition duration-300 hover:scale-105 animate__animated animate__fadeInUp">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze</h3>
              <p className="text-gray-600">
                Our AI engine analyzes content, handwriting, and patterns
              </p>
            </div>

            <div className="text-center transform transition duration-300 hover:scale-105 animate__animated animate__fadeInUp">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Report</h3>
              <p className="text-gray-600">
                Receive detailed reports with actionable insights and recommendations
              </p>
            </div>
          </div>

          <div className="mt-16">
            <div className="bg-purple-100 rounded-xl p-6 md:p-8 shadow-lg animate__animated animate__fadeInUp">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-2xl font-bold mb-4 text-purple-600">
                    See AssessEngine in Action
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Watch how our platform transforms assessment workflows, saves time, and provides valuable insights.
                  </p>
                  <button
                    onClick={handlePlayVideo}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium inline-flex items-center transform hover:scale-105 hover:shadow-lg"
                  >
                    Watch Demo
                    <svg className="ml-2 w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </button>
                </div>

                <div className="md:w-1/2">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden relative transition-all duration-500 transform hover:shadow-xl">
                    {!isPlaying ? (
                      <>
                        <img
                          src={thumbnailUrl}
                          alt="AssessEngine Demo"
                          className="max-w-500 max-h-100 object-cover"
                          // style={{ width: 'auto', height: 'auto' }}
                        />

                        {showPlayButton && (
                          <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={handlePlayVideo}
                          >
                            <div className="bg-purple-600 bg-opacity-80 rounded-full w-16 h-16 flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:bg-opacity-90">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <iframe
                        ref={videoRef}
                        width="500"
                        height="100"
                        src=""
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-100 md:h-100"
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
      <section className="py-16 bg-[#FAFAFB] animate__animated animate__fadeIn">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Experience the <span className="text-[#5D3FD3]">AssessEngine</span> Difference
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools for modern assessment needs
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden animate__animated animate__fadeInLeft">
                <img
                  src="/api/placeholder/600/400"
                  alt={demoImages[activeFeature].title}
                  className="w-full h-auto"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#5D3FD3]">{demoImages[activeFeature].title}</h3>
                  <p className="text-gray-600 mt-2">{demoImages[activeFeature].description}</p>
                </div>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {demoImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${index === activeFeature ? 'bg-[#5D3FD3]' : 'bg-gray-300'}`}
                    onClick={() => setActiveFeature(index)}
                    aria-label={`View feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate__animated animate__fadeInRight">
                  <div className="flex items-start">
                    <div className="bg-[#F0EBF8] p-3 rounded-lg mr-4">
                      <Award className="text-[#5D3FD3] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">99% Accuracy Rate</h3>
                      <p className="text-gray-600">
                        Our advanced algorithms ensure nearly perfect recognition of handwriting and assessment scoring.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate__animated animate__fadeInRight">
                  <div className="flex items-start">
                    <div className="bg-[#F0EBF8] p-3 rounded-lg mr-4">
                      <CheckCircle className="text-[#5D3FD3] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Time-Saving Automation</h3>
                      <p className="text-gray-600">
                        Reduce assessment time by up to 75% while improving quality and consistency of feedback.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate__animated animate__fadeInRight">
                  <div className="flex items-start">
                    <div className="bg-[#F0EBF8] p-3 rounded-lg mr-4">
                      <Brain className="text-[#5D3FD3] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Personalized Learning Insights</h3>
                      <p className="text-gray-600">
                        Tailored recommendations help students focus on areas that need improvement.
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
      <section className="py-16 bg-white animate__animated animate__fadeIn">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              What <span className="text-[#5D3FD3]">Educators</span> Are Saying
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from professionals who have transformed their assessment process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F0EBF8] p-6 rounded-xl animate__animated animate__fadeInUp">
              <div className="text-[#5D3FD3] mb-4">
                ★★★★★
              </div>
              <p className="italic mb-6">
                "AssessEngine has revolutionized how I evaluate student work. The handwriting analysis is incredibly accurate, and the automated reports save me hours each week."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 w-10 h-10 rounded-full mr-3"></div>
                <div>
                  <div className="font-bold">Dr. Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Mathematics Professor, Oxford</div>
                </div>
              </div>
            </div>

            <div className="bg-[#F0EBF8] p-6 rounded-xl animate__animated animate__fadeInUp">
              <div className="text-[#5D3FD3] mb-4">
                ★★★★★
              </div>
              <p className="italic mb-6">
                "The detailed analytics provide insights I never had before. My students are receiving more targeted feedback, and I'm seeing improved results."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 w-10 h-10 rounded-full mr-3"></div>
                <div>
                  <div className="font-bold">Prof. Michael Chen</div>
                  <div className="text-sm text-gray-600">Science Department, Cambridge</div>
                </div>
              </div>
            </div>

            <div className="bg-[#F0EBF8] p-6 rounded-xl animate__animated animate__fadeInUp">
              <div className="text-[#5D3FD3] mb-4">
                ★★★★★
              </div>
              <p className="italic mb-6">
                "As a school administrator, implementing AssessEngine across our institution has standardized our assessment process while giving teachers more time to focus on teaching."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 w-10 h-10 rounded-full mr-3"></div>
                <div>
                  <div className="font-bold">Lisa Thompson</div>
                  <div className="text-sm text-gray-600">Principal, Westfield Academy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-[#FAFAFB] animate__animated animate__fadeIn">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Simple, <span className="text-[#5D3FD3]">Transparent</span> Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your assessment needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden ${
                  plan.highlighted
                    ? 'border-2 border-[#5D3FD3] shadow-lg transform md:-translate-y-4 animate__animated animate__pulse'
                    : 'border border-gray-200 shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-[#5D3FD3] text-white text-center py-2 font-medium">
                    Most Popular
                  </div>
                )}
                <div className="bg-white p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>

                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <CheckCircle className="text-[#28C76F] w-5 h-5 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      plan.highlighted
                        ? 'bg-[#5D3FD3] text-white hover:bg-opacity-90'
                        : 'border-2 border-[#5D3FD3] text-[#5D3FD3] hover:bg-[#F0EBF8]'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Need a custom solution for your organization?
            </p>
            <button className="bg-white border-2 border-[#5D3FD3] text-[#5D3FD3] px-6 py-3 rounded-lg hover:bg-[#F0EBF8] transition-colors font-medium">
              Contact Our Sales Team
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white animate__animated animate__fadeIn">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Frequently Asked <span className="text-[#5D3FD3]">Questions</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about RNS AssessEngine
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="bg-[#F0EBF8] rounded-lg p-6 animate__animated animate__fadeInUp">
                <h3 className="text-xl font-bold mb-2">How accurate is the handwriting recognition?</h3>
                <p className="text-gray-700">
                  Our AI-powered handwriting recognition achieves 99% accuracy for most standard handwriting styles. The system continuously learns and improves with each assessment processed.
                </p>
              </div>

              <div className="bg-[#F0EBF8] rounded-lg p-6 animate__animated animate__fadeInUp">
                <h3 className="text-xl font-bold mb-2">Can I customize the assessment criteria?</h3>
                <p className="text-gray-700">
                  Yes! RNS AssessEngine allows full customization of assessment criteria, scoring rubrics, and report templates to match your institution's specific requirements.
                </p>
              </div>

              <div className="bg-[#F0EBF8] rounded-lg p-6 animate__animated animate__fadeInUp">
                <h3 className="text-xl font-bold mb-2">Is my data secure?</h3>
                <p className="text-gray-700">
                  Absolutely. We implement bank-level encryption, secure data storage, and strict access controls. We're fully GDPR and FERPA compliant to protect all student information.
                </p>
              </div>

              <div className="bg-[#F0EBF8] rounded-lg p-6 animate__animated animate__fadeInUp">
                <h3 className="text-xl font-bold mb-2">How long does it take to process assessments?</h3>
                <p className="text-gray-700">
                  Most standard assessments are processed within minutes. Processing time depends on the complexity and length of the assessment, but our system is optimized for speed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-[#F0EBF8] animate__animated animate__fadeIn">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Ready to <span className="text-[#5D3FD3]">Transform</span> Your Assessment Process?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get in touch with our team to learn more or start your free trial today
            </p>
          </div>

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-sm animate__animated animate__fadeInLeft">
              <h3 className="text-2xl font-bold mb-4 text-[#5D3FD3]">Contact Us</h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D3FD3] h-32"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button className="bg-[#5D3FD3] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium w-full">
                  Send Message
                </button>
              </form>
            </div>

            <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-sm animate__animated animate__fadeInRight">
              <h3 className="text-2xl font-bold mb-4 text-[#5D3FD3]">Get in Touch</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#F0EBF8] p-3 rounded-lg mr-4">
                    <Mail className="text-[#5D3FD3] w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Us</h4>
                    <p className="text-gray-600">info@rnsassessengine.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#F0EBF8] p-3 rounded-lg mr-4">
                    <svg className="text-[#5D3FD3] w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Call Us</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-[#F0EBF8] p-3 rounded-lg text-[#5D3FD3] hover:bg-[#5D3FD3] hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-[#F0EBF8] p-3 rounded-lg text-[#5D3FD3] hover:bg-[#5D3FD3] hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-[#F0EBF8] p-3 rounded-lg text-[#5D3FD3] hover:bg-[#5D3FD3] hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-[#F0EBF8] p-3 rounded-lg text-[#5D3FD3] hover:bg-[#5D3FD3] hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#F0EBF8] rounded-lg">
                <h4 className="font-bold mb-2">Schedule a Demo</h4>
                <p className="text-gray-600 mb-4">
                  See how RNS AssessEngine can work for your institution with a personalized demo.
                </p>
                <button className="bg-[#5D3FD3] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium w-full">
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#5D3FD3] to-[#7E6CF3] text-white animate__animated animate__fadeIn">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Assessment Process?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of educators who are saving time and improving student outcomes with RNS AssessEngine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#5D3FD3] px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium">
              Start Your Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2356] text-white py-12 animate__animated animate__fadeInUp">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                RNS <span className="text-[#FFAC3E]">AssessEngine</span>
              </div>
              <p className="text-gray-300 mb-4">
                Transforming assessment with AI-powered analysis for better educational outcomes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Solutions</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Integrations</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} RNS AssessEngine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
