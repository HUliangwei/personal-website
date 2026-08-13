export interface MediaQueryState {
  matches: boolean;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

interface JourneyMotionOptions {
  desktop: MediaQueryState;
  reduced: MediaQueryState;
  initialize: () => Promise<() => void>;
}

export interface JourneyMotionController {
  dispose(): void;
}

export function createJourneyMotionController({
  desktop,
  reduced,
  initialize,
}: JourneyMotionOptions): JourneyMotionController {
  let activeDispose: (() => void) | undefined;
  let initializing: Promise<void> | undefined;
  let generation = 0;
  let disposed = false;

  const allowed = () => desktop.matches && !reduced.matches;

  const reconcile = () => {
    generation += 1;
    const currentGeneration = generation;

    if (!allowed()) {
      activeDispose?.();
      activeDispose = undefined;
      return;
    }
    if (activeDispose || initializing) return;

    initializing = initialize().then((nextDispose) => {
      initializing = undefined;
      if (disposed || !allowed() || currentGeneration !== generation) {
        nextDispose();
        if (!disposed && allowed()) reconcile();
        return;
      }
      activeDispose = nextDispose;
    });
  };

  const onChange = () => reconcile();
  desktop.addEventListener('change', onChange);
  reduced.addEventListener('change', onChange);
  reconcile();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      generation += 1;
      desktop.removeEventListener('change', onChange);
      reduced.removeEventListener('change', onChange);
      activeDispose?.();
      activeDispose = undefined;
    },
  };
}
