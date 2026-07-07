import React, { useState, useCallback, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowRight, ChevronLeft, Phone, MapPin } from 'lucide-react';
import { AuthContext } from '../utils/AuthProvider';
import MapModal from './MapModal';

const CustomInput = React.memo(({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      {...props}
      className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
    />
  </div>
));

CustomInput.displayName = 'CustomInput';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, createUser, loading: authLoading } = useContext(AuthContext);
  
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/auth/sign-up');
  const [userType, setUserType] = useState('reader');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    libraryName: '',
    libraryAddress: '',
    userType: 'reader'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (selectedAddress) => {
    setFormData(prev => ({
      ...prev,
      libraryAddress: selectedAddress
    }));
    setIsMapModalOpen(false);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }, []);

  const handleUserTypeChange = useCallback((type) => {
    setUserType(type);
    setFormData(prev => ({
      ...prev,
      userType: type,
      ...(type === 'reader' && {
        libraryName: '',
        libraryAddress: ''
      })
    }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (isSignUp) {
      if (!formData.firstName) errors.firstName = 'First name is required';
      if (!formData.lastName) errors.lastName = 'Last name is required';
      if (!formData.username) errors.username = 'Username is required';
      else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';
      
      if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
      else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (userType === 'librarian') {
        if (!formData.libraryName) errors.libraryName = 'Library name is required';
        if (!formData.libraryAddress) errors.libraryAddress = 'Library address is required';
      }
    }
    
    return errors;
  }, [formData, isSignUp, userType]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      let response;
      
      if (isSignUp) {
        response = await createUser(formData.email, formData.password, {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          username: formData.username,
          phoneNumber: formData.phoneNumber,
          userType: userType,
          ...(userType === 'librarian' && {
            libraryName: formData.libraryName,
            libraryAddress: formData.libraryAddress,
          }),
        });
      } else {
        response = await login(formData.email, formData.password);
      }
  
      if (response.user) {
        if (response.user.userType === 'librarian') {
          switch (response.user.status) {
            case 'pending':
              navigate('/auth/waiting', { state: { status: 'pending' } });
              return;
            case 'rejected':
              navigate('/auth/waiting', { state: { status: 'rejected' } });
              return;
            case 'approved':
              navigate('/librarian/dashboard');
              return;
          }
        }
        
        switch (response.user.userType) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'reader':
            navigate('/reader/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setFormErrors({
        submit: error.message || 'Authentication failed. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent">
        <div className="absolute inset-0 opacity-30 bg-[url('/grid.svg')]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700 p-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          
          {isSignUp && (
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleUserTypeChange('reader')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
                  userType === 'reader'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Reader
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('librarian')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
                  userType === 'librarian'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Librarian
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomInput
                      icon={User}
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <CustomInput
                      icon={User}
                      type="text"
                      name="middleName"
                      placeholder="Middle Name (Optional)"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <CustomInput
                      icon={User}
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <CustomInput
                      icon={User}
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    {formErrors.username && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.username}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <CustomInput
                      icon={Phone}
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </>
            )}
            
            <div>
              <CustomInput
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <CustomInput
                icon={Lock}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>
            
            {isSignUp && (
              <>
                <div>
                  <CustomInput
                    icon={Lock}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
                
                {userType === 'librarian' && (
                  <>
                    <div>
                      <CustomInput
                        icon={Building2}
                        type="text"
                        name="libraryName"
                        placeholder="Library Name"
                        value={formData.libraryName}
                        onChange={handleChange}
                      />
                      {formErrors.libraryName && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.libraryName}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="libraryAddress"
                          placeholder="Library Address"
                          value={formData.libraryAddress}
                          onChange={handleChange}
                          className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-20 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => setIsMapModalOpen(true)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded-md text-sm transition-colors flex items-center gap-1"
                        >
                          <MapPin className="w-4 h-4" />
                          Select
                        </button>
                      </div>
                      {formErrors.libraryAddress && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.libraryAddress}</p>
                      )}
                    </div>

                    <MapModal
                      isOpen={isMapModalOpen}
                      onClose={() => setIsMapModalOpen(false)}
                      onSelectLocation={handleLocationSelect}
                    />
                  </>
                )}
              </>
            )}
            
            <button
              type="submit"
              disabled={authLoading}
              className="w-full group bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white rounded-lg py-3 px-4 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  middleName: '',
                  lastName: '',
                  username: '',
                  phoneNumber: '',
                  libraryName: '',
                  libraryAddress: '',
                  userType: 'reader'
                });
                setFormErrors({});
                navigate(isSignUp ? '/auth/sign-in' : '/auth/sign-up');
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {formErrors.submit && (
            <p className="text-red-400 text-sm text-center mt-4">{formErrors.submit}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;