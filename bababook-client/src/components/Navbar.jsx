import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Book, User, Library, Home, LogIn } from 'lucide-react';
import { AuthContext } from "../utils/AuthProvider";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user } = useContext(AuthContext);
    const location = useLocation();
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const getAuthNavItems = () => {
        if (user) {
            // Logged in user navigation items
            const dashboardPath = user.userType === 'librarian' ? '/librarian/dashboard' : '/reader/dashboard';
            return [
                { link: "Dashboard", path: dashboardPath, icon: User },
                { link: "Logout", path: "/auth/logout", icon: LogIn }
            ];
        } else {
            // Guest navigation items
            return [
                { link: "Sign In", path: "/auth/sign-in", icon: LogIn }
            ];
        }
    };

    const navItems = [
        { link: "Home", path: "/", icon: Home },
        { link: "Libraries", path: "/libraries", icon: Library },
        ...getAuthNavItems()
    ];

    return (
        <header className="fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300">
            <nav className={`transition-all duration-300 ${
                isScrolled 
                    ? 'bg-gray-900/80 backdrop-blur-md shadow-xl'
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="flex items-center space-x-2 text-gray-100 hover:text-blue-400 transition-all duration-300"
                        >
                            <Book className="w-8 h-8" />
                            <span className="text-xl font-bold tracking-wide">BabaBook</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navItems.map(({ link, path, icon: Icon }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300 group ${
                                        location.pathname === path
                                            ? 'text-blue-400'
                                            : 'text-gray-300 hover:text-blue-400'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                                        location.pathname === path
                                            ? 'text-blue-400'
                                            : 'text-gray-400 group-hover:text-blue-400'
                                    }`} />
                                    <span className="relative">
                                        {link}
                                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                                            location.pathname === path
                                                ? 'w-full'
                                                : 'group-hover:w-full'
                                        }`}>
                                        </span>
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-blue-400 transition-all duration-300"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden transition-all duration-300 ${
                    isMenuOpen 
                        ? 'max-h-screen opacity-100'
                        : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                    <div className="px-4 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md">
                        {navItems.map(({ link, path, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center space-x-3 py-3 transition-all duration-300 ${
                                    location.pathname === path
                                        ? 'text-blue-400'
                                        : 'text-gray-300 hover:text-blue-400'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${
                                    location.pathname === path
                                        ? 'text-blue-400'
                                        : 'text-gray-400'
                                }`} />
                                <span>{link}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;