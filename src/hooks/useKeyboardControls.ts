
import { useState, useEffect, useCallback } from 'react';
import { useKeyboardShortcut } from './useKeyboardShortcut';

interface KeyboardControlsOptions {
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onRotateUp?: () => void;
  onRotateDown?: () => void;
  onFlip?: () => void;
  onToggleAutoRotate?: () => void;
  onReset?: () => void;
  onEscape?: () => void;
}

/**
 * Hook for handling keyboard controls for card viewer
 * 
 * @param options Object containing callback functions for different keyboard controls
 */
export function useKeyboardControls(options: KeyboardControlsOptions = {}) {
  // Use the existing keyboard shortcut hook for each control
  useKeyboardShortcut('ArrowLeft', () => {
    if (options.onRotateLeft) options.onRotateLeft();
  }, { preventDefault: true });

  useKeyboardShortcut('ArrowRight', () => {
    if (options.onRotateRight) options.onRotateRight();
  }, { preventDefault: true });

  useKeyboardShortcut('ArrowUp', () => {
    if (options.onRotateUp) options.onRotateUp();
  }, { preventDefault: true });

  useKeyboardShortcut('ArrowDown', () => {
    if (options.onRotateDown) options.onRotateDown();
  }, { preventDefault: true });

  useKeyboardShortcut('f', () => {
    if (options.onFlip) options.onFlip();
  });

  useKeyboardShortcut('r', () => {
    if (options.onToggleAutoRotate) options.onToggleAutoRotate();
  });

  useKeyboardShortcut('0', () => {
    if (options.onReset) options.onReset();
  });

  useKeyboardShortcut('Escape', () => {
    if (options.onEscape) options.onEscape();
  });

  return { ...options };
}
