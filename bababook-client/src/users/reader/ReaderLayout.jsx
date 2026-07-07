import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Book, 
  BookOpen, 
  Clock, 
  Heart, 
  Home, 
  Library, 
  LogOut, 
  User, 
  Search,
  CircleUser,
  UserCircle2,
  UserCircle,
  Ghost,
  Bot,
  Badge,
  Cat,
  Bird,
  Dog,
  Rabbit,
  ChevronRight
} from 'lucide-react';
import { AuthContext } from '../../utils/AuthProvider';
import { useLogout } from '../../utils/AuthUtils';

const StyleSheet = () => (
  <style>
    {`
      @keyframes fadeInLeft {
        0% { 
          opacity: 0;
          transform: translateX(-10px);
        }
        100% { 
          opacity: 1;
          transform: translateX(0);
        }
      }

      .menu-item {
        animation: fadeInLeft 0.3s ease-out forwards;
        opacity: 0;
      }

      .avatar-selection {
        animation: fadeInScale 0.2s ease-out forwards;
      }

      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .sidebar-scroll::-webkit-scrollbar {
        width: 5px;
      }

      .sidebar-scroll::-webkit-scrollbar-track {
        background: rgba(31, 41, 55, 0.5);
      }

      .sidebar-scroll::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.5);
        border-radius: 5px;
      }

      .sidebar-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.7);
      }

      .action-button-icon {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .action-button:hover .action-button-icon {
        transform: translateX(-2px);
      }

      .action-button:hover .chevron-icon {
        transform: translateX(2px);
      }

      .shimmer-effect {
        background-size: 200% 100%;
        animation: shimmer 2s linear infinite;
      }

      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}
  </style>
);

const ReaderLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/auth/logout');
  };
  const [isAvatarSelectOpen, setIsAvatarSelectOpen] = useState(false);

  const avatarOptions = [
    { icon: CircleUser, label: 'Default User' },
    { icon: UserCircle2, label: 'User Circle 2' },
    { icon: UserCircle, label: 'User Circle' },
    { icon: Ghost, label: 'Ghost' },
    { icon: Bot, label: 'Robot' },
    { icon: Badge, label: 'Badge' },
    { icon: Cat, label: 'Cat' },
    { icon: Bird, label: 'Bird' },
    { icon: Dog, label: 'Dog' },
    { icon: Rabbit, label: 'Rabbit' }
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem('user-avatar');
    return saved ? parseInt(saved) : 0;
  });

  const handleAvatarSelect = (index) => {
    setSelectedAvatar(index);
    localStorage.setItem('user-avatar', index.toString());
    setIsAvatarSelectOpen(false);
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/reader/dashboard' },
    { icon: Search, label: 'Browse Books', path: '/reader/browse' }, 
    { icon: Book, label: 'Borrowed Books', path: '/reader/borrowed-books' },
    { icon: Heart, label: 'Saved Books', path: '/reader/saved-books' },
    { icon: Library, label: 'Find Libraries', path: '/reader/find-libraries' },
  ];

  const SelectedAvatarIcon = avatarOptions[selectedAvatar].icon;

  return (
    <div className="min-h-screen bg-gray-900">
      <StyleSheet />
      <div className="flex h-screen overflow-hidden">
        {/* Enhanced Sidebar */}
        <div className="w-64 flex-shrink-0 fixed h-screen bg-gray-800/50 backdrop-blur-md border-r border-gray-700/50">
          <div className="h-full flex flex-col">
            {/* Profile Section */}
            <div className="p-6 border-b border-gray-700/50 bg-gradient-to-b from-blue-500/5 to-transparent">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <button 
                    onClick={() => setIsAvatarSelectOpen(!isAvatarSelectOpen)}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 
                    flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 border border-blue-500/20"
                  >
                    <SelectedAvatarIcon className="w-14 h-14 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  </button>
                  
                  {/* Avatar Selection Modal */}
                  {isAvatarSelectOpen && (
                    <div className="avatar-selection absolute top-full mt-4 left-1/2 transform -translate-x-1/2 w-56 
                    bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-xl border border-blue-500/20 p-3 z-50">
                      <div className="grid grid-cols-5 gap-2">
                        {avatarOptions.map((avatar, index) => (
                          <button
                            key={index}
                            onClick={() => handleAvatarSelect(index)}
                            className={`p-2 rounded-lg transition-all duration-200 hover:bg-blue-500/20 
                            ${selectedAvatar === index ? 'bg-blue-500/30 shadow-lg shadow-blue-500/10' : ''}`}
                            title={avatar.label}
                          >
                            <avatar.icon className="w-6 h-6 text-blue-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-white font-medium text-lg">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-blue-400/80">@{user?.username}</p>
                  <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Menus */}
            <nav className="flex-grow p-4 overflow-y-auto sidebar-scroll">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={index} className="menu-item" style={{ animationDelay: `${index * 100}ms` }}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group
                      hover:shadow-lg relative overflow-hidden
                      ${location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-transparent border border-transparent'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        animate-[shimmer_2s_infinite] pointer-events-none"
                        style={{
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s linear infinite',
                          '@keyframes shimmer': {
                            '0%': { backgroundPosition: '200% 0' },
                            '100%': { backgroundPosition: '-200% 0' }
                          }
                        }}
                      />
                      
                      <div className="flex items-center space-x-3 relative">
                        <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <item.icon className={`w-5 h-5 transition-colors duration-300 
                            ${location.pathname === item.path 
                              ? 'text-blue-400' 
                              : 'group-hover:text-blue-400'}`} 
                          />
                        </div>
                        <span className="transform transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                      </div>

                      <ChevronRight 
                        className={`w-4 h-4 transition-all duration-300 transform
                        ${location.pathname === item.path 
                          ? 'text-blue-400 opacity-100' 
                          : 'opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-blue-400'}`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-700/50 bg-gradient-to-t from-blue-500/5 to-transparent">
              <div className="space-y-3">
                {/* Profile Settings Button */}
                <Link
                  to="/reader/settings"
                  className="action-button w-full flex items-center justify-between px-4 py-3 text-gray-300 
                  rounded-lg transition-all duration-300 group border border-transparent
                  hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-500/5
                  hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 action-button-icon group-hover:text-blue-400 transition-colors duration-300" />
                    <span className="group-hover:text-blue-400 transition-colors duration-300">Profile Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 chevron-icon opacity-0 group-hover:opacity-100 text-blue-400 transition-all duration-300" />
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="action-button w-full flex items-center justify-between px-4 py-3 text-gray-300 
                  rounded-lg transition-all duration-300 group border border-transparent
                  hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-500/5
                  hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/10"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-5 h-5 action-button-icon group-hover:text-red-400 transition-colors duration-300" />
                    <span className="group-hover:text-red-400 transition-colors duration-300">Log Out</span>
                  </div>
                  <ChevronRight className="w-4 h-4 chevron-icon opacity-0 group-hover:opacity-100 text-red-400 transition-all duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto h-screen pl-64">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReaderLayout;