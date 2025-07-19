import { useState, useContext } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { SearchContext } from "../Context/SearchContext";

const Header = () => {
  const { setSearchTerm } = useContext(SearchContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 current route

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const isMobileHome = location.pathname === "/";

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="flex justify-around items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dqxbyu1dj/image/upload/v1752211019/Group_ylohfc.png"
            className="h-8 w-12"
            alt="logo"
          />
          <h1 className="text-lg font-semibold">Insta Share</h1>
        </div>

        {/* Desktop navigation always shows search bar */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            placeholder="Search Caption"
            className="border rounded px-2 py-1 text-sm"
            onChange={handleSearchChange}
          />
          <Link to="/" className="text-sm">Home</Link>
          <Link to="/profile" className="text-sm">Profile</Link>
          <button onClick={onClickLogout} className="bg-[#4094EF] text-white text-sm font-semibold px-3 py-1 rounded">
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile search bar only shown on home route */}
      {isMobileHome && (
        <div className="block md:hidden px-4 pb-2">
          <input
            type="text"
            placeholder="Search Caption"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={handleSearchChange}
          />
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col items-center gap-2 pb-4">
          <Link to="/" className="text-sm">Home</Link>
          <Link to="/profile" className="text-sm">Profile</Link>
          <button onClick={onClickLogout} className="bg-[#4094EF] text-white text-sm font-semibold px-4 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
