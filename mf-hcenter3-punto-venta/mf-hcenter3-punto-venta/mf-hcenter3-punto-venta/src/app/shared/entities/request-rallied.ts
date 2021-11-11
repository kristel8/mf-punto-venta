import { Fields } from './fields';
import { IdTable } from './id-table';

export class RequestRallied {
  id: string;
  nameUser: string;
  windowSend: string;
  crudType: string;
  idTable: IdTable[];
  requestingUser: string;
  viewed: number;
  approved: number;
  comment: string;
  requestDate: string;
  approvedDate: string;
  fields: Fields[];

  constructor() {
    this.nameUser = '';
    this.windowSend = '';
    this.crudType = '';
    this.requestingUser = '';
    this.viewed = 0;
    this.approved = 0;
    this.comment = '';
    this.requestDate = '';
    this.approvedDate = '';
  }
}
