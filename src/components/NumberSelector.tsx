import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

interface NumberSelectorProps {
  maxNumbers: number;
  onNumbersSelect: (numbers: number[]) => void;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ maxNumbers, onNumbersSelect }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const { occupiedNumbers, settings } = useAppContext();

  if (!settings) return null;

  const numbers = Array.from({ length: settings.raffle_size }, (_, i) => i);

  useEffect(() => {
    setSelectedNumbers([]);
    onNumbersSelect([]);
  }, [maxNumbers, onNumbersSelect]);

  const handleNumberClick = (number: number) => {
    if (occupiedNumbers.includes(number)) return;

    let newSelected: number[];
    if (selectedNumbers.includes(number)) {
      newSelected = selectedNumbers.filter(n => n !== number);
    } else if (selectedNumbers.length < maxNumbers) {
      newSelected = [...selectedNumbers, number];
    } else {
      return; 
    }
    
    setSelectedNumbers(newSelected);
    onNumbersSelect(newSelected);
  };

  const formatNumber = (num: number) => num.toString().padStart(3, '0');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
      <div className="mb-4">
        {selectedNumbers.length > 0 && (
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-white font-semibold">
              Seleccionados ({selectedNumbers.length}/{maxNumbers}): <span className="text-cyan-300 tracking-wider">{selectedNumbers.map(formatNumber).join(' ')}</span>
            </p>
          </div>
        )}
      </div>

      <div className="flex-grow grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1 sm:gap-2 overflow-y-auto p-2 sm:p-4 bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-lg fade-scroll">
        {numbers.map((number) => {
          const isSelected = selectedNumbers.includes(number);
          const isOccupied = occupiedNumbers.includes(number);
          
          return (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              disabled={isOccupied}
              className={`flex justify-center items-center p-1 sm:p-2 text-xs font-medium rounded-md sm:rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform
                ${isSelected ? 'bg-reg-gradient text-white font-bold shadow-lg shadow-green-500/30 scale-105' : ''}
                ${isOccupied ? 'bg-red-800/60 text-gray-500 cursor-not-allowed' : 'bg-white/5 hover:scale-105 hover:bg-cyan-500/50 text-white'}
              `}
            >
              {formatNumber(number)}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NumberSelector;
