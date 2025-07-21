
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, Mail } from "lucide-react";

const ApplicationProgress: React.FC = () => {
  // In a real application, you would fetch the application status from your API
  const applicationStatus = {
    submitted: true,
    emailVerified: true,
    documentsVerified: false,
    approved: false,
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusLabel = (status: boolean, isPending: boolean = false) => {
    if (status) return <span className="text-green-600 font-medium flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Completed</span>;
    if (isPending) return <span className="text-amber-600 font-medium flex items-center"><Clock className="w-4 h-4 mr-1" /> In Progress</span>;
    return <span className="text-gray-400 font-medium flex items-center"><Clock className="w-4 h-4 mr-1" /> Pending</span>;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold kyc-gradient-text">FORTMINDZ</h2>
          <p className="text-muted-foreground mt-2">Your application is being processed</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Tracking the progress of your FORTMINDZ application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Application Submitted
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your application has been received.
                  </p>
                </div>
                <div className="text-right">
                  <div>{getStatusLabel(applicationStatus.submitted)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(new Date())}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> Email Verification
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your email address has been verified.
                  </p>
                </div>
                <div className="text-right">
                  <div>{getStatusLabel(applicationStatus.emailVerified)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(new Date())}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Document Verification
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We're reviewing your Company PAN and other details.
                  </p>
                </div>
                <div className="text-right">
                  <div>{getStatusLabel(false, true)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Estimated: 1-2 business days
                  </div>
                </div>
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" /> Application Approval
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Final review and approval of your application.
                  </p>
                </div>
                <div className="text-right">
                  <div>{getStatusLabel(applicationStatus.approved)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Pending previous steps
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">What's Next?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We'll notify you via email once your application is approved. 
                This typically takes 1-3 business days. If we need any additional 
                information, our team will contact you.
              </p>
              <div className="flex justify-between items-center">
                <Link to="/" className="text-sm text-primary hover:underline">
                  Return to home page
                </Link>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Refresh Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationProgress;
