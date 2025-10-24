import { useState } from "react";
import { crearInventario } from "../../services/api";

export default function InventarioStep({ urnaId, onBack, onClose, onSuccess }) {
  const [data, setData] = useState({
    cantidadActual: 0,
    cantidadMaxima: 50,
    cantidadMinima: 5,
    ubicacionFisica: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      await crearInventario(urnaId, data);
      alert("Inventario configurado correctamente");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Error al configurar inventario");
    }
  };

  return (
    <div>
      <h3>Configurar Inventario</h3>

      <div className="form-group">
        <label>Cantidad actual</label>
        <input
          type="number"
          name="cantidadActual"
          value={data.cantidadActual}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Cantidad máxima</label>
        <input
          type="number"
          name="cantidadMaxima"
          value={data.cantidadMaxima}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Cantidad mínima</label>
        <input
          type="number"
          name="cantidadMinima"
          value={data.cantidadMinima}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Ubicación física</label>
        <input
          type="text"
          name="ubicacionFisica"
          value={data.ubicacionFisica}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={onBack}>← Atrás</button>
        <button className="btn btn-success" onClick={handleGuardar}>Guardar Inventario</button>
      </div>
    </div>
  );
}
