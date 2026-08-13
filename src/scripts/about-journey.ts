interface JourneyOptions {
  signal?: AbortSignal;
}

export function initAboutJourney(root: HTMLElement, { signal }: JourneyOptions = {}): () => void {
  if (signal?.aborted) return () => {};

  const stages = Array.from(root.querySelectorAll<HTMLElement>('[data-journey-stage]'));
  const progress = root.querySelector<HTMLElement>('[data-journey-progress]');
  const status = root.querySelector<HTMLElement>('[data-journey-status]');
  let frame = 0;
  let activeIndex = 0;
  let disposed = false;

  const setActive = (index: number) => {
    activeIndex = index;
    stages.forEach((stage, stageIndex) => {
      stage.toggleAttribute('data-active', stageIndex === index);
      if (stageIndex === index) stage.setAttribute('aria-current', 'step');
      else stage.removeAttribute('aria-current');
    });
    if (status) status.textContent = `${String(index + 1).padStart(2, '0')} / ${String(stages.length).padStart(2, '0')}`;
  };

  const updateProgress = () => {
    frame = 0;
    const bounds = root.getBoundingClientRect();
    const travel = Math.max(1, bounds.height - window.innerHeight);
    const value = Math.min(1, Math.max(0, -bounds.top / travel));
    root.style.setProperty('--journey-progress', String(value));
  };

  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(updateProgress);
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * 0.42) - Math.abs(b.boundingClientRect.top - window.innerHeight * 0.42));
    if (!visible.length) return;
    const nextIndex = stages.indexOf(visible[0].target as HTMLElement);
    if (nextIndex >= 0 && nextIndex !== activeIndex) setActive(nextIndex);
  }, { rootMargin: '-28% 0px -46%', threshold: [0, 0.2, 0.5] });

  stages.forEach((stage) => observer.observe(stage));
  root.setAttribute('data-journey-enhanced', '');
  setActive(0);
  updateProgress();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
    signal?.removeEventListener('abort', dispose);
    root.removeAttribute('data-journey-enhanced');
    root.style.removeProperty('--journey-progress');
  };

  signal?.addEventListener('abort', dispose, { once: true });
  return dispose;
}
