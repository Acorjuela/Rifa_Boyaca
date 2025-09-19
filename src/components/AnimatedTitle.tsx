import React from 'react';
import { motion } from 'framer-motion';

const AnimatedTitle: React.FC = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="text-center mb-16 px-4 -mt-20">
      <motion.div
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="animated-title"
      >
        <div className="title-wrapper">
          <div className="title-line"></div>
          
          <motion.h1 className="title-letters text-3xl md:text-5xl lg:text-6xl">
            <motion.span variants={letterVariants} className="inline-block">
              SENSACIONAL RIFA
            </motion.span>
            <br />
            <motion.span 
              variants={letterVariants} 
              className="title-ampersand inline-block text-2xl md:text-4xl lg:text-5xl"
            >
              EN APOYO A TODOS
            </motion.span>
            <br />
            <motion.span 
              variants={letterVariants} 
              className="inline-block"
            >
              NUESTROS NIÑ@S
            </motion.span>
          </motion.h1>
          
          <div className="title-line"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedTitle;
