export class User {
    constructor(
        public id: number,
        public username: string,
        public password: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}

    //* Método para ocultar la contraseña al serializar...
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
