import HttpStatusCode from '@configurations/HttpStatusCodes';


export interface IServiceErr {
  status: HttpStatusCode;
  msg: string;
}
