export class Restaurant {
  constructor(
    public uuid: string,
    public cover: string,
    public name: string,
    public short_name: string,
    public cuisines: string[],
    public rating: number,
    public delivery_time: number,
    public price: number,
    public distance?: number,
    public address?: string
  ) {}
}
