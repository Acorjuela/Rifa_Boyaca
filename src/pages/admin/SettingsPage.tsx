import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { PaymentPlatform, RaffleInfo } from '../../types';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, uploadFile } = useAppContext();
  
  const [localRaffleDate, setLocalRaffleDate] = useState('');
  const [localPaymentOptions, setLocalPaymentOptions] = useState<{ nequi: PaymentPlatform; binance: PaymentPlatform; } | null>(null);
  const [localUsdToCopRate, setLocalUsdToCopRate] = useState(0);
  const [localRaffleSize, setLocalRaffleSize] = useState(0);
  const [localRaffleInfo, setLocalRaffleInfo] = useState<RaffleInfo | null>(null);

  useEffect(() => {
    if (settings) {
      const date = new Date(settings.raffle_date);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setLocalRaffleDate(`${year}-${month}-${day}T${hours}:${minutes}`);
      
      setLocalPaymentOptions(settings.payment_options);
      setLocalUsdToCopRate(settings.usd_to_cop_rate);
      setLocalRaffleSize(settings.raffle_size);
      setLocalRaffleInfo(settings.raffle_info);
    }
  }, [settings]);

  const handleQrUpload = async (platform: 'nequi' | 'binance', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && localPaymentOptions) {
      const toastId = toast.loading('Subiendo imagen...');
      try {
        const filePath = `public/qr-${platform}-${Date.now()}`;
        const newUrl = await uploadFile(file, 'assets', filePath);
        if (newUrl) {
          setLocalPaymentOptions(prev => ({
            ...prev!,
            [platform]: { ...prev![platform], qr_url: newUrl }
          }));
          toast.success('Imagen subida', { id: toastId });
        }
      } catch (error: any) {
        toast.error(`Error al subir: ${error.message}`, { id: toastId });
      }
    }
  };

  const handleToggle = (platform: 'nequi' | 'binance') => {
    if (localPaymentOptions) {
      setLocalPaymentOptions(prev => ({
        ...prev!,
        [platform]: { ...prev![platform], enabled: !prev![platform].enabled }
      }));
    }
  };

  const handleSave = async () => {
    if (localPaymentOptions && localRaffleInfo) {
      const toastId = toast.loading('Guardando configuración...');
      try {
        await updateSettings({
          payment_options: localPaymentOptions,
          raffle_date: new Date(localRaffleDate).toISOString(),
          usd_to_cop_rate: localUsdToCopRate,
          raffle_size: localRaffleSize,
          raffle_info: localRaffleInfo,
        });
        toast.success('¡Configuración guardada!', { id: toastId });
      } catch (error: any) {
        toast.error(`Error al guardar: ${error.message}`, { id: toastId });
      }
    }
  };

  if (!settings || !localPaymentOptions || !localRaffleInfo) {
    return <div>Cargando ajustes...</div>;
  }

  const QrSettings: React.FC<{ platform: 'nequi' | 'binance', title: string, options: PaymentPlatform }> = ({ platform, title, options }) => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={options.enabled} onChange={() => handleToggle(platform)} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
        </label>
      </div>
      <div className="flex items-center gap-4">
        <input type="file" id={`${platform}Upload`} accept="image/*" onChange={(e) => handleQrUpload(platform, e)} className="hidden" />
        <label htmlFor={`${platform}Upload`} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
          Cambiar QR
        </label>
        <img src={options.qr_url} alt={`${title} QR Preview`} className="w-24 h-24 rounded-lg bg-white p-1" />
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-cyan-300">Ajustes Generales</h1>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-2xl space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Información del Sorteo</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Título del Modal</label>
              <input type="text" value={localRaffleInfo.title} onChange={(e) => setLocalRaffleInfo(prev => ({...prev!, title: e.target.value}))} className="w-full p-3 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Descripción del Modal</label>
              <textarea value={localRaffleInfo.description} onChange={(e) => setLocalRaffleInfo(prev => ({...prev!, description: e.target.value}))} rows={3} className="w-full p-3 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Configuración de la Rifa</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Fecha del Sorteo</label>
              <p className="text-xs text-gray-400 mb-2">Establece la fecha y hora final. Esto actualizará el contador.</p>
              <input type="datetime-local" value={localRaffleDate} onChange={(e) => setLocalRaffleDate(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tamaño de la Rifa</label>
              <p className="text-xs text-gray-400 mb-2">Define el número total de boletos (e.g., 1000 para 0-999).</p>
              <input type="number" value={localRaffleSize} onChange={(e) => setLocalRaffleSize(Number(e.target.value))} className="w-full p-3 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Tasa de Cambio</h2>
          <p className="text-gray-400 mb-4">Define cuántos COP equivalen a 1 USD para los pagos con Binance.</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">1 USD =</span>
            <input type="number" value={localUsdToCopRate} onChange={(e) => setLocalUsdToCopRate(Number(e.target.value))} className="w-full p-3 pl-20 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">COP</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Plataformas de Pago</h2>
          <div className="space-y-6">
            <QrSettings platform="nequi" title="Nequi" options={localPaymentOptions.nequi} />
            <QrSettings platform="binance" title="Binance" options={localPaymentOptions.binance} />
          </div>
        </div>

        <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
