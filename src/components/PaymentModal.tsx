import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Clock, Info } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (reference: string) => void;
  totalValue: number;
  platform: 'nequi' | 'binance';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, totalValue, platform }) => {
  const { settings } = useAppContext();
  const [timeLeft, setTimeLeft] = useState(300);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  if (!settings) return null;

  const platformConfig = {
    nequi: {
      qrUrl: settings.payment_options.nequi.qr_url,
      label: 'Referencia de Pago (Nequi)',
      placeholder: 'Ej: A123456',
      regex: /^[A-HJ-NP-Z]\d{6,10}$/,
      errorMsg: 'Formato inválido. Debe empezar con una letra (excepto I, O) y tener 6-10 dígitos.',
      currency: 'COP',
      amount: totalValue,
    },
    binance: {
      qrUrl: settings.payment_options.binance.qr_url,
      label: 'ID de Orden (Binance)',
      placeholder: 'Ej: 250058298491334',
      regex: /^\d{10,19}$/,
      errorMsg: 'Formato inválido. Debe ser un ID de 10 a 19 dígitos.',
      currency: 'USD',
      amount: totalValue,
    }
  };

  const currentConfig = platformConfig[platform];

  const validateReference = (ref: string) => {
    if (!ref) {
      setError('El campo es obligatorio.');
      return false;
    }
    if (!currentConfig.regex.test(ref)) {
      setError(currentConfig.errorMsg);
      return false;
    }
    setError('');
    return true;
  };

  useEffect(() => {
    if (!isOpen) {
      setReference('');
      setError('');
      return;
    }
    setTimeLeft(300);
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && timeLeft <= 0) onClose();
  }, [timeLeft, isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (validateReference(reference)) onPaymentSuccess(reference);
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  
  const formatCurrency = (amount: number, currency: 'COP' | 'USD') => new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'USD' && amount % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: currency === 'USD' && amount % 1 !== 0 ? 2 : 0,
  }).format(amount);

  const isButtonDisabled = !reference || !!error;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 font-quicksand" onClick={onClose}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", damping: 20 }} className="bg-gray-800 text-white border-2 border-cyan-400 rounded-3xl shadow-lg text-center w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-cyan-300">Completa tu Pago ({platform})</h2>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold bg-gray-700/50 px-4 py-2 rounded-lg">
              <Clock className="text-cyan-400" size={24} />
              <span>Tiempo restante: {formatTime(timeLeft)}</span>
            </div>
            <p>Escanea el código QR para pagar <strong className="text-cyan-300">{formatCurrency(currentConfig.amount, currentConfig.currency)}</strong>.</p>
            <div className="p-2 bg-white rounded-lg inline-block">
              <img src={currentConfig.qrUrl} alt={`QR Code para pago ${platform}`} className="w-48 h-48" />
            </div>
            <div>
              <label htmlFor="reference" className="block text-sm font-medium mb-2 text-left">{currentConfig.label}</label>
              <input type="text" id="reference" value={reference} onChange={(e) => { setReference(e.target.value); validateReference(e.target.value); }} className="w-full p-2 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" placeholder={currentConfig.placeholder} autoComplete="off" />
              {error && <p className="text-red-400 text-xs mt-1 text-left flex items-center gap-1"><Info size={14}/> {error}</p>}
            </div>
            <div className="flex justify-between gap-4 mt-4">
              <button onClick={handleConfirm} disabled={isButtonDisabled} className="py-2.5 px-5 rounded-xl border-none cursor-pointer bg-green-500 text-white hover:enabled:bg-green-600 flex-1 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Confirmar Pago</button>
              <button onClick={onClose} className="py-2.5 px-5 rounded-xl border-none cursor-pointer bg-red-500 text-white hover:bg-red-600 flex-1 transition-colors">Cancelar</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
