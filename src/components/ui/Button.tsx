import React, { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  href?: string;
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
  analyticsLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  href,
  to,
  size = 'md',
  className = 'w-full sm:w-auto',
  children,
  loading = false,
  analyticsLabel,
  onClick,
  disabled = false,
  ...rest
}) => {
  const baseClasses = 'btn';

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'border border-white/20 hover:border-white/50 text-white/80 hover:text-white',
    ghost: 'btn-ghost',
  };

  const sizeClasses = {
    sm: 'text-sm min-h-[40px] px-3 py-2',
    md: 'text-base min-h-[44px] px-4 sm:px-6 py-3',
    lg: 'text-lg min-h-[48px] px-6 sm:px-8 py-4',
  };

  const isDisabled = disabled || loading;
  const disabledClasses = isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  };

  const content = (
    <span className="inline-flex items-center justify-center gap-2">
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 border-2 border-white/60 border-t-white rounded-full animate-spin"
        />
      )}
      <span>{children}</span>
    </span>
  );

  const handleAnalyticsClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (analyticsLabel) {
      import('../../lib/analytics').then(({ trackCTA }) => trackCTA(analyticsLabel));
    }
    if (typeof onClick === 'function') {
      onClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
    }
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        aria-busy={loading}
        aria-disabled={isDisabled}
        data-analytics-cta={analyticsLabel}
        data-analytics-manual={analyticsLabel ? 'true' : undefined}
        onClick={handleAnalyticsClick}
        {...motionProps}
        {...(rest as Record<string, unknown>)}
      >
        {content}
      </motion.a>
    );
  }

  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link
          to={to}
          className={classes}
          aria-busy={loading}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
          data-analytics-cta={analyticsLabel}
          data-analytics-manual={analyticsLabel ? 'true' : undefined}
          onClick={handleAnalyticsClick}
          {...(rest as Record<string, unknown>)}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={classes}
      aria-busy={loading}
      disabled={isDisabled}
      data-analytics-cta={analyticsLabel}
      data-analytics-manual={analyticsLabel ? 'true' : undefined}
      onClick={handleAnalyticsClick}
      {...rest}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;