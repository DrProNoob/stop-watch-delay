"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StopwatchPage() {
  const [delay, setDelay] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showStopwatch, setShowStopwatch] = useState(false);
  const [hideInput, setHideInput] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setHideInput(true);
    setHasStarted(true);

    console.log("Timer startet in", delay, "Minuten");
    
    setTimeout(() => {
      console.log("Großer Timer wird angezeigt");
      setShowStopwatch(true);
      setIsRunning(true); // Aktiviert auch den kleinen Timer!

      setTimeout(() => {
        console.log("Großer Timer wird ausgeblendet");
        setShowStopwatch(false);
      }, 60 * 1000);
    }, delay * 60 * 1000);
  };

  const stopTimer = () => {
    console.log("Timer gestoppt!");
    setIsRunning(false);
    setIsPaused(false);
    setShowStopwatch(false);
    setTime(0);
    setHideInput(false);
    setHasStarted(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}`;
    if (m > 0) return `${m}:${s.toString().padStart(2, "0")}`;
    return `${s}s`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-zinc-900 text-white">
      {/* Großer Timer */}
      {showStopwatch && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-9xl font-bold">{formatTime(time)}</div>
        </div>
      )}
  
      {/* Eingabe und Buttons */}
      <div className={`z-10 ${showStopwatch ? "mt-96" : ""} flex flex-col items-center space-y-4`}>
        {!hideInput && (
          <div className="flex flex-col items-center space-y-2">
            <label className="text-lg font-medium">
              Nach wie vielen Minuten soll der Timer angezeigt werden?
            </label>
            <Input
              type="number"
              placeholder="Minuten eingeben"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-40 text-center bg-zinc-800 text-white border-gray-600"
            />
          </div>
        )}
        <div className="space-y-8">
          {!hasStarted && (
            <Button className="bg-slate-50 text-black" onClick={startTimer}>
              Start
            </Button>
          )}
          {isRunning && (
            <div className="flex space-x-4 mt-4">
              <Button variant="destructive" onClick={stopTimer}>
                Stop
              </Button>
              <Button className="bg-zinc-800" onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? "Fortsetzen" : "Pause"}
              </Button>
            </div>
          )}
        </div>
      </div>
  
      {/* Kleiner Timer unten links */}
      {isRunning ? (
        <div className="absolute bottom-4 left-4 text-xl font-bold bg-black/50 px-4 py-2 rounded-lg">
          ⏳ {formatTime(time)}
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 text-gray-500 text-lg">
          Timer gestoppt
        </div>
      )}
    </div>
  );
}
