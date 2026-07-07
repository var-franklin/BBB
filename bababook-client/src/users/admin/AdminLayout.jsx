import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Settings, Shield, Users, LogOut, 
  Library, BarChart3, AlertTriangle,
  Database, Lock, Globe, UserPlus,
  CircleUser, UserCircle2, UserCircle, Crown
} from 'lucide-react';
import { AuthContext } from '../../utils/AuthProvider';
import { useLogout } from '../../utils/AuthUtils';
import LogoutSidebar from '../LogoutSidebar';

const AdminLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const handleLogout = useLogout(logOut);
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem('admin-avatar');
    return saved ? parseInt(saved) : 0;
  });

  const avatarOptions = [
    { icon: CircleUser, label: 'Default Admin' },
    { icon: UserCircle2, label: 'Circle 2' },
    { icon: UserCircle, label: 'Circle' },
    { icon: Crown, label: 'Admin' }
  ];

  const menuItems = [
    { icon: Shield, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/manage-users' },
    { icon: UserPlus, label: 'Librarian Applications', path: '/admin/librarian-applications' },
    { icon: Library, label: 'Libraries', path: '/admin/manage-libraries' },
    { icon: Database, label: 'System Settings', path: '/admin/system-settings' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: AlertTriangle, label: 'System Alerts', path: '/admin/alerts' },
    { icon: Lock, label: 'Security', path: '/admin/security' },
    { icon: Globe, label: 'API Access', path: '/admin/api-access' },
  ];

  const SelectedAvatarIcon = avatarOptions[selectedAvatar].icon;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        <div className="w-64 min-h-screen bg-gray-800 border-r border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <SelectedAvatarIcon className="w-12 h-12 text-blue-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-medium">{user?.firstName} {user?.lastName}</h3>
                <p className="text-sm text-gray-400">System Administrator</p>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
            <div className="space-y-4">
              <Link
                to="/admin/settings"
                className="flex items-center space-x-3 text-gray-300 hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Admin Settings</span>
              </Link>
              <LogoutSidebar/>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;