import { useState, useEffect } from 'react';
import { publicAssetUrl } from '@/lib/assetUrl';
import { getRizzStatus } from '@/lib/audioManager';

interface AssetCheck {
  name: string;
  url: string;
  status: 'pending' | 'ok' | 'error';
  error?: string;
}

/**
 * Debug Panel - only shows when ?debug=1 is in URL
 * Displays critical asset loading status for production debugging
 */
const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [assetChecks, setAssetChecks] = useState<AssetCheck[]>([]);
  const [rizzStatus, setRizzStatus] = useState<ReturnType<typeof getRizzStatus> | null>(null);

  useEffect(() => {
    // Only show in debug mode
    if (!window.location.search.includes('debug=1')) return;
    setIsVisible(true);

    // Check critical assets
    const assetsToCheck = [
      { name: 'Rizz Music', url: publicAssetUrl('music/rizz.mp3') },
      { name: 'Background Music', url: publicAssetUrl('music/background.mp3') },
      { name: 'QT Image (public)', url: publicAssetUrl('qt-girl.jpg') },
    ];

    const checks: AssetCheck[] = assetsToCheck.map(a => ({
      name: a.name,
      url: a.url,
      status: 'pending' as const,
    }));
    setAssetChecks([...checks]);

    // Run fetch checks
    assetsToCheck.forEach((asset, index) => {
      fetch(asset.url, { method: 'HEAD' })
        .then(res => {
          checks[index].status = res.ok ? 'ok' : 'error';
          checks[index].error = res.ok ? undefined : `HTTP ${res.status}`;
          setAssetChecks([...checks]);
        })
        .catch(err => {
          checks[index].status = 'error';
          checks[index].error = err.message;
          setAssetChecks([...checks]);
        });
    });

    // Poll rizz status
    const interval = setInterval(() => {
      setRizzStatus(getRizzStatus());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-2 right-2 z-[9999] bg-black/90 text-white text-xs p-3 rounded-lg max-w-[300px] font-mono shadow-lg border border-white/20">
      <div className="font-bold text-yellow-400 mb-2">🔧 Debug Panel</div>
      
      {/* Asset Checks */}
      <div className="mb-2">
        <div className="text-gray-400 mb-1">Asset Checks:</div>
        {assetChecks.map((check, i) => (
          <div key={i} className="flex items-center gap-1 mb-0.5">
            <span>
              {check.status === 'pending' && '⏳'}
              {check.status === 'ok' && '✅'}
              {check.status === 'error' && '❌'}
            </span>
            <span className="truncate">{check.name}</span>
            {check.error && <span className="text-red-400">({check.error})</span>}
          </div>
        ))}
      </div>

      {/* Rizz Status */}
      {rizzStatus && (
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="text-gray-400 mb-1">Rizz Audio:</div>
          <div>Playing: {rizzStatus.isPlaying ? '✅ Yes' : '❌ No'}</div>
          <div>Method: {rizzStatus.method || 'none'}</div>
          <div>Ready: {rizzStatus.preloaded ? '✅' : '❌'}</div>
          {rizzStatus.lastError && (
            <div className="text-red-400 break-words">Error: {rizzStatus.lastError}</div>
          )}
        </div>
      )}

      {/* URLs */}
      <div className="border-t border-white/20 pt-2 mt-2 text-[10px] text-gray-500">
        <div>BASE_URL: {import.meta.env.BASE_URL || '/'}</div>
      </div>
    </div>
  );
};

export default DebugPanel;
