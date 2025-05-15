import React, { useState, useEffect } from 'react';
import Sidebar from '../components/nav';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = 'sanjay.n.ihub@snsgroups.com'; // Replace with actual user email or fetch from context/state
        const response = await fetch(`http://127.0.0.1:8000/api/get-profile?email=${userEmail}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    console.log('User logged out');
  };

  const handleChangePassword = () => {
    setIsChangingPassword(true);
  };

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    // Implement password change logic here
    console.log('Password change submitted:', passwordData);
    setIsChangingPassword(false);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex">
      <Sidebar activeTab="profile" />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-32"></div>
            <div className="relative">
              <div className="flex justify-center -mt-16">
                <div className="rounded-full border-4 border-white bg-gray-200 h-32 w-32 flex items-center justify-center text-gray-500 text-4xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="text-center mt-4">
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600">{user.occupation}</p>
                <p className="text-gray-500">{user.location}</p>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">About Me</h2>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600">{user.phone}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Social Links</h2>
                  <div className="flex space-x-4">
                    <a href={user.socialLinks.linkedin} className="text-blue-500 hover:text-blue-700">LinkedIn</a>
                    <a href={user.socialLinks.github} className="text-gray-800 hover:text-gray-600">GitHub</a>
                    <a href={user.socialLinks.twitter} className="text-blue-400 hover:text-blue-600">Twitter</a>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isChangingPassword && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChangeSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
