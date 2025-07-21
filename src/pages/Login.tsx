import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Loader2, KeyRound, Link2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/apis/modules/auth";
import { useDispatch, useSelector } from "react-redux";
import { setExpiresAt, setFirstName, setLastName, setRefreshToken, setToken } from "@/store/userSlice";
import { RootState } from "@/types/store.types";
import logo from "@/assets/logos/logo-full.png";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.user.token);

useEffect(() => {
    if(token){
      navigate("/dashboard")
    }
  }, [token])

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Email and Password Required",
        description: "Please enter your email and password to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({ username: email, password });
      dispatch(setToken(response.data.access_token));
      dispatch(setRefreshToken(response.data.refresh_token));
      dispatch(setExpiresAt(response.data.expires_at));
      dispatch(setFirstName(response.data.first_name));
      dispatch(setLastName(response.data.last_name));
      toast({
        title: "Login Successful",
        description: "Welcome to FORTMINDZ!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description:
          error.response.data?.detail || "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} className="w-30 h-5 mx-auto" alt="" />
          <p className="text-muted-foreground mt-2">
            Log in to your business account
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your business email and password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="text"
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Toggle input type
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5 text-[#f6b438]" />
                    ) : (
                      <EyeOff className="h-5 w-5 hover:text-[#f6b438] transition-all duration-300" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex ">
                <Link
                  to="/reset-password/email"
                  className="text-xs text-primary font-bold"
                >
                  Forgot your password ?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full kyc-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Register now
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
