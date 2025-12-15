// Global type definitions

// Cal.com global object
interface Window {
  Cal?: {
    (action: string, ...args: unknown[]): void;
    q?: unknown[][];
    ns?: Record<string, (...args: unknown[]) => void>;
    loaded?: boolean;
  };
}

// Declare module for importing CSS
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Declare module for importing images
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.webp';