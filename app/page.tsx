"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// Fetch
const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get("https://dummyjson.com/todos");
  return response.data.todos;
};

export default function Home() {
  const queryClient = useQueryClient();

  // Fetch Todos
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  //  toggle completed state
  const toggleMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      await axios.put(`https://dummyjson.com/todos/${todo.id}`, {
        completed: !todo.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  //  to edit todo text
  const editMutation = useMutation({
    mutationFn: async ({ id, todo }: { id: number; todo: string }) => {
      await axios.put(`https://dummyjson.com/todos/${id}`, { todo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Local state for editing
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching todos.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <ul className="space-y-4">
        {todos?.map((todo) => (
          <li key={todo.id} className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleMutation.mutate(todo)}
              className="h-5 w-5 accent-blue-500 cursor-pointer"
            />

            {editId === todo.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => {
                  editMutation.mutate({ id: todo.id, todo: editText });
                  setEditId(null);
                }}
                className="border border-gray-300 rounded p-1"
                autoFocus
              />
            ) : (
              <span
                onClick={() => {
                  setEditId(todo.id);
                  setEditText(todo.todo);
                }}
                className={`cursor-pointer ${
                  todo.completed ? "line-through text-gray-500" : "text-black"
                }`}
              >
                {todo.todo}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
