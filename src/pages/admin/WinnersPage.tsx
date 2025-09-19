import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { WinningNumbers } from '../../types';

const WinnersPage: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const [localWinning, setLocalWinning] = useState<WinningNumbers | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalWinning(settings.winning_numbers);
    }
  }, [settings]);

  const handleWinningChange = (field: keyof WinningNumbers, value: string) => {
    if (!localWinning) return;
    if (field === 'cifras' || field === 'series') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setLocalWinning(prev => ({ ...prev!, [field]: numericValue }));
    } else {
      setLocalWinning(prev => ({ ...prev!, [field]: value }));
    }
  };

  const handleSaveWinners = async () => {
    if (localWinning) {
      const toastId = toast.loading('Guardando...');
      try {
        await updateSettings({ winning_numbers: localWinning });
        toast.success('¡Números ganadores guardados!', { id: toastId });
      } catch (error: any) {
        toast.error(`Error: ${error.message}`, { id: toastId });
      }
    }
  };

  if (!localWinning) {
    return <div>Cargando...</div>;
  }

  const NumberPreview: React.FC<{ numbers: string }> = ({ numbers }) => {
    const digits = String(numbers || '').split('');
    return (
      <div className="mt-4 text-center p-4 bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Vista Previa</p>
        <div className="flex gap-2 justify-center">
          {digits.length > 0 && digits[0] !== '' ? (
            <>
              <div className="flex justify-center items-center w-12 h-12 rounded-full text-2xl font-bold bg-sky-500 text-white border-2 border-red-500 shadow-md">#</div>
              {digits.map((digit, index) => (
                <div key={index} className="flex justify-center items-center w-12 h-12 rounded-full text-2xl font-bold bg-sky-500 text-white border-2 border-red-500 shadow-md">
                  {digit}
                </div>
              ))}
            </>
          ) : (
            <div className="text-gray-500 h-12 flex items-center justify-center">Introduce un número</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-cyan-300">Gestión de Ganadores</h1>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
        <h2 className="text-2xl font-semibold mb-4">Establecer Números y Títulos de Ganadores</h2>
        <p className="text-gray-400 mb-6">Define los números y los títulos que se mostrarán en el "Salón de la Fama" de la página principal.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-4">
            <label htmlFor="cifras-title-input" className="font-medium text-lg mb-2 block">Título para Cifras</label>
            <input id="cifras-title-input" type="text" value={localWinning.cifrasTitle} onChange={(e) => handleWinningChange('cifrasTitle', e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
            <label htmlFor="cifras-input" className="font-medium text-lg mb-2 block">Número Ganador (Cifras)</label>
            <input id="cifras-input" type="text" value={localWinning.cifras} onChange={(e) => handleWinningChange('cifras', e.target.value)} className="w-full h-16 text-center text-3xl font-bold bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none tracking-widest" placeholder="????" />
            <NumberPreview numbers={localWinning.cifras} />
          </div>
          <div className="space-y-4">
            <label htmlFor="series-title-input" className="font-medium text-lg mb-2 block">Título para Series</label>
            <input id="series-title-input" type="text" value={localWinning.seriesTitle} onChange={(e) => handleWinningChange('seriesTitle', e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
            <label htmlFor="series-input" className="font-medium text-lg mb-2 block">Número Ganador (Series)</label>
            <input id="series-input" type="text" value={localWinning.series} onChange={(e) => handleWinningChange('series', e.target.value)} className="w-full h-16 text-center text-3xl font-bold bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none tracking-widest" placeholder="???" />
            <NumberPreview numbers={localWinning.series} />
          </div>
        </div>
        <button onClick={handleSaveWinners} className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">Guardar Cambios</button>
      </div>
    </div>
  );
};

export default WinnersPage;
