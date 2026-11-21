type StoryExplorerControllerOptions = {
  root: HTMLElement;
  onActiveChange: (index: number) => void;
};

const DESKTOP_QUERY = "(min-width: 1024px)";

const ACTIVATION_POINT = 0.45;

export function createStoryExplorerController({
  root,
  onActiveChange,
}: StoryExplorerControllerOptions): () => void {
  const media = window.matchMedia(DESKTOP_QUERY);

  const items = Array.from(
    root.querySelectorAll<HTMLElement>("[data-story-explorer-item]"),
  );

  if (items.length === 0) {
    return () => {};
  }

  let activeIndex = 0;
  let scrollIndex = 0;

  let hoverIndex: number | null = null;
  let focusIndex: number | null = null;

  let frameId = 0;
  let running = false;

  let observer: IntersectionObserver | undefined;

  function activate(index: number) {
    if (index < 0 || index >= items.length || index === activeIndex) {
      return;
    }

    items[activeIndex]?.removeAttribute("data-active");

    activeIndex = index;

    items[activeIndex]?.setAttribute("data-active", "true");

    onActiveChange(activeIndex);
  }

  function resolveActiveIndex() {
    activate(hoverIndex ?? focusIndex ?? scrollIndex);
  }

  function getItemIndex(target: EventTarget | null): number | null {
    if (!(target instanceof Element)) {
      return null;
    }

    const item = target.closest<HTMLElement>("[data-story-explorer-item]");

    if (!item || !root.contains(item)) {
      return null;
    }

    const index = items.indexOf(item);

    return index >= 0 ? index : null;
  }

  function updateScrollIndex() {
    frameId = 0;

    if (!running) {
      return;
    }

    const activationPoint = window.innerHeight * ACTIVATION_POINT;

    let nextIndex = 0;

    for (let index = 0; index < items.length; index++) {
      const bounds = items[index].getBoundingClientRect();

      if (bounds.top <= activationPoint) {
        nextIndex = index;
      } else {
        break;
      }
    }

    scrollIndex = nextIndex;

    resolveActiveIndex();
  }

  function scheduleUpdate() {
    if (!running || frameId !== 0) {
      return;
    }

    frameId = window.requestAnimationFrame(updateScrollIndex);
  }

  function handleScroll() {
    hoverIndex = null;

    scheduleUpdate();
  }

  function handlePointerOver(event: PointerEvent) {
    if (event.pointerType === "touch") {
      return;
    }

    const previousIndex = getItemIndex(event.relatedTarget);

    const nextIndex = getItemIndex(event.target);

    if (previousIndex === nextIndex) {
      return;
    }

    hoverIndex = nextIndex;

    resolveActiveIndex();
  }

  function handlePointerOut(event: PointerEvent) {
    if (event.pointerType === "touch") {
      return;
    }

    const previousIndex = getItemIndex(event.target);

    const nextIndex = getItemIndex(event.relatedTarget);

    if (previousIndex === nextIndex) {
      return;
    }

    hoverIndex = nextIndex;

    resolveActiveIndex();
  }

  function handleFocusIn(event: FocusEvent) {
    focusIndex = getItemIndex(event.target);

    resolveActiveIndex();
  }

  function handleFocusOut(event: FocusEvent) {
    focusIndex = getItemIndex(event.relatedTarget);

    resolveActiveIndex();
  }

  function startScrollTracking() {
    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener("resize", scheduleUpdate, { passive: true });

    scheduleUpdate();
  }

  function stopScrollTracking() {
    window.removeEventListener("scroll", handleScroll);

    window.removeEventListener("resize", scheduleUpdate);

    if (frameId !== 0) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }

  function start() {
    if (running) {
      return;
    }

    running = true;

    items[activeIndex]?.setAttribute("data-active", "true");

    root.addEventListener("pointerover", handlePointerOver);

    root.addEventListener("pointerout", handlePointerOut);

    root.addEventListener("focusin", handleFocusIn);

    root.addEventListener("focusout", handleFocusOut);

    observer = new IntersectionObserver(([entry]) => {
      if (!running) {
        return;
      }

      if (entry?.isIntersecting) {
        startScrollTracking();
      } else {
        stopScrollTracking();
      }
    });

    observer.observe(root);
  }

  function stop() {
    running = false;

    observer?.disconnect();
    observer = undefined;

    stopScrollTracking();

    root.removeEventListener("pointerover", handlePointerOver);

    root.removeEventListener("pointerout", handlePointerOut);

    root.removeEventListener("focusin", handleFocusIn);

    root.removeEventListener("focusout", handleFocusOut);

    hoverIndex = null;
    focusIndex = null;
    scrollIndex = 0;

    items.forEach((item) => {
      item.removeAttribute("data-active");
    });

    if (activeIndex !== 0) {
      activeIndex = 0;

      onActiveChange(0);
    }
  }

  function syncMediaQuery() {
    if (media.matches) {
      start();
    } else {
      stop();
    }
  }

  media.addEventListener("change", syncMediaQuery);

  syncMediaQuery();

  return () => {
    stop();

    media.removeEventListener("change", syncMediaQuery);
  };
}
