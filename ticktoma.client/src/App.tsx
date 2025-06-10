import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './pages/Home';
import Timer from './pages/Timer';
import Settings from './pages/Settings';
import './PomodoroTheme.css'; // Assumendo tema pomodoro
// Importa o crea pagine Timer e Settings
// import Timer from './pages/Timer';
// import Settings from './pages/Settings';

function App() {
    return (
        <Router>
            <Navbar expand="lg" className="navbar-pomodoro" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">TickToma</Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar-nav" />
                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/timer">Timer</Nav.Link>
                            <Nav.Link as={Link} to="/settings">Impostazioni</Nav.Link>
                            <Nav.Link href="#patreon">Patreon</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/timer" element={<Timer />} />
                    <Route path="/settings" element={<Settings />} /> 
                    {/* <Route path="/settings" element={<Settings />} /> */}
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
