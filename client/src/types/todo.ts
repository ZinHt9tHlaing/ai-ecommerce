export interface CreateTodoTypes {
  success: boolean;
  message: string;
  todo: Todo;
}

export interface Todo {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTodosResponse {
  success: boolean;
  todos: Todo[];
}
