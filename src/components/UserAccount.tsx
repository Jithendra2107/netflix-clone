import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Plus, Settings, CreditCard, Shield, Bell } from 'lucide-react';

interface User {
  name: string;
  email: string;
  profileImage: string;
  plan: string;
  profiles: Array<{ id: number; name: string; avatar: string; }>;
}

interface UserAccountProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigateToHome: () => void;
}

const UserAccount: React.FC<UserAccountProps> = ({ user, onUpdateUser, onNavigateToHome }) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'account' | 'billing' | 'security'>('profiles');
  const [editingProfile, setEditingProfile] = useState<number | null>(null);
  const [newProfileName, setNewProfileName] = useState('');

  const handleEditProfile = (profileId: number, newName: string) => {
    const updatedProfiles = user.profiles.map(profile =>
      profile.id === profileId ? { ...profile, name: newName } : profile
    );
    onUpdateUser({ ...user, profiles: updatedProfiles });
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId: number) => {
    const updatedProfiles = user.profiles.filter(profile => profile.id !== profileId);
    onUpdateUser({ ...user, profiles: updatedProfiles });
  };

  const handleAddProfile = () => {
    if (newProfileName.trim() && user.profiles.length < 5) {
      const newProfile = {
        id: Date.now(),
        name: newProfileName.trim(),
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
      };
      onUpdateUser({ ...user, profiles: [...user.profiles, newProfile] });
      setNewProfileName('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 md:px-12 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateToHome}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="text-red-600 text-2xl md:text-3xl font-bold">NETFLIX</div>
          </div>
          <div className="text-xl font-semibold">Account Settings</div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-800 px-4 md:px-12">
        <div className="flex space-x-8 overflow-x-auto">
          {[
            { key: 'profiles', label: 'Profiles & Parental Controls', icon: Settings },
            { key: 'account', label: 'Account Details', icon: Settings },
            { key: 'billing', label: 'Billing Details', icon: CreditCard },
            { key: 'security', label: 'Security & Privacy', icon: Shield }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === key
                  ? 'border-red-600 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="px-4 md:px-12 py-8">
        {activeTab === 'profiles' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Profiles & Parental Controls</h2>
            
            {/* Existing Profiles */}
            <div className="space-y-4 mb-8">
              {user.profiles.map((profile) => (
                <div key={profile.id} className="bg-gray-900 rounded-lg p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      {editingProfile === profile.id ? (
                        <input
                          type="text"
                          defaultValue={profile.name}
                          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-600"
                          onBlur={(e) => handleEditProfile(profile.id, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleEditProfile(profile.id, e.currentTarget.value);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-lg font-semibold">{profile.name}</h3>
                      )}
                      <p className="text-gray-400 text-sm">All Maturity Ratings</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProfile(profile.id)}
                      className="text-gray-400 hover:text-white transition-colors p-2"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Profile */}
            {user.profiles.length < 5 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Add Profile</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Plus size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter profile name"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <button
                    onClick={handleAddProfile}
                    disabled={!newProfileName.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-400 text-white px-6 py-2 rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'account' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Account Details</h2>
            <div className="bg-gray-900 rounded-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plan</label>
                <div className="text-white bg-gray-800 px-3 py-2 rounded border border-gray-600">
                  {user.plan} Plan
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Billing Details</h2>
            <div className="bg-gray-900 rounded-lg p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Netflix {user.plan}</h3>
                  <p className="text-gray-400">Ultra HD + HDR</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">$19.99/month</p>
                  <p className="text-gray-400 text-sm">Next billing: Jan 15, 2024</p>
                </div>
              </div>
              <hr className="border-gray-700" />
              <div>
                <h4 className="font-semibold mb-2">Payment Method</h4>
                <p className="text-gray-400">•••• •••• •••• 1234</p>
                <p className="text-gray-400 text-sm">Expires 12/2025</p>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors">
                Update Payment Method
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Security & Privacy</h2>
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Password & Security</h3>
                <div className="space-y-4">
                  <button className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                    Change Password
                  </button>
                  <button className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                    Two-Factor Authentication
                  </button>
                  <button className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                    Sign Out of All Devices
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Bell size={20} className="mr-2" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="form-checkbox text-red-600" />
                    <span>Email notifications about new releases</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="form-checkbox text-red-600" />
                    <span>SMS notifications for account activity</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="form-checkbox text-red-600" />
                    <span>Marketing communications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserAccount;