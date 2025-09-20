import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';

const NumbersPage: React.FC = () => {
  const { occupiedNumbers, settings } = useAppContext();
  
  if (!settings) return null;

  const allNumbers = Array.from({ length: settings.raffle_size }, (_, i) => i);

  const formatNumber = (num: number) => num.toString().padStart(3, '0');

  const { availableCount, occupiedCount } = useMemo(() => {
    const occupied = occupiedNumbers.length;
    const total = settings.raffle_size;
    return {
      availableCount: total - occupied,
      occupiedCount: occupied,
    };
  }, [occupiedNumbers, settings.raffle_size]);

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-cyan-300">Estado de los Números</h1>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Visualizador de Números</h2>
            <p className="text-gray-400">Vista general de todos los números de la rifa (0 - {settings.raffle_size - 1}).</p>
          </div>
          <div className="flex gap-4 text-sm font-semibold">
             <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Disponibles: {availableCount}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Ocupados: {occupiedCount}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-2">
          {allNumbers.map(num => {
            const isOccupied = occupiedNumbers.includes(num);
            return (
              <div
                key={num}
                className={`flex items-center justify-center p-1 rounded-md text-xs sm:text-sm font-mono
                  ${isOccupied ? 'bg-red-600/80 text-white' : 'bg-green-600/80 text-white'}
                `}
                title={`Número ${formatNumber(num)} - ${isOccupied ? 'Ocupado' : 'Disponible'}`}
              >
                {formatNumber(num)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NumbersPage;
