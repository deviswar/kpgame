import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MilkHospitalScreen from '@/components/game/MilkHospitalScreen';

const MilkHospitalPage = () => {
  const navigate = useNavigate();
  const mourningAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (mourningAudioRef.current) {
        mourningAudioRef.current.pause();
        mourningAudioRef.current.src = '';
        mourningAudioRef.current = null;
      }
    };
  }, []);

  const handleComplete = () => {
    navigate('/airplane');
  };

  const handleStartMourningMusic = () => {
    try {
      if (!mourningAudioRef.current) {
        const audio = new Audio('/music/mourning.mp3');
        audio.volume = 0.5;
        audio.loop = true;
        audio.preload = 'auto';
        mourningAudioRef.current = audio;
      }

      mourningAudioRef.current.currentTime = 0;
      mourningAudioRef.current.play().catch((e) => {
        console.error('Music 2 play failed:', e);
      });
    } catch (e) {
      console.error('Music 2 error:', e);
    }
  };

  return (
    <MilkHospitalScreen
      onComplete={handleComplete}
      onStartMourningMusic={handleStartMourningMusic}
    />
  );
};

export default MilkHospitalPage;
