// utils/loginDebugger.js

// Hàm này giúp kiểm tra cấu trúc của token 
export const debugLoginResponse = (loginResponse) => {
  if (!loginResponse) {
    console.warn('Login response is undefined or null');
    return;
  }

  console.group('DEBUG LOGIN RESPONSE');
  console.log('Full response:', loginResponse);
  
  // Kiểm tra accessToken hoặc token
  const accessToken = loginResponse.accessToken || loginResponse.token;
  
  if (accessToken) {
    console.log('Access token exists:', accessToken);
    
    // Kiểm tra định dạng JWT
    if (typeof accessToken === 'string') {
      const parts = accessToken.split('.');
      console.log('Token parts count:', parts.length);
      
      if (parts.length === 3) {
        try {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          
          console.log('Token header:', header);
          console.log('Token payload:', payload);
        } catch (e) {
          console.error('Could not decode token parts:', e);
        }
      } else {
        console.error('Not a valid JWT format! Expected 3 parts, got:', parts.length);
      }
    } else {
      console.error('Token is not a string:', typeof accessToken);
    }
  } else {
    console.warn('Access token missing in response!');
  }
  
  // Kiểm tra refreshToken
  if (loginResponse.refreshToken) {
    console.log('Refresh token exists:', loginResponse.refreshToken);
  } else {
    console.warn('Refresh token missing in response!');
  }
  
  console.groupEnd();
};

// Trích xuất lỗi thực sự từ Axios error
export const extractErrorDetails = (error) => {
  if (error.response) {
    // Server trả về response với status code nằm ngoài phạm vi 2xx
    return {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    };
  } else if (error.request) {
    // Request đã được gửi nhưng không nhận được response
    return {
      request: 'Request sent but no response received',
      error: error.message
    };
  } else {
    // Có lỗi khi thiết lập request
    return {
      message: error.message,
      error: error
    };
  }
};