import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { usuariosApi } from "../../services/api";
import "../../assets/styles/animate.css";

/**
 * ConfirmarDatosStep.jsx
 * Paso de confirmación de datos del usuario logueado antes de la compra.
 * Obtiene automáticamente la dirección registrada desde el backend.
 */
export function ConfirmarDatosStep({ onConfirm, onBack }) {
  const { usuario } = useContext(AuthContext);
  const [direccion, setDireccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  // 📦 Cargar dirección del usuario logueado
  useEffect(() => {
    const cargarDireccion = async () => {
      if (!usuario?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await usuariosApi.getDireccionesByUsuario(usuario.id);
        if (res.data && res.data.length > 0) {
          setDireccion(res.data[0]); // Tomar la primera dirección del usuario
        } else {
          setDireccion(null);
        }
      } catch (err) {
        console.error("Error al obtener dirección:", err);
        setDireccion(null);
      } finally {
        setLoading(false);
      }
    };
    cargarDireccion();
  }, [usuario]);

  const handleConfirmar = async () => {
    setConfirming(true);
    try {
      // Aquí podrías incluir la lógica del POST del pedido en el futuro.
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulación
      onConfirm();
    } catch (err) {
      alert("Error al confirmar la compra.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 animate__animated animate__fadeInRight">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Cargando datos del usuario...</p>
      </div>
    );
  }

  return (
    <div className="animate__animated animate__fadeInRight">
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-outline-dark btn-sm me-2" onClick={onBack}>
          ←
        </button>
        <h5 className="m-0">✅ Confirmar tus datos</h5>
      </div>

      {usuario ? (
        <>
          <p className="text-muted">
            Revisa que tu información esté correcta antes de continuar:
          </p>

          <ul className="list-group mb-3 shadow-sm">
            <li className="list-group-item">
              <strong>Nombre:</strong> {usuario.nombre}
            </li>
            <li className="list-group-item">
              <strong>Correo:</strong> {usuario.correo}
            </li>
            {direccion ? (
              <>
                <li className="list-group-item">
                  <strong>Región:</strong> {direccion.region}
                </li>
                <li className="list-group-item">
                  <strong>Comuna:</strong> {direccion.comuna}
                </li>
                <li className="list-group-item">
                  <strong>Dirección:</strong> {direccion.calle}
                </li>
                <li className="list-group-item">
                  <strong>Teléfono:</strong> {direccion.telefono || "No registrado"}
                </li>
              </>
            ) : (
              <li className="list-group-item text-danger">
                No se encontró una dirección registrada. Por favor, verifica tus datos.
              </li>
            )}
          </ul>

          <button
            className="btn btn-success w-100"
            onClick={handleConfirmar}
            disabled={confirming}
          >
            {confirming ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i> Procesando...
              </>
            ) : (
              <>
                <i className="bi bi-bag-check-fill me-2"></i> Confirmar y proceder al pago
              </>
            )}
          </button>
        </>
      ) : (
        <p className="text-center text-muted py-4">
          No se encontró un usuario activo.
        </p>
      )}
    </div>
  );
}
