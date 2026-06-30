"use client";

import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { tarotCards } from "@/data/tarotCards";

const VISIBLE_RADIUS = 12;
const PIXELS_PER_CARD = 34;
const CLICK_DRAG_THRESHOLD = 7;
const ROTATE_STEP_CARDS = 3;
const WHEEL_SNAP_DELAY_MS = 140;
const ARC_DEPTH_REM = 23;
const ARC_SPACING_REM = 8.6;
const ARC_ROTATE_STEP = 4;
const HOVER_LIFT_REM = 0.75;
const SELECTED_LIFT_REM = 8.5;
const SELECTED_SCALE_BONUS = 0.06;
const SELECTED_ROTATE_FACTOR = 0.75;
const CONFIRM_TRANSITION_MS = 650;
const SHUFFLE_GATHER_MS = 420;
const SHUFFLE_SPLIT_MS = 360;
const SHUFFLE_RIFFLE_ONE_MS = 360;
const SHUFFLE_CUT_MS = 320;
const SHUFFLE_RIFFLE_TWO_MS = 360;
const SHUFFLE_RIFFLE_THREE_MS = 320;
const SHUFFLE_STACK_MS = 300;
const SHUFFLE_EXPAND_MS = 460;
const SHUFFLE_TOTAL_MS =
  SHUFFLE_GATHER_MS +
  SHUFFLE_SPLIT_MS +
  SHUFFLE_RIFFLE_ONE_MS +
  SHUFFLE_CUT_MS +
  SHUFFLE_RIFFLE_TWO_MS +
  SHUFFLE_RIFFLE_THREE_MS +
  SHUFFLE_STACK_MS +
  SHUFFLE_EXPAND_MS;
const SHUFFLE_SPLIT_AT_MS = SHUFFLE_GATHER_MS;
const SHUFFLE_RIFFLE_ONE_AT_MS = SHUFFLE_SPLIT_AT_MS + SHUFFLE_SPLIT_MS;
const SHUFFLE_CUT_AT_MS = SHUFFLE_RIFFLE_ONE_AT_MS + SHUFFLE_RIFFLE_ONE_MS;
const SHUFFLE_RIFFLE_TWO_AT_MS = SHUFFLE_CUT_AT_MS + SHUFFLE_CUT_MS;
const SHUFFLE_RIFFLE_THREE_AT_MS =
  SHUFFLE_RIFFLE_TWO_AT_MS + SHUFFLE_RIFFLE_TWO_MS;
const SHUFFLE_STACK_AT_MS =
  SHUFFLE_RIFFLE_THREE_AT_MS + SHUFFLE_RIFFLE_THREE_MS;
const SHUFFLE_EXPAND_AT_MS = SHUFFLE_STACK_AT_MS + SHUFFLE_STACK_MS;
const ARC_RADIUS_REM =
  (ARC_DEPTH_REM * ARC_DEPTH_REM + (VISIBLE_RADIUS * ARC_SPACING_REM) ** 2) /
  (2 * ARC_DEPTH_REM);

type CircularDeckCarouselDrawProps = {
  confirmLabel: string;
  onShuffleStateChange?: (isShuffling: boolean) => void;
  onConfirm: (selectedCardIds: string[]) => void;
  requiredSelectionCount: number;
  selectedLabel: string;
  shuffleSignal: number;
};

type ShufflePhase =
  | "idle"
  | "gather"
  | "split"
  | "riffle-one"
  | "cut"
  | "riffle-two"
  | "riffle-three"
  | "stack"
  | "expand";

type ArcLayout = {
  opacity: number;
  transform: string;
  zIndex: number;
};

function wrapSigned(value: number, length: number) {
  const wrapped = ((value + length / 2) % length + length) % length;
  return wrapped - length / 2;
}

