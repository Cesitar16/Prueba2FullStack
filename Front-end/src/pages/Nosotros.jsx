import "../assets/styles/estilos.css";
import "../assets/styles/nosotros.css";
import urnaImage from "../assets/img/UrnaImageNosotros.jpg";

export function Nosotros() {
  return (
    <div className="nosotros-page">
      {/* Sección principal */}
      <section className="nosotros-hero container py-5">
        <div className="row align-items-center g-4">
          {/* Texto principal */}
          <div className="col-lg-7 text-section">
            <h1 className="nosotros-title">Descansos del Recuerdo</h1>
            <p className="nosotros-subtitle">
              Honramos la memoria de tus seres queridos con urnas funerarias de
              calidad, diseño y respeto.
            </p>
          </div>

          {/* Imagen decorativa */}
          <div className="col-lg-5 text-center">
            <img
              src={urnaImage}
              alt="Urna funeraria"
              className="img-fluid urna-nosotros"
            />
          </div>
        </div>
      </section>

      {/* Sección de contenido */}
      <section className="container py-4">
        <div className="row gy-4">
          {/* QUIÉNES SOMOS */}
          <div className="col-lg-6">
            <div className="info-card">
              <h3>Quiénes somos</h3>
              <p>
                Somos una empresa dedicada a la fabricación y distribución de
                urnas funerarias con más de 35 años de trayectoria. Combinamos
                tradición artesanal con innovación para ofrecer un producto
                digno, resistente y lleno de significado.
              </p>
            </div>
          </div>

          {/* MISIÓN */}
          <div className="col-lg-6">
            <div className="info-card">
              <h3>Nuestra Misión</h3>
              <p>
                Fusionamos la tradición artesanal e innovación, brindando
                productos y servicios que ofrezcan respeto, amor y cuidado hacia
                quienes ya no están.
              </p>
              <div className="icon">
                <i className="bi bi-jar"></i>
              </div>
            </div>
          </div>

          {/* VALORES */}
          <div className="col-lg-6">
            <div className="info-card">
              <h3>Nuestros Valores</h3>
              <ul className="list-unstyled mb-0">
                <li>
                  <i className="bi bi-heart-fill me-2"></i> Respeto y empatía
                </li>
                <li>
                  <i className="bi bi-brush me-2"></i> Artesanía y detalle
                </li>
                <li>
                  <i className="bi bi-flower3 me-2"></i> Dignidad y armonía
                </li>
              </ul>
            </div>
          </div>

          {/* SUSTENTABILIDAD */}
          <div className="col-lg-6">
            <div className="info-card">
              <h3>Sustentabilidad</h3>
              <p>
                Nos comprometemos con el medio ambiente, utilizando materiales
                naturales y procesos respetuosos con la naturaleza.
              </p>
              <div className="icon">
                <i className="bi bi-leaf"></i>
              </div>
            </div>
          </div>

          {/* CONTACTO */}
          <div className="col-12">
            <div className="info-card text-center">
              <h3>Contáctanos</h3>
              <p>
                ¿Tienes dudas o deseas más información?  
                Escríbenos, estaremos encantados de ayudarte.
              </p>
              <p className="contact-info">
                <i className="bi bi-envelope-fill me-2"></i>
                contacto@descansosdelrecuerdo.com  
                <br />
                <i className="bi bi-telephone-fill me-2"></i> +56 9 1234 5676
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
