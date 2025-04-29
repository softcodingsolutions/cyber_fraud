import { useState, useEffect } from "react";

export default function Home() {
  const [spinCount, setSpinCount] = useState(0);
  const [winnerCount, setWinnerCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Demo animation effect for the numbers
  useEffect(() => {
    // Set initial load animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    const interval = setInterval(() => {
      setSpinCount((prev) => (prev < 1258 ? prev + 7 : prev));
      setWinnerCount((prev) => (prev < 431 ? prev + 3 : prev));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`h-150 bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow-lg mx-auto transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex justify-center mb-6">
        <h1 className="md:text-3xl text-xl font-bold text-center relative inline-block">
          <span className="bg-clip-text text-transparent  bg-gradient-to-r from-blue-400 to-blue-800">
            Spin Statistics
          </span>
          <div className="absolute -bottom-2 mt-10 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Box - User Spins */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-md overflow-hidden border border-blue-200 transition-all duration-300 hover:shadow-xl  min-h-[300px] flex flex-col relative group">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
            <h2 className="text-white text-center font-bold text-xl">
              Total User Spins
            </h2>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-700">
              {spinCount.toLocaleString()}
            </div>
            <div className="mt-4 text-blue-800 text-lg font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Wheel Spins
            </div>
          </div>
        </div>

        {/* Second Box - Free Ticket Winners */}
        <div className="bg-gradient-to-br from-indigo-100 to-blue-50 rounded-xl shadow-md overflow-hidden border border-indigo-200 transition-all duration-300 hover:shadow-xl min-h-[300px] flex flex-col relative group">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
            <h2 className="text-white text-center font-bold text-xl">
              Total Free Ticket Winners
            </h2>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-600">
              {winnerCount.toLocaleString()}
            </div>
            <div className="mt-4 text-indigo-800 text-lg font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Lucky Winners
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
