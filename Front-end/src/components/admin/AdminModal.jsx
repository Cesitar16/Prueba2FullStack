export default function AdminModal({ open, title, children, onClose, onSubmit, submitText="Guardar" }) {
    if (!open) return null;
    return (
        <div className="modal-backdrop" style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"grid", placeItems:"center", zIndex:1050
        }}>
            <div className="modal-content" style={{
                background:"#fff", borderRadius:10, maxWidth:600, width:"95%", boxShadow:"0 10px 30px rgba(0,0,0,.25)"
            }}>
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="m-0">{title}</h5>
                    <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Cerrar</button>
                </div>
                <div className="p-3">{children}</div>
                <div className="p-3 border-top d-flex justify-content-end gap-2">
                    <button className="btn btn-cancelar" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-guardar" onClick={onSubmit}>{submitText}</button>
                </div>
            </div>
        </div>
    );
}