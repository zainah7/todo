import { create } from "zustand";
import axios from "axios";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodoStore {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  toggleTodo: (id: number) => void;
  editTodo: (id: number, newTodo: string) => void;
}

// Create Zustand store
export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),

  toggleTodo: async (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));

    await axios.put(`https://dummyjson.com/todos/${id}`, {
      completed: true,
    });
  },

  editTodo: async (id, newTodo) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, todo: newTodo } : todo
      ),
    }));

    await axios.put(`https://dummyjson.com/todos/${id}`, { todo: newTodo });
  },
}));
