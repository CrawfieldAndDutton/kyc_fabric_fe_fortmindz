import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Download,
  Search,
  FileDown,
  Printer,
  Calendar,
  Filter,
  Check,
  X,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";
import { dashboardApi } from "@/apis/modules/dashboard";

const VerificationHistory: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // const [searchTerm, setSearchTerm] = useState("");
  // const [dateFilter, setDateFilter] = useState("all");
  // const [typeFilter, setTypeFilter] = useState("all");
  // const [statusFilter, setStatusFilter] = useState("all");
  const [totalHistory, setTotalHistory] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [verificationData, setVerificationData] = useState([]);
  const [isLoading ,setIsLoading]= useState(false);
  const [startIndex,setStartIndex]= useState(1);
  const [endIndex,setEndIndex]= useState(100);

  function formatISTDate(istDateStr) {
    const date = new Date(istDateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const increment = () => {
    if (Math.ceil(totalHistory / 100) > pageNo) {
      setPageNo((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (pageNo !== 1) {
      setPageNo((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        
        const response = await dashboardApi.getVerificationHistory(pageNo);
        // console.log(response.data.result.ledger_transactions)
        setTotalHistory(response.data.result.total_transactions);
        const responseData = response.data.result.ledger_transactions;
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
        
        setVerificationData(historyData);
        setIsLoading(false);
        setStartIndex(1 + (pageNo - 1)*100);
        setEndIndex(startIndex - 1 + historyData.length);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [pageNo,startIndex]);

  // Simulated data - in a real app, this would come from your API
  // const verificationHistory = [
  //   {
  //     id: "v1",
  //     type: "PAN",
  //     documentNumber: "ABCDE1234F",
  //     timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  //     status: "Verified",
  //     credits: 5,
  //   },
  //   {
  //     id: "v2",
  //     type: "Aadhaar",
  //     documentNumber: "XXXX XXXX 5678",
  //     timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  //     status: "Verified",
  //     credits: 10,
  //   },
  //   {
  //     id: "v3",
  //     type: "Passport",
  //     documentNumber: "J8765432",
  //     timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  //     status: "Failed",
  //     credits: 0,
  //   },
  //   {
  //     id: "v4",
  //     type: "Voter ID",
  //     documentNumber: "XYZ1234567",
  //     timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  //     status: "Verified",
  //     credits: 7,
  //   },
  //   {
  //     id: "v5",
  //     type: "Vehicle RC",
  //     documentNumber: "MH01AB1234",
  //     timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  //     status: "Verified",
  //     credits: 15,
  //   },
  //   {
  //     id: "v6",
  //     type: "PAN",
  //     documentNumber: "PQRST5678G",
  //     timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  //     status: "Failed",
  //     credits: 0,
  //   },
  //   {
  //     id: "v7",
  //     type: "Aadhaar",
  //     documentNumber: "XXXX XXXX 1234",
  //     timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  //     status: "Verified",
  //     credits: 10,
  //   },
  // ];
  // Filter verification history based on filters
  // const filteredHistory = verificationHistory.filter((item) => {
  //   // Search term filter
  //   if (
  //     searchTerm &&
  //     !item.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     !item.type.toLowerCase().includes(searchTerm.toLowerCase())
  //   ) {
  //     return false;
  //   }

  //   // Date filter
  //   if (dateFilter !== "all") {
  //     const now = new Date();
  //     const itemDate = new Date(item.timestamp);

  //     if (dateFilter === "today") {
  //       if (
  //         itemDate.getDate() !== now.getDate() ||
  //         itemDate.getMonth() !== now.getMonth() ||
  //         itemDate.getFullYear() !== now.getFullYear()
  //       ) {
  //         return false;
  //       }
  //     } else if (dateFilter === "week") {
  //       const oneWeekAgo = new Date();
  //       oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  //       if (itemDate < oneWeekAgo) {
  //         return false;
  //       }
  //     } else if (dateFilter === "month") {
  //       const oneMonthAgo = new Date();
  //       oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  //       if (itemDate < oneMonthAgo) {
  //         return false;
  //       }
  //     }
  //   }

  //   // Type filter
  //   if (
  //     typeFilter !== "all" &&
  //     item.type.toLowerCase() !== typeFilter.toLowerCase()
  //   ) {
  //     return false;
  //   }

  //   // Status filter
  //   if (
  //     statusFilter !== "all" &&
  //     item.status.toLowerCase() !== statusFilter.toLowerCase()
  //   ) {
  //     return false;
  //   }

  //   return true;
  // });
  // const formatDate = (date: Date) => {
  //   return new Intl.DateTimeFormat("en-GB", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(date);
  // };

  const resetFilters = () => {
    navigate("/credit-purchase")
  };

  const handleDownloadStatement = (format: "pdf" | "csv") => {
    toast({
      title: `${format.toUpperCase()} Download Started`,
      description: `Your verification history is being downloaded as a ${format.toUpperCase()} file.`,
    });

    // In a real app, this would trigger an actual download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `Your verification history has been downloaded as a ${format.toUpperCase()} file.`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Button
            variant="outline"
            className="mb-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Verification History
              </h1>
              <p className="text-muted-foreground">
                View and filter your previous verifications
              </p>
            </div>
            {/* <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => handleDownloadStatement('csv')}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                CSV
              </Button>
               <Button 
                variant="outline"
                onClick={() => handleDownloadStatement('pdf')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button> 
              <Button 
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div> */}
          </div>
        </div>

        {/* <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filter Verifications</CardTitle>
            <CardDescription>
              Refine the verification list using the filters below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="mb-2 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Document number or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="date-filter" className="mb-2 block">Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger id="date-filter" className="w-full">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type-filter" className="mb-2 block">Verification Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter" className="w-full">
                    <SelectValue placeholder="Select verification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pan">PAN</SelectItem>
                    <SelectItem value="aadhaar">Aadhaar</SelectItem>
                    <SelectItem value="voter id">Voter ID</SelectItem>
                    <SelectItem value="vehicle rc">Vehicle RC</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filter" className="mb-2 block">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-3 w-3" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card> */}
        

        {/* card to show the verification history if it not loeaded returns a loader */}
        <Card>
          {isLoading ? 
          <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        :
        <div>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2">
            <CardTitle>Verification Records</CardTitle>

            <div className="flex items-center gap-2 max-sm:flex-col max-sm:gap-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={decrement}
                  className="hover:bg-slate-400 w-[30px] h-[30px]"
                >
                  <ArrowLeft />
                </Button>
                <div className="">PAGE {pageNo}</div>
                <Button
                  variant="outline"
                  onClick={increment}
                  className="hover:bg-slate-400 w-[30px] h-[30px]"
                >
                  <ArrowRight />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {startIndex} - {endIndex} of {totalHistory} records
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium text-nowrap">
                    Document Number
                  </th>
                  <th className="text-left p-4 font-medium text-nowrap">
                    Date & Time
                  </th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Credits</th>
                </tr>
              </thead>
              <tbody>
                {verificationData.map((verification,index) => (
                  <tr
                  key={`${verification.documentNumber}-${index}}`}
                  className="border-b hover:bg-muted/50">
                    <td className="p-4">{verification.type}</td>
                    <td className="p-4">{verification.description}</td>
                    <td className="p-4">{verification.created_at}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          verification.found === "FOUND" || verification.found === "CREDITED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {verification.found === "FOUND" || verification.found === "CREDITED"? (
                          <><Check className="h-3 w-3 mr-1" />{verification.found}</>
                        ) : (
                          <><X className="h-3 w-3 mr-1" />NOT FOUND</>
                        )}
                        
                      </span>
                    </td>
                    <td className="p-4">
                      {verification.found !== "CREDITED" ? (
                        <span className="text-red-600">
                          {verification.amount}
                        </span>
                      ) : (
                        <span className="text-green-600">+{verification.amount}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {verificationData.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-lg mb-1">No results found</h3>
              <p className="text-muted-foreground mb-4">
                No verification records Found.
              </p>
              {/* <Button onClick={resetFilters} variant="outline">
                Purchase Some Credits
              </Button> */}
            </div>
          )}
        </CardContent>

        {/* <CardFooter className="py-4 border-t">
          <div className="text-sm text-muted-foreground">
            <Filter className="h-4 w-4 inline-block mr-1" />
            Displaying data with applied filters - {filteredHistory.length} result{filteredHistory.length !== 1 ? 's' : ''}
          </div>
        </CardFooter> */}
        </div>
        }
        </Card>
      </div>
    </div>
  );
};

export default VerificationHistory;
