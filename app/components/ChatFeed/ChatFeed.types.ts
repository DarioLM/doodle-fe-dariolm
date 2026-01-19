export interface Message {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface MessagesResponse {
  messages?: Message[];
}
