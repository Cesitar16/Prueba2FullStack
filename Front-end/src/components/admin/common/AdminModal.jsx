import "/src/assets/styles/admin-modal.css";
import { Modal, Button } from "react-bootstrap";

/**
 * AdminModal.jsx (genérico)
 * Modal reutilizable sin lógica de imágenes.
 * Renderiza {children} y botones estándar.
 */
export default function AdminModal({ open, title, children, onClose, onSubmit, submitText = "Guardar" }) {
    return (
        <Modal show={open} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {children}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                    {submitText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}