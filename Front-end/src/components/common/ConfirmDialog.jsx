import { Modal, Button } from "react-bootstrap";

export default function ConfirmDialog({ open, title="Confirmar", message, onCancel, onConfirm, confirmText="Sí, continuar" }) {
    return (
        <Modal show={open} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button variant="outline-danger" onClick={onConfirm}>{confirmText}</Button>
            </Modal.Footer>
        </Modal>
    );
}