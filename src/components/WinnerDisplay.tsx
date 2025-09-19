import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const WinnerDisplay: React.FC = () => {
  const { settings } = useAppContext();
  const [activeTab, setActiveTab] = useState<'cifras' | 'series'>('cifras');

  const winningNumbers = settings?.winning_numbers;

  const getNumbersArray = (numString: string) => {
    const cleanString = String(numString || '').replace(/\s/g, '');
    if (!cleanString || cleanString.includes('?')) {
      return [];
    }
    return ['#', ...cleanString.split('')];
  };

  const winners = {
    cifras: { title: winningNumbers?.cifrasTitle || '', prize: "$200.000", numbers: getNumbersArray(winningNumbers?.cifras || '') },
    series: { title: winningNumbers?.seriesTitle || '', prize: "$600.000", numbers: getNumbersArray(winningNumbers?.series || '') },
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-10 w-full">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-2 text-cyan-300">Salón de la Fama</h2>
      <p className="text-center text-gray-400 mb-8">¡Conoce a los números ganadores del último sorteo!</p>

      <div className="flex justify-center mb-8 border-b-2 border-gray-700">
        <button
          onClick={() => setActiveTab('cifras')}
          className={`px-6 py-3 font-semibold text-lg transition-colors relative ${activeTab === 'cifras' ? 'text-cyan-300' : 'text-gray-400 hover:text-white'}`}
        >
          Cifras
          {activeTab === 'cifras' && <motion.div layoutId="underline" className="absolute bottom-[-2px] left-0 right-0 h-1 bg-cyan-400" />}
        </button>
        <button
          onClick={() => setActiveTab('series')}
          className={`px-6 py-3 font-semibold text-lg transition-colors relative ${activeTab === 'series' ? 'text-cyan-300' : 'text-gray-400 hover:text-white'}`}
        >
          Series
          {activeTab === 'series' && <motion.div layoutId="underline" className="absolute bottom-[-2px] left-0 right-0 h-1 bg-cyan-400" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center w-full flex flex-col items-center"
        >
          <h3 className="text-xl md:text-2xl text-white font-bold">{winners[activeTab].title}</h3>
          
          <div className="flex gap-2 md:gap-4 justify-center items-center mt-6">
            {winners[activeTab].numbers.length > 0 ? (
              winners[activeTab].numbers.map((number, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 rounded-full text-3xl md:text-4xl font-bold text-gray-900 bg-cyan-500 shadow-lg"
                >
                  {number}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">Aún no se han definido los ganadores.</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WinnerDisplay;
