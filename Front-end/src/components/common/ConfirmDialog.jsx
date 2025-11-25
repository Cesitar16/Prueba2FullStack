export default function ConfirmDialog({ open, title="Confirmar", message, onCancel, onConfirm, confirmText="Sí, continuar" }) {
    if (!open) return null;
    return (
        <div className="modal-backdrop" style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"grid", placeItems:"center", zIndex:1050
        }}>
            <div className="modal-content" style={{
                background:"#fff", borderRadius:10, maxWidth:480, width:"95%", boxShadow:"0 10px 30px rgba(0,0,0,.25)"
            }}>
                <div className="p-3 border-bottom">
                    <h5 className="m-0">{title}</h5>
                </div>
                <div className="p-3">
                    <p className="mb-0">{message}</p>
                </div>
                <div className="p-3 border-top d-flex justify-content-end gap-2">
                    <button className="btn btn-cancelar" onClick={onCancel}>Cancelar</button>
                    <button className="btn btn-outline-danger" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}