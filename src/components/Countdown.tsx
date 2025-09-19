import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: number;
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const TimeBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <motion.div 
        key={value}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-5xl md:text-7xl font-bold tracking-tighter"
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <div className="text-sm md:text-base font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );

  const Separator: React.FC = () => (
    <div className="text-5xl md:text-7xl font-bold text-cyan-400/50 -mt-2">:</div>
  );

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-10">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-cyan-300">El Sorteo Termina En</h2>
      <div className="flex items-start justify-center gap-4 md:gap-8">
        <TimeBox value={timeLeft.days} label="Días" />
        <Separator />
        <TimeBox value={timeLeft.hours} label="Horas" />
        <Separator />
        <TimeBox value={timeLeft.minutes} label="Minutos" />
        <Separator />
        <TimeBox value={timeLeft.seconds} label="Segundos" />
      </div>
    </div>
  );
};

export default Countdown;
