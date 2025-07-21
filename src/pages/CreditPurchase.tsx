import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  CreditCard,
  Shield,
  ArrowRight,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { paymentApi } from "@/apis/modules/payment";

const creditPackages = [
  {
    id: "basic",
    name: "Upto 25K Credits",
    credits: "₹1200/1000 credits",
    popular: false,
    description: "Basic Value",
    borderColor: "hsl(0, 0%, 85%)",
  },
  {
    id: "standard",
    name: "Upto 50K Credits",
    credits: "₹1000/1000 credits",
    description: "Save 16%",
    borderColor: "hsl(39 92% 55%)",
    popular: true,
  },
  {
    id: "premium",
    name: "Upto 100K Credits",
    credits: "₹900/1000 credits",
    description: "Save 25%",
    borderColor: "hsl(0, 0%, 85%)",
    popular: false,
  },
];

const CreditPurchase: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<boolean>(null);
  const [amount, setAmount] = useState<number>(undefined);
  const [slidervalue, setSlidervalue] = useState<number>(10000);
  const [creditsRate, setCreditsRate] = useState<string>("");
  const [offer, setOffer] = useState<string>(null);
  const [purchaseCredit, setPurchaseCredit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shortUrl ,setShortUrl] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  //to set the slider value and setting amoun according to the rate
  useEffect(() => {
    if (slidervalue < 25000) {
      setCreditsRate("₹1200/1000 Credits");
      setAmount(slidervalue * 1.2);
      setOffer(null);
    } else if (slidervalue > 25000 && slidervalue < 50000) {
      setCreditsRate("₹1000/1000 Credits");
      setAmount(slidervalue);
      setOffer("16% Off");
    } else if (slidervalue > 50000) {
      setCreditsRate("₹900/1000 Credits");
      setAmount(slidervalue * 0.9);
      setOffer("25% Off");
    }
  }, [slidervalue]);



  //total amount
  const totalAmount = Math.ceil((amount * 2.5) / 100) + Number(amount);

  //sets the slider value and clears it
  const clearResponse = () => {
    setSlidervalue(1000);
  };

  //contact us navigate
  const navigateContact = () => {
    navigate("/contact");
  };

  //increment button
  const incrementValue = (amount) => {
    setSlidervalue((prev) => Math.min(prev + amount, 100000)); // Prevent exceeding max
  };

  const handlePurchase = async(e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true);

    try {
      const response = await paymentApi.payment({ amount: totalAmount , credits_purchased : slidervalue });
      // console.log(response.data.short_url)
      setShortUrl(response.data.short_url)
      window.location.href = response.data.short_url;
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    }

  };

  // selects the credit you want to buy in pop up section
  const handleSelected = () => {
    setSelectedPlan(true);
    setPurchaseCredit(true);
  };

  //pop up close button
  const handleClose = () => {
    setSelectedPlan(false);
    setPurchaseCredit(false);
    setSlidervalue(1000);
    window.location.reload();
  };

  //stores slidervalue == total creds user want to buy
  const handleSliderChange = (value) => {
    setSlidervalue(Number(value[0]));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { ease: "easeIn", duration: 0.5 },
          }}
        >
          <Button
            variant="outline"
            className="mb-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Purchase Credits
          </h1>
          <p className="text-muted-foreground">
            Buy verification credits to use for your KYC processes
          </p>
        </motion.div>

        <div className="space-y-6 mt-6">
          <div className="w-[100%] relative">
            {/* packages information  */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { ease: "easeIn", duration: 0.7 },
              }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5"
            >
              {creditPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden
                   ring-1 p-3
                      `}
                  style={{
                    borderColor: pkg.borderColor,
                    borderWidth: "1px",
                    boxShadow: `0 0 0 1px ${pkg.borderColor}`,
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-md">
                        POPULAR
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-nowrap">
                      {pkg.name}
                    </CardTitle>
                    <CardDescription className="rounded-xl text-[12px] py-0.5 bg-green-500 w-[90px] text-white text-center">
                      
                        {pkg.description}
                      
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{pkg.credits} </span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>Never expires</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>All verification methods</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              ))}
              <Card
                className={`relative overflow-hidden
                   ring-1 p-3`}
                style={{
                  borderColor: "hsl(0, 0%, 85%)",
                  borderWidth: "1px",
                  boxShadow: `0 0 0 1px hsl(0, 0%, 85%)`,
                }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-nowrap">
                    Above 100K Credits
                  </CardTitle>
                  <CardDescription  className="rounded-xl text-[12px] py-0.5 bg-green-500 w-[90px] text-white text-center">
                    Reach Us
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span>Contact Our Brochure</span>
                    </li>

                    <li className="flex items-center">
                      <Button
                        className="h-7 mt-7 w-[100%] "
                        onClick={navigateContact}
                      >
                        Contact Us
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* slider section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { ease: "easeIn", duration: 1 },
              }}
            >
              <Card
                className={`relative overflow-hidden w-[60%] max-sm:w-[100%]`}
              >
                <CardHeader className="pb-4">
                  <CardTitle>Credit Purchase</CardTitle>
                  <CardDescription>
                    Use the slider to get credits price
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="">
                    {/* slider */}
                    <Slider
                      defaultValue={[slidervalue]}
                      min={1000}
                      max={100000}
                      step={1000}
                      className=""
                      onValueChange={handleSliderChange}
                    />
                    <div className="mt-4">{slidervalue} Credits</div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4 mt-3">
                    {creditsRate}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-xl max-sm:text-lg">
                        {slidervalue} Credits in
                      </div>

                      <div className="flex flex-col justify-center items-center gap-2">
                        <div className="text-3xl max-sm:text-xl font-bold text-gray-600">
                          ₹{amount || 0}{" "}
                        </div>
                        {offer && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: { ease: "easeIn", duration: 0.5 },
                            }}
                            className="rounded-xl text-[12px] max-sm:text-[10px] py-0.5 bg-green-100 w-[90px] text-black text-center"
                          >
                            {offer}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3  w-[100%]">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>Never expires</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>All verification methods</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex w-[100%] gap-2 max-sm:flex-col">
                    <Button
                      className={`w-full kyc-btn-primary`}
                      variant="default"
                      onClick={handleSelected}
                    >
                      Purchase Credit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            {/* purchase section  */}
            {purchaseCredit ? (
              <div
                className={`w-[100vw] h-[100vh] bg-transparent backdrop-blur-sm top-0 left-0 fixed`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: "easeIn" }}
                  className={`fixed top-[1] m-2 w-[50vw]  mx-auto inset-0 max-sm:w-[95vw] overflow-y-auto scrollbar-hide max-md:w-[80vw] `}
                >
                  <Card className={`relative overflow-hidden w-[100%]`}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between">
                        <CardTitle>Purchase Credits</CardTitle>
                        <CardTitle>
                          <Button
                            onClick={handleClose}
                            className="bg-transparent"
                          >
                            <IoMdClose />
                          </Button>
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="flex flex-col  mb-1 ">
                        <div className="flex">
                          <Input
                            id="creditamount"
                            type="number"
                            value={slidervalue}
                            disabled={true}
                            placeholder="Write your amount in rupees.."
                            className="rounded-r-none"
                          />
                          <Button
                            onClick={() => clearResponse()}
                            className="rounded-l-none  text-black hover:bg-slate-300"
                            variant="outline"
                          >
                            Clear
                          </Button>
                        </div>
                        {slidervalue === 100000 ? (
                          <h6 className="text-gray-400 text-sm pt-2">
                            Maximum limit reached , For more credits contact
                            sales
                          </h6>
                        ) : (
                          <></>
                        )}

                        <div className="flex justify-between max-sm:flex-col items-center my-5">
                          <div className="flex gap-2">
                            <Button variant="outline" className="text-gray-500 border-yellow-400 hover:bg-slate-200" onClick={() => incrementValue(1000)}>
                              1000+
                            </Button>
                            <Button variant="outline" className="text-gray-500 border-yellow-400 hover:bg-slate-200" onClick={() => incrementValue(5000)}>
                              5000+
                            </Button>
                            <Button variant="outline" className="text-gray-500 border-yellow-400 hover:bg-slate-200" onClick={() => incrementValue(10000)}>
                              10000+
                            </Button>
                          </div>

                          <div className="text-lg text-muted-foreground font-bold max-sm:mt-5  ">
                          {creditsRate}
                          </div>

                        </div>
                        
                      </div>

                      <div className=" text-sm flex  gap-3 max-sm:flex-col">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <div>Never expires</div>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>All verification methods</span>
                        </div>
                      </div>
                    </CardContent>
                    <Card className="mt-0 border-none">
                      <CardHeader className="pb-3 pt-3">
                        <CardTitle className="text-xl">
                          Payment Information
                        </CardTitle>

                        <CardDescription>
                          Secure payment processing by our payment gateway
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="p-4 bg-muted rounded-lg mb-4">
                          <h3 className="font-medium mb-2">Order Summary</h3>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>{"Amount"}</span>
                              <span>₹{amount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Credits</span>
                              <span>{slidervalue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Convenience Fees</span>
                              <span>{"2.5%"}</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t">
                              <span>Total</span>
                              <span>₹{totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full kyc-btn-primary"
                          onClick={handlePurchase}
                          disabled={!selectedPlan || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Complete Purchase{" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </Card>
                </motion.div>
              </div>
            ) : (
              <> </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditPurchase;
