import { useNavigate } from 'react-router-dom';
import WelcomeScreen from '@/components/game/WelcomeScreen';
import { playGameMusic, stopRizz } from '@/lib/audioManager';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // CRITICAL: All audio actions MUST happen in user gesture context (same click)
    // 1. Stop rizz music immediately
    stopRizz();
    // 2. Start game music BEFORE navigation (in same click = valid gesture)
    playGameMusic();
    // 3. Then navigate
    navigate('/feed');
  };

  return <WelcomeScreen onStart={handleStart} />;
};

export default WelcomePage;