function getArcLayout(
  visualOffset: number,
  selected: boolean,
  hovered: boolean,
  exiting: boolean,
  shufflePhase: ShufflePhase,
  deckIndex: number,
  shuffleSeed: number,
): ArcLayout {
  const normalizedOffset = visualOffset / VISIBLE_RADIUS;
  const edge = Math.min(1, Math.abs(normalizedOffset));
  const arcXRem = visualOffset * ARC_SPACING_REM;
  const isShuffling = shufflePhase !== "idle";
  const shuffleGroupCount = shuffleSeed % 2 === 0 ? 2 : 3;
  const shuffleGroup = (deckIndex + shuffleSeed) % shuffleGroupCount;
  const groupCenter = shuffleGroup - (shuffleGroupCount - 1) / 2;
  const shuffleSlot = ((deckIndex + shuffleSeed) % 9) - 4;
  const fineSlot = ((deckIndex * 3 + shuffleSeed) % 7) - 3;
  const depthSlot = ((deckIndex * 5 + shuffleSeed) % 11) - 5;
  const weaveDirection = shuffleGroup % 2 === 0 ? 1 : -1;
  const halfSign = (deckIndex + shuffleSeed) % 2 === 0 ? -1 : 1;
  const thirdBand = ((deckIndex + shuffleSeed) % 3) - 1;
  const shuffleXRem =
    shufflePhase === "gather"
      ? arcXRem * 0.28 + shuffleSlot * 0.14
      : shufflePhase === "split"
        ? groupCenter * 5.2 + fineSlot * 0.34
        : shufflePhase === "riffle-one"
          ? halfSign * 3.8 + fineSlot * 0.46 + weaveDirection * 1.05
          : shufflePhase === "cut"
            ? thirdBand * 3.6 + fineSlot * 0.26
            : shufflePhase === "riffle-two"
              ? halfSign * -3.25 + fineSlot * 0.54 + thirdBand * 0.85
              : shufflePhase === "riffle-three"
                ? groupCenter * -4.15 + fineSlot * 0.34 + weaveDirection * 0.72
                : shufflePhase === "stack"
                  ? shuffleSlot * 0.12
                  : arcXRem * 0.7 + groupCenter * 0.56;
  const xRem = isShuffling
    ? shuffleXRem
    : exiting && selected
      ? arcXRem * 0.32
      : arcXRem;
  const baseYRem =
    ARC_RADIUS_REM -
    Math.sqrt(Math.max(0, ARC_RADIUS_REM * ARC_RADIUS_REM - xRem * xRem));
  const baseRotate = visualOffset * ARC_ROTATE_STEP;
  const baseScale = Math.max(0.92, 1.06 - edge * 0.12);
  const shuffleBaseYRem =
    shufflePhase === "gather"
      ? -5.3 + edge * 1.35
      : shufflePhase === "split"
        ? -6.05 + Math.abs(groupCenter) * 0.42 + depthSlot * 0.03
        : shufflePhase === "riffle-one"
          ? -6.65 + halfSign * 0.42 + Math.abs(fineSlot) * 0.09
          : shufflePhase === "cut"
            ? -6.2 + thirdBand * 0.46 + depthSlot * 0.025
            : shufflePhase === "riffle-two"
              ? -6.95 - halfSign * 0.36 + Math.abs(fineSlot) * 0.11
              : shufflePhase === "riffle-three"
                ? -6.55 + groupCenter * 0.28 + depthSlot * 0.035
                : shufflePhase === "stack"
                  ? -7.95 + Math.abs(shuffleSlot) * 0.04
                  : -4.35 + edge * 1.35;
  const yRem =
    (isShuffling ? 2.2 : baseYRem) +
    (isShuffling ? shuffleBaseYRem : 0) +
    (hovered && !selected && !isShuffling ? -HOVER_LIFT_REM : 0) +
    (selected && !isShuffling ? -SELECTED_LIFT_REM : 0) +
    (exiting && selected ? -5.5 : 0);
  const rotate = isShuffling
    ? shufflePhase === "gather"
      ? baseRotate * 0.08 + fineSlot * 0.85
      : shufflePhase === "split"
        ? groupCenter * 5.2 + fineSlot * 0.95
        : shufflePhase === "riffle-one"
          ? halfSign * -4.8 + weaveDirection * 2.1 + fineSlot * 1.15
          : shufflePhase === "cut"
            ? thirdBand * 4.8 + fineSlot * 0.72
            : shufflePhase === "riffle-two"
              ? halfSign * 4.3 + thirdBand * -2.4 + fineSlot * 1.05
              : shufflePhase === "riffle-three"
                ? groupCenter * -4.8 + weaveDirection * 1.8 + fineSlot * 0.82
                : shufflePhase === "stack"
                  ? fineSlot * 0.54 + depthSlot * 0.13
                  : baseRotate * 0.45 + groupCenter * 1.25
    : selected
      ? baseRotate * (exiting ? 0.18 : SELECTED_ROTATE_FACTOR)
      : baseRotate;
  const scale = isShuffling
    ? shufflePhase === "expand"
      ? Math.max(0.86, baseScale - 0.06)
      : Math.max(0.78, 0.9 - Math.abs(shuffleSlot) * 0.009)
    : baseScale + (selected ? SELECTED_SCALE_BONUS : 0) + (exiting && selected ? 0.12 : 0);
  const opacity = isShuffling
    ? Math.max(0.74, 1 - edge * 0.12)
    : selected
      ? 1
      : Math.max(0.82, 1 - edge * 0.14) * (exiting ? 0.28 : 1);

  return {
    opacity,
    transform: `translateX(calc(-50% + ${xRem}rem)) translateY(${yRem}rem) rotate(${rotate}deg) scale(${scale})`,
    zIndex:
      Math.round(1000 + (visualOffset + VISIBLE_RADIUS) * 10) +
      (isShuffling ? 130 + depthSlot * 9 + shuffleGroup * 18 : 0) +
      (exiting && selected ? 500 : 0),
  };
}

