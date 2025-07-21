import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/apis/modules/auth";


const Reset: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [procKey, setProcKey] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  useEffect(() => {
    const dateNow = new Date();
    const day = dateNow.getUTCDate();
    const procKeys = queryParams.get("proc_key");
    if (!procKeys) {
      navigate("/login");
    }
    function decodeProcKey() {
      try {
        if (!procKeys) {
          toast({
            title: "No prockey passed",
            description: "Invalid prockey",
            variant: "destructive",
          });
        }
        console.log(procKeys)
        const decodedString = atob(procKeys);
        console.log(decodedString)
        setProcKey(queryParams.get("proc_key"));
        const [id, date, userID, email, randomValue] = decodedString.split("|");
        if(Number(date) !== Number(day)){
          toast({
            title: "Link Expired",
            description: "please genarate another link",
            variant: "destructive",
          });
          navigate("/reset-password/email")
          return
        }
        setEmail(email);
        setDate(date);
      } catch (error) {
        console.error("Invalid Base64 string", error);
      }
    }
    decodeProcKey();
  }, []);

  useEffect(() => {
    console.log(email, date);
  }, [procKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your password to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({email,password});
      if(response.status === 200){
        toast({
          title: "Password Changed Succesfully",
          description:"Your password has changed redirecting to login page"
        });
        navigate("/login")
      }

    } catch (error) {
      toast({
        title: "error in reseting password",
        description:
          error.response.data?.detail || "Email dont exist.",
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
          <h2 className="text-3xl font-bold kyc-gradient-text">FORTMINDZ</h2>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Enter your new password </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Toggle input type
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 30) setPassword(value);
                    }}
                    maxLength={30}
                    className="pl-10 pr-12 py-2" // Adjust padding for better spacing
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5 text-[#f6b438] " />
                    ) : (
                      <EyeOff className="h-5 w-5 hover:text-[#f6b438] transition-all duration-300" />
                    )}
                  </button>
                  {password && password.length < 8 && (
                    <div className="absolute text-xs text-red-600 mt-1">
                      Password must be at least 8 characters long.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"} // Toggle input type
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 30) setConfirmPassword(value);
                    }}
                    maxLength={30}
                    className="pl-10 pr-12 py-2" // Adjust padding for better spacing
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <Eye className="h-5 w-5 text-[#f6b438] " />
                    ) : (
                      <EyeOff className="h-5 w-5 hover:text-[#f6b438] transition-all duration-300" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full kyc-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reseting...
                  </>
                ) : (
                  "Reset"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reset;
