import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAccept }) => {
  const { settings, packages } = useAppContext();
  
  if (!isOpen || !packages || !settings) return null;

  const formattedDate = new Date(settings.raffle_date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formatUSD = (amount: number) => {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'USD',
    };
    if (amount % 1 === 0) {
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 0;
    } else {
        options.minimumFractionDigits = 2;
        options.maximumFractionDigits = 2;
    }
    return amount.toLocaleString('en-US', options);
  };

  const paymentOptions = settings.payment_options || {};
  const showCOP = paymentOptions.nequi?.enabled;
  const showUSD = paymentOptions.binance?.enabled;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        style={{ background: 'rgba(35, 234, 241, 0.432)' }}
        onClick={onClose}
      >
        <motion.dialog
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="modal-dialog relative"
          onClick={(e) => e.stopPropagation()}
          open
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-purple-900 text-center">
              {settings.raffle_info?.title || 'Información de la Rifa'}
            </h3>

            <p className="text-purple-900 leading-relaxed text-center font-lato text-lg">
              {settings.raffle_info?.description || 'Apoya una buena causa y gana premios increíbles.'}
            </p>

            <div>
              <h3 className="text-lg font-bold text-purple-900 mb-3 text-center">Pagar:</h3>
              <ul className="space-y-2 text-purple-900 font-lato text-lg">
                {packages.map(pkg => {
                  return (
                    <li key={pkg.id} className="text-center">
                      {pkg.label}:{' '}
                      {showCOP && (pkg.price_cop ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                      {showCOP && showUSD && ' / '}
                      {showUSD && formatUSD(pkg.price_usd ?? 0)}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-purple-900 mb-3 text-center">Resultados finales:</h3>
              <p className="text-purple-900 text-center font-lato text-lg">
                El {formattedDate} en cifras y series.
              </p>
            </div>

            <div className="modal-buttons flex justify-between gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="confirm bg-orange-400 text-white h-9 px-5 rounded-2xl border-none cursor-pointer flex-1 flex justify-center items-center"
                onClick={onAccept}
              >
                Aceptar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cancel bg-red-600 text-white px-5 h-9 rounded-2xl border-none cursor-pointer flex-1 flex justify-center items-center"
                onClick={onClose}
              >
                Cancelar
              </motion.button>
            </div>
          </div>
        </motion.dialog>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