function getCardStyle(layout: ArcLayout): CSSProperties {
  return {
    opacity: layout.opacity,
    transform: layout.transform,
    zIndex: layout.zIndex,
  };
}

function cardBackStyle(selected: boolean): CSSProperties {
  return {
    background:
      "radial-gradient(circle at 50% 44%, transparent 0 18%, color-mix(in srgb, var(--c-accent) 30%, transparent) 18.4% 18.9%, transparent 19.4%), radial-gradient(circle at 50% 44%, transparent 0 32%, color-mix(in srgb, var(--c-accent) 22%, transparent) 32.4% 32.9%, transparent 33.4%), linear-gradient(155deg, color-mix(in srgb, var(--card-face) 96%, var(--c-surface)), color-mix(in srgb, var(--c-surface-well) 50%, var(--card-face)))",
    borderColor: selected
      ? "color-mix(in srgb, var(--c-accent) 82%, var(--c-border))"
      : "color-mix(in srgb, var(--c-accent) 46%, var(--c-border))",
    boxShadow: selected
      ? "0 16px 34px color-mix(in srgb, var(--c-accent) 24%, transparent), inset 0 0 0 7px color-mix(in srgb, var(--c-surface) 42%, transparent), inset 0 0 0 8px color-mix(in srgb, var(--c-accent) 28%, transparent)"
      : "0 10px 24px color-mix(in srgb, var(--c-text) 14%, transparent), inset 0 0 0 7px color-mix(in srgb, var(--c-surface) 38%, transparent), inset 0 0 0 8px color-mix(in srgb, var(--c-accent) 20%, transparent)",
  };
}

function getShuffleRotationStep(fallbackSeed: number) {
  const randomBuffer = new Uint32Array(1);
  globalThis.crypto?.getRandomValues(randomBuffer);
  const randomValue = randomBuffer[0] || fallbackSeed * 17;

  return 9 + (randomValue % 21);
}

