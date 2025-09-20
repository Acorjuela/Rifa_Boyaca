import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeNotifications = notifications.filter(n => n.is_enabled);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen || activeNotifications.length === 0) return null;

  const currentNotification = activeNotifications[currentIndex];

  const goToNext = () => setCurrentIndex(prev => (prev + 1) % activeNotifications.length);
  const goToPrev = () => setCurrentIndex(prev => (prev - 1 + activeNotifications.length) % activeNotifications.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-[200] font-quicksand"
        style={{ background: 'rgb(0 0 0 / 60%)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
              <X size={24} />
            </button>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {currentNotification.video_url && (
                  <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                    <video src={currentNotification.video_url} className="w-full h-full object-contain" autoPlay loop muted playsInline />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-cyan-300">{currentNotification.title}</h3>
                <p className="text-gray-300 leading-relaxed">{currentNotification.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="mt-auto p-4 bg-black/20 flex justify-between items-center">
            {activeNotifications.length > 1 ? (
              <>
                <button onClick={goToPrev} className="p-2 rounded-full hover:bg-white/10"><ChevronLeft size={20} /></button>
                <div className="flex gap-2">
                  {activeNotifications.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
                  ))}
                </div>
                <button onClick={goToNext} className="p-2 rounded-full hover:bg-white/10"><ChevronRight size={20} /></button>
              </>
            ) : <div />}
            <button onClick={onClose} className="py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700">Entendido</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationModal;
