import { RolePos } from './role-pos';

export class UserPos {
    firstName: string;
    id: string;
    merchantId: string;
    merchantName: string;
    modifyUser: string;
    numeroIntentosFallidos: number;
    password: string;
    periodoBloqueoIntentosFallidosDate: string;
    periodoBloqueoIntentosFallidosTime: string;
    periodoCaducidadContrasena: string;
    registerDate: string;
    registerTime: string;
    secondName: string;
    solicitarCambioContra: string;
    tarjeta: string;
    tautentication: string;
    terminalSN: string;
    tipoDeEncriptacion: string;
    tipoUsuario: string;
    ultimoInicioSesionDate: string;
    ultimoInicioSesionTime: string;
    username: string;
    usuarioBloqueado: string;
    listRols: RolePos[];
    constructor() {
        this.usuarioBloqueado = '0';
    }
}