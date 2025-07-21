import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
  
      const redirectTimeout = setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
  
      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimeout);
      };
    }, [navigate]);

  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <div className="bg-white p-6 md:mx-auto text-center rounded-lg shadow-lg">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z" />
        </svg>

        <h3 className="md:text-2xl text-base text-gray-900 font-semibold">
          Payment Done!
        </h3>
        <p className="text-gray-600 my-2">
          Thank you for completing your secure online payment.
        </p>
        <p>Have a great day!</p>

        {/* Loader & Countdown Timer */}
        <div className="flex flex-col items-center mt-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-700 mt-2">Redirecting in {countdown}...</p>
        </div>

        <div className="py-10">
         Redirecting to dashboard
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
