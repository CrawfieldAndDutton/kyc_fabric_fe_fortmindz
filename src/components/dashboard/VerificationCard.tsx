
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  credits: number;
  path: string;
  className?: string;
}

const VerificationCard: React.FC<VerificationCardProps> = ({
  title,
  description,
  icon: Icon,
  credits,
  path,
  className
}) => {
  return (
    <Card className={cn("h-full transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 grid place-items-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          Credits Required: <span className="text-primary">{credits}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={path} className="w-full">
          <Button variant="outline" className="w-full justify-between group">
            <span>Verify Now</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VerificationCard;
