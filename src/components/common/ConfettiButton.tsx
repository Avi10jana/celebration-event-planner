import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

interface ConfettiButtonProps {
  label?: string;
  className?: string;
  variant?: 'primary' | 'gold' | 'secondary';
  onClickExtra?: () => void;
}

export const ConfettiButton: React.FC<ConfettiButtonProps> = ({
  label = 'Celebrate!',
  className = '',
  variant = 'gold',
  onClickExtra
}) => {
  const triggerCelebration = () => {
    // Canvas confetti celebratory burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#06b6d4', '#fde047']
    });

    if (onClickExtra) {
      onClickExtra();
    }
  };

  const btnClass = variant === 'primary' ? 'btn-primary' : variant === 'gold' ? 'btn-gold' : 'btn-secondary';

  return (
    <button
      type="button"
      className={`btn ${btnClass} ${className}`}
      onClick={triggerCelebration}
      title="Celebrate milestone!"
    >
      <Sparkles size={16} />
      <span>{label}</span>
    </button>
  );
};
