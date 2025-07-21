import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { authApi } from "@/apis/modules/auth";
import { logout } from "@/store/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/logos/logo-full.png";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authApi.logout({
        refresh_token: localStorage.getItem("refreshToken"),
      });
      setToken(null);
      dispatch(logout());
      toast({
        title: "Logged Out",
        description: "You have successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    setToken(localStorage.getItem("token"));

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3 bg-background/80 backdrop-blur-md border-b" : "py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link
          to="/"
          className="relative flex items-center gap-1.5 font-semibold text-xl transition-all"
        >
          <img
            className="w-30 h-5"
            src={logo}
            alt=""
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive("/")
                ? "text-primary bg-accent/50"
                : "text-muted-foreground hover:text-primary hover:bg-accent/30"
            )}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive("/about")
                ? "text-primary bg-accent/50"
                : "text-muted-foreground hover:text-primary hover:bg-accent/30"
            )}
          >
            About
          </Link>
          <Link
            to="/pricing"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive("/pricing")
                ? "text-primary bg-accent/50"
                : "text-muted-foreground hover:text-primary hover:bg-accent/30"
            )}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive("/contact")
                ? "text-primary bg-accent/50"
                : "text-muted-foreground hover:text-primary hover:bg-accent/30"
            )}
          >
            Contact
          </Link>
        </nav>
        {token === null ? (
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm" className="h-9">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="h-9">
                Register
              </Button>
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="h-9">
                Dashboard
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <Avatar>
                  <AvatarImage src="/path-to-user-image.jpg" alt="User" />
                  <AvatarFallback className="bg-[#f6b438] text-white">
                    C
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-background/95 backdrop-blur-md border-b shadow-lg transition-all duration-300 ease-in-out",
          isMobileMenuOpen
            ? "max-h-[calc(100vh-4rem)] overflow-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        )}
      >
        <div className="container mx-auto px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              className={cn(
                "px-4 py-3 rounded-md text-base font-medium transition-colors",
                isActive("/")
                  ? "text-primary bg-accent/50"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/30"
              )}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={cn(
                "px-4 py-3 rounded-md text-base font-medium transition-colors",
                isActive("/about")
                  ? "text-primary bg-accent/50"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/30"
              )}
            >
              About
            </Link>
            <Link
              to="/pricing"
              className={cn(
                "px-4 py-3 rounded-md text-base font-medium transition-colors",
                isActive("/pricing")
                  ? "text-primary bg-accent/50"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/30"
              )}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className={cn(
                "px-4 py-3 rounded-md text-base font-medium transition-colors",
                isActive("/contact")
                  ? "text-primary bg-accent/50"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/30"
              )}
            >
              Contact
            </Link>
          </nav>
          {token === null ? (
            <div className="flex flex-col pt-4 border-t space-y-3">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center">
                  Log in
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="w-full justify-center">Register</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col pt-4 border-t space-y-3">
              <Link to="/dashboard" className="w-full">
                <Button variant="outline" className="w-full justify-center">
                  Dashboard
                </Button>
              </Link>
              <Link to="/" className="w-full">
                <Button
                  className="w-full justify-center"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
