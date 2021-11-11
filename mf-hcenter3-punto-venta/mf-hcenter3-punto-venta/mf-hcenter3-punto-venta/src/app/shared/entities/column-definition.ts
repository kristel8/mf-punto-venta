export interface ColumnDefinition {
	columnDef: string;
	header: string;
	cell(element: any);

	filterActive?: boolean;//Añadido para agregar o quitar campoFiltro
	linkModal?: boolean; // Añadido para convertir a enlace 

}
