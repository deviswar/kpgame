import { useNavigate } from 'react-router-dom';
import AirplaneAnimation from '@/components/game/AirplaneAnimation';

const AirplanePage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/welcome');
  };

  return <AirplaneAnimation onComplete={handleComplete} />;
};

export default AirplanePage;
