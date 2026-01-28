import { useNavigate } from 'react-router-dom';
import MilkHospitalScreen from '@/components/game/MilkHospitalScreen';
import { playMourningMusic } from '@/lib/audioManager';

const MilkHospitalPage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/airplane');
  };

  const handleStartMourningMusic = () => {
    // Use centralized audio manager - Music 3 will persist across routes
    playMourningMusic();
  };

  return (
    <MilkHospitalScreen
      onComplete={handleComplete}
      onStartMourningMusic={handleStartMourningMusic}
    />
  );
};

export default MilkHospitalPage;
