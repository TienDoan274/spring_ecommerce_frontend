// pages/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Mock data for demonstration
  const mockUsers = [
    { id: 1, username: 'admin', email: 'admin@example.com', roles: ['ADMIN'], status: 'active' },
    { id: 2, username: 'user1', email: 'user1@example.com', roles: ['USER'], status: 'active' },
    { id: 3, username: 'user2', email: 'user2@example.com', roles: ['USER'], status: 'inactive' },
    { id: 4, username: 'manager', email: 'manager@example.com', roles: ['MANAGER'], status: 'active' },
  ];

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call:
        // const response = await userService.getAllUsers();
        // setUsers(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Không thể tải danh sách người dùng');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [mockUsers]);

  const handleStatusChange = (userId, newStatus) => {
    // In a real app, this would call an API
    // For demo, we'll just update the local state
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleChange = (userId, role, isAdd) => {
    // In a real app, this would call an API
    // For demo, we'll just update the local state
    setUsers(users.map(user => {
      if (user.id === userId) {
        const updatedRoles = isAdd 
          ? [...user.roles, role]
          : user.roles.filter(r => r !== role);
        return { ...user, roles: updatedRoles };
      }
      return user;
    }));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditUserModal(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      // In a real app, this would call an API
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <Link
            to="/admin"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Quay lại Admin
          </Link>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Danh sách người dùng
                </h3>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Thêm người dùng
                  </button>
                </div>
              </div>
              <div className="bg-white overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên đăng nhập
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <span
                                key={role}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  role === 'ADMIN'
                                    ? 'bg-red-100 text-red-800'
                                    : role === 'MANAGER'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleStatusChange(
                                user.id, 
                                user.status === 'active' ? 'inactive' : 'active'
                              )}
                              className={`${
                                user.status === 'active'
                                  ? 'text-red-600 hover:text-red-900'
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Thêm người dùng mới
                    </h3>
                    <div className="mt-2">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Tên đăng nhập
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="user-role"
                                name="role"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label htmlFor="user-role" className="ml-2 block text-sm text-gray-900">
                                Người dùng
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="admin-role"
                                name="role"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="admin-role" className="ml-2 block text-sm text-gray-900">
                                Quản trị viên
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="manager-role"
                                name="role"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="manager-role" className="ml-2 block text-sm text-gray-900">
                                Quản lý
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Chỉnh sửa người dùng
                    </h3>
                    <div className="mt-2">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700">
                            Tên đăng nhập
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="edit-username"
                            defaultValue={editingUser.username}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="edit-email"
                            defaultValue={editingUser.email}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu mới (để trống nếu không thay đổi)
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="edit-password"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="edit-user-role"
                                name="role"
                                type="checkbox"
                                defaultChecked={editingUser.roles.includes('USER')}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="edit-user-role" className="ml-2 block text-sm text-gray-900">
                                Người dùng
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="edit-admin-role"
                                name="role"
                                type="checkbox"
                                defaultChecked={editingUser.roles.includes('ADMIN')}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="edit-admin-role" className="ml-2 block text-sm text-gray-900">
                                Quản trị viên
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="edit-manager-role"
                                name="role"
                                type="checkbox"
                                defaultChecked={editingUser.roles.includes('MANAGER')}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="edit-manager-role" className="ml-2 block text-sm text-gray-900">
                                Quản lý
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                          <div className="mt-2">
                            <select
                              id="user-status"
                              name="status"
                              defaultValue={editingUser.status}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option value="active">Hoạt động</option>
                              <option value="inactive">Vô hiệu</option>
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;