import React, { useEffect, useState } from "react";
import { useNavigate, Link, useActionData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  CreditCard,
  FileText,
  Search,
  Clock,
  Plus,
  BarChart,
  Check,
  X,
} from "lucide-react";
import LogoutNavbar from "@/components/Layout/LogoutNavbar";
import { LineChartUi } from "@/components/dashboard/LineChart";
import { PieChartUi } from "@/components/dashboard/PieChart";
import { dashboardApi } from "@/apis/modules/dashboard";
import { CiMobile3 } from "react-icons/ci";

function formatISTDate(istDateStr) {
  const date = new Date(istDateStr);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  //to set total daily api calls
  const [panCalls, setPanCalls] = useState(0);
  const [aadhaarCalls, setAaadhaarCalls] = useState(0);
  const [rcCalls, setRcCalls] = useState(0);
  const [voterCalls, setVoterCalls] = useState(0);
  const [dlCalls, setDlCalls] = useState(0);
  const [passportCalls, setPassortCalls] = useState(0);
  const [monthlyCall, setMonthlyCall] = useState(0);
  const [mobileLookup, setMobileLookup] = useState(0);
  const [emailLookup, setEmailLookup] = useState(0);
  const [jobVerification, setJobVerification] = useState(0);
  const [gstinCalls, setGstinCalls] = useState(0);

  const [topHistory, setTopHistory] = useState([]);

  //pending credits of user
  const [credits, setCredits] = useState(0);

  //getting current date
  const currentDate = new Date().toISOString().split("T")[0];

  //total credit used daily in pon,rc,dl e.t.c
  const [dailyCredit, setDailyCredit] = useState(0);

  const [isloading, setIsLoading] = useState(true);

  //fetching pending credits
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardApi.getCredits();
        setCredits(response.data.result.pending_credits);
      } catch (err) {
        console.log("error in fetching dashboard");
      }
    };
    fetchData();
  }, []);

  //fetching monthly credits
  useEffect(() => {
    const fetchMonthly = async () => {
      const response = await dashboardApi.getMonthlyCredits();
      setMonthlyCall(response.data.result.total_amount);
    };

    fetchMonthly();
  }, []);

  //fetching history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await dashboardApi.getVerificationHistory(1);
        // console.log(response.data.result.ledger_transactions)

        const responseData = response.data.result.ledger_transactions.slice(
          0,
          3
        );
        //formatting the incoming data
        const historyData = responseData.map((item) => {
          const date = formatISTDate(item.created_at);

          if (item.type !== "CREDIT") {
            const [found, details] = item.description.split("|");
            const type = item.type.split("_");
            return {
              ...item,
              type: type[1],
              created_at: date,
              found: found,
              description: details,
            };
          } else {
            return { ...item, created_at: date, found: "CREDITED" };
          }
        });

        setTopHistory(historyData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistory();
  }, []);

  //for total credits used
  useEffect(() => {
    setIsLoading(true);
    const fetchDailyCredit = async () => {
      try {
        //storing responses for fetching date wise api calls
        const responsePAN = await dashboardApi.getWeeklyCreditUsage(`KYC_PAN`);
        const responseGSTIN = await dashboardApi.getWeeklyCreditUsage(
          `KYB_GSTIN`
        );
        const responseRC = await dashboardApi.getWeeklyCreditUsage(`KYC_RC`);
        const responseDL = await dashboardApi.getWeeklyCreditUsage(`KYC_DL`);
        const responsePASSPORT = await dashboardApi.getWeeklyCreditUsage(
          `KYC_PASSPORT`
        );
        const responseVOTER = await dashboardApi.getWeeklyCreditUsage(
          `KYC_VOTER`
        );
        const responseAADHAAR = await dashboardApi.getWeeklyCreditUsage(
          `KYC_AADHAAR`
        );
        const responseMobileLookup = await dashboardApi.getWeeklyCreditUsage(
          `KYC_MOBILE_LOOKUP`
        );
        const responseEmailLookup = await dashboardApi.getWeeklyCreditUsage(
          `KYC_EMAIL_LOOKUP`
        );
        
        const responseJobVerification = await dashboardApi.getWeeklyCreditUsage(
          `EV_EMPLOYMENT_LATEST`
        );
        //storing total amount spend today

        const jobVerificationCredits: number =
          responseJobVerification.data.result.find(
            (item) => item.date === currentDate
          )?.total_amount || 0;
        const mobileLookupCredits: number =
          responseMobileLookup.data.result.find(
            (item) => item.date === currentDate
          )?.total_amount || 0;
        const emailLookupCredits: number =
          responseEmailLookup.data.result.find(
            (item) => item.date === currentDate
          )?.total_amount || 0;
          console.log(emailLookupCredits)
        const panCredits: number =
          responsePAN.data.result.find((item) => item.date === currentDate)
            ?.total_amount || 0;

        const gstinCredits: number =
          responseGSTIN.data.result.find((item) => item.date === currentDate)
            ?.total_amount || 0;
        const rcCredits: number =
          responseRC.data.result.find((item) => item.date === currentDate)
            ?.total_amount || 0;
        const dlCredits: number =
          responseDL.data.result.find((item) => item.date === currentDate)
            ?.total_amount || 0;
        const passportCredits: number =
          responsePASSPORT.data.result.find((item) => item.date === currentDate)
            ?.total_amount || 0;
        const voterCredits: number =
          responseVOTER.data.result.find((item) => item.date === currentDate)
            ?.total_amount || 0;
        const aadhaarCredits: number =
          responseAADHAAR.data.result.find((item) => item.date === currentDate)
            ?.total_amount || 0;
        //setting daily api calls for pan,dl ....
        setPanCalls(
          responsePAN.data.result.find((item) => item.date === currentDate)
            ?.count || 0
        );
        setGstinCalls(
          responseGSTIN.data.result.find((item) => item.date === currentDate)
            ?.count || 0
        );

        setMobileLookup(
          responseMobileLookup.data.result.find(
            (item) => item.date === currentDate
          )?.count || 0
        );
        setEmailLookup(
          responseEmailLookup.data.result.find(
            (item) => item.date === currentDate
          )?.count || 0
        );
        setRcCalls(
          responseRC.data.result.find((item) => item.date === currentDate)
            ?.count || 0
        );
        setDlCalls(
          responseDL.data.result.find((item) => item.date === currentDate)
            ?.count || 0
        );
        setPassortCalls(
          responsePASSPORT.data.result.find((item) => item.date === currentDate)
            ?.count || 0
        );
        setVoterCalls(
          responseVOTER.data.result.find((item) => item.date === currentDate)
            ?.count || 0
        );
        setAaadhaarCalls(
          responseAADHAAR.data.result.find((item) => item.date === currentDate)
            ?.count || 0
        );
        setJobVerification(
          responseJobVerification.data.result.find(
            (item) => item.date === currentDate
          )?.count || 0
        );
        //setting total credits spend today
        setDailyCredit(
          panCredits +
            gstinCredits +
            rcCredits +
            dlCredits +
            passportCredits +
            voterCredits +
            aadhaarCredits +
            mobileLookupCredits +
            jobVerificationCredits +
            emailLookupCredits
        );
        setIsLoading(false);
      } catch (err) {
        console.log("error in fetching dashboard");
        setIsLoading(false);
      }
    };
    fetchDailyCredit();
  }, []);

  // Simulated data - in a real app, this would come from your API
  const creditBalance = credits;

  const verificationMethods = [
    // {
    //   id: "gstin-verification",
    //   name: "GSTIN Verification",
    //   description: "Verify GSTIN Number",
    //   icon: <FileText className="h-8 w-8 text-kycfabric-gold" />,
    //   credits: 0.5,
    // },

    {
      id: "job-history-verification",
      name: "Job History Verification",
      description: "Verify Employement History Status",
      icon: <CreditCard className="h-8 w-8 text-kycfabric-gold" />,
      credits: 10,
    },
  ];

  const dailyVerification = [
    {
      id: "pan",
      name: "PAN Verification",
      dailyCalls: panCalls,
      description: "Verify PAN",
      icon: <FileText className="h-8 w-8 text-kycfabric-gold" />,
      credits: 2,
    },

    {
      id: "gstin",
      name: "GSTIN Verification",
      dailyCalls: gstinCalls,
      description: "Verify GSTIN",
      icon: <FileText className="h-8 w-8 text-kycfabric-gold" />,
      credits: 2,
    },

    {
      id: "aadhaar",
      name: "Aadhaar Verification",
      dailyCalls: aadhaarCalls,
      description: "Verify Aadhaar",
      icon: <CreditCard className="h-8 w-8 text-kycfabric-gold" />,
      credits: 1,
    },
    {
      id: "voter",
      name: "Voter Verfication",
      dailyCalls: voterCalls,
      description: "Verify Voter ",
      icon: <CreditCard className="h-8 w-8 text-kycfabric-gold" />,
      credits: 5,
    },
    {
      id: "vehicle",
      name: "Vehicle RC Verification",
      dailyCalls: rcCalls,
      description: "Verify Vehicle RC",
      icon: <FileText className="h-8 w-8 text-kycfabric-gold" />,
      credits: 7.5,
    },
    {
      id: "passport",
      name: "Passport Verification",
      dailyCalls: passportCalls,
      description: "Verify Passport",
      icon: <CreditCard className="h-8 w-8 text-kycfabric-gold" />,
      credits: 5,
    },
    {
      id: "dl",
      name: "Driving License Verification",
      dailyCalls: dlCalls,
      description: "Verify Driving License",
      icon: <FileText className="h-8 w-8 text-kycfabric-gold" />,
      credits: 5,
    },
    {
      id: "mobileLookup",
      name: "Mobile Look Up Verification",
      dailyCalls: mobileLookup,
      description: "Verify Mobile Lookup ",
      icon: (
        <CiMobile3
          className="h-8 w-8 text-kycfabric-gold "
          style={{ strokeWidth: 1 }}
        />
      ),
      credits: 6,
    },
    {
      id: "emailLookup",
      name: "Email Look Up Verification",
      dailyCalls: emailLookup,
      description: "Verify Email Lookup ",
      icon: <FileText className="h-8 w-8 text-kycfabric-gold" />,
      credits: 6,
    },
    {
      id: "JobVerification",
      name: "Employment Verification",
      dailyCalls: jobVerification,
      description: "Verify Employment Status ",
      icon: <FileText className="h-8 w-8 text-kycfabric-gold" />,
      credits: 7,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <LogoutNavbar />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your KYC verifications and credits
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/verification-history")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Verification</span> History
              </Button>
              {/* <Button
                onClick={() => navigate("/credit-purchase")}
                className="kyc-btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Buy Credits
              </Button> */}
            </div>
          </div>

          {/* Credit Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { ease: "easeIn", duration: 0.8 },
            }}
            className="flex max-sm:flex-col w-[100%]"
          >
            {isloading ? (
              <div className="flex justify-center items-center h-screen w-[100%]">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <Card className="w-[70%] max-sm:w-[100%] max-sm:rounded-b-none rounded-r-none">
                  <div className="flex justify-between max-sm:block">
                    <CardHeader className="pb-3 max-sm:pb-0">
                      <CardTitle className="text-xl">Credit Balance</CardTitle>

                      <CardDescription>
                        Your available verification credits
                      </CardDescription>
                    </CardHeader>
                  </div>

                  <CardContent>
                    <div className="flex items-center">
                      <div>
                        <div className="text-3xl font-bold">
                          {creditBalance}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available Credits
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {/* <CardFooter className="pt-0">
                    <Button
                      onClick={() => navigate("/credit-purchase")}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Purchase more credits
                    </Button>
                  </CardFooter> */}
                </Card>
                <div className="w-[30%] max-sm:w-[100%] max-sm:flex">
                  <div
                    className="bg-yellow-50 rounded-tr-lg justify-center p-0 flex flex-col items-center h-[50%] max-sm:w-[50%] max-sm:h-[100px] max-sm:rounded-bl-lg max-sm:rounded-none"
                    style={{ border: "1px solid hsl(45, 100%, 50%)" }}
                  >
                    <div className=" hover:bg-transparent max-sm:text-sm">
                      Daily Credit Used{" "}
                    </div>
                    <span className="text-xl text-muted-foreground">
                      {"  "}
                      {dailyCredit}
                    </span>
                  </div>

                  <div
                    className="bg-yellow-50 rounded-br-lg justify-center p-0 flex flex-col items-center h-[50%] max-sm:w-[50%] max-sm:h-[100px] max-sm:rounded-none max-sm:rounded-br-lg "
                    style={{ border: "1px solid hsl(45, 100%, 50%)" }}
                  >
                    <div className=" hover:bg-transparent max-sm:text-sm">
                      Monthly Credit Used{" "}
                    </div>
                    <span className="text-xl text-muted-foreground">
                      {"  "}
                      {monthlyCall}
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/*Analytics of api usage*/}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { ease: "easeIn", duration: 1 },
            }}
            className="display flex gap-4 max-sm:flex-col"
          >
            {/*pie chart ui*/}
            <PieChartUi />
            {/*Line chart section */}
            <LineChartUi />
          </motion.div>

          {/*daily credit usage and api usage section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Verification Methods</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dailyVerification.map((method) => (
                <Card
                  key={method.id}
                  className="hover:border-primary relative transition-all min-h-[280px] overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/verification-form/${method.id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      {method.icon}
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {method.credits} credits
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">
                      {method.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col justify-between gap-4 md:gap-6 pb-[90px]">
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-0 text-primary hover:text-primary hover:bg-transparent"
                      onClick={() =>
                        navigate(`/verification-form/${method.id}`)
                      }
                    >
                      Start verification →
                    </Button>
                  </CardContent>

                  <div className="absolute bottom-0 left-0 w-full bg-yellow-50 border-t border-yellow-400 grid grid-cols-2 h-[80px]">
                    <div
                      className="flex flex-col justify-center items-center border-r border-yellow-400 rounded-bl-lg"
                      style={{ border: "1px solid hsl(45, 100%, 50%)" }}
                    >
                      <div className="text-[12px] font-medium">Daily Calls</div>
                      <span className="text-lg text-muted-foreground">
                        {" "}
                        {method.dailyCalls}
                      </span>
                    </div>

                    <div
                      className="flex flex-col justify-center items-center rounded-br-lg"
                      style={{ border: "1px solid hsl(45, 100%, 50%)" }}
                    >
                      <div className="text-[12px] font-medium whitespace-nowrap">
                        Daily Credit Used{" "}
                      </div>
                      <span className="text-lg text-muted-foreground">
                        {" "}
                        {method.dailyCalls * method.credits}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Verification Methods Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Upcoming Verification Methods
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {verificationMethods.map((method) => (
                <Card
                  key={method.id}
                  className="hover:border-primary transition-all cursor-pointer"
                  onClick={() => {
                    navigate(`/${method.id}`);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      {method.icon}
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {method.credits} credits
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">
                      {method.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-0 text-primary hover:text-primary hover:bg-transparent"
                    >
                      Start verification →
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Verifications */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Recent Verifications</h2>
              <Button
                variant="link"
                className="text-primary"
                onClick={() => navigate("/verification-history")}
              >
                View all →
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Type</th>
                        <th className="text-left p-4 font-medium">Document</th>
                        <th className="text-left p-4 font-medium">
                          Date & Time
                        </th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topHistory.map((verification, index) => (
                        <tr
                          key={`${verification.documentNumber}-${index}}`}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4">{verification.type}</td>
                          <td className="p-4">{verification.description}</td>
                          <td className="p-4">{verification.created_at}</td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                verification.found === "FOUND" ||
                                verification.found === "CREDITED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {verification.found === "FOUND" ||
                              verification.found === "CREDITED" ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  {verification.found}
                                </>
                              ) : (
                                <>
                                  <X className="h-3 w-3 mr-1" />
                                  NOT FOUND
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-4">
                            {verification.found !== "CREDITED" ? (
                              <span className="text-red-600">
                                {verification.amount}
                              </span>
                            ) : (
                              <span className="text-green-600">
                                +{verification.amount}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {topHistory.length === 0 && (
                  <div className="p-8 text-center">
                    <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium text-lg mb-1">
                      No verifications yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't performed any verifications yet.
                    </p>
                    <Button
                      onClick={() => navigate("/verification-form/pan")}
                      className="kyc-btn-primary"
                    >
                      Start your first verification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
