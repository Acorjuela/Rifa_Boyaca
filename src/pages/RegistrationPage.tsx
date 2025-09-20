import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NumberSelector from '../components/NumberSelector';
import RegistrationModal from '../components/RegistrationModal';
import PaymentPlatformModal from '../components/PaymentPlatformModal';
import PaymentModal from '../components/PaymentModal';
import ConfirmationTicket from '../components/ConfirmationTicket';
import { Ticket } from '../types';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, CheckCircle, Ticket as TicketIcon } from 'lucide-react';
import toast from 'react-hot-toast';

function generateTicketCode(): string {
  let code = '';
  for (let i = 0; i < 16; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

interface UserInfo {
  nombre: string;
  apellido: string;
  ciudad: string;
  pais: string;
  whatsapp: string;
  prize_type: 'cifras' | 'series';
}

const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [currentModal, setCurrentModal] = useState<'userInfo' | 'platform' | 'payment' | null>(null);
  const [paymentPlatform, setPaymentPlatform] = useState<'nequi' | 'binance' | null>(null);
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [generatedTicketCode, setGeneratedTicketCode] = useState<string>('');
  const [finalTicket, setFinalTicket] = useState<Ticket | null>(null);
  
  const navigate = useNavigate();
  const { addTicket, packages, settings } = useAppContext();

  const selectedPackage = packages.find(p => p.id === selectedOptionId);

  const handleOptionChange = (pkgId: number) => {
    setSelectedOptionId(pkgId);
    setSelectedNumbers([]);
    setStep(2);
  };

  const handleNumberSelect = useCallback((numbers: number[]) => {
    setSelectedNumbers(numbers);
  }, []);

  const handleOpenRegisterModal = () => {
    if (isRegisterEnabled) setCurrentModal('userInfo');
  };

  const handleUserInfoSubmit = (formData: UserInfo) => {
    const code = generateTicketCode();
    setGeneratedTicketCode(code);
    setUserInfo(formData);
    setCurrentModal('platform');
  };

  const handlePlatformSelect = (platform: 'nequi' | 'binance') => {
    setPaymentPlatform(platform);
    setCurrentModal('payment');
  };

  const handlePaymentSuccess = async (reference: string) => {
    if (userInfo && selectedPackage && paymentPlatform) {
      const totalValue = (paymentPlatform === 'nequi' ? selectedPackage.price_cop : selectedPackage.price_usd) ?? 0;
      const ticketData: Omit<Ticket, 'id' | 'created_at' | 'is_approved'> = { 
        ...userInfo, 
        numbers: selectedNumbers, 
        total_value: totalValue,
        payment_platform: paymentPlatform,
        reference,
        ticket_code: generatedTicketCode,
      };
      
      try {
        await addTicket(ticketData);
        
        const localTicket: Ticket = {
            ...ticketData,
            id: Date.now(),
            created_at: new Date().toISOString(),
            is_approved: false,
        };

        setFinalTicket(localTicket);
      } catch (error: any) {
        toast.error(`Error al guardar el ticket: ${error.message}`);
      }
    }
  };

  const requiredNumberCount = selectedPackage ? selectedPackage.numbers : 0;
  const isRegisterEnabled = selectedNumbers.length === requiredNumberCount && selectedNumbers.length > 0;
  
  const formatUSD = (amount: number) => {
    const options: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' };
    if (amount % 1 === 0) {
      options.minimumFractionDigits = 0;
      options.maximumFractionDigits = 0;
    } else {
      options.minimumFractionDigits = 2;
      options.maximumFractionDigits = 2;
    }
    return amount.toLocaleString('en-US', options);
  };

  if (!settings) return null;

  return (
    <section className="font-quicksand text-white min-h-screen w-full flex justify-center items-center p-4 bg-reg-gradient">
      <video autoPlay muted loop id="video-bg" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover z-0">
        <source src="https://cdn.pixabay.com/vimeo/215697/small.mp4" type="video/mp4" />
      </video>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, type: 'spring' }} 
        className="relative z-10 bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl h-auto md:h-[90vh] flex flex-col p-8 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-300">Compra tu Rifa</h1>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Volver al Inicio
          </button>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center h-full">
                <TicketIcon className="text-cyan-400 mb-4" size={64} />
                <h2 className="text-2xl font-semibold mb-2">Paso 1: Elige tu paquete</h2>
                <p className="text-gray-400 mb-8 max-w-md text-center">Cada paquete te da una cantidad diferente de números para jugar.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                  {packages.map((pkg) => {
                    const paymentOptions = settings.payment_options || {};
                    const showCOP = paymentOptions.nequi?.enabled;
                    const showUSD = paymentOptions.binance?.enabled;
                    return (
                      <button key={pkg.id} onClick={() => handleOptionChange(pkg.id)} className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all duration-300">
                        <h3 className="font-bold text-lg">{pkg.label}</h3>
                        <p className="text-gray-300">
                          {showCOP && (pkg.price_cop ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                          {showCOP && showUSD && ' / '}
                          {showUSD && formatUSD(pkg.price_usd ?? 0)}
                        </p>
                        <p className="text-cyan-400 mt-2">{pkg.numbers} número{pkg.numbers > 1 ? 's' : ''}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && selectedPackage && (
              <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Paso 2: Selecciona tus números</h2>
                    <p className="text-gray-400">Has elegido el paquete {selectedPackage.label}. Selecciona {requiredNumberCount} número{requiredNumberCount > 1 ? 's' : ''}.</p>
                  </div>
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <ArrowLeft size={18} /> Cambiar Paquete
                  </button>
                </div>
                <div className="flex-grow overflow-hidden">
                  <NumberSelector maxNumbers={requiredNumberCount} onNumbersSelect={handleNumberSelect} />
                </div>
                <div className="mt-6 text-center">
                  <motion.button onClick={handleOpenRegisterModal} disabled={!isRegisterEnabled} className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto py-3 px-6 text-lg font-bold border-none rounded-full cursor-pointer bg-green-500 text-white transition-all duration-300 ease-in-out hover:enabled:bg-green-600 hover:enabled:shadow-lg hover:enabled:shadow-green-500/50 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <CheckCircle size={22} /> Continuar al Registro
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {selectedPackage && <RegistrationModal isOpen={currentModal === 'userInfo'} onClose={() => setCurrentModal(null)} selectedNumbers={selectedNumbers} totalValueCOP={selectedPackage.price_cop ?? 0} totalValueUSD={selectedPackage.price_usd ?? 0} onSubmit={handleUserInfoSubmit} />}
      {paymentPlatform && selectedPackage && <PaymentModal isOpen={currentModal === 'payment'} onClose={() => setCurrentModal('platform')} onPaymentSuccess={handlePaymentSuccess} totalValue={(paymentPlatform === 'nequi' ? selectedPackage.price_cop : selectedPackage.price_usd) ?? 0} platform={paymentPlatform} />}
      <PaymentPlatformModal isOpen={currentModal === 'platform'} onClose={() => setCurrentModal('userInfo')} onPlatformSelect={handlePlatformSelect} />
      {finalTicket && <ConfirmationTicket isOpen={true} onClose={() => navigate('/')} ticket={finalTicket} />}
    </section>
  );
};

export default RegistrationPage;
