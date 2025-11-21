import { Container, Row, Col, Card, Image } from "react-bootstrap";
import "../assets/styles/estilos.css";
import "../assets/styles/nosotros.css";
import urnaImage from "../assets/img/UrnaImageNosotros.jpg";

export function Nosotros() {
    return (
        <div className="nosotros-page">
            {/* HERO SECTION */}
            <section className="nosotros-hero py-5">
                <Container>
                    <Row className="align-items-center g-5">
                        <Col lg={7}>
                            <h1 className="display-4 fw-bold mb-3 text-warning" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Descansos del Recuerdo
                            </h1>
                            <p className="lead">
                                Honramos la memoria de tus seres queridos con urnas funerarias de
                                calidad, diseño y respeto.
                            </p>
                        </Col>
                        <Col lg={5} className="text-center">
                            <Image
                                src={urnaImage}
                                alt="Urna funeraria"
                                fluid
                                rounded
                                className="shadow-lg border border-2 border-white"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CONTENIDO GRID */}
            <Container className="py-5">
                <Row className="g-4">
                    {/* 1. QUIÉNES SOMOS */}
                    <Col md={6}>
                        <Card className="h-100 shadow-sm info-card border-0">
                            <Card.Body className="p-4 position-relative">
                                <Card.Title className="mb-3 text-warning fw-bold">Quiénes somos</Card.Title>
                                <Card.Text>
                                    Somos una empresa dedicada a la fabricación y distribución de
                                    urnas funerarias con más de 35 años de trayectoria. Combinamos
                                    tradición artesanal con innovación para ofrecer un producto
                                    digno, resistente y lleno de significado.
                                </Card.Text>
                                {/* Icono decorativo de fondo */}
                                <div className="position-absolute top-0 end-0 p-3 opacity-25">
                                    <i className="bi bi-people-fill display-4 text-warning"></i>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 2. MISIÓN */}
                    <Col md={6}>
                        <Card className="h-100 shadow-sm info-card border-0">
                            <Card.Body className="p-4 position-relative">
                                <Card.Title className="mb-3 text-warning fw-bold">Nuestra Misión</Card.Title>
                                <Card.Text>
                                    Fusionamos la tradición artesanal e innovación, brindando
                                    productos y servicios que ofrezcan respeto, amor y cuidado hacia
                                    quienes ya no están.
                                </Card.Text>
                                {/* Icono decorativo: Brújula/Objetivo */}
                                <div className="position-absolute top-0 end-0 p-3 opacity-25">
                                    <i className="bi bi-compass-fill display-4 text-warning"></i>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 3. VALORES */}
                    <Col md={6}>
                        <Card className="h-100 shadow-sm info-card border-0">
                            <Card.Body className="p-4 position-relative">
                                <Card.Title className="mb-3 text-warning fw-bold">Nuestros Valores</Card.Title>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2"><i className="bi bi-heart-fill me-2 text-danger"></i> Respeto y empatía</li>
                                    <li className="mb-2"><i className="bi bi-brush me-2 text-primary"></i> Artesanía y detalle</li>
                                    <li><i className="bi bi-flower3 me-2 text-success"></i> Dignidad y armonía</li>
                                </ul>
                                {/* Icono decorativo: Diamante/Valor */}
                                <div className="position-absolute top-0 end-0 p-3 opacity-25">
                                    <i className="bi bi-gem display-4 text-warning"></i>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 4. SUSTENTABILIDAD */}
                    <Col md={6}>
                        <Card className="h-100 shadow-sm info-card border-0">
                            <Card.Body className="p-4 position-relative">
                                <Card.Title className="mb-3 text-warning fw-bold">Sustentabilidad</Card.Title>
                                <Card.Text>
                                    Nos comprometemos con el medio ambiente, utilizando materiales
                                    naturales y procesos respetuosos con la naturaleza.
                                </Card.Text>
                                {/* Icono decorativo: Hoja */}
                                <div className="position-absolute top-0 end-0 p-3 opacity-25">
                                    <i className="bi bi-leaf-fill display-4 text-success"></i>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* SECCIÓN CONTACTO - Fondo Madera (No Negro) */}
                <Row className="mt-4">
                    <Col>
                        <Card
                            className="text-white text-center p-4 shadow border-0"
                            // Usamos el color principal (Madera) para diferenciarlo del footer negro/gris
                            style={{ backgroundColor: 'var(--color-principal)', borderTop: '4px solid var(--color-secundario)' }}
                        >
                            <Card.Body>
                                <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-warning mb-3">
                                    Contáctanos
                                </h3>
                                <p className="mb-4 text-white-50">
                                    ¿Tienes dudas o deseas más información? Escríbenos, estaremos encantados de ayudarte.
                                </p>
                                <div className="d-flex justify-content-center gap-4 flex-wrap align-items-center">
                                    <span className="d-flex align-items-center gap-2 fs-5">
                                        <i className="bi bi-envelope-fill text-warning"></i>
                                        contacto@descansosdelrecuerdo.com
                                    </span>
                                    <span className="d-none d-md-block text-white-50">|</span>
                                    <span className="d-flex align-items-center gap-2 fs-5">
                                        <i className="bi bi-telephone-fill text-warning"></i>
                                        +56 9 1234 5676
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}