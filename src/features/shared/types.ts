export interface Identifiable {
  id: number | string
}
export interface CrudProvider<D extends Identifiable, I = number>{
  create(data:Omit<D, 'id'>):Promise<D>;
  update(data:Partial<D> & Pick<D, 'id'>):Promise<D>;
  list(skip?:number, take?: number, ...args:any):Promise<D[]>;
  get(id:I): Promise<D | undefined>;
  delete(id:I): Promise<void>;
}