export function CircularDeckCarouselDraw({
  confirmLabel,
  onShuffleStateChange,
  onConfirm,
  requiredSelectionCount,
  selectedLabel,
  shuffleSignal,
}: CircularDeckCarouselDrawProps) {
  const [rotationOffset, setRotationOffset] = useState(0);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shufflePhase, setShufflePhase] = useState<ShufflePhase>("idle");
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const shuffleRunRef = useRef(0);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startRotation: number;
    moved: boolean;
  } | null>(null);
  const wheelSnapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shuffleTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const suppressClickRef = useRef(false);
  const pointerSelectionRef = useRef(false);
  const isZh = selectedLabel === "已选择";
  const isShuffling = shufflePhase !== "idle";
  const canHoverCards = !isDragging && !isExiting && !isShuffling;
  const deck = useMemo(() => tarotCards.slice(0, 78), []);
  const visibleCards = useMemo(
    () =>
      deck
        .map((card, deckIndex) => ({
          card,
          deckIndex,
          visualOffset: wrapSigned(deckIndex - rotationOffset, deck.length),
        }))
        .filter(({ visualOffset }) => Math.abs(visualOffset) <= VISIBLE_RADIUS)
        .sort((a, b) => a.visualOffset - b.visualOffset),
    [deck, rotationOffset],
  );

  useEffect(
    () => () => {
      if (wheelSnapTimerRef.current) {
        clearTimeout(wheelSnapTimerRef.current);
      }
      if (confirmTimerRef.current) {
        clearTimeout(confirmTimerRef.current);
      }
      shuffleTimersRef.current.forEach((timer) => clearTimeout(timer));
      onShuffleStateChange?.(false);
    },
    [onShuffleStateChange],
  );

  useEffect(() => {
    if (shuffleSignal <= 0 || isExiting) {
      return;
    }

    const runId = shuffleRunRef.current + 1;
    const reduceMotion =
      globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    shuffleRunRef.current = runId;
    shuffleTimersRef.current.forEach((timer) => clearTimeout(timer));
    shuffleTimersRef.current = [];
    clearWheelSnapTimer();
    dragStateRef.current = null;
    suppressClickRef.current = true;
    pointerSelectionRef.current = false;
    queueMicrotask(() => {
      if (shuffleRunRef.current !== runId) {
        return;
      }

      setHoveredCardId(null);
      setIsDragging(false);
      setSelectedCardIds([]);
      setShuffleSeed(runId);
      setShufflePhase("gather");
      onShuffleStateChange?.(true);
    });

    if (reduceMotion) {
      shuffleTimersRef.current.push(
        setTimeout(() => {
          if (shuffleRunRef.current !== runId) {
            return;
          }

          setRotationOffset((current) =>
            Math.round(current + getShuffleRotationStep(runId)),
          );
          setShufflePhase("idle");
          onShuffleStateChange?.(false);
        }, 220),
      );
      return;
    }

    shuffleTimersRef.current.push(
      setTimeout(() => {
        if (shuffleRunRef.current === runId) {
          setShufflePhase("split");
        }
      }, SHUFFLE_SPLIT_AT_MS),
      setTimeout(() => {
        if (shuffleRunRef.current === runId) {
          setShufflePhase("riffle-one");
        }
      }, SHUFFLE_RIFFLE_ONE_AT_MS),
      setTimeout(() => {
        if (shuffleRunRef.current === runId) {
          setShufflePhase("cut");
        }
      }, SHUFFLE_CUT_AT_MS),
      setTimeout(() => {
        if (shuffleRunRef.current === runId) {
          setShufflePhase("riffle-two");
        }
      }, SHUFFLE_RIFFLE_TWO_AT_MS),
      setTimeout(() => {
        if (shuffleRunRef.current === runId) {
          setShufflePhase("riffle-three");
        }
      }, SHUFFLE_RIFFLE_THREE_AT_MS),
      setTimeout(() => {
        if (shuffleRunRef.current === runId) {
          setRotationOffset((current) =>
            Math.round(current + getShuffleRotationStep(runId)),
          );
          setShufflePhase("stack");
        }
      }, SHUFFLE_STACK_AT_MS),
      setTimeout(() => {
        if (shuffleRunRef.current === runId) {
          setShufflePhase("expand");
        }
      }, SHUFFLE_EXPAND_AT_MS),
      setTimeout(() => {
        if (shuffleRunRef.current === runId) {
          setShufflePhase("idle");
          onShuffleStateChange?.(false);
        }
      }, SHUFFLE_TOTAL_MS),
    );
  }, [isExiting, onShuffleStateChange, shuffleSignal]);

  function clearWheelSnapTimer() {
    if (!wheelSnapTimerRef.current) {
      return;
    }

    clearTimeout(wheelSnapTimerRef.current);
    wheelSnapTimerRef.current = null;
  }

  function snapToNearestCard() {
    setRotationOffset((current) => Math.round(current));
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (isExiting || isShuffling) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    clearWheelSnapTimer();
    setHoveredCardId(null);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startRotation: rotationOffset,
      moved: false,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    const delta = event.clientX - dragStateRef.current.startX;

    if (Math.abs(delta) > CLICK_DRAG_THRESHOLD) {
      dragStateRef.current.moved = true;
    }

    setRotationOffset(dragStateRef.current.startRotation - delta / PIXELS_PER_CARD);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    suppressClickRef.current = dragStateRef.current.moved;
    dragStateRef.current = null;
    setIsDragging(false);
    snapToNearestCard();
  }

  function rotateDeck(direction: -1 | 1) {
    if (isExiting || isShuffling) {
      return;
    }

    clearWheelSnapTimer();
    setHoveredCardId(null);
    setRotationOffset((current) => Math.round(current + direction * ROTATE_STEP_CARDS));
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();

    if (isExiting || isShuffling) {
      return;
    }

    clearWheelSnapTimer();
    setHoveredCardId(null);

    const rawDelta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const direction = rawDelta > 0 ? 1 : -1;
    const amount = Math.min(3, Math.max(0.35, Math.abs(rawDelta) / 80));

    setRotationOffset((current) => current + direction * amount);
    wheelSnapTimerRef.current = setTimeout(() => {
      snapToNearestCard();
      wheelSnapTimerRef.current = null;
    }, WHEEL_SNAP_DELAY_MS);
  }

  function toggleCardSelection(cardId: string) {
    if (isExiting || isShuffling) {
      return;
    }

    setHoveredCardId(null);
    setSelectedCardIds((current) => {
      if (current.includes(cardId)) {
        return current.filter((selectedCardId) => selectedCardId !== cardId);
      }

      if (current.length >= requiredSelectionCount) {
        return current;
      }

      return [...current, cardId];
    });
  }

  function handleCardPointerUp(
    event: ReactPointerEvent<HTMLButtonElement>,
    cardId: string,
  ) {
    if (isShuffling || dragStateRef.current?.moved) {
      return;
    }

    event.stopPropagation();
    dragStateRef.current = null;
    setIsDragging(false);
    snapToNearestCard();
    pointerSelectionRef.current = true;
    toggleCardSelection(cardId);
  }

  function handleCardClick(cardId: string) {
    if (isShuffling) {
      return;
    }

    if (pointerSelectionRef.current) {
      pointerSelectionRef.current = false;
      return;
    }

    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    toggleCardSelection(cardId);
  }

  function handleConfirmClick() {
    if (isExiting || isShuffling || selectedCardIds.length !== requiredSelectionCount) {
      return;
    }

    clearWheelSnapTimer();
    setHoveredCardId(null);
    setIsExiting(true);
    confirmTimerRef.current = setTimeout(() => {
      onConfirm(selectedCardIds);
    }, CONFIRM_TRANSITION_MS);
  }

  function handleCardPointerEnter(
    event: ReactPointerEvent<HTMLButtonElement>,
    cardId: string,
    selected: boolean,
  ) {
    if (event.pointerType !== "mouse" || selected || !canHoverCards) {
      return;
    }

    setHoveredCardId(cardId);
  }

  function handleCardPointerLeave(cardId: string) {
    setHoveredCardId((current) => (current === cardId ? null : current));
  }

  return (
    <section
      className={`relative h-full w-screen max-w-none overflow-visible transition-opacity duration-500 ${
        isExiting ? "opacity-95" : "opacity-100"
      }`}
    >
      <header
        className={`pointer-events-none absolute left-1/2 top-[4.6rem] z-[1400] flex w-[min(32rem,calc(100vw-7rem))] -translate-x-1/2 flex-col items-center gap-3 text-center transition-all duration-500 sm:top-[4.9rem] sm:w-[min(36rem,calc(100vw-13rem))] ${
          isExiting || isShuffling ? "-translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        <div>
          <h1 className="font-serif text-[2.35rem] leading-none text-[color:var(--c-text)] drop-shadow-[0_1px_0_color-mix(in_srgb,var(--c-surface)_70%,transparent)] sm:text-[3.15rem]">
            {isZh ? "选择" : "Choose"}{" "}
            <span className="text-[color:var(--c-accent)]">
              {requiredSelectionCount}
            </span>{" "}
            {isZh
              ? "张牌"
              : `card${requiredSelectionCount === 1 ? "" : "s"}`}
          </h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--c-text-soft)]">
            {isZh
              ? `已选择 ${selectedCardIds.length} / ${requiredSelectionCount}`
              : `${selectedCardIds.length} / ${requiredSelectionCount} selected`}
          </p>
        </div>
        {selectedCardIds.length === requiredSelectionCount ? (
          <button
            className="pointer-events-auto rounded-full border border-[color:var(--c-accent)]/68 bg-[color:var(--c-accent)]/18 px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--c-accent)] shadow-[0_12px_30px_color-mix(in_srgb,var(--c-accent)_18%,transparent)] transition hover:bg-[color:var(--c-accent)]/24"
            disabled={isExiting || isShuffling}
            onClick={handleConfirmClick}
            type="button"
          >
            {confirmLabel}
          </button>
        ) : null}
      </header>

      <div className="absolute inset-x-0 bottom-0 h-[82dvh] overflow-visible">
        <button
          aria-label="Rotate deck left"
          className="fixed left-2 top-1/2 z-[1300] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--c-accent)]/38 bg-[color:var(--c-surface)]/80 text-2xl leading-none text-[color:var(--c-accent)] shadow-[0_10px_26px_color-mix(in_srgb,var(--c-text)_10%,transparent)] transition hover:border-[color:var(--c-accent)]/64 hover:bg-[color:var(--c-surface)] disabled:opacity-35 sm:left-6 sm:h-12 sm:w-12"
          disabled={isShuffling}
          onClick={() => rotateDeck(-1)}
          type="button"
        >
          ‹
        </button>
        <button
          aria-label="Rotate deck right"
          className="fixed right-2 top-1/2 z-[1300] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--c-accent)]/38 bg-[color:var(--c-surface)]/80 text-2xl leading-none text-[color:var(--c-accent)] shadow-[0_10px_26px_color-mix(in_srgb,var(--c-text)_10%,transparent)] transition hover:border-[color:var(--c-accent)]/64 hover:bg-[color:var(--c-surface)] disabled:opacity-35 sm:right-6 sm:h-12 sm:w-12"
          disabled={isShuffling}
          onClick={() => rotateDeck(1)}
          type="button"
        >
          ›
        </button>

        <div
          aria-label="Choose cards from the circular tarot deck"
          className={`relative mx-auto h-full w-screen max-w-none select-none overflow-visible ${
            isShuffling ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onPointerCancel={endDrag}
          onPointerDown={handlePointerDown}
          onPointerLeave={endDrag}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onWheel={handleWheel}
          role="listbox"
          style={{ touchAction: "none" }}
        >
          <div className="absolute inset-0">
            {visibleCards.map(({ card, deckIndex, visualOffset }) => {
              const isSelected = selectedCardIds.includes(card.id);
              const isHovered =
                hoveredCardId === card.id && !isSelected && canHoverCards;
              const layout = getArcLayout(
                visualOffset,
                isSelected,
                isHovered,
                isExiting,
                shufflePhase,
                deckIndex,
                shuffleSeed,
              );
              const cardStyle = getCardStyle(layout);

              return (
                <button
                  key={`${card.id}-${deckIndex}`}
                  aria-label={`Choose ${card.title}`}
                  aria-selected={isSelected}
                  className={`absolute bottom-[2rem] left-1/2 aspect-[9/16] h-[clamp(20rem,46dvh,32rem)] origin-bottom rounded-[1rem] border transition-[opacity,transform,border-color] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                    isDragging
                      ? "duration-0"
                      : isExiting
                        ? "duration-700"
                        : isShuffling
                          ? "duration-500"
                          : "duration-300"
                  }`}
                  disabled={isShuffling}
                  onClick={() => handleCardClick(card.id)}
                  onPointerEnter={(event) =>
                    handleCardPointerEnter(event, card.id, isSelected)
                  }
                  onPointerLeave={() => handleCardPointerLeave(card.id)}
                  onPointerUp={(event) => handleCardPointerUp(event, card.id)}
                  role="option"
                  style={{
                    ...cardStyle,
                    ...cardBackStyle(isSelected),
                  }}
                  type="button"
                >
                  <span className="pointer-events-none absolute inset-3 rounded-[0.7rem] border border-[color:var(--c-accent)]/24" />
                  <span className="pointer-events-none absolute left-1/2 top-[44%] h-[34%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--c-accent)]/44" />
                  <span className="pointer-events-none absolute left-1/2 top-[44%] h-px w-[62%] -translate-x-1/2 bg-[color:var(--c-accent)]/30" />
                  {isSelected ? (
                    <span className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[color:var(--c-accent)] shadow-[0_0_18px_color-mix(in_srgb,var(--c-accent)_55%,transparent)]" />
                  ) : null}
                  <span className="sr-only">{card.title}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
