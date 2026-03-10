interface IProductDetails {
  _id: string;
  name: string;
  image: string;
  price: number;
}

export interface ICartItem {
  product: IProductDetails;
  quantity: number;
}
