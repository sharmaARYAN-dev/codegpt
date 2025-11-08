import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

type ErrorEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We can't use the native EventEmitter because it's not available in the browser
// This is a simple polyfill.
class BrowserEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(l => l(...args));
  }
}


// This is a typed event emitter.
class TypedEventEmitter<T extends Record<string, (...args: any[]) => void>> {
  private emitter = new BrowserEventEmitter();

  on<K extends keyof T>(event: K, listener: T[K]) {
    this.emitter.on(event as string, listener);
  }

  off<K extends keyof T>(event: K, listener: T[K]) {
    this.emitter.off(event as string, listener);
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
    this.emitter.emit(event as string, ...args);
  }
}

export const errorEmitter = new TypedEventEmitter<ErrorEvents>();
