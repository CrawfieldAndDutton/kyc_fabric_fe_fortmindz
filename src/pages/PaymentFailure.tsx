import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailure: React.FC = () => {
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
        {/* Error Icon */}
        <svg
          viewBox="0 0 24 24"
          className="text-red-600 w-16 h-16 mx-auto my-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.333C6.159 21.333 2 17.174 2 12S6.159 2.667 12 2.667 22 6.826 22 12 17.841 21.333 12 21.333zm-1-15.333h2v7h-2v-7zm0 9h2v2h-2v-2z" />
        </svg>

        <h3 className="md:text-2xl text-base text-gray-900 font-semibold">
          Payment Failed!
        </h3>
        <p className="text-gray-600 my-2">
          Your transaction could not be completed.
        </p>
        <p>Please try again later or contact support.</p>

        {/* Loader & Countdown Timer */}
        <div className="flex flex-col items-center mt-4">
          <div className="w-10 h-10 border-4 border-red-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-700 mt-2">Redirecting in {countdown}...</p>
        </div>

        <div className="py-10">Redirecting to dashboard</div>
      </div>
    </div>
  );
};

export default PaymentFailure;
