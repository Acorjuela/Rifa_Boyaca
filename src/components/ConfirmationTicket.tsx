import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import { Ticket as TicketType } from '../types';
import { useAppContext } from '../context/AppContext';
import Barcode from './Barcode';
import confetti from 'canvas-confetti';

const ConfirmationTicket: React.FC<{ isOpen: boolean; onClose: () => void; ticket: TicketType; }> = ({ isOpen, onClose, ticket }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const { settings, prizes } = useAppContext();

  useEffect(() => {
    if (isOpen) {
      if (!confetti) {
        console.warn('Confetti library not loaded');
        return;
      }
      
      const duration = 2200;
      const end = Date.now() + duration;
      const colors = ['#a78bfa', '#60a5fa', '#22d3ee', '#f472b6'];

      (function frame() {
        // left side
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors, zIndex: 200 });
        // right side
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors, zIndex: 200 });

        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      // center burst
      setTimeout(() => {
        if (confetti) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: colors, zIndex: 200 });
        }
      }, 250);
    }
  }, [isOpen]);

  if (!isOpen || !settings) return null;

  const handleDownload = () => {
    if (ticketRef.current) {
      html2canvas(ticketRef.current, { backgroundColor: null, scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `ticket-rifa-${ticket.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const raffleDrawDate = new Date(settings.raffle_date);
  const formattedDate = raffleDrawDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = raffleDrawDate.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true });

  const paymentInfo = {
    nequi: {
      formatter: (amount: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount),
      label: "Referencia"
    },
    binance: {
      formatter: (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: amount % 1 === 0 ? 0 : 2 }).format(amount),
      label: "ID de Orden"
    },
  }[ticket.payment_platform];
  
  const ticketValueFormatted = paymentInfo.formatter(ticket.total_value);

  const formatSecureTicketId = (code: string) => {
    if (!code || code.length < 6) return 'xxxxxx';
    return code.slice(0, 6) + 'x'.repeat(code.length - 6);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] font-sans" 
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.8, y: 50, opacity: 0 }} 
          animate={{ scale: 1, y: 0, opacity: 1 }} 
          exit={{ scale: 0.8, y: 50, opacity: 0 }} 
          transition={{ type: "spring", damping: 20, stiffness: 300 }} 
          className="w-full max-w-md md:max-w-4xl mx-auto" 
          onClick={(e) => e.stopPropagation()}
        >
          <div ref={ticketRef} className="w-full bg-[#00529C] rounded-2xl shadow-2xl text-white flex flex-col md:flex-row overflow-hidden">
            {/* Stub */}
            <div className="w-full md:w-1/3 bg-[#00427C] p-6 flex flex-col justify-between items-center relative">
              <div className="transform md:-rotate-90 whitespace-nowrap origin-center mt-4 md:mt-24">
                <h3 className="text-4xl font-extrabold text-white" style={{ WebkitTextStroke: '1px #ef4444', textShadow: '0 0 5px #ef4444' }}>
                  Gran Rifa
                </h3>
              </div>
              <div className="space-y-4 text-center text-sm mt-4 md:mt-0">
                <div>
                  <p>FECHA: {formattedDate}</p>
                  <p>Hora del Sorteo: {formattedTime}</p>
                </div>
                <div>
                  <p>NÚMEROS: {ticket.numbers.map(n => n.toString().padStart(3, '0')).join(' ')}</p>
                </div>
                <div className="w-full">
                  <Barcode />
                </div>
              </div>
            </div>

            {/* Perforated Line */}
            <div className="border-b-2 md:border-b-0 md:border-l-2 border-dashed border-white/30"></div>

            {/* Main Body */}
            <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-extrabold text-white mb-4" style={{ WebkitTextStroke: '1px #ef4444', textShadow: '0 0 5px #ef4444' }}>
                  Gran Rifa
                </h2>
                <div className="flex justify-between text-sm border-b border-white/20 pb-2">
                  <span>TICKET</span>
                  <span>Serie: {ticket.payment_platform.toUpperCase()}</span>
                  <span>Nº: {formatSecureTicketId(ticket.ticket_code)}</span>
                </div>
                
                <div className="bg-white text-black p-4 rounded-md mt-4 flex justify-between items-start">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm w-full">
                    <div>
                      <p className="text-gray-600">COMPRADOR</p>
                      <p className="font-bold">{ticket.nombre} {ticket.apellido}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">NÚMEROS</p>
                      <p className="font-bold">{ticket.numbers.map(n => n.toString().padStart(3, '0')).join(' ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">UBICACIÓN</p>
                      <p className="font-bold">{ticket.ciudad}, {ticket.pais}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">WHATSAPP</p>
                      <p className="font-bold">{ticket.whatsapp}</p>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-red-600 text-right shrink-0 ml-4">
                    {ticketValueFormatted}
                  </p>
                </div>

                <div className="flex justify-between text-sm mt-4">
                  <span>FECHA: <span className="font-bold">{formattedDate}</span></span>
                  <span>Hora del Sorteo: <span className="font-bold">{formattedTime}</span></span>
                  <span>{paymentInfo.label}: <span className="font-bold">{ticket.reference}</span></span>
                </div>
                <div className="mt-4">
                  <Barcode />
                </div>
              </div>
              
              <div className="flex justify-around items-end mt-6">
                {prizes.filter(p => p.enabled && p.url).map((prize, index) => (
                    <img key={index} src={prize.url!} alt={`Premio ${index + 1}`} className="h-14 md:h-20 object-contain" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={handleDownload} className="w-full py-3 px-6 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Download size={18} /> Descargar Ticket
            </button>
            <button onClick={onClose} className="w-full py-2 text-white/80 font-semibold hover:bg-white/10 rounded-xl transition-colors">Cerrar</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationTicket;
