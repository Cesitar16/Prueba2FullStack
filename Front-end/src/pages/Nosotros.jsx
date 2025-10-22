import "../assets/styles/estilos.css";

/**
 * Nosotros.jsx
 * Página institucional "Descansos del Recuerdo SPA"
 */
export function Nosotros() {
  return (
    <div className="container my-5">
      {/* 🕊️ Sección principal */}
      <section className="text-center mb-5">
        <h1 className="titulo-seccion">Descansos del Recuerdo SPA</h1>
        <p className="lead text-muted mt-3">
          Honramos la memoria de tus seres queridos con urnas funerarias de
          calidad, diseño y respeto.
        </p>
      </section>

      {/* 📸 Imagen principal */}
      <section className="text-center mb-5">
        <img
          src="http://localhost/storage/image-about.webp"
          alt="Urnas artesanales"
          className="img-fluid rounded shadow-sm"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
      </section>

      {/* 👥 Quiénes somos */}
      <section className="mb-5">
        <h3 className="titulo-seccion">Quiénes Somos</h3>
        <p className="text-muted fs-5">
          Somos una empresa chilena dedicada a la fabricación y distribución de
          urnas funerarias con más de 35 años de trayectoria.  
          Combinamos tradición artesanal con materiales de alta calidad para
          ofrecer un producto digno, resistente y lleno de significado.
        </p>
      </section>

      {/* 🌱 Misión */}
      <section className="mb-5">
        <h3 className="titulo-seccion">Nuestra Misión</h3>
        <p className="text-muted fs-5">
          Acompañar a las familias en momentos difíciles, brindando productos y
          servicios que reflejen respeto, amor y cuidado hacia quienes ya no
          están físicamente, pero permanecen en nuestros recuerdos.
        </p>
      </section>

      {/* 💛 Valores */}
      <section className="mb-5">
        <h3 className="titulo-seccion">Nuestros Valores</h3>
        <div className="row text-center mt-4">
          <div className="col-md-4 mb-4">
            <i className="bi bi-heart display-5 text-warning"></i>
            <h5 className="mt-2">Respeto</h5>
            <p className="text-muted">
              Cada urna es elaborada con el máximo cuidado, como símbolo de amor
              eterno hacia nuestros seres queridos.
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="bi bi-brush display-5 text-warning"></i>
            <h5 className="mt-2">Artesanía</h5>
            <p className="text-muted">
              Fusionamos técnicas tradicionales con diseños modernos, logrando
              piezas únicas y elegantes.
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="bi bi-leaf display-5 text-warning"></i>
            <h5 className="mt-2">Sustentabilidad</h5>
            <p className="text-muted">
              Comprometidos con el medio ambiente, utilizamos materiales
              responsables y procesos ecológicos.
            </p>
          </div>
        </div>
      </section>

      {/* 📞 Contacto */}
      <section className="text-center my-5">
        <h3 className="titulo-seccion">Contáctanos</h3>
        <p className="text-muted fs-5 mb-3">
          ¿Tienes dudas o quieres más información sobre nuestros productos?
        </p>
        <p>
          <i className="bi bi-envelope-fill text-warning me-2"></i>
          <a
            href="mailto:contacto@descansosdelrecuerdo.com"
            className="text-decoration-none text-dark"
          >
            contacto@descansosdelrecuerdo.com
          </a>
        </p>
        <p>
          <i className="bi bi-telephone-fill text-warning me-2"></i>
          +56 9 1234 5678
        </p>
        <p>
          <i className="bi bi-geo-alt-fill text-warning me-2"></i>
          Av. Siempre Viva 742, Maipú – Santiago, Chile
        </p>
      </section>
    </div>
  );
}
