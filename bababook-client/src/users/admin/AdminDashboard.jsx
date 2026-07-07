import React from 'react';
import { Users, Library, BookOpen, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '5,234', icon: Users, change: '+15% this month' },
    { title: 'Active Libraries', value: '42', icon: Library, change: '+2 this month' },
    { title: 'Total Books', value: '125,845', icon: BookOpen, change: '+1,234 this month' },
    { title: 'Active Borrows', value: '1,856', icon: Activity, change: '+8% from last month' },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "New Library Registration",
      details: "Central City Library registered",
      timestamp: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      type: "User Report",
      details: "Multiple late returns reported",
      timestamp: "3 hours ago",
      status: "resolved"
    },
    {
      id: 3,
      type: "System Update",
      details: "Database optimization completed",
      timestamp: "5 hours ago",
      status: "completed"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "System Update",
      message: "New security patch available",
      severity: "high",
      timestamp: "1 hour ago"
    },
    {
      id: 2,
      type: "Performance Alert",
      message: "High server load detected",
      severity: "medium",
      timestamp: "30 minutes ago"
    },
    {
      id: 3,
      type: "Storage Alert",
      message: "Database storage at 85% capacity",
      severity: "low",
      timestamp: "45 minutes ago"
    }
  ];

  return (
    <div className="p-6 bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">System Administration</h1>
        <p className="text-gray-400 mt-2">Monitor and manage the entire library system</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-blue-400 text-sm">{stat.change}</span>
            </div>
            <h3 className="text-gray-400 text-sm">{stat.title}</h3>
            <p className="text-white text-2xl font-semibold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Activity Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
            <Link to="/admin/activity-log" className="text-blue-400 hover:text-blue-300 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium">{activity.type}</h3>
                    <p className="text-gray-400 text-sm">{activity.details}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    activity.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    activity.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <Activity className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-400 text-sm">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">System Alerts</h2>
            <Link to="/admin/alerts" className="text-blue-400 hover:text-blue-300 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium">{alert.type}</h3>
                    <p className="text-gray-400 text-sm">{alert.message}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-500/10 text-red-400' :
                    alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-400 text-sm">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 transition-colors duration-200">
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-4 transition-colors duration-200">
              <Library className="w-5 h-5" />
              <span>Add Library</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 transition-colors duration-200">
              <TrendingUp className="w-5 h-5" />
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;