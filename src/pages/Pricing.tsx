import { motion } from "framer-motion";
import React, { useEffect } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { analytics } from "@/firebase";
import { logEvent } from "firebase/analytics";

const Pricing: React.FC = () => {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view", { page: "Pricing" });
    }
  }, []);
  return (
    <div className="min-h-screen  flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 md:pt-28">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-5xl mx-auto ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { ease: "easeIn", duration: 1 },
              }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Purchase credits in advance and use them as needed for different
                verification types. No hidden fees, no contracts, just pay for
                what you use.
              </p>
            </motion.div>

            <div className="bg-green-100  py-2 px-7  lg:rounded-full rounded-md mb-8 flex flex-col items-center  gap-4 animate-fade-in">
              <p className="text-lg text-gray-600">
                Sign up today and get{" "}
                <span className="font-bold">10 free credits</span> to experience
                seamless KYC verification!
              </p>
            </div>
            <div className="flex flex-col justify-center sm:flex-row gap-4 animate-fade-in mb-10">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 group">
                  Get 10 Free Credits – Start Now
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-4 gap-2">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { ease: "easeIn", duration: plan.price },
                  }}
                  key={index}
                  className={`relative rounded-xl overflow-hidden border transition-all ${
                    plan.popular ? "shadow-lg border-primary" : "shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-xs font-medium px-3 py-1 text-primary-foreground">
                      {plan.offer}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>

                    <p className="text-muted-foreground mb-6">
                      {plan.description}
                    </p>

                    <Link to="/register">
                      <Button
                        className="w-full mb-6"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </Link>

                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-primary shrink-0 mr-3" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted p-3 border-t">
                    <h4 className="font-medium mb-3">Credit Consumption:</h4>
                    <div className="space-y-2 text-sm">
                      {creditConsumption.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-muted-foreground">
                            {item.type}
                          </span>
                          <span>{item.credits} credits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 bg-card rounded-xl p-8 border shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const pricingPlans = [
  {
    name: "Upto 25K Credits",
    price: 0.5,
    description: "₹1200/1000 credits",
    popular: false,
    offer: "",
    features: [
      "Never Expires",
      "All Verification",
      "API Access",
      "24/7 Email Support",
    ],
  },
  {
    name: "Upto 50K Credits",
    price: 1,
    description: "₹1000/1000 credits",
    popular: true,
    offer: "16% Off",
    features: [
      "Never Expires",
      "All Verification",
      "API Access",
      "24/7 Email Support",
    ],
  },
  {
    name: "Upto 100K Credits ",
    price: 1.5,
    description: "₹900/1000 credits",
    popular: true,
    offer: "25% Off",
    features: [
      "Never Expires",
      "All Verification",
      "API Access",
      "24/7 Email Support",
    ],
  },
  {
    name: "Above 100K Credits",
    price: 2,
    description: "Contact Us",
    popular: false,
    offer: "",
    features: [
      "Never Expires",
      "All Verification",
      "API Access",
      "24/7 Email Support",
    ],
  },
];

const creditConsumption = [
  { type: "PAN Verification", credits: 2 },
  { type: "Aadhaar Verification", credits: 1 },
  { type: "Voter ID Verification", credits: 5 },
  { type: "Vehicle RC Verification", credits: 7.5 },
  { type: "Passport Verification", credits: 5 },
  { type: "Job Verification", credits: 7 },
  { type: "Mobile Look Up Verification", credits: 5 },
  { type: "Email Look Up Verification", credits: 5 },
  { type: "GSTIN Verification", credits: 2 },
];

const faqs = [
  {
    question: "Do credits expire?",
    answer:
      "No, your purchased credits never expire. You can use them at your own pace.",
  },
  // {
  //   question: "Can I upgrade my plan later?",
  //   answer:
  //     "Yes, you can purchase additional credits or upgrade to a higher plan at any time.",
  // },
  {
    question: "How secure is the verification process?",
    answer:
      "We use industry-standard encryption and security protocols to ensure all verification data is protected. We are compliant with all relevant regulations.",
  },
  {
    question: "Do you offer volume discounts?",
    answer:
      "Yes, discounts are applicable on volume buckets. Above 25000 credits purchase, 10% discount is offered. Above 50000 credits purchase, 18% discount is offered.",
  },
  {
    question: "How quickly will I get verification results?",
    answer:
      "Most verifications are completed within seconds. Complex cases might take up to a few minutes.",
  },
];

export default Pricing;
