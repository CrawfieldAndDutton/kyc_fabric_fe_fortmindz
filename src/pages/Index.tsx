import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Lock, ShieldCheck, Zap } from "lucide-react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { analytics } from "@/firebase";
import { logEvent } from "firebase/analytics";

const Index: React.FC = () => {
  // G-ANALYTICS
  const onButtonClick = (type) => {
    if (analytics) {
      logEvent(analytics, "button_click", { button: type });
    }
  };
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const [showPopup, setShowPopup] = useState(false);
  const popUpShown = useRef(sessionStorage.getItem("leavePopupShown"));

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (event.clientY <= 10 && popUpShown.current !== "true") {
        setShowPopup(true);
        sessionStorage.setItem("leavePopupShown", "true");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Parallax effect for the hero section
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }

      // Animate features on scroll
      if (featuresRef.current) {
        const elements = featuresRef.current.querySelectorAll(".feature-card");
        elements.forEach((el, i) => {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.9;

          if (isVisible) {
            (el as HTMLElement).style.opacity = "1";
            (el as HTMLElement).style.transform = "translateY(0)";
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 md:pt-32 lg:pt-36 pb-16 md:pb-24 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-accent text-accent-foreground animate-fade-in">
              <span className="font-semibold">Simplified KYC Verification</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 animate-slide-down">
              Streamline Your KYC Process with{" "}
              <span className="text-primary">Intelligent</span> Verification
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up">
              A powerful platform that allows businesses to validate customer
              identities through multiple verification methods using a simple
              credit-based system.
            </p>

            <div className="bg-green-100  py-2 px-7  lg:rounded-full rounded-md mb-8 flex flex-col items-center gap-4 animate-fade-in">
              <p className="text-lg text-gray-600">
                Sign up today and get{" "}
                <span className="font-bold">10 free credits</span> to experience
                seamless KYC verification!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 group" onClick={() => onButtonClick("Claim Your Free Credits")}>
                  Get 10 Free Credits – Start Now
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => onButtonClick("Contact Sales")}
                >
                  Contact Sales
                </Button>
              </Link>
            </div>

            <div className="mt-12 md:mt-16 w-full animate-scale-in">
              <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border bg-card">
                <div className="glass-panel h-[50px] flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="aspect-[16/9] md:aspect-[2/1] flex items-center justify-center overflow-hidden bg-black">
                  <div className="w-full h-full grid place-items-center p-8">
                    <div className="text-center text-white">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 grid place-items-center">
                          <Lock className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold">
                          FORTMINDZ Dashboard Preview
                        </h3>
                        <p className="text-sm text-white/70 max-w-md">
                          Seamlessly verify customer identities through multiple
                          methods in one unified platform.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 bg-accent/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <h4 className="text-3xl md:text-4xl font-bold">20+</h4>
              <p className="text-sm text-muted-foreground">Businesses</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-3xl md:text-4xl font-bold">10M+</h4>
              <p className="text-sm text-muted-foreground">Verifications</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-3xl md:text-4xl font-bold">99.9%</h4>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-3xl md:text-4xl font-bold">24/7</h4>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center bg-white text-black py-10 rounded-md shadow-slate-500 mt-5 px-4 md:px-6 ">
        <h2 className="text-2xl font-semibold">Join 20+ Businesses!</h2>
        <p className="text-lg my-5">
          Get 10 Free Credits on Sign-up – No Credit Card Required.
        </p>
        <Link to="/register">
          <Button size="lg" className="w-full sm:w-auto gap-2 group" onClick={() => onButtonClick("Claim Your Free Credits")}>
            Claim Your Free Credits
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 md:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Streamlined KYC Verification</h2>
            <p className="section-description">
              Our platform offers multiple verification methods to help
              businesses validate customer identities efficiently and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card relative bg-card rounded-lg p-6 border transition-all duration-500 opacity-0"
                style={{
                  transform: "translateY(20px)",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 grid place-items-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Types Section */}
      <section className="py-20 bg-accent/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              Comprehensive Verification Methods
            </h2>
            <p className="section-description">
              Choose from a variety of verification types to suit your business
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {verificationTypes.map((type, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <type.icon className="w-10 h-10 text-muted-foreground/70" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {type.description}
                </p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit System Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Simple Credit-Based System</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our credit-based system makes it easy to manage verification
                costs. Purchase credits in advance and use them as needed for
                different verification types.
              </p>

              <ul className="space-y-4 mb-8">
                {creditFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-primary/10 grid place-items-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link to="/pricing">
                <Button size="lg" className="gap-2">
                  View Pricing
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent rounded-3xl transform -translate-x-4 translate-y-4"></div>
              <div className="relative bg-card rounded-xl border shadow-xl overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">Credit Management</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-medium">Available Credits</span>
                    <span className="text-2xl font-bold">2,500</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        PAN Verification
                      </span>
                      <span>2 credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Aadhaar Verification
                      </span>
                      <span>1 credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Voter ID Verification
                      </span>
                      <span>5 credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Vehicle RC Verification
                      </span>
                      <span>7.5 credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Passport Verification
                      </span>
                      <span>5 credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                      Driving Licence Verification
                      </span>
                      <span>5 credits</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                      GSTIN Verification
                      </span>
                      <span>2 credits</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                      Mobile Lookup Verification
                      </span>
                      <span>6 credits</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                      Email Lookup Verification
                      </span>
                      <span>6 credits</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                      Job Verification
                      </span>
                      <span>7 credits</span>
                    </div>
                  </div>
                  

                  <Button className="w-full">Buy More Credits</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Streamline Your KYC Process?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/80">
              Join thousands of businesses that trust FORTMINDZ for their
              verification needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => onButtonClick("Create an Account")}
                >
                  Create an Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => onButtonClick("Contact Sales")}
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg max-w-sm  animate-slide-down">
            <h3 className="text-xl font-bold mb-2">
              Wait! Before You Leave...
            </h3>
            <p className="text-gray-600 mb-4">
              Get 10 Free Credits for KYC Verification – No Credit Card
              Required!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="default"
                  className="w-full sm:w-auto"
                  onClick={() => onButtonClick("Claim Your Free Credits")}
                >
                  Claim Your Free Credits
                </Button>
              </Link>

              <Button
                onClick={() => {
                  setShowPopup(false);
                  popUpShown.current = "true";
                }}
                variant="outline"
                size="lg"
                className="hover:bg-gray-100 w-full sm:w-auto"
              >
                No, Thanks
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const features = [
  {
    title: "Multiple Verification Types",
    description:
      "Verify identities using PAN, Aadhaar, Voter ID, Vehicle RC, Driving License, and Passport details in one platform.",
    icon: ShieldCheck,
  },
  {
    title: "Credit-Based System",
    description:
      "Purchase credits in advance and use them as needed for different verification types.",
    icon: Zap,
  },
  {
    title: "Secure Processing",
    description:
      "All verification data is transmitted securely and processed with industry-standard encryption.",
    icon: Lock,
  },
  {
    title: "Detailed Reporting",
    description:
      "Access comprehensive reports of verification history with full audit trails.",
    icon: Check,
  },
  {
    title: "Real-time Results",
    description:
      "Get instant verification results directly in the platform dashboard.",
    icon: Zap,
  },
  {
    title: "API Integration",
    description:
      "Seamlessly integrate our verification services into your existing systems via API.",
    icon: ShieldCheck,
  },
];

const verificationTypes = [
  {
    title: "PAN Verification",
    description:
      "Verify Permanent Account Number details with the Income Tax Department database.",
    icon: ShieldCheck,
    benefits: [
      "Instant verification",
      "Match with name and status",
      "Low credit consumption",
      "High accuracy rates",
    ],
  },
  {
    title: "Aadhaar Verification",
    description: "Validate Aadhaar card details securely and efficiently.",
    icon: ShieldCheck,
    benefits: [
      "Instant verification",
      "PAN Connection Status",
      "PAN Detection",
      "High accuracy rates",
    ],
  },
  // {
  //   title: "Voter ID Verification",
  //   description:
  //     "Confirm voter identity card information across the electoral database.",
  //   icon: ShieldCheck,
  //   benefits: [
  //     "Address verification",
  //     "Electoral status check",
  //     "Identity confirmation",
  //     "National database match",
  //   ],
  // },
  {
    title: "Vehicle RC Verification",
    description:
      "Verify vehicle registration certificate details with transport authorities.",
    icon: ShieldCheck,
    benefits: [
      "Owner details confirmation",
      "Registration status check",
      "Insurance validity",
      "Vehicle specifications",
    ],
  },
  {
    title: "Passport Verification",
    description:
      "Validate passport details securely for international identity verification.",
    icon: ShieldCheck,
    benefits: [
      "International standard",
      "High security verification",
      "Address & identity validation",
      "Visa status check",
    ],
  },
  {
    title: "Driving Licence Verification",
    description:
      "Verify Driving Licence  details with transport authorities.",
    icon: ShieldCheck,
    benefits: [
      "Owner details confirmation",
      "Driving Licence status check",
      "Licence validity",
      "Photo match capability",
    ],
  },

  {
    title: "Job Verification",
    description:
      "Verify Employement Status",
    icon: ShieldCheck,
    benefits: [
      "Owner details confirmation",
      "Driving Licence status check",
      "Licence validity",
      "Photo match capability",
    ],
  },
  
  {
    title: "Email Look Up Verification",
    description:
      "Verify Email Lookup",
    icon: ShieldCheck,
    benefits: [
      "Email Connected Accounts",
      "Instant verification",
      "Secure Verification",
      "High accuracy rates",
    ],
  },

  {
    title: "Mobile Look Up Verification",
    description:
      "Verify Mobile Lookup",
    icon: ShieldCheck,
    benefits: [
      "Mobile Number Connected Accounts",
      "Instant verification",
      "Secure Verification",
      "High accuracy rates",
    ],
  },

  {
    title: "Custom Integration",
    description:
      "Need a specific verification type? We can build custom solutions for your business.",
    icon: ShieldCheck,
    benefits: [
      "Tailored to your needs",
      "Seamless integration",
      "Dedicated support",
      "Custom reporting",
    ],
  },
  ];

const creditFeatures = [
  {
    title: "Transparent Pricing",
    description:
      "Clear credit costs for each verification type with no hidden fees.",
  },
  {
    title: "Volume Discounts",
    description: "Purchase larger credit packages to receive better rates.",
  },
  {
    title: "No Expiration",
    description: "Your credits never expire, use them whenever you need them.",
  },
  {
    title: "Automated Alerts",
    description:
      "Receive notifications when your credit balance is running low.",
  },
];

export default Index;
