import React, { useState } from 'react';
import NetflixHome from './components/NetflixHome';
import UserAccount from './components/UserAccount';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'account'>('home');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    plan: 'Premium',
    profiles: [
      { id: 1, name: 'John', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
      { id: 2, name: 'Sarah', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
      { id: 3, name: 'Kids', avatar: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
    ]
  });

  return (
    <div className="min-h-screen bg-black">
      {currentPage === 'home' ? (
        <NetflixHome 
          user={user} 
          onNavigateToAccount={() => setCurrentPage('account')} 
        />
      ) : (
        <UserAccount 
          user={user} 
          onUpdateUser={setUser}
          onNavigateToHome={() => setCurrentPage('home')} 
        />
      )}
    </div>
  );
}

export default App;