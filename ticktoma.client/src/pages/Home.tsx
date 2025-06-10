import { Container, Button, Row, Col } from 'react-bootstrap';

function Home() {
    return (
        <>
            <Container className="text-center my-5">
                <h1>Benvenuto in TickToma</h1>
                <p className="lead">Gestisci i tuoi Pomodoro per aumentare la produttività</p>
                <Button variant="warning" size="lg" href="timer">Inizia il Timer</Button>
            </Container>

            <Container className="my-5">
                <Row>
                    <Col md={4} className="text-center">
                        <h3>1. Imposta il timer</h3>
                        <p>Scegli la durata del tuo Pomodoro e delle pause.</p>
                    </Col>
                    <Col md={4} className="text-center">
                        <h3>2. Concentrati</h3>
                        <p>Lavora senza distrazioni fino al suono della pausa.</p>
                    </Col>
                    <Col md={4} className="text-center">
                        <h3>3. Riposa</h3>
                        <p>Rilassati e riparti per un altro ciclo produttivo.</p>
                    </Col>
                </Row>
            </Container>

            <footer className="text-center py-3 bg-light">
                <small>© 2025 TickToma. Tutti i diritti riservati.</small>
            </footer>
        </>
    );
}

export default Home;
