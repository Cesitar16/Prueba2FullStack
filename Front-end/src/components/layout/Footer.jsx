import { Container, Row, Col } from "react-bootstrap";
import "../../assets/styles/estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export function Footer() {
    return (
        // 1. Cambiamos 'bg-dark' por 'custom-footer'
        <footer className="mt-auto py-5 custom-footer">
            <Container>
                <Row className="gy-4">
                    {/* Columna 1: Marca e Identidad */}
                    <Col lg={4}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            {/* Puedes descomentar esto si quieres el ícono en el footer */}
                            {/* <i className="bi bi-dove fs-3 text-warning"></i> */}
                            <h5 className="mb-0">Descansos Del Recuerdo</h5>
                        </div>
                        <p className="small text-white-50" style={{ lineHeight: '1.8' }}>
                            Con más de 35 años de experiencia, ofrecemos urnas funerarias de
                            la más alta calidad, combinando la artesanía tradicional con un
                            profundo respeto para honrar la memoria de tus seres queridos.
                        </p>
                    </Col>

                    {/* Columna 2: Contacto */}
                    <Col lg={4}>
                        <h5 className="mb-3">Contáctenos</h5>
                        <div className="d-flex flex-column gap-3">
                            <a href="mailto:contacto@descansosdelrecuerdo.com" className="text-decoration-none d-flex align-items-center gap-2">
                                <i className="bi bi-envelope-fill text-warning"></i>
                                <span>contacto@descansosdelrecuerdo.com</span>
                            </a>
                            <a href="tel:+56912345678" className="text-decoration-none d-flex align-items-center gap-2">
                                <i className="bi bi-telephone-fill text-warning"></i>
                                <span>+56 9 1234 5678</span>
                            </a>
                            <div className="d-flex align-items-start gap-2">
                                <i className="bi bi-geo-alt-fill text-warning mt-1"></i>
                                <span>Av. Siempreviva 742, Santiago,<br/>Región Metropolitana</span>
                            </div>
                        </div>
                    </Col>

                    {/* Columna 3: Horario */}
                    <Col lg={4}>
                        <h5 className="mb-3">Horario de Atención</h5>
                        <ul className="list-unstyled text-white-50 d-flex flex-column gap-2">
                            <li className="d-flex justify-content-between border-bottom border-secondary pb-1" style={{maxWidth: '250px'}}>
                                <span>Lunes - Viernes</span>
                                <span className="text-white">9:00 - 18:00</span>
                            </li>
                            <li className="d-flex justify-content-between border-bottom border-secondary pb-1" style={{maxWidth: '250px'}}>
                                <span>Sábados</span>
                                <span className="text-white">10:00 - 14:00</span>
                            </li>
                            <li className="d-flex justify-content-between" style={{maxWidth: '250px'}}>
                                <span>Domingos</span>
                                <span className="text-warning">Cerrado</span>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <hr className="my-4" />

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-white-50 small">
                    <p className="mb-0">© 2025 Descansos Del Recuerdo. Todos los derechos reservados.</p>
                    <div className="d-flex gap-3 mt-2 mt-md-0">
                        <a href="#" className="text-white-50 hover-dorado">Privacidad</a>
                        <a href="#" className="text-white-50 hover-dorado">Términos</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}