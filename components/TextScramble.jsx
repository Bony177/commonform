"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_CHARS = "!<>-_\\/[]{}-=+*^?#________";

class TextScrambler {
  constructor(el, options = {}) {
    this.el = el;
    this.chars = options.chars || DEFAULT_CHARS;
    this.dudClassName = options.dudClassName || "dud";
    this.startMax = options.startMax ?? 40;
    this.endMax = options.endMax ?? 40;
    this.scrambleChance = options.scrambleChance ?? 0.28;
    this.frame = 0;
    this.frameRequest = null;
    this.queue = [];
    this.resolve = null;
    this.update = this.update.bind(this);
  }

  stop() {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
    this.frameRequest = null;
  }

  setText(newText) {
    const oldText = this.el.innerText || "";
    const nextText = String(newText ?? "");
    const length = Math.max(oldText.length, nextText.length);

    const promise = new Promise((resolve) => {
      this.resolve = resolve;
    });

    this.queue = [];
    for (let i = 0; i < length; i += 1) {
      const from = oldText[i] || "";
      const to = nextText[i] || "";
      const start = Math.floor(Math.random() * this.startMax);
      const end = start + Math.floor(Math.random() * this.endMax);
      this.queue.push({ from, to, start, end, char: "" });
    }

    this.stop();
    this.frame = 0;
    this.update();

    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0; i < this.queue.length; i += 1) {
      const item = this.queue[i];
      if (this.frame >= item.end) {
        complete += 1;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < this.scrambleChance) {
          item.char = this.randomChar();
        }
        output += `<span class="${this.dudClassName}">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      if (this.resolve) {
        this.resolve();
      }
      return;
    }

    this.frameRequest = requestAnimationFrame(this.update);
    this.frame += 1;
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

export default function TextScramble({
  as: Tag = "span",
  text,
  className,
  chars = DEFAULT_CHARS,
  dudClassName = "dud",
  startMax = 40,
  endMax = 40,
  scrambleChance = 0.28,
  animateOnView = false,
  once = true,
  inViewThreshold = 0.25,
  rootMargin = "0px 0px -10% 0px",
  replayKey,
  ...rest
}) {
  const elRef = useRef(null);
  const scramblerRef = useRef(null);
  const [canAnimate, setCanAnimate] = useState(!animateOnView);

  useEffect(() => {
    if (!elRef.current) {
      return undefined;
    }

    scramblerRef.current = new TextScrambler(elRef.current, {
      chars,
      dudClassName,
      startMax,
      endMax,
      scrambleChance,
    });

    return () => {
      scramblerRef.current?.stop();
      scramblerRef.current = null;
    };
  }, [chars, dudClassName, startMax, endMax, scrambleChance]);

  useEffect(() => {
    if (!animateOnView || !elRef.current) {
      setCanAnimate(true);
      return undefined;
    }

    setCanAnimate(false);
    const target = elRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }
        if (entry.isIntersecting) {
          setCanAnimate(true);
          if (once) {
            observer.disconnect();
          }
          return;
        }
        if (!once) {
          setCanAnimate(false);
        }
      },
      {
        threshold: inViewThreshold,
        rootMargin,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [animateOnView, once, inViewThreshold, rootMargin, replayKey]);

  useEffect(() => {
    if (!scramblerRef.current) {
      return;
    }
    if (!canAnimate) {
      if (elRef.current) {
        elRef.current.textContent = text ?? "";
      }
      return;
    }
    scramblerRef.current.setText(text ?? "");
  }, [text, replayKey, canAnimate]);

  return (
    <Tag ref={elRef} className={className} aria-label={text} {...rest}>
      {text}
    </Tag>
  );
}
