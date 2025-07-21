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

const JobVerification: React.FC = () => {
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
              Job Verification Coming Soon
            </CardTitle>
            <CardDescription className="text-lg">
              We're working hard to bring you comprehensive job verification services
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-muted-foreground">
                Our team is currently developing a robust job verification system. 
                This service will be available soon with the following features:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Employment Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify current and past employment details with employers
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Salary Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Confirm salary details and payment history
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Tenure Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Validate employment duration and role history
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-left">
                  <h3 className="font-semibold mb-2">Document Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify employment documents and certificates
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
                                  <FaClockRotateLeft/> <span>Notify Me</span>
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

export default JobVerification; 