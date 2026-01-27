import { useNavigate } from 'react-router-dom';
import MilkHospitalScreen from '@/components/game/MilkHospitalScreen';

const MilkHospitalPage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/airplane');
  };

  return <MilkHospitalScreen onComplete={handleComplete} />;
};

export default MilkHospitalPage;
