export interface RegisterResponse {
  message: string;
}

export interface LoginResponse extends RegisterResponse {
  _id: string;
}

export interface UpdateProfileResponse {
  message: string;
}

export interface CartItem {
  _id: string;
  product: string;
  quantity: number;
}

export interface GetUserProfileResponse {
  _id: string;
  name: string;
  email: string;
  owner: false;
  cartItem: CartItem[];
  profilePhoto: string;
  createdAt: string;
  updatedAt: string;
}
