import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

// API Functions
const fetchTodos = async () => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
    return data;
};

const addTodo = async (newTodo) => {
    const { data } = await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo);
    return data;
};

export default function Todos() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');

    // 1. useQuery: Fetching Data
    const { data: todos, isLoading, isError, error } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos,
        staleTime: 5000, // Data stays fresh for 5 seconds
    });

    // 2. useMutation: Changing Data
    const mutation = useMutation({
        mutationFn: addTodo,
        onSuccess: (newTodoData) => {
            // Invalidate the cache to trigger a refetch
            // (Note: JSONPlaceholder doesn't actually persist writes, so we won't see it in the list on refetch,
            // but this is the correct pattern. We can manually update cache for demo purposes)

            // queryClient.invalidateQueries({ queryKey: ['todos'] });

            // For demo with fake API, manually update cache:
            queryClient.setQueryData(['todos'], (oldTodos) => [newTodoData, ...oldTodos]);

            setTitle('');
            alert('Todo added!');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ title, userId: 1, completed: false });
    };

    if (isLoading) return <div className="p-10 text-center text-blue-500">Loading your todos...</div>;
    if (isError) return <div className="p-10 text-center text-red-500">Error: {error.message}</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">✅ Daily Tasks</h2>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    disabled={mutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {mutation.isPending ? 'Adding...' : 'Add'}
                </button>
            </form>

            {/* Todo List */}
            <ul className="space-y-3">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <span className={`w-3 h-3 rounded-full mr-3 ${todo.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span className={todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                            {todo.title}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-4 text-xs text-gray-400 text-center">
                Powered by TanStack Query
            </div>
        </div>
    );
}
