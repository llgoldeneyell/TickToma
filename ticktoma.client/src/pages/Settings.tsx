import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

type SettingsData = {
    workDuration: number;
    shortBreak: number;
    longBreak: number;
    soundEnabled: boolean;
    theme: 'light' | 'dark' | 'pomodoro';
};

const defaultSettings: SettingsData = {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    soundEnabled: true,
    theme: 'pomodoro',
};

export default function Settings() {
    const [settings, setSettings] = useState<SettingsData>(defaultSettings);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    // Carica impostazioni da localStorage all'avvio
    useEffect(() => {
        const saved = localStorage.getItem('ticktoma-settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const target = e.target;
        const name = target.name;

        let value: string | number | boolean;

        if (target instanceof HTMLInputElement) {
            if (target.type === 'checkbox') {
                value = target.checked;
            } else if (target.type === 'number') {
                value = Number(target.value);
            } else {
                value = target.value;
            }
        } else if (target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
            value = target.value;
        } else {
            throw new Error('Unsupported input element');
        }

        setSettings(prev => ({
            ...prev,
            [name]: value,
        }));
    }



    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        localStorage.setItem('ticktoma-settings', JSON.stringify(settings));
        setSavedMessage('Impostazioni salvate!');
        setTimeout(() => setSavedMessage(null), 3000);
    }

    return (
        <Container className="my-5" style={{ maxWidth: '500px' }}>
            <h2>Impostazioni</h2>
            <Form onSubmit={handleSave}>

                <Form.Group className="mb-3" controlId="workDuration">
                    <Form.Label>Durata Pomodoro (minuti)</Form.Label>
                    <Form.Control
                        type="number"
                        name="workDuration"
                        min={1}
                        max={120}
                        value={settings.workDuration}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="shortBreak">
                    <Form.Label>Pausa breve (minuti)</Form.Label>
                    <Form.Control
                        type="number"
                        name="shortBreak"
                        min={1}
                        max={60}
                        value={settings.shortBreak}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="longBreak">
                    <Form.Label>Pausa lunga (minuti)</Form.Label>
                    <Form.Control
                        type="number"
                        name="longBreak"
                        min={1}
                        max={120}
                        value={settings.longBreak}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="soundEnabled">
                    <Form.Check
                        type="switch"
                        label="Abilita suoni di notifica"
                        name="soundEnabled"
                        checked={settings.soundEnabled}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="theme">
                    <Form.Label>Tema</Form.Label>
                    <Form.Select name="theme" value={settings.theme} onChange={handleChange}>
                        <option value="light">Chiaro</option>
                        <option value="dark">Scuro</option>
                        <option value="pomodoro">Pomodoro</option>
                    </Form.Select>
                </Form.Group>

                <Button type="submit" variant="primary">Salva modifiche</Button>
                {savedMessage && <p className="mt-3 text-success">{savedMessage}</p>}
            </Form>
        </Container>
    );
}
