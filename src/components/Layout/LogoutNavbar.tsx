import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/apis/modules/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/userSlice";
import logo from "@/assets/logos/logo-full.png";


const LogoutNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  // Get user data from Redux store
  const firstName = useSelector((state: any) => state.user?.first_name || "U");
  const lastName = useSelector((state: any) => state.user?.last_name || "U");

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authApi.logout({
        refresh_token: localStorage.getItem("refreshToken"),
      });
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

  // Extract the first letter of the user's name
  const userInitial =
    firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 left-0 right-0 z-50 py-4 bg-background/80 backdrop-blur-md border-b shadow-sm w-full">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-xl transition-all">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <img className="w-30 h-5" src={logo} alt="" />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
              <AvatarImage src="/path-to-user-image.jpg" alt="User" />
              <AvatarFallback className="bg-[#f6b438] text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default LogoutNavbar;
