import { describe, it, expect } from 'vitest';
import {
    isValidEmail,
    isValidPrice,
    isValidStock,
    isValidPassword,
    isPositiveNumber,
    validateProductForm,
    isValidName,
    isValidAddress,
    isValidPhone,
    isRequired
} from './validators';

describe('Pruebas Unitarias: Validadores (validators.js)', () => {

    it('isValidEmail debe retornar true para un correo válido', () => {
        expect(isValidEmail('cliente@descansos.cl')).toBe(true);
        expect(isValidEmail('correo-sin-arroba.com')).toBe(false);
    });

    it('isValidPrice debe retornar false si el precio es negativo o cero', () => {
        expect(isValidPrice(-500)).toBe(false);
        expect(isValidPrice(0)).toBe(false);
        expect(isValidPrice(1000)).toBe(true);
    });

    it('isValidStock debe retornar true para stock 0 o mayor', () => {
        expect(isValidStock(0)).toBe(true);
        expect(isValidStock(10)).toBe(true);
        expect(isValidStock(-1)).toBe(false);
        expect(isValidStock('texto')).toBe(false);
    });

    it('isValidPassword debe validar que la contraseña tenga al menos 6 caracteres', () => {
        expect(isValidPassword('123456')).toBe(true);
        expect(isValidPassword('12345')).toBe(false);
        expect(isValidPassword('')).toBeFalsy();
    });

    it('isPositiveNumber debe validar si un valor es numérico y positivo', () => {
        expect(isPositiveNumber(50)).toBe(true);
        expect(isPositiveNumber("50")).toBe(true);
        expect(isPositiveNumber(0)).toBe(false);
        expect(isPositiveNumber(-10)).toBe(false);
        expect(isPositiveNumber("abc")).toBe(false);
    });

    it('isValidName solo acepta letras y espacios', () => {
        expect(isValidName('Juan Perez')).toBe(true);
        expect(isValidName('Maria Ñuñez')).toBe(true);
        expect(isValidName('Juan123')).toBe(false);
        expect(isValidName('')).toBe(false);
    });

    it('isValidAddress requiere al menos 5 caracteres', () => {
        expect(isValidAddress('Calle 123')).toBe(true);
        expect(isValidAddress('Av')).toBe(false);
        expect(isValidAddress(null)).toBeFalsy();
    });

    it('isValidPhone valida formato chileno básico', () => {
        expect(isValidPhone('+56912345678')).toBe(true);
        expect(isValidPhone('912345678')).toBe(true);
        expect(isValidPhone('12345678')).toBe(false);
        expect(isValidPhone('hola')).toBe(false);
    });

    it('isRequired valida que el campo no sea nulo o vacío', () => {
        expect(isRequired('Valor')).toBe(true);
        expect(isRequired(0)).toBe(true);
        expect(isRequired('')).toBe(false);
        expect(isRequired(null)).toBe(false);
        expect(isRequired(undefined)).toBe(false);
    });

    describe('validateProductForm', () => {
        it('Debe retornar un objeto de errores si el producto es inválido', () => {
            const productoInvalido = {
                nombre: '',
                precio: 0,
                stock: -5,
                idMaterial: '',
                idColor: '',
                idModelo: ''
            };
            const errores = validateProductForm(productoInvalido);

            expect(errores).toHaveProperty('nombre');
            expect(errores).toHaveProperty('precio');
            expect(errores).toHaveProperty('stock');
            expect(errores).toHaveProperty('idMaterial');
            expect(errores.nombre).toBe("El nombre es obligatorio.");
        });

        it('Debe retornar un objeto vacío si el producto es válido', () => {
            const productoValido = {
                nombre: 'Urna de Madera',
                precio: 50000,
                stock: 10,
                idMaterial: '1',
                idColor: '2',
                idModelo: '3'
            };
            const errores = validateProductForm(productoValido);
            expect(Object.keys(errores).length).toBe(0);
        });
    });
});