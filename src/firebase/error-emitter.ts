// src/firebase/error-emitter.ts
import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

// This is a simple event emitter that allows different parts of the application
// to communicate without being directly coupled. We will use it to broadcast
// Firestore permission errors to a central listener.

type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We extend the base EventEmitter and type it for our specific events.
class TypedEventEmitter extends EventEmitter {
  emit<T extends keyof AppEvents>(event: T, ...args: Parameters<AppEvents[T]>): boolean {
    return super.emit(event, ...args);
  }

  on<T extends keyof AppEvents>(event: T, listener: AppEvents[T]): this {
    return super.on(event, listener);
  }

  off<T extends keyof AppEvents>(event: T, listener: AppEvents[T]): this {
    return super.off(event, listener);
  }
}

// We export a singleton instance of our typed emitter.
export const errorEmitter = new TypedEventEmitter();
