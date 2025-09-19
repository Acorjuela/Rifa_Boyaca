import React from 'react';
import { motion } from 'framer-motion';

interface SubscribeButtonProps {
  onClick: () => void;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ onClick }) => {
  return (
    <div className="subscribe flex justify-center gap-2 mt-8 flex-wrap">
      <motion.button
        id="butt_arte"
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="custom-button -mt-7"
      >
        Juega con la lotería de Boyacá
      </motion.button>
    </div>
  );
};

export default SubscribeButton;
