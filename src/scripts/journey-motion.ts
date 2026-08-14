export interface MediaQueryState {
  matches: boolean;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

export interface JourneyMotionOptions {
  desktop: MediaQueryState;
  reduced: MediaQueryState;
  initialize: () => Promise<() => void>;
}

export interface JourneyMotionController {
  dispose(): void;
}

export interface JourneyInitializerOptions {
  signal: AbortSignal;
}

export type JourneyInitializer<Root> = (root: Root, options: JourneyInitializerOptions) => () => void;

export interface AboutJourneyBootstrapOptions<Root> {
  roots: Iterable<Root>;
  desktop: MediaQueryState;
  reduced: MediaQueryState;
  createController(options: JourneyMotionOptions): JourneyMotionController;
  createAbortController(): AbortController;
  loadJourney(): Promise<JourneyInitializer<Root>>;
}

export interface AboutJourneyBootstrap {
  mount(): void;
  teardown(): void;
  handlePageShow(event: { persisted: boolean }): void;
}

export function createAboutJourneyBootstrap<Root>({
  roots,
  desktop,
  reduced,
  createController,
  createAbortController,
  loadJourney,
}: AboutJourneyBootstrapOptions<Root>): AboutJourneyBootstrap {
  let controllers: JourneyMotionController[] = [];
  let generation = 0;
  const pendingAborts = new Set<AbortController>();

  const mount = () => {
    if (controllers.length) return;
    generation += 1;
    const mountGeneration = generation;

    controllers = Array.from(roots, (root) => createController({
      desktop,
      reduced,
      initialize: async () => {
        const abortController = createAbortController();
        pendingAborts.add(abortController);
        let initJourney: JourneyInitializer<Root>;
        try {
          initJourney = await loadJourney();
        } finally {
          pendingAborts.delete(abortController);
        }

        if (abortController.signal.aborted || mountGeneration !== generation) return () => {};

        const disposeJourney = initJourney(root, { signal: abortController.signal });
        let active = true;
        return () => {
          if (!active) return;
          active = false;
          abortController.abort();
          disposeJourney();
        };
      },
    }));
  };

  const teardown = () => {
    generation += 1;
    pendingAborts.forEach((abortController) => abortController.abort());
    pendingAborts.clear();
    controllers.forEach((controller) => controller.dispose());
    controllers = [];
  };

  return {
    mount,
    teardown,
    handlePageShow(event) {
      if (event.persisted) mount();
    },
  };
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
