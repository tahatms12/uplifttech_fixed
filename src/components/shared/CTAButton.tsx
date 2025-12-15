import React from 'react';
import Button from '../ui/Button';

type Variant = 'primary' | 'secondary' | 'outline';

interface CTAButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button'
}) => {
  return (
    <Button
      to={to}
      href={href}
      onClick={onClick}
      variant={variant}
      size={size}
      className={className ?? 'w-auto'}
      type={type}
    >
      {children}
    </Button>
  );
};

export default CTAButton;
