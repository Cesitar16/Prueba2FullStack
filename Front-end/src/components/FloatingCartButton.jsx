export function FloatingCartButton() {
  return (
    <button
      className="floating-cart-btn"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#carritoModal"
      aria-label="Abrir carrito"
      title="Abrir carrito"
    >
      <i className="bi bi-cart3"></i>
    </button>
  );
}
