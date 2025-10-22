import "../assets/styles/estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="container">
        <div className="row">
          {/* Columna 1 */}
          <div className="col-lg-4 mb-4">
            <h5>Descansos Del Recuerdo</h5>
            <p>
              Con más de 35 años de experiencia, ofrecemos urnas funerarias de
              la más alta calidad que honran la memoria de sus seres queridos.
            </p>
          </div>

          {/* Columna 2 */}
          <div className="col-lg-4 mb-4">
            <h5>Contáctenos</h5>
            <div className="footer-contact">
              <p>
                <i className="bi bi-envelope me-2"></i>
                <a
                  href="mailto:contacto@descansosdelrecuerdo.com"
                  className="text-decoration-none"
                >
                  contacto@descansosdelrecuerdo.com
                </a>
              </p>
              <p>
                <i className="bi bi-telephone me-2"></i>
                <a
                  href="tel:+525512345678"
                  className="text-decoration-none"
                >
                  +52 55 1234 5678
                </a>
              </p>
              <p>
                <i className="bi bi-geo-alt me-2"></i>
                Av. Siempreviva 742, Ciudad de México
              </p>
            </div>
          </div>

          {/* Columna 3 */}
          <div className="col-lg-4 mb-4">
            <h5>Horario de Atención</h5>
            <p>Lunes a Viernes: 9:00 - 18:00</p>
            <p>Sábados: 10:00 - 14:00</p>
            <p>Domingos: Cerrado</p>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="copyright text-center">
          <p>© 2025 Descansos Del Recuerdo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
