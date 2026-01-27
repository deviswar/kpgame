import { useNavigate } from 'react-router-dom';
import CowFightScreen from '@/components/game/CowFightScreen';

const CowFightPage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/milk-hospital');
  };

  return <CowFightScreen onComplete={handleComplete} />;
};

export default CowFightPage;
