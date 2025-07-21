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
import { FaClockRotateLeft } from "react-icons/fa6";

const GstinVerification: React.FC = () => {
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
              GSTIN Verification Coming Soon
            </CardTitle>
            <CardDescription className="text-lg">
              We're working hard to bring you GSTIN verification services
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-muted-foreground">
                Our team is currently developing a comprehensive GSTIN
                verification system. This service will be available soon with
                the following features:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Real-time Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant verification of GSTIN status and validity
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Business Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to complete business information and registration
                    details
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Compliance Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Check GST compliance status and filing history
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">API Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Seamless integration with your existing business systems
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Want to be notified when this service becomes available?
                </p>
                <Button
                  className="kyc-btn-primary "
                  onClick={() => navigate("/contact")}
                >
                  <div className="flex items-center gap-2">
                    <FaClockRotateLeft /> <span>Notify Me</span>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GstinVerification;
