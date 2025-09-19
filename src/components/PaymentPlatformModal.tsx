import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { CreditCard } from 'lucide-react';

interface PaymentPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlatformSelect: (platform: 'nequi' | 'binance') => void;
}

const PaymentPlatformModal: React.FC<PaymentPlatformModalProps> = ({ isOpen, onClose, onPlatformSelect }) => {
  const { settings } = useAppContext();

  if (!isOpen || !settings) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 font-quicksand" onClick={onClose}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", damping: 20 }} className="bg-gray-800 text-white border-2 border-cyan-400 rounded-3xl shadow-lg text-center w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-cyan-300">Selecciona una Plataforma</h2>
            <p className="text-gray-300">¿Cómo te gustaría realizar tu pago?</p>
            <div className="flex flex-col gap-4">
              {settings.payment_options.nequi.enabled && (
                <button onClick={() => onPlatformSelect('nequi')} className="w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  <CreditCard size={20} /> Pagar con Nequi
                </button>
              )}
              {settings.payment_options.binance.enabled && (
                <button onClick={() => onPlatformSelect('binance')} className="w-full py-3 px-4 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
                  <CreditCard size={20} /> Pagar con Binance
                </button>
              )}
              {!settings.payment_options.nequi.enabled && !settings.payment_options.binance.enabled && (
                <p className="text-yellow-400">No hay plataformas de pago activas en este momento.</p>
              )}
            </div>
            <button onClick={onClose} className="mt-4 text-gray-400 hover:text-white transition-colors">Volver</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentPlatformModal;
