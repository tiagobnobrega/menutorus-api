export interface Identifiable {
  id: number | string
}
export interface CrudProvider<D extends Identifiable, I = number>{
  create(businessData:Omit<D, 'id'>):Promise<D>;
  update(businessData:Partial<D> & Pick<D, 'id'>):Promise<D>;
  list(skip?:number, take?: number, ...args:any):Promise<D[]>;
  get(id:I): Promise<D | null>;
  delete(id:I): Promise<void>;
}
