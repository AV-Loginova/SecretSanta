'use client';

import React, { useEffect, useState } from 'react';

//todo types
type CountdownProps = {
  targetDate: string | Date;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max my-8">
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ '--value': timeLeft.days } as React.CSSProperties}
            aria-live="polite"
            aria-label={`${timeLeft.days} days`}
          >
            {timeLeft.days}
          </span>
        </span>
        дней
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ '--value': timeLeft.hours } as React.CSSProperties}
            aria-live="polite"
            aria-label={`${timeLeft.hours} hours`}
          >
            {timeLeft.hours}
          </span>
        </span>
        часов
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ '--value': timeLeft.minutes } as React.CSSProperties}
            aria-live="polite"
            aria-label={`${timeLeft.minutes} minutes`}
          >
            {timeLeft.minutes}
          </span>
        </span>
        минут
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ '--value': timeLeft.seconds } as React.CSSProperties}
            aria-live="polite"
            aria-label={`${timeLeft.seconds} seconds`}
          >
            {timeLeft.seconds}
          </span>
        </span>
        секунд
      </div>
    </div>
  );
};
