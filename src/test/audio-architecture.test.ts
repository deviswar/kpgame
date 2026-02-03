/**
 * Audio Architecture Tests
 * 
 * These tests ensure iOS Safari compatibility patterns are maintained.
 * They read source files and verify architectural rules are followed.
 * 
 * If any test fails, READ THE GOLDEN RULES at the top of audioManager.ts!
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const readSource = (relativePath: string): string => {
  return fs.readFileSync(path.resolve(__dirname, '..', relativePath), 'utf-8');
};

describe('Audio Manager Architecture Rules', () => {
  const audioManagerSource = readSource('lib/audioManager.ts');

  it('should have Golden Rules documentation header', () => {
    expect(audioManagerSource).toContain('iOS SAFARI AUDIO REQUIREMENTS');
    expect(audioManagerSource).toContain('DO NOT VIOLATE');
  });

  it('should NOT have warmRizzAudio or similar pre-warming functions', () => {
    // Remove comment blocks before checking for forbidden patterns
    // (the Golden Rules docs mention these as examples of what NOT to do)
    const codeWithoutComments = audioManagerSource
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '');         // Remove line comments
    
    // These patterns break iOS Safari audio - should not exist in actual code
    expect(codeWithoutComments).not.toMatch(/warmRizzAudio/i);
    expect(codeWithoutComments).not.toMatch(/rizzWarmAudio/i);
    expect(codeWithoutComments).not.toMatch(/prewarmRizz/i);
    expect(codeWithoutComments).not.toMatch(/bufferRizz/i);
  });

  it('should NOT have legacy WebAudio variables (cleaned up)', () => {
    // These were removed as they are no longer used
    expect(audioManagerSource).not.toContain('audioContext: AudioContext');
    expect(audioManagerSource).not.toContain('rizzAudioBuffer: AudioBuffer');
    expect(audioManagerSource).not.toContain('rizzGainNode: GainNode');
  });

  it('playRizz should create new Audio() inside the function (gesture context)', () => {
    // Extract the playRizz function body
    const playRizzMatch = audioManagerSource.match(
      /export const playRizz = \(\) => \{[\s\S]*?^\};/m
    );
    expect(playRizzMatch).toBeTruthy();
    
    const playRizzBody = playRizzMatch![0];
    
    // Must create Audio inside the function
    expect(playRizzBody).toContain('new Audio(');
    
    // Must call .play() inside the function
    expect(playRizzBody).toMatch(/\.play\(\)/);
  });

  it('playRizz should call audio.play() BEFORE startSilentUnlocker()', () => {
    const playRizzMatch = audioManagerSource.match(
      /export const playRizz = \(\) => \{[\s\S]*?^\};/m
    );
    expect(playRizzMatch).toBeTruthy();
    
    const playRizzBody = playRizzMatch![0];
    
    const playCallIndex = playRizzBody.indexOf('.play()');
    const silentUnlockerIndex = playRizzBody.indexOf('startSilentUnlocker()');
    
    expect(playCallIndex).toBeGreaterThan(-1);
    expect(silentUnlockerIndex).toBeGreaterThan(-1);
    expect(playCallIndex).toBeLessThan(silentUnlockerIndex);
  });

  it('precacheRizzAudio should only set flags, NOT create Audio', () => {
    const precacheMatch = audioManagerSource.match(
      /export const precacheRizzAudio[\s\S]*?^\};/m
    );
    expect(precacheMatch).toBeTruthy();
    
    const precacheBody = precacheMatch![0];
    
    // Should NOT create Audio elements
    expect(precacheBody).not.toContain('new Audio(');
    
    // Should set the preloaded flag
    expect(precacheBody).toContain('rizzPreloaded = true');
  });
});

describe('WelcomeScreen Audio Integration', () => {
  const welcomeScreenSource = readSource('components/game/WelcomeScreen.tsx');

  it('should NOT call preloadAllAudio() in mount useEffect', () => {
    // Find the mount useEffect (the one with empty deps [])
    const mountEffectMatch = welcomeScreenSource.match(
      /useEffect\(\(\)\s*=>\s*\{[\s\S]*?\},\s*\[\]\)/
    );
    expect(mountEffectMatch).toBeTruthy();
    
    const mountEffectBody = mountEffectMatch![0];
    
    // preloadAllAudio should NOT be called on mount
    expect(mountEffectBody).not.toContain('preloadAllAudio()');
  });

  it('should have early event handlers (pointerdown/touchstart) for audio', () => {
    // These fire earlier than onClick on mobile
    expect(welcomeScreenSource).toContain('onPointerDown');
    expect(welcomeScreenSource).toContain('onTouchStart');
  });

  it('should have a one-call guard ref to prevent double audio triggers', () => {
    // Should have a ref to prevent playRizz being called twice
    expect(welcomeScreenSource).toMatch(/useRef.*false/);
    expect(welcomeScreenSource).toContain('rizzTriggeredRef');
  });

  it('should call playRizz before setting state in handlers', () => {
    // The audio trigger handler should call playRizz immediately
    const audioTriggerMatch = welcomeScreenSource.match(
      /handleAudioTrigger[\s\S]*?playRizz\(\)/
    );
    expect(audioTriggerMatch).toBeTruthy();
  });

  it('should delay preloadAllAudio after first interaction', () => {
    // preloadAllAudio should be in a setTimeout, not called immediately
    expect(welcomeScreenSource).toMatch(/setTimeout[\s\S]*?preloadAllAudio/);
  });

  it('should have a build ID for production debugging', () => {
    expect(welcomeScreenSource).toContain('BUILD_ID');
  });
});

describe('DebugPanel Diagnostics', () => {
  const debugPanelSource = readSource('components/game/DebugPanel.tsx');

  it('should display rizz latency information', () => {
    expect(debugPanelSource).toContain('latencyMs');
    expect(debugPanelSource).toContain('Latency');
  });

  it('should display audio state (readyState, networkState)', () => {
    expect(debugPanelSource).toContain('readyState');
    expect(debugPanelSource).toContain('networkState');
  });
});
