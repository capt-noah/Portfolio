import React from 'react';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loader({ className = '', size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={`flex items-center gap-1 justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} 
        style={{ animationDelay: '0s' }}
      />
      <div 
        className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} 
        style={{ animationDelay: '0.15s' }}
      />
      <div 
        className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} 
        style={{ animationDelay: '0.3s' }}
      />
    </div>
  );
}
