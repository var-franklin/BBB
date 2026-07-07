import React, { useState, useEffect, useContext } from 'react';
import { Search, BookOpen, Library, Settings, ArrowRight, Bookmark, Cloud, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../utils/AuthProvider';

const StyleSheet = () => (
  <style>
    {`
      @keyframes fadeInScale {
        0% { 
          opacity: 0; 
          transform: scale(0.8);
        }
        100% { 
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes slideInFromBottom {
        0% { 
          opacity: 0;
          transform: translateY(40px);
        }
        100% { 
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes gradientFlow {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      .hero-title {
        animation: fadeInScale 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        background: linear-gradient(90deg, #60A5FA, #3B82F6, #2563EB);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: fadeInScale 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                   gradientFlow 8s linear infinite;
      }

      .hero-subtitle {
        opacity: 0;
        animation: slideInFromBottom 1s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
        animation-delay: 0.5s;
      }

      .hero-description {
        opacity: 0;
        animation: slideInFromBottom 1s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
        animation-delay: 0.8s;
      }

      .hero-button {
        opacity: 0;
        animation: slideInFromBottom 1s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
        animation-delay: 1.1s;
      }

      .scroll-indicator {
        opacity: 0;
        animation: fadeIn 0.8s ease-out forwards,
                   bounce 2s infinite;
        animation-delay: 1.4s;
      }

      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      @keyframes slideUp {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }

      .section-animate {
        opacity: 0;
        transform: translateY(60px);
        transition: all 0.8s ease-out;
      }

      .section-animate.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .card-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
      }

      .card-animate.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `}
  </style>
);

const StepCard = ({ number, title, description, icon: Icon, delay }) => (
  <div 
    className="relative flex flex-col items-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 
    hover:border-blue-500 hover:transform hover:scale-105 transition-all duration-300 h-full group
    hover:shadow-lg hover:shadow-blue-500/10"
    style={{ 
      animationDelay: `${delay}ms`,
      transitionDelay: `${delay}ms` 
    }}
  >
    <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold
      group-hover:bg-blue-400 transition-colors duration-300">
      {number}
    </div>
    <div className="p-3 bg-blue-500/10 rounded-full mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500/20">
      <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">{title}</h3>
    <p className="text-gray-400 text-center group-hover:text-gray-300 transition-colors duration-300">{description}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div 
    className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 
    hover:border-blue-500 hover:transform hover:scale-105 transition-all duration-300 h-full flex flex-col items-center group
    hover:shadow-lg hover:shadow-blue-500/10"
    style={{ 
      animationDelay: `${delay}ms`,
      transitionDelay: `${delay}ms` 
    }}
  >
    <div className="p-3 bg-blue-500/10 rounded-full w-fit mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500/20">
      <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2 text-center group-hover:text-blue-300 transition-colors duration-300">{title}</h3>
    <p className="text-gray-400 flex-grow text-center group-hover:text-gray-300 transition-colors duration-300">{description}</p>
  </div>
);

const ScrollIndicator = () => (
  <div className="scroll-indicator absolute bottom-24 left-0 right-0 mx-auto w-fit text-white flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
       onClick={() => document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' })}>
    <p className="text-sm mb-2 whitespace-nowrap">Scroll down to explore</p>
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
);

const Home = () => {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState({
    hero: true,
    benefits: false,
    howItWorks: false,
    features: false,
    cta: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['benefits', 'howItWorks', 'features', 'cta'];
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight * 0.85;
          setIsVisible(prev => ({ ...prev, [section]: isVisible }));
        }
      });
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <StyleSheet />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent">
          <div className="absolute inset-0 opacity-30 bg-[url('/grid.svg')]"></div>
        </div>
        <div className="relative px-4 lg:px-24 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8">
            <span className="hero-title block">Welcome to BaBaBook</span>
            <span className="hero-subtitle block text-blue-400 mt-4">Your Digital Library Companion</span>
          </h1>
          <p className="hero-description text-gray-300 text-xl max-w-2xl mx-auto mb-12">
            Bridging the gap between readers and libraries in the digital age. 
            Experience the future of reading and library management with BaBaBook.
          </p>
        </div>
        <ScrollIndicator />
      </section>

      {/* Key Benefits Section */}
      <section 
        id="benefits"
        className={`section-animate px-4 lg:px-24 py-24 bg-gray-900/50 ${isVisible.benefits ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Choose BaBaBook?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cloud, title: "24/7 Accessibility", description: "Access your digital library anytime, anywhere. Read on any device with our cloud-based platform." },
              { icon: Library, title: "Sustainable Reading", description: "Go green with digital books. Reduce paper waste while enjoying unlimited access to knowledge." },
              { icon: Settings, title: "Personalized Experience", description: "Track your progress, create custom collections." }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`card-animate ${isVisible.benefits ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="howItWorks"
        className={`section-animate px-4 lg:px-24 py-24 bg-gray-900 ${isVisible.howItWorks ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "1", icon: BookOpen, title: "Create Account", description: "Sign up in seconds and get instant access to our vast collection of digital books." },
              { number: "2", icon: Search, title: "Find Books", description: "Search, filter, and discover books that match your interests and preferences." },
              { number: "3", icon: Bookmark, title: "Start Reading", description: "Borrow books instantly and start reading on any device, online or offline." }
            ].map((step, index) => (
              <div 
                key={index} 
                className={`card-animate ${isVisible.howItWorks ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <StepCard {...step} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        className={`section-animate px-4 lg:px-24 py-24 bg-gray-900/50 ${isVisible.features ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Filter, title: "Smart Search", description: "Find books quickly with advanced filters and categories." },
              { icon: Bookmark, title: "Reading Lists", description: "Create and organize personal book collections." },
              { icon: Library, title: "Library Integration", description: "Connect with your local library's digital collection." }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`card-animate ${isVisible.features ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta"
        className={`section-animate px-4 lg:px-24 py-24 bg-gray-900 ${isVisible.cta ? 'visible' : ''}`}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            {user ? 'Continue Your Literary Journey' : 'Begin Your Literary Journey Today'}
          </h2>
          <p className="text-gray-300 text-lg mb-12">
            {user 
              ? "Ready to explore more? Your next great reading adventure awaits. Access your personalized dashboard to discover new books, manage your collections, and continue your reading journey."
              : "Whether you're a passionate reader looking to explore new worlds through books, or a librarian ready to digitize your collection and reach more readers, BaBaBook is your gateway to the future of reading. Join our community and be part of the digital reading revolution."
            }
          </p>
          <Link 
            to={user ? `/${user.userType}/dashboard` : "/auth/sign-up"}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 inline-flex items-center"
          >
            {user ? 'Go to Dashboard' : 'Create Your Account'}
            <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;