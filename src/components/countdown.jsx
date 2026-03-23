import React, { useEffect, useState } from "react";

const Countdown = ({ endTimestamp, text = "Time Remaining" }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = endTimestamp - now;

      if (remaining <= 0) {
        setTimeLeft("Staking period has ended.");
        return;
      }

      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTimestamp]);

  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-400 font-medium">{text}:</p>
      <p className="text-2xl font-bold text-blue-500">{timeLeft}</p>
    </div>
  );
};

export default Countdown;
