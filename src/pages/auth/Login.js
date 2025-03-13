import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Chuyển hướng người dùng đã đăng nhập
    useEffect(() => {
        if (isAuthenticated && !loading) {
            console.log('User already logged in, redirecting to dashboard');
            navigate('/dashboard');
        }
    }, [isAuthenticated, loading, navigate]);

    // Nếu đang kiểm tra xác thực, hiển thị loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Nếu đã xác thực, không hiển thị gì (sẽ chuyển hướng bởi useEffect)
    if (isAuthenticated) {
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        
        console.log('Submitting login form for:', formData.username);
        
        try {
            console.log('Attempting to login...');
            await login(formData.username, formData.password);
            console.log('Login successful, navigating to dashboard');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            
            // Display user-friendly error message
            if (error.response) {
                // Server responded with error
                const status = error.response.status;
                if (status === 401) {
                    setError('Sai tên đăng nhập hoặc mật khẩu');
                } else if (status === 403) {
                    setError('Tài khoản bị khóa hoặc chưa kích hoạt');
                } else if (status >= 500) {
                    setError('Lỗi máy chủ. Vui lòng thử lại sau.');
                } else {
                    setError(error.response.data?.message || 'Đăng nhập thất bại');
                }
            } else if (error.request) {
                // Request made but no response received
                setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.');
            } else {
                // Error during request setup
                setError('Đăng nhập thất bại: ' + (error.message || 'Lỗi không xác định'));
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng nhập vào tài khoản của bạn
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-500 text-center">{error}</div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Tên đăng nhập"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;