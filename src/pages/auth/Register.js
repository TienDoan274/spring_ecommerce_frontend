// pages/auth/Register.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const { register, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect logged in users
    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, loading, navigate]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // If already authenticated, don't render (will redirect via useEffect)
    if (isAuthenticated) {
        return null;
    }

    const validateForm = () => {
        const newErrors = {};
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Tên đăng nhập không được để trống';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        }
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        
        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear specific field error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        
        // Validate the form
        if (!validateForm()) {
            return;
        }
        
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...userData } = formData;
            
            await register(userData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            
            // Handle server error messages
            if (error.response) {
                // Server responded with error
                const status = error.response.status;
                if (status === 400) {
                    // Bad request - handle validation errors from server
                    if (error.response.data?.errors) {
                        setErrors(error.response.data.errors);
                    } else {
                        setSubmitError(error.response.data?.message || 'Đăng ký thất bại do dữ liệu không hợp lệ');
                    }
                } else if (status === 409) {
                    // Conflict - username or email already exists
                    setSubmitError('Tên đăng nhập hoặc email đã tồn tại');
                } else if (status >= 500) {
                    setSubmitError('Lỗi máy chủ. Vui lòng thử lại sau.');
                } else {
                    setSubmitError(error.response.data?.message || 'Đăng ký thất bại');
                }
            } else if (error.request) {
                // Request made but no response received
                setSubmitError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.');
            } else {
                // Error during request setup
                setSubmitError('Đăng ký thất bại: ' + (error.message || 'Lỗi không xác định'));
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng ký tài khoản mới
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Hoặc{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            đăng nhập vào tài khoản hiện có
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {submitError && (
                        <div className="text-red-500 text-center bg-red-50 p-3 rounded-md">
                            {submitError}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errors.username ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Tên đăng nhập"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errors.password ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Mật khẩu"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Xác nhận mật khẩu"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Đăng ký
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;