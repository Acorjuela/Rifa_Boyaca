import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { User, Building, Globe, Phone } from 'lucide-react';

interface FormData {
  nombre: string;
  apellido: string;
  ciudad: string;
  pais: string;
  whatsapp: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNumbers: number[];
  totalValueCOP: number;
  totalValueUSD: number;
  onSubmit: (formData: FormData) => void;
}

const InputField: React.FC<{ id: string, name: keyof FormData, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, icon: React.ReactNode }> = ({ id, name, placeholder, value, onChange, type = 'text', icon }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} required className="w-full pl-10 p-3 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" autoComplete="off" />
  </div>
);

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, selectedNumbers, totalValueCOP, totalValueUSD, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    ciudad: '',
    pais: '',
    whatsapp: ''
  });
  const { settings } = useAppContext();

  if (!isOpen || !settings) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatNumber = (num: number) => num.toString().padStart(3, '0');
  const formatCurrency = (amount: number, currency: 'COP' | 'USD') => {
    const options: Intl.NumberFormatOptions = { style: 'currency', currency };
    if (currency === 'COP' || (currency === 'USD' && amount % 1 === 0)) {
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 0;
    } else {
        options.minimumFractionDigits = 2;
        options.maximumFractionDigits = 2;
    }
    return amount.toLocaleString(currency === 'COP' ? 'es-CO' : 'en-US', options);
  };

  const showCOP = settings.payment_options.nequi.enabled;
  const showUSD = settings.payment_options.binance.enabled;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 font-quicksand" onClick={onClose}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", damping: 20 }} className="bg-gray-800 text-white border-2 border-cyan-400 rounded-3xl shadow-lg text-center w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-cyan-300">Registra tus Datos</h2>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="font-semibold">Números: <span className="text-cyan-300">{selectedNumbers.map(formatNumber).join(' ')}</span></p>
              <p className="font-bold">
                Total:{' '}
                {showCOP && <span className="text-cyan-300">{formatCurrency(totalValueCOP, 'COP')}</span>}
                {showCOP && showUSD && ' / '}
                {showUSD && <span className="text-cyan-300">{formatCurrency(totalValueUSD, 'USD')}</span>}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col text-left space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField id="nombre" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} icon={<User className="text-gray-400" size={20}/>} />
                <InputField id="apellido" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} icon={<User className="text-gray-400" size={20}/>} />
                <InputField id="ciudad" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleInputChange} icon={<Building className="text-gray-400" size={20}/>} />
                <InputField id="pais" name="pais" placeholder="País" value={formData.pais} onChange={handleInputChange} icon={<Globe className="text-gray-400" size={20}/>} />
              </div>
              <InputField id="whatsapp" name="whatsapp" type="tel" placeholder="Número de WhatsApp" value={formData.whatsapp} onChange={handleInputChange} icon={<Phone className="text-gray-400" size={20}/>} />
              
              <div className="flex justify-between gap-4 pt-4">
                <button type="submit" className="w-full py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">Continuar al Pago</button>
                <button type="button" onClick={onClose} className="w-full py-3 font-bold text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegistrationModal;
