import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Clock } from "lucide-react";

const AadhaarVerification: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <Card className="text-center p-8">
          <CardHeader>
            <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight mb-2">
              Aadhaar Verification Coming Soon
            </CardTitle>
            <CardDescription className="text-lg">
              We're working hard to bring you Aadhaar verification services
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-muted-foreground">
                Our team is currently developing a secure and reliable Aadhaar verification system. 
                This service will be available soon with the following features:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Secure Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    End-to-end encrypted verification process ensuring your data safety
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Quick Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Fast and accurate verification results in real-time
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">UIDAI Compliant</h3>
                  <p className="text-sm text-muted-foreground">
                    Fully compliant with UIDAI guidelines and regulations
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Easy Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple API integration with your existing systems
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Want to be notified when this service becomes available?
                </p>
                <Button
                  className="kyc-btn-primary"
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AadhaarVerification; 