
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building, Mail, CreditCard, Loader2 } from "lucide-react";

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    companyPAN: ""
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.companyName.trim()) {
      toast({
        title: "Company Name Required",
        description: "Please enter your company name to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.companyPAN.trim()) {
      toast({
        title: "Company PAN Required",
        description: "Please enter your company PAN to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // PAN validation (simple format check)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.companyPAN)) {
      toast({
        title: "Invalid PAN Format",
        description: "Please enter a valid PAN in the format ABCDE1234F.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
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
    
    // Simulate API call to verify OTP and complete registration
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, any 6-digit OTP is considered valid
      if (otp.length === 6) {
        toast({
          title: "Registration Successful",
          description: "Your application is now under review.",
        });
        navigate("/application-progress");
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

  if (step === 1) {
    return (
      <form onSubmit={handleSubmitBasicInfo} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="companyName"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={(e) => updateFormData("companyName", e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="pl-10"
              autoComplete="email"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyPAN">Company PAN</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="companyPAN"
              placeholder="ABCDE1234F"
              value={formData.companyPAN}
              onChange={(e) => updateFormData("companyPAN", e.target.value.toUpperCase())}
              className="pl-10 uppercase"
              maxLength={10}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your 10-digit Permanent Account Number
          </p>
        </div>
        
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    );
  }
  
  return (
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
          A verification code has been sent to <span className="font-medium">{formData.email}</span>
        </p>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Complete Registration"
        )}
      </Button>
      
      <div className="text-center">
        <Button 
          type="button" 
          variant="link" 
          className="text-sm text-muted-foreground"
          onClick={() => setStep(1)}
        >
          Go back and edit details
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
