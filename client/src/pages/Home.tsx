import "../App.css";
import api from "@/api";
import type { CreateTodoTypes, GetTodosResponse, Todo } from "@/types/todo";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Home = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodoHandler = async () => {
    try {
      const res = await api.post<CreateTodoTypes>("/todo/create-todo", {
        title,
        description,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setTodos([...todos, res.data.todo]);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error("Create todo error", error);
      toast.error("Todo creation error!");
    }
  };

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await api.get<GetTodosResponse>("/todo/get-all-todos");

        if (res.data.success) {
          setTodos(res.data.todos);
        }
      } catch (error) {
        console.error("Get all todos error!", error);
        toast.error("Get all todos error!!");
      }
    };

    fetchTodo();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex items-center gap-5">
        <div className="w-2/4 space-y-3 sm:w-1/4">
          <Input
            type="text"
            placeholder="Add a new todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button onClick={addTodoHandler}>Add Todo</Button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {todos.map((todo) => (
          <Card key={todo._id} className="bg-gray-200">
            <CardHeader>
              <CardTitle>{todo.title}</CardTitle>
              <CardDescription>{todo.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
