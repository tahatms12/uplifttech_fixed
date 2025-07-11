import React, { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  href,
  to,
  size = 'md',
  className = 'w-full sm:w-auto',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-violet focus:ring-offset-2 focus:ring-offset-rich-black';
  
  const variantClasses = {
    primary: 'bg-electric-violet hover:bg-opacity-90 text-white shadow-[0_0_20px_rgba(155,29,255,0.3)] w-full sm:w-auto',
    secondary: 'bg-deep-purple hover:bg-opacity-90 text-white w-full sm:w-auto',
    outline: 'border-2 border-electric-violet text-electric-violet hover:bg-electric-violet hover:bg-opacity-10 w-full sm:w-auto',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 sm:px-6 py-3',
    lg: 'px-6 sm:px-8 py-4 text-base sm:text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  };
  
  if (href) {
    return (
      <motion.a 
        href={href} 
        className={classes}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }
  
  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }
  
  return (
    <motion.button 
      className={classes} 
      {...props}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;