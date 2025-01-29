"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StopwatchPage() {
  const [delay, setDelay] = useState(0); // Verzögerung in Minuten
  const [showDelay, setShowDelay] = useState(0); // Dauer, wie lange der Timer angezeigt werden soll
  const [time, setTime] = useState(0); // Timer-Zeit
  const [isRunning, setIsRunning] = useState(false); // Timer läuft
  const [isPaused, setIsPaused] = useState(false); // Timer ist pausiert
  const [showStopwatch, setShowStopwatch] = useState(false); // Großer Timer sichtbar
  const [hideInput, setHideInput] = useState(false); // Eingabefeld verstecken
  const [hasStarted, setHasStarted] = useState(false); // Timer gestartet

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Wenn der Timer läuft und nicht pausiert ist, erhöhe die Zeit jede Sekunde
    if (isRunning && !isPaused) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setHideInput(true);
    setHasStarted(true);

    console.log("Timer startet sofort!");

    // Starte sofort den kleinen Timer
    setIsRunning(true);

    // Setze die Verzögerung für die Anzeige des großen Timers
    setTimeout(() => {
      console.log("Großer Timer wird angezeigt");
      setShowStopwatch(true);

      // Der große Timer wird nach der angegebenen Dauer wieder ausgeblendet (showDelay)
      setTimeout(() => {
        console.log("Großer Timer wird ausgeblendet");
        setShowStopwatch(false);
      }, showDelay * 60 * 1000); // Dauer in Minuten, wie lange der Timer angezeigt wird
    }, delay * 60 * 1000); // Delay in Minuten
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
    <div className="relative flex items-center justify-center h-screen bg-zinc-900 text-white">
      {/* Großer Timer */}
      {showStopwatch && (
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none mb-9">
          <div className="text-[15rem] font-bold">{formatTime(time)}</div>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4 mt-40 z-10 relative">
        {/* Eingabefeld für die Minuten */}
        {!hideInput && (
          <div className="flex flex-col items-center space-y-2">
            <label className="text-xl font-medium">Nach wie vielen Minuten soll der Timer eingeblendet werden?</label>
            <Input
              type="number"
              placeholder="Minuten eingeben"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-40 text-center bg-zinc-800 text-white border-gray-600"
            />
            <label className="text-xl font-medium">Wie lange soll der Timer angezeigt werden?</label>
            <Input
              type="number"
              placeholder="Minuten eingeben"
              value={showDelay}
              onChange={(e) => setShowDelay(Number(e.target.value))}
              className="w-40 text-center bg-zinc-800 text-white border-gray-600"
            />
          </div>
        )}

        {/* Buttons für Start/Pause/Stop */}
        <div className="mt-9">
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
        <div className="absolute bottom-4 left-4 text-xl font-bold bg-black/50 px-4 py-2 rounded-lg z-20">
          ⏳ {formatTime(time)}
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 text-gray-500 text-lg z-20">
          Timer gestoppt
        </div>
      )}
    </div>
  );
}
