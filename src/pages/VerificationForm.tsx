import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-input-2";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import "react-phone-input-2/lib/bootstrap.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { verifyApi } from "@/apis/modules/verify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Checkbox } from "@/components/ui/checkbox";
import { pathToFileURL } from "url";

// Define verification types and their details
const verificationTypes = {
  pan: {
    title: "PAN Verification",
    description: "Verify Permanent Account Number",
    placeholder: "ABCDE1234F",
    icon: <FileText className="h-8 w-8" />,
    pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
    credits: 2,
    validation: (value: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
    errorMessage: "Please enter a valid 10-character PAN (e.g., ABCDE1234F)",
  },
  aadhaar: {
    title: "Aadhaar Verification",
    description: "Verify Aadhaar Number",
    placeholder: "1234 5678 9012",
    icon: <CreditCard className="h-8 w-8" />,
    pattern: "^[0-9]{12}$",
    credits: 1,
    validation: (value: string) => /^[0-9]{12}$/.test(value.replace(/\s/g, "")),
    errorMessage: "Please enter a valid 12-digit Aadhaar number",
  },
  voter: {
    title: "Voter ID Verification",
    description: "Verify Voter Identity Card",
    placeholder: "ABC1234567",
    icon: <CreditCard className="h-8 w-8" />,
    pattern: "^[A-Z]{3}[0-9]{7}$",
    credits: 5,
    validation: (value: string) => /^[A-Z]{3}[0-9]{7}$/.test(value),
    errorMessage: "Please enter a valid Voter ID (e.g., ABC1234567)",
  },
  vehicle: {
    title: "Vehicle RC Verification",
    description: "Verify Registration Certificate",
    placeholder: "MH01AB1234/21BH0000A",
    icon: <FileText className="h-8 w-8" />,
    pattern:
      "^(?:[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}||[0-9]{2}[A-Z]{2}[0-9]{4}[A-Z]{1})$",
    credits: 7.5,
    validation: (value: string) =>
      /^(?:[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}||[0-9]{2}[A-Z]{2}[0-9]{4}[A-Z]{1})$/.test(
        value
      ),
    errorMessage:
      "Please enter a valid RC number (e.g., MH01AB1234, 21BH0000A)",
  },
  passport: {
    title: "Passport Verification",
    description: "Verify Passport Details",
    placeholder: "",
    fileNumberPlaceholder: "File Number",
    dobPlaceholder: "DD/MM/YYYY",
    namePlaceholder: "FULL NAME",
    icon: <CreditCard className="h-8 w-8" />,
    pattern: "^[A-Z]{1}[0-9]{7}$",
    fileNumberPattern: "^[A-Z0-9]+$",
    dobPattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$",
    namePattern: "^[A-Z ]+$",
    credits: 5,
    validation: (value: string) => /^[A-Z]{1}[0-9]{7}$/.test(value),
    fileNumberValidation: (value: string) => /^[A-Z]{2}\d{13}$/.test(value),
    dobValidation: (value: string) =>
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/.test(value),
    nameValidation: (value: string) => /^[A-Z ]+$/.test(value),
    errorMessage: "Please enter a valid passport number (e.g., A1234567)",
    fileNumberErrorMessage: "Please enter a valid file number",
    dobErrorMessage: "Please enter a valid date of birth (e.g., 01/01/2000)",
    nameErrorMessage: "Please enter a valid name",
  },
  dl: {
    title: "Driving Licence Verification",
    description: "Verify Driving Licence Details",
    placeholder: "AB1122334455667",
    dobPlaceholder: "DD/MM/YYYY",
    icon: <FileText className="h-8 w-8" />,
    pattern: "^(?:[A-Z]{2}[0-9]{13})$",
    dobPattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$",
    credits: 5,
    validation: (value: string) => /^(?:[A-Z]{2}[0-9]{13})$/.test(value),
    dobValidation: (value: string) =>
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/.test(value),
    errorMessage:
      "Please enter a valid Driving Licence number (e.g., MH0320080022135)",
    dobErrorMessage: "Please enter a valid date of birth (e.g., 01/01/2000)",
  },

  mobileLookup: {
    title: "Mobile Lookup Verification",
    description: "Mobile Lookup Verification Details",
    placeholder: "92XXXXXX27",
    icon: <FileText className="h-8 w-8" />,
    credits: 6,
    errorMessage: "Please enter a valid number",
    pattern: "^(+d{1,3}[s-]?)?d{10,15}$",
    validation: (value: string) => /^(\+\d{1,3}[\s-]?)?\d{10,15}$/.test(value),
  },
  emailLookup: {
    title: "Email Lookup Verification",
    description: "Email Lookup Verification Details",
    placeholder: "johndeo@gmail.com",
    icon: <FileText className="h-8 w-8" />,
    credits: 6,
    errorMessage: "Please enter a valid email",
    pattern: "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$",
    validation: (value: string) =>
      /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value),
  },
  JobVerification: {
    title: "Job Verification",
    description: "Job Verification Details",
    placeholder: "92XXXXXX27",
    icon: <FileText className="h-8 w-8" />,
    credits: 7,
    pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
    validation: (value: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
    errorMessage: "Please enter a valid 10-character PAN (e.g., ABCDE1234F)",
    dobValidation: (value: string) =>
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/.test(value),
    dobPlaceholder: "DD/MM/YYYY",
    dobPattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$",
    dobErrorMessage: "Please enter a valid date of birth (e.g., 01/01/2000)",
  },
  gstin: {
    title: "GSTIN Verification",
    description: "Verify GSTIN Number",
    placeholder: "99AAAUB4321A1ZA",
    icon: <FileText className="h-8 w-8" />,
    pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
    credits: 2,
    validation: (value: string) =>
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
    errorMessage:
      "Please enter a valid 15-character GSTIN Number (e.g., 99AAAUB4321A1ZA)",
  },
};

type VerificationType = keyof typeof verificationTypes;

const VerificationForm: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [dob, setDob] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [fileNumber, setFileNumber] = useState("");
  const [name, setName] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [checkBox, setCheckBox] = useState(true);
  const [option, setOption] = useState("Mobile");
  const [pan, setPan] = useState("");

  // Check if verification type is valid
  useEffect(() => {
    if (type && !Object.keys(verificationTypes).includes(type)) {
      toast({
        title: "Invalid Verification Type",
        description: "The requested verification type does not exist.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [type, navigate, toast]);

  useEffect(() => {
    // console.log(verificationResult, "Verification Result");
  }, [verificationResult]);

  // If type is not defined or invalid, return null
  if (!type || !Object.keys(verificationTypes).includes(type)) {
    return null;
  }

  const verificationType = type as VerificationType;
  const verificationConfig = verificationTypes[verificationType];

  // Destructure common properties
  const {
    title,
    description,
    placeholder,
    icon,
    pattern,
    credits,
    validation,
    errorMessage,
  } = verificationConfig;

  // Get dob-related properties only if they exist (for driving license,passport,JobVerification)
  const dobPlaceholder =
    verificationType === "dl" ||
    verificationType === "passport" ||
    verificationType === "JobVerification"
      ? verificationTypes[verificationType].dobPlaceholder
      : undefined;
  const dobPattern =
    verificationType === "dl" ||
    verificationType === "passport" ||
    verificationType === "JobVerification"
      ? verificationTypes[verificationType].dobPattern
      : undefined;
  const dobValidation =
    verificationType === "dl" ||
    verificationType === "passport" ||
    verificationType === "JobVerification"
      ? verificationTypes[verificationType].dobValidation
      : undefined;
  const dobErrorMessage =
    verificationType === "dl" ||
    verificationType === "passport" ||
    verificationType === "JobVerification"
      ? verificationTypes[verificationType].dobErrorMessage
      : undefined;

  //Get passport-related properties only if they exist (for passport)
  const fileNumberPlaceholder =
    verificationType === "passport"
      ? verificationTypes.passport.fileNumberPlaceholder
      : undefined;
  const fileNumberPattern =
    verificationType === "passport"
      ? verificationTypes.passport.fileNumberPattern
      : undefined;
  const namePlaceholder =
    verificationType === "passport"
      ? verificationTypes.passport.namePlaceholder
      : undefined;
  const fileNumberValidation =
    verificationType === "passport"
      ? verificationTypes.passport.fileNumberValidation
      : undefined;
  const fileNumberErrorMessage =
    verificationType === "passport"
      ? verificationTypes.passport.fileNumberErrorMessage
      : undefined;
  const nameValidation =
    verificationType === "passport"
      ? verificationTypes.passport.nameValidation
      : undefined;
  const nameErrorMessage =
    verificationType === "passport"
      ? verificationTypes.passport.nameErrorMessage
      : undefined;
  const namePattern =
    verificationType === "passport"
      ? verificationTypes.passport.namePattern
      : undefined;

  //mobile pattern
  const mobilePattern =
    verificationType === "mobileLookup"
      ? verificationTypes.mobileLookup.pattern
      : undefined;
  const mobileNumberValidation =
    verificationType === "mobileLookup"
      ? verificationTypes.mobileLookup.validation
      : undefined;

  //job verification pattern
  const jobVerificationPattern =
    verificationType === "JobVerification"
      ? verificationTypes.JobVerification.pattern
      : undefined;
  const JobVerificationValidation =
    verificationType === "JobVerification"
      ? verificationTypes.JobVerification.validation
      : undefined;

  const handleCheckBox = () => {
    setIsDisable((prev) => (prev === null ? true : null));
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate document number
    if (verificationType === "JobVerification") {
      if (option === "Mobile" && !phone) {
        toast({
          title: "Input Required",
          description: "Please enter your mobile number.",
          variant: "destructive",
        });
        return;
      }
      if (option === "Pan" && !pan) {
        toast({
          title: "Input Required",
          description: "Please enter your PAN number.",
          variant: "destructive",
        });
        return;
      }
      if (option === "NameAndDOB" && (!name || !dob || !phone)) {
        toast({
          title: "Input Required",
          description:
            "Please enter all required fields (Name, DOB, and Mobile).",
          variant: "destructive",
        });
        return;
      }
    }
    if (
      verificationType !== "passport" &&
      verificationType !== "mobileLookup" &&
      verificationType !== "JobVerification" &&
      verificationType !== "emailLookup"
    ) {
      if (!documentNumber) {
        toast({
          title: "Input Required",
          description: "Please enter the document number to verify.",
          variant: "destructive",
        });
        return;
      }
    }
    if (
      verificationType !== "passport" &&
      verificationType !== "mobileLookup" &&
      verificationType !== "JobVerification" &&
      verificationType !== "emailLookup"
    ) {
      if (!validation(documentNumber)) {
        toast({
          title: "Invalid Format",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
    }
    //mobile validation
    if (verificationType === "mobileLookup") {
      if (!phone) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your number.",
          variant: "destructive",
        });
        return;
      }
      if (!mobileNumberValidation(phone)) {
        toast({
          title: "Valid Phone Number Required",
          description: "Please enter a valid phone number.",
          variant: "destructive",
        });
        return;
      }
    }

    if (verificationType === "emailLookup") {
      if (!email) {
        toast({
          title: "Email Required",
          description: "Please enter your email.",
          variant: "destructive",
        });
        return;
      }
     
    }

    // Check DOB validation for DL verification
    if (verificationType === "dl") {
      if (!dob) {
        toast({
          title: "Date of Birth Required",
          description: "Please enter your date of birth for DL verification.",
          variant: "destructive",
        });
        return;
      }

      if (!dobValidation(dob)) {
        toast({
          title: "Invalid Date of Birth",
          description: dobErrorMessage,
          variant: "destructive",
        });
        return;
      }
    }
    // Check file number, dob, name for passport verification
    if (verificationType === "passport") {
      if (!fileNumber) {
        toast({
          title: "File Number Required",
          description:
            "Please enter your file number for passport verification.",
          variant: "destructive",
        });
        return;
      }

      if (!fileNumberValidation(fileNumber)) {
        toast({
          title: "Invalid File Number",
          description: fileNumberErrorMessage,
          variant: "destructive",
        });
        return;
      }

      if (!dob) {
        toast({
          title: "Date of Birth Required",
          description:
            "Please enter your date of birth for passport verification.",
          variant: "destructive",
        });
        return;
      }

      if (!dobValidation(dob)) {
        toast({
          title: "Invalid Date of Birth",
          description: dobErrorMessage,
          variant: "destructive",
        });
        return;
      }

      if (!name) {
        toast({
          title: "Name Required",
          description: "Please enter your name for passport verification.",
          variant: "destructive",
        });
        return;
      }

      if (!nameValidation(name)) {
        toast({
          title: "Invalid Name",
          description: nameErrorMessage,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      let response;
      switch (verificationType) {
        case "pan":
          response = await verifyApi.pan({ pan: documentNumber });
          break;

        case "gstin":
          response = await verifyApi.gstin({ gstin: documentNumber });
          break;

        case "vehicle":
          response = await verifyApi.vehicle({ reg_no: documentNumber });
          break;

        case "voter":
          response = await verifyApi.voter({ epic_no: documentNumber });
          break;

        case "dl":
          response = await verifyApi.dl({ dl_no: documentNumber, dob });
          break;

        case "aadhaar":
          response = await verifyApi.aadhaar({ aadhaar: documentNumber });
          break;

        case "passport":
          response = await verifyApi.passport({
            file_number: fileNumber,
            dob,
            name,
          });
          break;
        case "mobileLookup": {
          const phoneNumber = "+" + phone;
          response = await verifyApi.mobileLookup({
            mobile: phoneNumber,
          });
          break;
        }

        case "emailLookup": {
          response = await verifyApi.emailLookup({
            email: email,
          });
          break;
        }

        case "JobVerification":
          response = await verifyApi.jobVerification({
            mobile: phone,
            pan: pan,
            dob: dob,
            employee_name: name,
          });
          break;

        default:
          throw new Error("Unsupported verification type");
      }

      setVerificationResult(response.data);
      toast({
        title:
          response.data?.http_status_code === 200 ||
          response.data?.http_status_code === 206
            ? "Verified"
            : "Verification Failed",
        description:
          response.data?.http_status_code === 200 ||
          response.data?.http_status_code === 206
            ? "The Document is successfully verified."
            : "The provided Document could not be verified.",
        variant:
          response.data?.http_status_code === 200 ||
          response.data?.http_status_code === 206
            ? "default"
            : "destructive",
      });
      setCheckBox(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Your session has timed out. Please login again.",
          variant: "destructive",
        });
      } else if (error.response?.status === 503) {
        toast({
          title: "Source Down",
          description: "Internal Server Error - Source Down.",
          variant: "destructive",
        });
      } else {
        console.error(error);
        toast({
          title: "Error",
          description:
            error.response?.data?.error || error.response?.data?.message ||
            "An error occurred during verification.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Button
            variant="outline"
            className="mb-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>

          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">{icon}</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Verification</CardTitle>
            <CardDescription>
              Enter the document details below to verify
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerification} className="space-y-4">
              <div className="space-y-1">
                {verificationType !== "passport" &&
                  verificationType !== "mobileLookup" &&
                  verificationType !== "JobVerification" && 
                  verificationType !== "emailLookup" &&(
                    <>
                      <Label htmlFor="documentNumber">Document Number</Label>
                      <Input
                        id="documentNumber"
                        placeholder={placeholder}
                        value={documentNumber}
                        onChange={(e) =>
                          setDocumentNumber(e.target.value.toUpperCase())
                        }
                        pattern={pattern}
                        className="uppercase"
                        disabled={isLoading || verificationResult !== null}
                        autoFocus
                      />
                    </>
                  )}

                {verificationType === "dl" && (
                  <div className="mt-4 space-y-1">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      placeholder={dobPlaceholder}
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      pattern={dobPattern}
                      disabled={isLoading || verificationResult !== null}
                    />
                  </div>
                )}

                {verificationType === "passport" && (
                  <>
                    <div className="mt-4 space-y-1">
                      <Label htmlFor="fileNumber">File Number</Label>
                      <Input
                        id="fileNumber"
                        placeholder={fileNumberPlaceholder}
                        type="text"
                        value={fileNumber}
                        onChange={(e) => setFileNumber(e.target.value)}
                        pattern={fileNumberPattern}
                        disabled={isLoading || verificationResult !== null}
                      />
                    </div>
                    <div className="mt-4 space-y-1">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        placeholder={dobPlaceholder}
                        type="text"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        pattern={dobPattern}
                        disabled={isLoading || verificationResult !== null}
                      />
                    </div>
                    <div className="mt-4 space-y-1">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder={namePlaceholder}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        pattern={namePattern}
                        disabled={isLoading || verificationResult !== null}
                      />
                    </div>
                  </>
                )}

                {verificationType === "mobileLookup" && (
                  <>
                    <div className=" space-y-1">
                      <Label>Phone Number</Label>
                      <PhoneInput
                        country={"in"}
                        enableSearch={true}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        inputProps={{
                          className:
                            "w-full p-2 px-14 border border-gray-300 rounded",
                        }}
                        disabled={isLoading || verificationResult !== null}
                      />
                    </div>
                  </>
                )}

                {verificationType === "emailLookup" && (
                  <>
                    <div className=" space-y-1">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading || verificationResult !== null}
                      />
                    </div>
                  </>
                )}

                {verificationType === "JobVerification" && (
                  <>
                    <div className="space-y-1">
                      <Label className="mb-2 block">Select Option</Label>
                      <Select
                        onValueChange={(value) => setOption(value)}
                        disabled={isLoading || verificationResult !== null}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={option} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mobile">Mobile</SelectItem>
                          <SelectItem value="Pan">PAN</SelectItem>
                          <SelectItem value="NameAndDOB">
                            Name , DOB & Mobile
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1 mt-4">
                      {(() => {
                        switch (option) {
                          case "Mobile":
                            return (
                              <>
                                <div>
                                  <Label>Phone Number</Label>
                                  <Input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => {
                                      const input = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 10);
                                      if (
                                        input === "" ||
                                        /^[0-9]/.test(input)
                                      ) {
                                        setPhone(input);
                                      }
                                    }}
                                    placeholder=" Enter Your 10 Digit Phone Number Without Country Code"
                                    disabled={
                                      isLoading || verificationResult !== null
                                    }
                                  />
                                </div>
                              </>
                            );

                          case "Pan":
                            return (
                              <>
                                <div>
                                  <Label>PAN Number</Label>
                                  <Input
                                    type="text"
                                    placeholder="Enter PAN Number"
                                    value={pan}
                                    onChange={(e) => setPan(e.target.value)}
                                    pattern={jobVerificationPattern}
                                    disabled={
                                      isLoading || verificationResult !== null
                                    }
                                  />
                                </div>
                              </>
                            );
                          case "NameAndDOB":
                            return (
                              <>
                                <div>
                                  <Label>Full Name</Label>
                                  <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter Your Full Name"
                                    disabled={
                                      isLoading || verificationResult !== null
                                    }
                                  />
                                </div>

                                <div>
                                  <Label>Phone Number</Label>
                                  <Input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => {
                                      const input = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 10);
                                      if (
                                        input === "" ||
                                        /^[0-9]/.test(input)
                                      ) {
                                        setPhone(input);
                                      }
                                    }}
                                    placeholder=" Enter Your 10 Digit Phone Number Without Country Code"
                                    disabled={
                                      isLoading || verificationResult !== null
                                    }
                                  />
                                </div>

                                <div className="mt-4 space-y-1">
                                  <Label htmlFor="dob">Date of Birth</Label>
                                  <Input
                                    id="dob"
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    disabled={
                                      isLoading || verificationResult !== null
                                    }
                                  />
                                </div>
                              </>
                            );

                          default:
                            return (
                              <p className="text-gray-500">
                                Please select an option
                              </p>
                            );
                        }
                      })()}
                    </div>
                  </>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  This verification will deduct {credits} credits from your
                  account
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>All verifications are secure and private</span>
              </div>

              {checkBox ? (
                <div className="flex items-center max-sm:items-start gap-2 ">
                  {" "}
                  <Checkbox
                    checked={isDisable === null}
                    onClick={handleCheckBox}
                    className="text-black max-md:mt-1.5 mt-[0.2rem]"
                  />
                  <div className="text-sm ">
                    I confirm that I have obtained the user's consent for this
                    particular mode of verification for regulatory purpose.
                  </div>
                </div>
              ) : (
                <></>
              )}

              <Button
                type="submit"
                className="w-full kyc-btn-primary"
                disabled={isLoading || verificationResult || isDisable !== null}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Document"
                )}
              </Button>
            </form>

            {verificationResult && (
              <Card className="mt-4">
                <div className="container mx-auto p-4">
                  <h1 className="text-xl font-bold mb-4">Document Details</h1>

                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="w-full md:w-1/2 shadow-md rounded-lg p-4 bg-white">
                      <h2 className="text-lg font-semibold mb-2">
                        Details Response
                      </h2>
                      <table className="w-full border border-gray-300">
                        {(() => {
                          switch (verificationType) {
                            case "pan":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.full_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Pan
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.pan || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Type
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.pan_type || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-2 font-medium bg-gray-100">
                                      Status
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.pan_status || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              );

                            case "gstin":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Trade Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.trade_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Legal Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.legal_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Entity Type
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.entity_type || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      GSTIN Number
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Registration Status
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.registration_status || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Registration Date
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.registration_date || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Address
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.place_of_business || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      E-Invoice Mandatory
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.e_invoice_mandatory || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Central Jurisdiction
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.central_jurisdiction || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      State Jurisdiction
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.gstin_details
                                        ?.state_jurisdiction || "N/A"}
                                    </td>
                                  </tr>

                                  {/* Business Owners Section */}
                                  <tr className="border-b">
                                    <td
                                      colSpan={2}
                                      className="p-2 font-bold bg-gray-200 text-center"
                                    >
                                      Business Owners
                                    </td>
                                  </tr>
                                  {verificationResult?.result?.business_owners
                                    ?.length > 0 ? (
                                    verificationResult?.result?.business_owners?.map(
                                      (owner: string, index: number) => (
                                        <tr
                                          key={`owner-${index}`}
                                          className="border-b"
                                        >
                                          <td className="p-2 font-medium bg-gray-100">
                                            Owner {index + 1}
                                          </td>
                                          <td className="p-2">{owner}</td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr className="border-b">
                                      <td className="p-2 font-medium bg-gray-100">
                                        Business Owners
                                      </td>
                                      <td className="p-2">N/A</td>
                                    </tr>
                                  )}

                                  {/* Other GSTINs Section */}
                                  <tr className="border-b">
                                    <td
                                      colSpan={2}
                                      className="p-2 font-bold bg-gray-200 text-center"
                                    >
                                      Other GSTINs
                                    </td>
                                  </tr>
                                  {verificationResult?.result?.other_gstin
                                    ?.length > 0 ? (
                                    verificationResult?.result?.other_gstin?.map(
                                      (gstin: string, index: number) => (
                                        <tr
                                          key={`gstin-${index}`}
                                          className="border-b"
                                        >
                                          <td className="p-2 font-medium bg-gray-100">
                                            GSTIN {index + 1}
                                          </td>
                                          <td className="p-2">{gstin}</td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <tr className="border-b">
                                      <td className="p-2 font-medium bg-gray-100">
                                        Other GSTINs
                                      </td>
                                      <td className="p-2">N/A</td>
                                    </tr>
                                  )}

                                  {/* Returns Filing History - Categorized by Return Type */}
                                  <tr className="border-b">
                                    <td
                                      colSpan={2}
                                      className="p-2 font-bold bg-gray-200 text-center"
                                    >
                                      Return Filing History
                                    </td>
                                  </tr>
                                  <tr className="bg-gray-100">
                                    <td colSpan={2}>
                                      {verificationResult?.result?.returns && (
                                        <div className="space-y-4">
                                          {Object.entries(
                                            verificationResult.result.returns.reduce(
                                              (acc: any, curr: any) => {
                                                const type =
                                                  curr.return_type || "Other";
                                                if (!acc[type]) {
                                                  acc[type] = [];
                                                }
                                                acc[type].push(curr);
                                                return acc;
                                              },
                                              {}
                                            )
                                          ).map(
                                            ([returnType, returns]: [
                                              string,
                                              any
                                            ]) => (
                                              <div
                                                key={returnType}
                                                className="mb-4"
                                              >
                                                <div className="bg-gray-300 p-2 font-semibold text-center">
                                                  {returnType} Returns
                                                </div>
                                                <table className="w-full">
                                                  <thead>
                                                    <tr>
                                                      <th className="p-2 text-left w-1/3">
                                                        Financial Year
                                                      </th>
                                                      <th className="p-2 text-left w-1/3">
                                                        Filing Date
                                                      </th>
                                                      <th className="p-2 text-left w-1/3">
                                                        Period
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {returns.map(
                                                      (
                                                        returnItem: any,
                                                        index: number
                                                      ) => (
                                                        <tr
                                                          key={`${returnType}-${index}`}
                                                          className={
                                                            index % 2 === 0
                                                              ? "bg-white"
                                                              : "bg-gray-50"
                                                          }
                                                        >
                                                          <td className="p-2">
                                                            {returnItem.fy ||
                                                              "N/A"}
                                                          </td>
                                                          <td className="p-2">
                                                            {returnItem.filling_date ||
                                                              "N/A"}
                                                          </td>
                                                          <td className="p-2">
                                                            {returnItem.period ||
                                                              "N/A"}
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              );

                            case "aadhaar":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Aadhaar Link Status
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.aadhaar_link_status || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Pan
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.pan || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              );

                            case "voter":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.full_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Age
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.age || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      State Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.address?.state_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      District Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.address?.district_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Gender
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.gender || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Parliamentary Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.parliamentary_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Assembly Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.assembly_name || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              );
                            case "vehicle":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.owner_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      State Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.current_state_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      District Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.permanent_district_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      RTO Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.office_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Vehicle Class
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.vehicle_class_desc || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Model
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.model || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-2 font-medium bg-gray-100">
                                      Color
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.color || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              );
                            case "dl":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.full_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Dob
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.dob || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Address
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.address.full_address || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      RTO Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.rto_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Issue Date
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.issue_date || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Renewal Date
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.renewal_date || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Gender
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.gender || "N/A"}
                                    </td>
                                  </tr>
                                  {verificationResult?.result?.result
                                    ?.user_photo && (
                                    <tr>
                                      <td className="p-2 font-medium bg-gray-100">
                                        User Photo
                                      </td>
                                      <td className="p-2">
                                        {verificationResult?.result?.result
                                          ?.user_photo && (
                                          <img
                                            src={`data:image/jpeg;base64,${verificationResult.result.result.user_photo}`}
                                            alt="User Photo"
                                            className="max-w-[200px] rounded-md shadow-sm"
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              );
                            case "passport":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      First Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.first_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Last Name
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.last_name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Passport Number
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.passport_number || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Application Type
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.application_type || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Application Date
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.application_date || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Date OF Dispatch
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.date_of_dispatch || "N/A"}
                                    </td>
                                  </tr>
                                </tbody>
                              );
                            case "mobileLookup":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Apple
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.apple
                                        ?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Amazon
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.amazon?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Instagram
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.instagram?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Twitter
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.twitter?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Facebook
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.facebook?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Whatsapp
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.whatsapp?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Whatsapp Business Account
                                    </td>
                                    <td className="p-2">
                                      {!verificationResult?.result?.result
                                        ?.whatsapp
                                        ? "N/A"
                                        : verificationResult.result.result.whatsapp.is_business.toString() ===
                                          "false"
                                        ? "No Business Account Detected"
                                        : verificationResult.result.result.whatsapp.is_business.toString()}
                                    </td>
                                  </tr>

                                  {verificationResult?.result?.result?.whatsapp
                                    ?.profile_picture && (
                                    <tr className="border-b ">
                                      <td className="p-2 font-medium bg-gray-100">
                                        User Photo
                                      </td>
                                      <td className="p-2">
                                        {verificationResult?.result?.result
                                          ?.whatsapp?.profile_picture && (
                                          <img
                                            src={`${verificationResult?.result?.result?.whatsapp?.profile_picture}`}
                                            alt="User Photo"
                                            className="max-w-[200px] rounded-md shadow-sm"
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  )}

                                  {verificationResult?.result?.result?.whatsapp
                                    ?.is_business === true && (
                                    <tr className="border-b">
                                      <td className="p-2 font-medium bg-gray-100">
                                        Whatsapp Business Name
                                      </td>
                                      <td className="p-2">
                                        {verificationResult?.result?.result
                                          ?.whatsapp?.business_name || "N/A"}
                                      </td>
                                    </tr>
                                  )}

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Flipkart
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.flipkart?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Paytm
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.paytm
                                        ?.message || "N/A"}
                                    </td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Social Media Score
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.confidence_scores?.social_media_score.toString() ||
                                        "N/A"}{" "}
                                      {"%"}
                                    </td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Ecommerce Score
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.confidence_scores?.ecommerce_score.toString() ||
                                        "N/A"}{" "}
                                      {"%"}
                                    </td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Payment Score
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.confidence_scores?.payment_score.toString() ||
                                        "N/A"}{" "}
                                      {"%"}
                                    </td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-green-300  ">
                                      Confidence Score
                                    </td>
                                    <td className="p-2 bg-green-200 ">
                                      {verificationResult?.result?.result?.confidence_scores?.confidence_score.toString() ||
                                        "N/A"}{" "}
                                      {"%"}
                                    </td>
                                  </tr>
                                </tbody>
                              );

                            case "emailLookup":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Apple
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.apple
                                        ?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Amazon
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.amazon?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Instagram
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.instagram?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Twitter
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.twitter?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Facebook
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.facebook?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Whatsapp
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.whatsapp?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Whatsapp Business Account
                                    </td>
                                    <td className="p-2">
                                      {!verificationResult?.result?.result
                                        ?.whatsapp
                                        ? "N/A"
                                        : verificationResult.result.result.whatsapp.is_business.toString() ===
                                          "false"
                                        ? "No Business Account Detected"
                                        : verificationResult.result.result.whatsapp.is_business.toString()}
                                    </td>
                                  </tr>

                                  {verificationResult?.result?.result?.whatsapp
                                    ?.profile_picture && (
                                    <tr className="border-b ">
                                      <td className="p-2 font-medium bg-gray-100">
                                        User Photo
                                      </td>
                                      <td className="p-2">
                                        {verificationResult?.result?.result
                                          ?.whatsapp?.profile_picture && (
                                          <img
                                            src={`${verificationResult?.result?.result?.whatsapp?.profile_picture}`}
                                            alt="User Photo"
                                            className="max-w-[200px] rounded-md shadow-sm"
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  )}

                                  {verificationResult?.result?.result?.whatsapp
                                    ?.is_business === true && (
                                    <tr className="border-b">
                                      <td className="p-2 font-medium bg-gray-100">
                                        Whatsapp Business Name
                                      </td>
                                      <td className="p-2">
                                        {verificationResult?.result?.result
                                          ?.whatsapp?.business_name || "N/A"}
                                      </td>
                                    </tr>
                                  )}

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Flipkart
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result
                                        ?.flipkart?.message || "N/A"}
                                    </td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Paytm
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.paytm
                                        ?.message || "N/A"}
                                    </td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Social Media Score
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.confidence_scores?.social_media_score.toString() ||
                                        "N/A"}{" "}
                                      {"%"}
                                    </td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Ecommerce Score
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.confidence_scores?.ecommerce_score.toString() ||
                                        "N/A"}{" "}
                                      {"%"}
                                    </td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Payment Score
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.result?.confidence_scores?.payment_score.toString() ||
                                        "N/A"}{" "}
                                      {"%"}
                                    </td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-green-300  ">
                                      Confidence Score
                                    </td>
                                    <td className="p-2 bg-green-200 ">
                                      {verificationResult?.result?.result?.confidence_scores?.confidence_score.toString() ||
                                        "N/A"}{" "}
                                      {"%"}
                                    </td>
                                  </tr>
                                </tbody>
                              );
                            case "JobVerification":
                              return (
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2 font-medium bg-gray-100">
                                      Message
                                    </td>
                                    <td className="p-2">
                                      {verificationResult?.result?.message ||
                                        "N/A"}
                                    </td>
                                  </tr>

                                  {verificationResult?.result?.result
                                    ?.summary && (
                                    <>
                                      <tr className="border-b">
                                        <td className="p-2 font-medium bg-gray-100">
                                          Total UAN Found
                                        </td>
                                        <td className="p-2">
                                          {verificationResult?.result?.result
                                            ?.summary?.uan_count || "N/A"}
                                        </td>
                                      </tr>
                                      <tr className="border-b w-[100%]">
                                        <td
                                          className="p-2 font-medium bg-gray-200 text-center"
                                          colSpan={2}
                                        >
                                          Summary
                                        </td>
                                      </tr>
                                      <tr className="border-b">
                                        <td className="p-2 font-medium bg-gray-100">
                                          Establishment ID
                                        </td>
                                        <td className="p-2">
                                          {verificationResult?.result?.result
                                            ?.summary?.recent_employer_data
                                            .establishment_id || "N/A"}
                                        </td>
                                      </tr>
                                      <tr className="border-b">
                                        <td className="p-2 font-medium bg-gray-100">
                                          Date Of Exit
                                        </td>
                                        <td className="p-2">
                                          {verificationResult?.result?.result
                                            ?.summary?.recent_employer_data
                                            ?.date_of_exit || "N/A"}
                                        </td>
                                      </tr>
                                      <tr className="border-b">
                                        <td className="p-2 font-medium bg-gray-100">
                                          Date Of Joining
                                        </td>
                                        <td className="p-2">
                                          {verificationResult?.result?.result
                                            ?.summary?.recent_employer_data
                                            ?.date_of_joining || "N/A"}
                                        </td>
                                      </tr>
                                      <tr className="border-b">
                                        <td className="p-2 font-medium bg-gray-100">
                                          Establishment Name
                                        </td>
                                        <td className="p-2">
                                          {verificationResult?.result?.result
                                            ?.summary?.recent_employer_data
                                            ?.establishment_name || "N/A"}
                                        </td>
                                      </tr>
                                      <tr className="border-b">
                                        <td className="p-2 font-medium bg-gray-100">
                                          Is Employed
                                        </td>
                                        <td className="p-2">
                                          {verificationResult?.result?.result
                                            ?.summary?.is_employed === true ? (
                                            <TiTick className="text-green-500 text-3xl" />
                                          ) : (
                                            <ImCross className="text-red-500" />
                                          )}
                                        </td>
                                      </tr>

                                      <tr className="border-b">
                                        <td className="p-2 font-medium bg-gray-100">
                                          Recent UAN
                                        </td>
                                        <td className="p-2">
                                          {verificationResult?.result?.result
                                            ?.summary?.matching_uan || "N/A"}
                                        </td>
                                      </tr>
                                      <tr className=" w-[100%]">
                                        <td
                                          className="p-2 font-medium  text-center"
                                          colSpan={2}
                                        ></td>
                                      </tr>
                                      <tr className="border-b w-[100%]">
                                        <td
                                          className="p-2 font-medium bg-gray-200 text-center"
                                          colSpan={2}
                                        >
                                          UAN details
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                  {verificationResult?.result?.result
                                    ?.uan_details &&
                                    Object.entries(
                                      verificationResult?.result?.result
                                        ?.uan_details
                                    ).map(([uan, details]: [string, any]) => (
                                      <>
                                        <tr className="border-b w-[100%]">
                                          <td
                                            className="p-2 font-medium bg-gray-300 text-center"
                                            colSpan={2}
                                          >
                                            Basic details
                                          </td>
                                        </tr>
                                        <tr className="border-b">
                                          <td className="p-2 font-medium bg-green-300">
                                            UAN
                                          </td>
                                          <td className="p-2 bg-green-200">
                                            {uan || "N/A"}
                                          </td>
                                        </tr>

                                        <tr className="border-b">
                                          <td className="p-2 font-medium bg-gray-100">
                                            Name
                                          </td>
                                          <td className="p-2">
                                            {details?.basic_details?.name ||
                                              "N/A"}
                                          </td>
                                        </tr>

                                        <tr className="border-b">
                                          <td className="p-2 font-medium bg-gray-100">
                                            Gender
                                          </td>
                                          <td className="p-2">
                                            {details?.basic_details?.gender ||
                                              "N/A"}
                                          </td>
                                        </tr>
                                        <tr className="border-b">
                                          <td className="p-2 font-medium bg-gray-100">
                                            Date Of Birth
                                          </td>
                                          <td className="p-2">
                                            {details?.basic_details
                                              ?.date_of_birth || "N/A"}
                                          </td>
                                        </tr>

                                        <tr className="border-b w-[100%]">
                                          <td
                                            className="p-2 font-medium bg-gray-300 text-center"
                                            colSpan={2}
                                          >
                                            Employment Details
                                          </td>
                                        </tr>

                                        <tr className="border-b">
                                          <td className="p-2 font-medium bg-gray-100">
                                            Establishment ID
                                          </td>
                                          <td className="p-2">
                                            {details?.employment_details
                                              ?.establishment_id || "N/A"}
                                          </td>
                                        </tr>

                                        <tr className="border-b">
                                          <td className="p-2 font-medium bg-gray-100">
                                            Date Of Exit
                                          </td>
                                          <td className="p-2">
                                            {details?.employment_details
                                              ?.date_of_exit || "N/A"}
                                          </td>
                                        </tr>
                                        <tr className="border-b">
                                          <td className="p-2 font-medium bg-gray-100">
                                            Date Of Joining
                                          </td>
                                          <td className="p-2">
                                            {details?.employment_details
                                              ?.date_of_joining || "N/A"}
                                          </td>
                                        </tr>
                                        <tr className="border-b">
                                          <td className="p-2 font-medium bg-gray-100">
                                            Establishment Name
                                          </td>
                                          <td className="p-2">
                                            {details?.employment_details
                                              ?.establishment_name || "N/A"}
                                          </td>
                                        </tr>
                                        <tr className=" w-[100%]">
                                          <td
                                            className="p-2 font-medium  text-center"
                                            colSpan={2}
                                          ></td>
                                        </tr>
                                      </>
                                    ))}
                                </tbody>
                              );

                            default:
                              return (
                                <tbody>
                                  <tr>
                                    <td className="p-2">No data available</td>
                                  </tr>
                                </tbody>
                              );
                          }
                        })()}
                      </table>
                    </div>

                    <div className="w-full md:w-1/2 shadow-md rounded-lg p-4 bg-gray-50">
                      <h2 className="text-lg font-semibold mb-2">
                        Full API Response
                      </h2>
                      <SyntaxHighlighter
                        language="json"
                        style={atomDark}
                        className="rounded-md p-2 overflow-y-auto max-h-[600px] text-xs"
                      >
                        {JSON.stringify(verificationResult, null, 2)}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {verificationResult && (
              <div
                className={`mt-6 p-4 rounded-lg ${
                  verificationResult?.http_status_code === 200 ||
                  verificationResult?.http_status_code === 206
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {verificationResult?.http_status_code === 200 ||
                  verificationResult?.http_status_code === 206 ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h3
                      className={`font-medium ${
                        verificationResult?.http_status_code === 200 ||
                        verificationResult?.http_status_code === 206
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {verificationResult?.http_status_code === 200 ||
                      verificationResult?.http_status_code === 206
                        ? "Verification Successful"
                        : "Verification Failed"}
                    </h3>
                    <p
                      className={`text-sm ${
                        verificationResult?.http_status_code === 200 ||
                        verificationResult?.http_status_code === 206
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {verificationResult?.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setDocumentNumber("");
                setDob("");
                setVerificationResult(null);
                setCheckBox(true);
                setIsDisable(true);
                window.location.reload();
              }}
              disabled={isLoading}
            >
              Reset Form
            </Button>

            <Button
              onClick={() => navigate("/verification-history")}
              disabled={isLoading}
            >
              View History
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerificationForm;
