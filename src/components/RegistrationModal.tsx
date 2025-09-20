import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { User, Building, Globe, Phone, Award, CheckCircle, XCircle } from 'lucide-react';

interface FormData {
  nombre: string;
  apellido: string;
  ciudad: string;
  pais: string;
  whatsapp: string;
  prize_type: 'cifras' | 'series';
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNumbers: number[];
  totalValueCOP: number;
  totalValueUSD: number;
  onSubmit: (formData: FormData) => void;
}

const NewInputField: React.FC<{ id: string, name: keyof FormData, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, icon: React.ReactNode, label: string, error?: string | null, success?: boolean }> = ({ id, name, placeholder, value, onChange, type = 'text', icon, label, error, success }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} required className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border focus:ring-1 focus:outline-none transition-colors ${error ? 'border-red-500 focus:ring-red-500' : success ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-500'}`} autoComplete="off" />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><XCircle size={14}/> {error}</p>}
    {success && <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><CheckCircle size={14}/> Válido</p>}
  </div>
);

const NewSelectField: React.FC<{ id: string, name: keyof FormData, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, icon: React.ReactNode, children: React.ReactNode, label: string }> = ({ id, name, value, onChange, icon, children, label }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <select id={id} name={name} value={value} onChange={onChange} required className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none appearance-none transition-colors">
        {children}
      </select>
    </div>
  </div>
);

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, selectedNumbers, totalValueCOP, totalValueUSD, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    ciudad: '',
    pais: '',
    whatsapp: '',
    prize_type: 'cifras'
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const { settings } = useAppContext();

  useEffect(() => {
    if (formData.nombre) {
      const nameParts = formData.nombre.trim().split(' ');
      if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
        setNameError('Debe incluir nombre y apellido.');
      } else {
        setNameError(null);
      }
    } else {
      setNameError(null);
    }
  }, [formData.nombre]);

  if (!isOpen || !settings) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameError) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as 'cifras' | 'series' });
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
  
  const cifrasOptionTitle = settings.winning_numbers.cifrasTitle || 'Premio por Cifras';
  const seriesOptionTitle = settings.winning_numbers.seriesTitle || 'Premio por Series';

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-quicksand" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-white rounded-2xl shadow-2xl text-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-cyan-500 text-center">Registra tus Datos</h2>
            
            <div className="bg-indigo-600 text-white p-4 rounded-lg text-center">
              <p className="font-semibold">Números: <span className="font-bold">{selectedNumbers.map(formatNumber).join(' ')}</span></p>
              <p className="font-bold text-lg">
                Total:{' '}
                {showCOP && <span className="">{formatCurrency(totalValueCOP, 'COP')}</span>}
                {showCOP && showUSD && ' / '}
                {showUSD && <span className="">{formatCurrency(totalValueUSD, 'USD')}</span>}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col text-left space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NewInputField id="nombre" name="nombre" label="Nombre Completo" placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={handleInputChange} icon={<User className="text-gray-400" size={20}/>} error={nameError} success={!nameError && formData.nombre.length > 0} />
                <NewInputField id="apellido" name="apellido" label="Apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} icon={<User className="text-gray-400" size={20}/>} />
              </div>
              <NewInputField id="ciudad" name="ciudad" label="Ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleInputChange} icon={<Building className="text-gray-400" size={20}/>} />
              <NewInputField id="pais" name="pais" label="País" placeholder="País" value={formData.pais} onChange={handleInputChange} icon={<Globe className="text-gray-400" size={20}/>} />
              <NewInputField id="whatsapp" name="whatsapp" label="Número de WhatsApp" type="tel" placeholder="Número de WhatsApp" value={formData.whatsapp} onChange={handleInputChange} icon={<Phone className="text-gray-400" size={20}/>} />
              
              <NewSelectField id="prize_type" name="prize_type" label="Elige tu Premio" value={formData.prize_type} onChange={handleSelectChange} icon={<Award className="text-cyan-500" size={20}/>}>
                <option value="cifras">{cifrasOptionTitle}</option>
                <option value="series">{seriesOptionTitle}</option>
              </NewSelectField>
              
              <div className="flex justify-center items-center gap-6 pt-4">
                <button type="submit" disabled={!!nameError} className="py-3 px-8 font-bold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/30 disabled:bg-gray-400 disabled:cursor-not-allowed">Continuar al Pago</button>
                <button type="button" onClick={onClose} className="py-3 font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegistrationModal;
