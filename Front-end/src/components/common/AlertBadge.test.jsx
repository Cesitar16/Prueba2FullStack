import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertBadge } from './AlertBadge';

describe('Pruebas de Componente: AlertBadge', () => {

    it('Debe mostrar el mensaje "Agotado" y clase secundaria cuando stock es 0', () => {
        render(<AlertBadge stock={0} />);

        const badge = screen.getByText(/Agotado/i);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-secondary');
    });

    it('Debe mostrar alerta de stock bajo cuando es menor al límite', () => {
        render(<AlertBadge stock={3} />);

        const badge = screen.getByText(/Bajo \(3\)/i);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-danger');
    });

    it('Debe mostrar el stock normal y clase success cuando hay suficiente cantidad', () => {
        render(<AlertBadge stock={10} />);

        const badge = screen.getByText(/Stock: 10/i);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-success');
    });
});