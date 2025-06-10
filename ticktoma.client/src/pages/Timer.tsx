import { useState, useEffect, useRef } from 'react';
import { Button, ProgressBar, Container } from 'react-bootstrap';

type SettingsData = {
    workDuration: number;
    shortBreak: number;
    longBreak: number;
    soundEnabled: boolean;
    theme: 'light' | 'dark' | 'pomodoro';
};

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export default function Timer() {
    const [phase, setPhase] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [cycle, setCycle] = useState(1);
    const [settings, setSettings] = useState<SettingsData>({
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        soundEnabled: true,
        theme: 'pomodoro',
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Carica impostazioni da localStorage all'avvio
    useEffect(() => {
        const saved = localStorage.getItem('ticktoma-settings');
        if (saved) {
            const parsed: SettingsData = JSON.parse(saved);
            setSettings(parsed);

            // Imposta secondsLeft iniziale in base alla fase corrente
            if (phase === 'work') setSecondsLeft(parsed.workDuration * 60);
            else if (phase === 'shortBreak') setSecondsLeft(parsed.shortBreak * 60);
            else setSecondsLeft(parsed.longBreak * 60);
        }
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev === 0) {
                        handlePhaseEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (!isRunning && intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    function handlePhaseEnd() {
        if (settings.soundEnabled) {
            // Puoi aggiungere qui il codice per far partire un suono (es. Audio API)
            console.log('Suono di notifica!');
        }

        alert(
            `Fase "${phase === 'work' ? 'Lavoro' : phase === 'shortBreak' ? 'Pausa breve' : 'Pausa lunga'
            }" terminata!`
        );

        const CYCLES_BEFORE_LONG_BREAK = 4;

        if (phase === 'work') {
            if (cycle < CYCLES_BEFORE_LONG_BREAK) {
                setPhase('shortBreak');
                setSecondsLeft(settings.shortBreak * 60);
            } else {
                setPhase('longBreak');
                setSecondsLeft(settings.longBreak * 60);
            }
        } else {
            if (phase === 'longBreak') {
                setCycle(1);
            } else {
                setCycle(cycle + 1);
            }
            setPhase('work');
            setSecondsLeft(settings.workDuration * 60);
        }
        setIsRunning(false);
    }

    function toggleStartPause() {
        setIsRunning(!isRunning);
    }

    function resetTimer() {
        setIsRunning(false);
        if (phase === 'work') setSecondsLeft(settings.workDuration * 60);
        else if (phase === 'shortBreak') setSecondsLeft(settings.shortBreak * 60);
        else setSecondsLeft(settings.longBreak * 60);
    }

    const totalDuration =
        phase === 'work'
            ? settings.workDuration * 60
            : phase === 'shortBreak'
                ? settings.shortBreak * 60
                : settings.longBreak * 60;

    const progress = ((totalDuration - secondsLeft) / totalDuration) * 100;

    return (
        <Container className="text-center my-5">
            <h2>
                {phase === 'work'
                    ? `Pomodoro ${cycle} di 4`
                    : phase === 'shortBreak'
                        ? 'Pausa breve'
                        : 'Pausa lunga'}
            </h2>
            <div style={{ fontSize: '5rem', margin: '20px 0' }}>{formatTime(secondsLeft)}</div>

            <ProgressBar
                now={progress}
                animated
                striped
                variant={phase === 'work' ? 'danger' : 'success'}
            />

            <div className="my-4">
                <Button
                    onClick={toggleStartPause}
                    variant={isRunning ? 'warning' : 'success'}
                    className="me-2"
                >
                    {isRunning ? 'Pausa' : 'Start'}
                </Button>
                <Button onClick={resetTimer} variant="secondary">
                    Reset
                </Button>
            </div>
        </Container>
    );
}
