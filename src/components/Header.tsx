
import { useState } from 'react';
import { Menu, X, Home, BookOpen, BarChart3, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserProfileButton from '@/components/UserProfileButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const standards = [
    'Nursery',
    '1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard'
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/" && !location.hash;
    }
    if (href === "/#hero-section") {
      return location.pathname === "/" && (!location.hash || location.hash === "#hero-section");
    }
    return location.pathname.includes(href.replace("#", ""));
  };

  const handleSubjectsClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (location.pathname === "/") {
      const subjectsSection = document.getElementById('subjects');
      if (subjectsSection) {
        subjectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#subjects');
    }
  };



  const handleStandardSelect = (standard: string) => {
    const standardNumber = standard.split(' ')[0];
    navigate(`/class/${standardNumber}`);
  };

  const handleClassDropdownSelect = (standard: string) => {
    if (standard === 'Nursery') {
      handleSubjectsClick();
    } else {
      handleStandardSelect(standard);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#hero-section');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-2 border-eduplay-purple/20 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/#hero-section" className="flex items-center space-x-2 animate-scale-in">
            <img 
              src="/assets/logo-2.png" 
              alt="247School Logo"
              className="h-8 lg:h-10 animate-bounce-gentle"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Home */}
            <Link
              to="/#hero-section"
              onClick={handleHomeClick}
              className={`text-lg font-semibold transition-all duration-300 hover:scale-105 animate-fade-in flex items-center space-x-1 px-3 py-2 rounded-lg ${
                isActive("/#hero-section")
                  ? 'text-eduplay-purple bg-eduplay-purple/10'
                  : 'text-gray-700 hover:text-eduplay-purple hover:bg-eduplay-purple/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {/* Classes Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-eduplay-purple hover:bg-eduplay-purple/5"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Classes</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg">
                {standards.map((standard) => (
                  <DropdownMenuItem
                    key={standard}
                    onClick={() => handleClassDropdownSelect(standard)}
                    className="cursor-pointer hover:bg-eduplay-purple/10"
                  >
                    {standard}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Subjects */}
            <Link
              to="/#subjects"
              onClick={handleSubjectsClick}
              className={`text-lg font-semibold transition-all duration-300 hover:scale-105 animate-fade-in flex items-center space-x-1 px-3 py-2 rounded-lg ${
                isActive("/subjects")
                  ? 'text-eduplay-purple bg-eduplay-purple/10'
                  : 'text-gray-700 hover:text-eduplay-purple hover:bg-eduplay-purple/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Subjects</span>
            </Link>

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={`text-lg font-semibold transition-all duration-300 hover:scale-105 animate-fade-in flex items-center space-x-1 px-3 py-2 rounded-lg ${
                isActive("/dashboard")
                  ? 'text-eduplay-purple bg-eduplay-purple/10'
                  : 'text-gray-700 hover:text-eduplay-purple hover:bg-eduplay-purple/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </nav>

          {/* User Actions - Desktop */}
          <div className="hidden lg:flex items-center animate-fade-in delay-700">
            <UserProfileButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg bg-eduplay-purple/10 hover:bg-eduplay-purple/20 transition-all duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-eduplay-purple animate-spin" />
            ) : (
              <Menu className="w-6 h-6 text-eduplay-purple animate-pulse" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white rounded-2xl playful-shadow animate-scale-in border border-eduplay-purple/10">
            <nav className="flex flex-col space-y-1">
              {/* Home */}
              <Link
                to="/#hero-section"
                onClick={(e) => {
                  handleHomeClick(e);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-300 animate-fade-in ${
                  isActive("/#hero-section")
                    ? 'text-eduplay-purple bg-eduplay-purple/10'
                    : 'text-gray-700 hover:text-eduplay-purple hover:bg-eduplay-purple/5'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              {/* Mobile Classes Section */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-3 px-4 py-2 text-lg font-semibold text-gray-700">
                  <GraduationCap className="w-5 h-5" />
                  <span>Classes</span>
                </div>
                <div className="pl-8 space-y-1">
                  {standards.map((standard) => (
                    <button
                      key={standard}
                      onClick={() => {
                        handleClassDropdownSelect(standard);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-eduplay-purple hover:bg-eduplay-purple/5 rounded transition-colors duration-200"
                    >
                      {standard}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <Link
                to="/#subjects"
                onClick={(e) => {
                  handleSubjectsClick(e);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-300 animate-fade-in ${
                  isActive("/subjects")
                    ? 'text-eduplay-purple bg-eduplay-purple/10'
                    : 'text-gray-700 hover:text-eduplay-purple hover:bg-eduplay-purple/5'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Subjects</span>
              </Link>

              {/* Dashboard */}
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-300 animate-fade-in ${
                  isActive("/dashboard")
                    ? 'text-eduplay-purple bg-eduplay-purple/10'
                    : 'text-gray-700 hover:text-eduplay-purple hover:bg-eduplay-purple/5'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              {/* Mobile User Actions */}
              <div className="pt-4 mt-4 border-t border-gray-200 animate-fade-in delay-500">
                <UserProfileButton isMobile={true} onMenuClose={() => setIsMenuOpen(false)} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
