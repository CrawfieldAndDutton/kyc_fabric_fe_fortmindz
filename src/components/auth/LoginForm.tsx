
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email.",
      });
      
      // Start countdown for resend
      setResendDisabled(true);
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the verification code sent to your email.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, any 6-digit OTP is considered valid
      if (otp.length === 6) {
        toast({
          title: "Login Successful",
          description: "Welcome to FORTMINDZ!",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    if (resendDisabled) return;
    
    setIsLoading(true);
    
    // Simulate API call to resend OTP
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });
      
      // Reset countdown for resend
      setResendDisabled(true);
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
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
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="otp">Verification Code</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleResendOTP}
                disabled={resendDisabled || isLoading}
                className="h-auto py-0 px-2 text-xs"
              >
                {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
              </Button>
            </div>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center tracking-widest"
              maxLength={6}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              A verification code has been sent to <span className="font-medium">{email}</span>
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Log In"
            )}
          </Button>
          
          <div className="text-center">
            <Button 
              type="button" 
              variant="link" 
              className="text-sm text-muted-foreground"
              onClick={() => setOtpSent(false)}
            >
              Use a different email
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
