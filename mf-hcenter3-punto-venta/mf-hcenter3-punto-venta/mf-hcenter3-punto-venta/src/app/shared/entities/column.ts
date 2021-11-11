export class Column {
	id: string;
	columnOfTable: string;
	display: string;
	columnOfRelationalTable: string;
	innierTable: string;

	filterActive?: boolean;//Añadido para agregar o quitar campoFiltro
  	blockAdminCol?: boolean;
	linkModal?: boolean; // Añadido para convertir a enlace 
}
