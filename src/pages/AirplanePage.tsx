import { useNavigate } from 'react-router-dom';
import AirplaneAnimation from '@/components/game/AirplaneAnimation';
import { stopAll } from '@/lib/audioManager';

const AirplanePage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Stop all music when going home
    stopAll();
    navigate('/');
  };

  // Music 3 (mourning) continues playing from audio manager (module singleton)
  return <AirplaneAnimation onComplete={handleComplete} />;
};

export default AirplanePage;
