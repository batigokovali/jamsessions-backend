export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  savedsessionID?: string;
  createdsessionID?: string;
}

export interface Comment {
  userID: string;
  content: string;
}

export interface Sessions {
  author: User;
  content: {
    title: string;
    description: string;
  };
  comments: Comment[];
}

export interface Product {
  brand: string;
  price: number;
  condition: string;
  photo?: string;
}

export interface googleRedirectRequest {
  accessToken: string;
}
