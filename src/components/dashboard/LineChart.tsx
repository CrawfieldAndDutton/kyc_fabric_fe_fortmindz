import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
import { ChevronDown } from 'lucide-react';

// Define TypeScript interfaces for data and chart config
interface ChartData {
  days: string;
  calls: number;
}

// Function to get last 7 days from today
function getLast7Days() {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const formattedDate = d.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    days.push({ date: formattedDate, day: d.getDay() });
  }

  return days;
}

// Get last 7 days
const last7Days = getLast7Days();

// Map weekdays to names
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function LineChartUi(): JSX.Element {
  const [lineData, setLineData] = useState([]);
  const currentYear = new Date().getFullYear();
  
  //dropdown menu
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("PAN");
  

  //options for 7 days credit (later update needed use maps )
  const options = ["PAN", "RC" ,"AADHAAR","DL","PASSPORT","VOTER","MOBILE LOOKUP","JOB VERIFICATION","GSTIN","EMAIL LOOKUP"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(selected === "MOBILE LOOKUP"){
          const response = await dashboardApi.getWeeklyCreditUsage(`KYC_MOBILE_LOOKUP`);
          setLineData(response.data.result);
        }else if(selected === "EMAIL LOOKUP"){
          const response = await dashboardApi.getWeeklyCreditUsage(`KYC_EMAIL_LOOKUP`);
          setLineData(response.data.result);
        }
        else if(selected === "JOB VERIFICATION"){
          const response = await dashboardApi.getWeeklyCreditUsage(`EV_EMPLOYMENT_LATEST`);
          setLineData(response.data.result);
        }else if(selected === "GSTIN"){
          const response = await dashboardApi.getWeeklyCreditUsage(`KYB_GSTIN`);
          setLineData(response.data.result);
        }else{
        const response = await dashboardApi.getWeeklyCreditUsage(`KYC_${selected}`);
        setLineData(response.data.result);}
      } catch (err) {
        console.log("error in fetching dashboard");
      }
    };
    fetchData();
  }, [selected]);

  

  // Create a result object with all days defaulted to count = 0
  const weeklyData = last7Days.map(({ date, day }) => {
    const existingData = lineData.find((d) => d.date === date);
    return {
      days: weekDays[day],
      calls: existingData ? existingData.count : 0,
    };
  });

  

  const chartConfig: ChartConfig = {
    calls: {
      label: "Api Calls",
      color: "hsl(221.2 83.2% 53.3%)",
    },
  };

  return (
    <Card className="w-[55%] max-w-full p-4 max-sm:w-[100%]">
      <CardHeader>
        <div className="flex justify-between items-center">
        <CardTitle>Weekly API Usage</CardTitle>
        <div className="z-10">
        <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-200 px-4 py-1 rounded-lg text-black flex items-center gap-2"
      >
        {selected}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border rounded-lg shadow-lg">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
        </div>
        </div>
        <CardDescription>{currentYear } Year Statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-70" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={weeklyData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="days"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="calls"
              type="linear"
              stroke="hsl(54, 90%, 61%)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing API usage for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
}
