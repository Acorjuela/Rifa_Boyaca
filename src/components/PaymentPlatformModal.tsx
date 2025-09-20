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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-quicksand" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-white rounded-2xl shadow-2xl text-gray-800 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-cyan-500 text-center">Selecciona una Plataforma</h2>
            <p className="text-gray-600 text-center">¿Cómo te gustaría realizar tu pago?</p>
            <div className="flex flex-col gap-4 pt-2">
              {settings.payment_options.nequi.enabled && (
                <button onClick={() => onPlatformSelect('nequi')} className="w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30">
                  <CreditCard size={20} /> Pagar con Nequi
                </button>
              )}
              {settings.payment_options.binance.enabled && (
                <button onClick={() => onPlatformSelect('binance')} className="w-full py-3 px-4 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/30">
                  <CreditCard size={20} /> Pagar con Binance
                </button>
              )}
              {!settings.payment_options.nequi.enabled && !settings.payment_options.binance.enabled && (
                <p className="text-yellow-500 text-center">No hay plataformas de pago activas en este momento.</p>
              )}
            </div>
            <div className="text-center pt-2">
              <button onClick={onClose} className="font-bold text-gray-500 hover:text-gray-700 transition-colors">Volver</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentPlatformModal;
