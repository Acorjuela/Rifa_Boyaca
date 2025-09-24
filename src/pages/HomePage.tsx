import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

import Header from '../components/Header';
import Countdown from '../components/Countdown';
import Modal from '../components/Modal';
import WinnerDisplay from '../components/WinnerDisplay';
import NotificationModal from '../components/NotificationModal';
import { ArrowRight, Lock } from 'lucide-react';

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { settings, packages, notifications, isLoading } = useAppContext();

  useEffect(() => {
    if (!isLoading && notifications && notifications.some(n => n.is_enabled)) {
      setIsNotificationModalOpen(true);
    }
  }, [notifications, isLoading]);

  const handleAccept = useCallback(() => {
    setIsModalOpen(false);
    navigate('/registro');
  }, [navigate]);

  if (!settings || !packages) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  const targetDate = new Date(settings.raffle_date).getTime();
  const isRaffleEnded = new Date().getTime() > targetDate;
  
  const homeGradient = {
    backgroundImage: `linear-gradient(to bottom, ${settings?.colors?.home?.from || '#000759'}, ${settings?.colors?.home?.to || '#1b005b'})`
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden flex flex-col items-center justify-start pt-8 font-quicksand">
      <div className="absolute top-0 left-0 w-full h-full opacity-80 z-0" style={homeGradient}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15)_0,_transparent_60%)] z-0"></div>
      
      <div className="relative z-10 w-full">
        <Header />
        
        <main className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <motion.div
            className="w-full flex flex-col items-center gap-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center flex flex-col items-center">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                La Rifa que Cambia Vidas
              </h1>
              <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-300">
                Sorteo Especial de Boyacá. Apoya una buena causa y ten la oportunidad de ganar premios increíbles.
              </p>
              {isRaffleEnded ? (
                <div className="mt-8 flex items-center gap-2 bg-gray-700 text-gray-400 font-bold text-lg py-3 px-8 rounded-full shadow-lg">
                  <Lock size={20} /> ¡Sorteo Finalizado!
                </div>
              ) : (
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 255, 255, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 flex items-center gap-2 bg-cyan-500 text-gray-900 font-bold text-lg py-3 px-8 rounded-full shadow-lg transition-all"
                >
                  ¡Juega Ahora! <ArrowRight size={20} />
                </motion.button>
              )}
            </motion.div>

            {!isRaffleEnded && (
              <motion.div variants={itemVariants} className="w-full max-w-4xl">
                <Countdown targetDate={targetDate} onComplete={() => {}} />
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="w-full max-w-4xl mt-12">
              <WinnerDisplay />
            </motion.div>
          </motion.div>
        </main>
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAccept}
      />
      <NotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
