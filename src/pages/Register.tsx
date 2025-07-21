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
import { ArrowLeft, Eye, EyeOff } from "lucide-react"; // Import eye icons
import {
  FileText,
  Mail,
  KeyRound,
  Loader2,
  Phone,
  CheckCircle,
} from "lucide-react";
import { authApi } from "@/apis/modules/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store.types";
import logo from "@/assets/logos/logo-full.png";


const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hasUsedVerify, setHasUsedVerify] = useState(false); // New state to track if verify button was used
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if(token){
      navigate("/dashboard")
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < 8 || value.length > 30) {
      setError("Password must be between 8 and 30 characters");
    } else {
      setError("");
    }
    setPassword(value);
  };

  // Add useEffect to monitor verifyingEmail state
  useEffect(() => {
    if (verifyingEmail) {
      // Additional logic when verification starts
    } else {
      // Additional logic when verification ends
    }
  }, [verifyingEmail]);

  // Reset hasUsedVerify when email changes
  useEffect(() => {
    if (email) {
      setHasUsedVerify(false);
      setEmailVerified(false);
      setShowOtp(false);
    }
  }, [email]);

  const startResendTimer = () => {
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
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to verify.",
        variant: "destructive",
      });
      return;
    }

    // Set the has used verify flag to true
    setHasUsedVerify(true);

    // Disable button immediately
    setVerifyingEmail(true);

    try {
      // Send OTP to the provided email with phone_number
      await authApi.sendOtp({
        email,
        phone_number: contactNumber,
      });

      setShowOtp(true);
      setEmailVerified(false);
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email.",
      });

      startResendTimer();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description:
          error.response?.data?.detail ||
          "Failed to send verification code. Please try again.",
        variant: "destructive",
      });

      // Allow user to try again if there was an error
      setHasUsedVerify(false);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast({
        title: "OTP Required",
        description:
          "Please enter the 6-digit verification code sent to your email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call API to verify OTP
      const response = await authApi.verifyOtp({
        email,
        otp,
      });

      if (response.data.is_email_verified) {
        setEmailVerified(true);
        setShowOtp(false);
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        });
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid OTP",
        description:
          error.response?.data?.detail ||
          "The verification code is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;

    setIsLoading(true);

    try {
      // Include phone_number when resending OTP
      await authApi.sendOtp({
        email,
        phone_number: contactNumber,
      });

      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });

      startResendTimer();
    } catch (error) {
      toast({
        title: "Failed to Resend OTP",
        description:
          error.response?.data?.detail ||
          "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !contactNumber || !password || !email) {
      toast({
        title: "All Fields Required",
        description: "Please fill in all required fields to continue.",
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

    if (!emailVerified) {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email address before registering.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      await authApi.register({
        username: email,
        email,
        role: "user",
        is_active: true,
        first_name: firstName,
        last_name: lastName,
        phone_number: contactNumber,
        password,
        company: companyName
      });

      toast({
        title: "Registration Successful",
        description: "Welcome to FORTMINDZ!",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error.response?.data?.detail ||
          "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* <div className="absolute top-3 left-0 max-sm:top-0 max-sm:hidden"><Button
            variant="outline"
            className="mb-4 "
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button></div> */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} className="w-30 h-5 mx-auto" alt="" />
          <p className="text-muted-foreground mt-2">
            Create your business account
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="Enter Your First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Enter Your Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_number"
                    type="text"
                    placeholder="Enter Your Contact Number"
                    value={contactNumber}
                    onChange={(e) =>
                      setContactNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    className="pl-10"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Company Name</Label>
                <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company_name"
                    type="text"
                    placeholder="Enter Your Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailVerified(false);
                      }}
                      className="pl-10"
                      autoComplete="email"
                      disabled={emailVerified}
                    />
                    {emailVerified && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={
                      verifyingEmail || emailVerified || !email || hasUsedVerify
                    }
                    className={`whitespace-nowrap ${
                      emailVerified
                        ? "bg-green-500 hover:bg-green-700 text-white"
                        : ""
                    }`}
                    variant={emailVerified ? "default" : "default"}
                  >
                    {verifyingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : emailVerified ? (
                      "Verified"
                    ) : hasUsedVerify ? (
                      "Verify"
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                {hasUsedVerify && !emailVerified && !showOtp && (
                  <p className="text-xs text-amber-600 mt-1">
                    OTP has been sent to your email.
                  </p>
                )}
              </div>

              {showOtp && !emailVerified && (
                <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="otp">Verification Code</Label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="text-center tracking-widest"
                      maxLength={6}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={isLoading || !otp || otp.length < 6}
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Submit OTP"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleResendOTP}
                        disabled={resendDisabled || isLoading}
                        className="h-auto py-1 px-2 text-xs whitespace-nowrap bg-red-600 hover:bg-red-700 text-white"
                      >
                        {resendDisabled
                          ? `Resend in ${countdown}s`
                          : "Resend OTP"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Code sent to <span className="font-medium">{email}</span>
                  </p>
                </div>
              )}

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
                disabled={isLoading || !emailVerified}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
