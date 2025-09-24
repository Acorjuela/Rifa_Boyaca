import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { settings } = useAppContext();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full py-4 px-6 flex justify-center items-center"
    >
      <div className="logo flex items-center justify-center">
        <img 
          id="loteria"
          src={settings?.logo_url || "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/120x120.png"} 
          alt="Logo Rifas de Boyacá" 
          className="w-full h-auto block mx-auto max-w-64 md:max-w-80"
        />
      </div>
    </motion.header>
  );
};

export default Header;
