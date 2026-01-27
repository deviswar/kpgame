import { useNavigate } from 'react-router-dom';
import WelcomeScreen from '@/components/game/WelcomeScreen';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/feed');
  };

  return <WelcomeScreen onStart={handleStart} />;
};

export default WelcomePage;
