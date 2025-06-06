import React, { useState, useRef } from 'react';
import { Search, Bell, ChevronDown, Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  name: string;
  email: string;
  profileImage: string;
  plan: string;
  profiles: Array<{ id: number; name: string; avatar: string; }>;
}

interface NetflixHomeProps {
  user: User;
  onNavigateToAccount: () => void;
}

interface Movie {
  id: number;
  title: string;
  image: string;
  rating: string;
  year: string;
  description: string;
}

const movieData = {
  trending: [
    { id: 1, title: "Stranger Things", image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-14", year: "2023", description: "A group of kids uncover supernatural mysteries in their small town." },
    { id: 2, title: "The Crown", image: "https://images.pexels.com/photos/8111357/pexels-photo-8111357.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2023", description: "The reign of Queen Elizabeth II in post-war Britain." },
    { id: 3, title: "Ozark", image: "https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2022", description: "A financial advisor launders money for a Mexican cartel." },
    { id: 4, title: "Bridgerton", image: "https://images.pexels.com/photos/8111358/pexels-photo-8111358.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2023", description: "Romance and scandal in Regency-era England." },
    { id: 5, title: "The Witcher", image: "https://images.pexels.com/photos/7991581/pexels-photo-7991581.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2023", description: "A monster hunter struggles to find his place in a world." },
    { id: 6, title: "Money Heist", image: "https://images.pexels.com/photos/8111359/pexels-photo-8111359.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2021", description: "A criminal mastermind plans the perfect heist." }
  ],
  popular: [
    { id: 7, title: "Wednesday", image: "https://images.pexels.com/photos/7991582/pexels-photo-7991582.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-14", year: "2023", description: "Wednesday Addams navigates her years as a student." },
    { id: 8, title: "You", image: "https://images.pexels.com/photos/8111360/pexels-photo-8111360.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2023", description: "A charming bookstore manager's obsessive love." },
    { id: 9, title: "Squid Game", image: "https://images.pexels.com/photos/7991583/pexels-photo-7991583.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2021", description: "Players compete in childhood games for a deadly prize." },
    { id: 10, title: "Dark", image: "https://images.pexels.com/photos/8111361/pexels-photo-8111361.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2020", description: "Time travel and family secrets in a German town." },
    { id: 11, title: "Lupin", image: "https://images.pexels.com/photos/7991584/pexels-photo-7991584.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2023", description: "A master thief inspired by classic literature." },
    { id: 12, title: "Elite", image: "https://images.pexels.com/photos/8111362/pexels-photo-8111362.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "TV-MA", year: "2023", description: "Class conflict at an exclusive private school." }
  ],
  newReleases: [
    { id: 13, title: "Glass Onion", image: "https://images.pexels.com/photos/7991585/pexels-photo-7991585.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "PG-13", year: "2023", description: "Detective Benoit Blanc solves a new mystery." },
    { id: 14, title: "The Gray Man", image: "https://images.pexels.com/photos/8111363/pexels-photo-8111363.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "PG-13", year: "2023", description: "A CIA operative becomes a target." },
    { id: 15, title: "Red Notice", image: "https://images.pexels.com/photos/7991586/pexels-photo-7991586.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "PG-13", year: "2023", description: "An FBI profiler partners with art thieves." },
    { id: 16, title: "Extraction 2", image: "https://images.pexels.com/photos/8111364/pexels-photo-8111364.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "R", year: "2023", description: "A black ops mercenary takes on a new mission." },
    { id: 17, title: "The Adam Project", image: "https://images.pexels.com/photos/7991587/pexels-photo-7991587.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "PG-13", year: "2023", description: "A time-traveling pilot teams up with his younger self." },
    { id: 18, title: "Don't Look Up", image: "https://images.pexels.com/photos/8111365/pexels-photo-8111365.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop", rating: "R", year: "2022", description: "Scientists try to warn humanity of an approaching comet." }
  ]
};

const MovieRow: React.FC<{ title: string; movies: Movie[] }> = ({ title, movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4 px-4 md:px-12">
        {title}
      </h2>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-2 px-4 md:px-12 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative min-w-[200px] md:min-w-[250px] cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-[280px] md:h-[350px] object-cover rounded-md"
              />
              {hoveredMovie === movie.id && (
                <div className="absolute inset-0 bg-black bg-opacity-75 rounded-md flex flex-col justify-end p-4 transition-opacity duration-300">
                  <h3 className="text-white text-lg font-bold mb-2">{movie.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{movie.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-green-400 text-sm font-semibold">{movie.rating}</span>
                    <span className="text-gray-400 text-sm">{movie.year}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-white text-black px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
                      <Play size={16} className="inline mr-1" />
                      Play
                    </button>
                    <button className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600 transition-colors">
                      <Info size={16} className="inline mr-1" />
                      Info
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const NetflixHome: React.FC<NetflixHomeProps> = ({ user, onNavigateToAccount }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="flex items-center justify-between px-4 md:px-12 py-4">
          <div className="flex items-center space-x-8">
            <div className="text-red-600 text-2xl md:text-3xl font-bold">NETFLIX</div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">TV Shows</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Movies</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">New & Popular</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">My List</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Search className="text-white hover:text-gray-300 cursor-pointer" size={20} />
            <Bell className="text-white hover:text-gray-300 cursor-pointer" size={20} />
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded"
                />
                <ChevronDown className="text-white" size={16} />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 rounded-md py-2 z-50">
                  <button
                    onClick={onNavigateToAccount}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    Account
                  </button>
                  <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors">Help Center</a>
                  <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors">Sign out</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 px-4 md:px-12 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Stranger Things
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
            When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-black px-6 md:px-8 py-2 md:py-3 text-lg font-semibold rounded hover:bg-gray-200 transition-colors flex items-center">
              <Play className="mr-2" size={24} />
              Play
            </button>
            <button className="bg-gray-700 bg-opacity-70 text-white px-6 md:px-8 py-2 md:py-3 text-lg font-semibold rounded hover:bg-gray-600 transition-colors flex items-center">
              <Info className="mr-2" size={24} />
              More Info
            </button>
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <main className="relative z-10 -mt-32">
        <MovieRow title="Trending Now" movies={movieData.trending} />
        <MovieRow title="Popular on Netflix" movies={movieData.popular} />
        <MovieRow title="New Releases" movies={movieData.newReleases} />
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Netflix</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Preferences</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Manage Profiles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Redeem Gift Cards</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-sm">&copy; 2024 Netflix Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NetflixHome;