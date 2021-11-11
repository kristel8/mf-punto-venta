import { RolPosApplication } from './rol-pos-application';
import { Menu } from './menu';

export class RolePos {
    id: string;
    name: string;
    fullName: string;
    description: string;
    application: string;
    flagFiltroCadenaComercio: string;
    cadenaComercioId: string;
    flagFiltroGrupoTarjeta: string;
    grupoTarjetaId: string;
    rolTipo: string;
    modifyUser: string;
    modifyDate: string;
    modifyTime: string;
    listModules: Menu[];
}
