import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logos/logo-full.png";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Loader2, KeyRound, Check, ArrowLeft } from "lucide-react";
import { authApi } from "@/apis/modules/auth";

const ResetEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSended, setIsSended] = useState(false);
  // State for password visibility
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await authApi.resetEmailVerify(email);
      if (response.status === 200) {
        toast({
          title: "Link has been sent",
          description: "A link has been sent to your email. Please proceed as per the guidelines.",
        });
        setIsSended(true);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Email Verify Failed",
        description: error.response.data?.detail || "Email doesn't exist.",
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
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              To reset your password, Enter the email below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
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
                {isSended ? (
                  <>
                    <div className="flex items-center ">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <h6 className="text-green-600 ">
                        Pasword reset link has been sent to your email
                      </h6>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <Button
                type="submit"
                className="w-full kyc-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetEmail;
