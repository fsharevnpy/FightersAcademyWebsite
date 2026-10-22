"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { CourseVideo } from "@/content/media";

export function PracticeVideo({ video }: { video: CourseVideo }) {
  const id = useId();
  const player = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  function reportError(cause: unknown) {
    console.warn("[media] Practice video could not be played.", cause);
    setError(true);
  }
  async function start() {
    const element = player.current;
    if (!element) return;
    setStarted(true);
    element.src = video.src;
    element.focus({ preventScroll: true });
    try { await element.play(); } catch (cause) { reportError(cause); }
  }
  return <figure className="practice-video">
    <div className="practice-video-frame" style={{ aspectRatio: `${video.width} / ${video.height}` }}>
      <video ref={player} controls={started} playsInline muted preload="none" tabIndex={started ? 0 : -1}
        aria-hidden={!started} aria-label={video.caption} aria-describedby={`${id}-description`}
        onError={() => reportError(player.current?.error)} />
      {!started && <button type="button" className="practice-video-start" onClick={start} aria-label={`Xem video: ${video.caption}`}>
        <Image src={video.poster} alt="" fill sizes="(min-width: 1280px) 540px, (min-width: 768px) 45vw, calc(100vw - 40px)" loading="lazy" />
        <span><Play size={20} aria-hidden="true" />Xem thực hành · {video.duration} giây</span>
      </button>}
    </div>
    <figcaption>{video.caption}</figcaption>
    <p id={`${id}-description`} className="sr-only">{video.description}</p>
    {error && <p role="alert" className="field-error">Không phát được video. <a className="text-link" href={video.src}>Mở video trực tiếp</a></p>}
    <noscript><a className="text-link" href={video.src}>Mở video thực hành</a></noscript>
  </figure>;
}
