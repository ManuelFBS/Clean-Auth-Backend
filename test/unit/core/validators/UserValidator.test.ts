import { UserValidator } from '../../../../src/core/validators/UserValidator';
import { ValidationError } from '../../../../src/core/errors';

describe('UserValidator', () => {
    //* Test 'validateUsername'...
    describe('validateUsername', () => {
        it('should throw for empty username', () => {
            expect(() =>
                UserValidator.validateUsername(''),
            ).toThrow(ValidationError);
        });

        it('should throw for short username', () => {
            expect(() =>
                UserValidator.validateUsername('ab'),
            ).toThrow(ValidationError);
        });

        it('should not throw for valid username', () => {
            expect(() =>
                UserValidator.validateUsername(
                    'valid_user123',
                ),
            ).not.toThrow();
        });
    });

    //* Test 'validatePassword'...
    describe('validatePassword', () => {
        it('should throw for empty password', () => {
            expect(() =>
                UserValidator.validatePassword(''),
            ).toThrow(
                new ValidationError(
                    'Password is required...!',
                ),
            );
        });

        it('should throw for short password (< 8 chars)', () => {
            expect(() =>
                UserValidator.validatePassword('Ab1'),
            ).toThrow(ValidationError);
        });

        it('should throw for too long password', () => {
            expect(() =>
                UserValidator.validatePassword(
                    'AbcDEf10gt8u71tn',
                ),
            ).toThrow(ValidationError);
        });

        it('should throw for password without uppercase', () => {
            expect(() =>
                UserValidator.validatePassword('invalid1'),
            ).toThrow(ValidationError);
        });

        it('should throw for password without lowercase', () => {
            expect(() =>
                UserValidator.validatePassword('INVALID1'),
            ).toThrow(ValidationError);
        });

        it('should throw for password without numbers', () => {
            expect(() =>
                UserValidator.validatePassword('Invalid'),
            ).toThrow(ValidationError);
        });

        it('should not throw for valid password', () => {
            expect(() =>
                UserValidator.validatePassword(
                    'ValidPass123',
                ),
            ).not.toThrow();
        });

        //* Caso borde: exactamente 8 caracteres...
        it('should accept password with exactly 8 chars', () => {
            expect(() =>
                UserValidator.validatePassword('Abc1xt08'),
            ).not.toThrow();
        });

        //* Caso borde: exactamente 15 caracteres...
        it('should accept password with exactly 15 chars', () => {
            expect(() =>
                UserValidator.validatePassword(
                    'AbcDEf10gt8u71w',
                ),
            ).not.toThrow();
        });
    });
});
