"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Find something happening this Friday.",
  "Discover something outside your faculty.",
  "Find your next adventure.",
  "See what your campus is up to.",
];

export function TypingRotator() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIndex];
    const speed = deleting ? 28 : 45;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        if (text.length > 0) {
          setText(current.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setPhraseIndex((i) => (i + 1) % PHRASES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex]);

  return (
    <span className="inline-flex items-center">
      {text}
      <span className="animate-caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-brand" />
    </span>
  );
}
