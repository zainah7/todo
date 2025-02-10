"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTodoStore } from "@/app/components/useTodoStore";
import { useEffect } from "react";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// Fetch Todos
const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get("https://dummyjson.com/todos");
  return response.data.todos;
};

export default function Home() {
  const { todos, setTodos, toggleTodo, editTodo } = useTodoStore();

  // Fetching data
  const { data, isLoading, isError } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // Update todos when data is fetched
  useEffect(() => {
    if (data) setTodos(data);
  }, [data, setTodos]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching todos.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 accent-blue-500 cursor-pointer"
            />

            <span
              onClick={() => {
                const newText = prompt("Edit todo:", todo.todo);
                if (newText) editTodo(todo.id, newText);
              }}
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-500" : "text-black"
              }`}
            >
              {todo.todo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
