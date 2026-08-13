export interface HomeSceneMediaQuery {
  matches: boolean;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

interface HomeSceneMotionOptions {
  reduced: HomeSceneMediaQuery;
  initialize: (signal: AbortSignal) => Promise<() => void>;
}

export interface HomeSceneMotionController {
  suspend(): void;
  resume(): void;
  dispose(): void;
}

export function createHomeSceneMotionController({
  reduced,
  initialize,
}: HomeSceneMotionOptions): HomeSceneMotionController {
  let activeAbort: AbortController | undefined;
  let activeDispose: (() => void) | undefined;
  let initializing: Promise<void> | undefined;
  let generation = 0;
  let suspended = false;
  let disposed = false;

  const allowed = () => !disposed && !suspended && !reduced.matches;

  const stopActive = () => {
    activeAbort?.abort();
    activeAbort = undefined;
    activeDispose?.();
    activeDispose = undefined;
  };

  const reconcile = () => {
    if (!allowed()) {
      generation += 1;
      stopActive();
      return;
    }
    if (activeDispose || initializing) return;

    generation += 1;
    const currentGeneration = generation;
    const abortController = new AbortController();
    activeAbort = abortController;
    initializing = initialize(abortController.signal)
      .then((nextDispose) => {
        initializing = undefined;
        if (!allowed() || abortController.signal.aborted || currentGeneration !== generation) {
          nextDispose();
          if (allowed()) reconcile();
          return;
        }
        activeDispose = nextDispose;
      })
      .catch(() => {
        initializing = undefined;
        if (activeAbort === abortController) activeAbort = undefined;
        if (allowed() && currentGeneration !== generation) reconcile();
      });
  };

  const onMotionChange = () => reconcile();
  reduced.addEventListener('change', onMotionChange);
  reconcile();

  return {
    suspend() {
      if (disposed || suspended) return;
      suspended = true;
      reconcile();
    },
    resume() {
      if (disposed || !suspended) return;
      suspended = false;
      reconcile();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      generation += 1;
      reduced.removeEventListener('change', onMotionChange);
      stopActive();
    },
  };
}
