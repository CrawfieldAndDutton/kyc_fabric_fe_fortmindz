import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { dashboardApi } from "@/apis/modules/dashboard";



export function PieChartUi() {

  
  const [panCall , setPanCall] = useState(0);
  const [gstinCalls, setGstinCalls] = useState(0);
  const [dlCall , setdlCall] = useState(0);
  const [aadhaarCall , setAadhaarCall] = useState(0);
  const [passportCall , setPassportCall] = useState(0);
  const [rcCall , setRcCall] = useState(0);
  const [voterCall , setVoterCall] = useState(0);
  const [mobileLookupCall,setMobileLookupCall] = useState(0);
  const [emailLookupCall,setEmailLookupCall] = useState(0);
  const [jobVerificationCall,setJobVerificationCall] = useState(0);
  const [isloading,setIsLoading] = useState(true)
  
  


  //used to get the data whenever the user comes to dashboard
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await dashboardApi.getTotalCredits();
        setPanCall(response.data.result?.KYC_PAN || null)
        setGstinCalls(response.data.result?.KYB_GSTIN || null)
        setdlCall(response.data.result?.KYC_DL || null)
        setAadhaarCall(response.data.result?.KYC_AADHAAR || null)
        setPassportCall(response.data.result?.KYC_PASSPORT || null)
        setVoterCall(response.data.result?.KYC_VOTER || null)
        setRcCall(response.data.result?.KYC_RC || null)
        setMobileLookupCall(response.data.result?.KYC_MOBILE_LOOKUP || null)
        setEmailLookupCall(response.data.result?.KYC_EMAIL_LOOKUP || null)
        setJobVerificationCall(response.data.result?.EV_EMPLOYMENT_LATEST || null)
        
        setIsLoading(false);
      } catch (err) {
        console.log("error in fetching dashboard")
        setIsLoading(false);
      } 
    };
    fetchData();
    
  }, []);
  
  const dashboardData = [
    { type: "PAN", calls: panCall },
    { type: "GSTIN", calls: gstinCalls },
    { type: "VOTER", calls:  voterCall },
    { type: "AADHAAR", calls: aadhaarCall },
    { type: "RC", calls: rcCall },
    { type: "PASSPORT", calls: passportCall },
    { type: "DRIVING LICENSE", calls: dlCall },
    { type: "MOBILE LOOKUP", calls: mobileLookupCall },
    { type: "EMAIL LOOKUP", calls: emailLookupCall },
    { type: "JOB VERIFICATION", calls: jobVerificationCall }
  ]

  
  //sorting the data to map it with the colors array
  const sortedChartData = [...dashboardData].sort((a, b) => b.calls - a.calls);
  
  //colors deep to light
  const fillColors = [
    "hsl(44, 90%, 48.3%)",
    "hsl(44, 90%, 50%)" ,
    "hsl(44, 90%, 52%)" ,
    "hsl(44, 90%, 55%)" ,
    "hsl(44, 90%, 60%)" ,
    "hsl(44, 90%, 65%)" ,
    "hsl(44, 90%, 75%)",
    "hsl(44, 90%, 85%)",
    "hsl(44, 90%, 90%)",
    "hsl(44, 90%, 95%)",
  ]

  //mapping the colors with the coming values
  const schartData = sortedChartData.map((item, index :number) => ({
    ...item,
    fill: fillColors[index], // Default to last color if out of range
  }));

  
  
  //not using anything
  const chartConfig: ChartConfig = {
    
  };



  return (
    <Card className="flex flex-col w-[45%] max-sm:w-[100%] p-4">

      {isloading ? <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div> :
        <>
        <CardHeader className="items-center pb-0">
          <CardTitle>API Usage</CardTitle>
          <CardDescription>All API usage uptil now</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0  flex justify-center items-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] px-0 m-2 flex justify-center w-[330px] h-[250px] items-center "
          >
            <PieChart className="p-0">
              <ChartTooltip
                content={<ChartTooltipContent  hideLabel />}
              />
              
              <Pie
                
                data={schartData}
                dataKey="calls"
                labelLine={false}
                label={({ payload, ...props }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="black"
                    >
                      {payload.calls}
                    </text>
                  );
                }}
                nameKey="type"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          
          <div className="leading-none text-muted-foreground">
            Showing total API usage
          </div>
        </CardFooter>
        </>
        }
      
    </Card>
  );
}
