import React from 'react';
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const ClientFooter = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm text-gray-300 border-t border-gray-800/50 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 py-16">
          {/* Company Info Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl shadow-lg shadow-blue-500/20" />
              <span className="text-2xl font-bold text-white tracking-tight">BaBaBook</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Project for Software Engineering II
            </p>
            <div className="space-y-4 pt-2">
              <a href="https://g.co/kgs/dqNz1LC" target="blank" className="flex items-center space-x-3 group">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
                <span className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
                  Sapang 1, Ternate, Cavite, Philippines
                </span>
              </a>
              <a href="mailto:nc.franklingian.sarmiento@cvsu.edu.ph" className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
                <span className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
                  nc.franklingian.sarmiento@cvsu.edu.ph
                </span>
              </a>
              <a href="mailto:nc.jhonlorence.hilario@cvsu.edu.ph" className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
                <span className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
                  nc.jhonlorence.hilario@cvsu.edu.ph
                </span>
              </a>
              <a href="tel:+63948767623" className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
                <span className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
                  +63 948 376 7623
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-4">
              {["About Us", "Our Team", "Careers", "News & Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200">
                    <ExternalLink className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 transition-all duration-200" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-4">
              {["Documentation", "API Reference", "Developer Guide", "Tools & SDKs"].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200">
                    <ExternalLink className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 transition-all duration-200" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} BaBaBook. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;