import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Todo } from './Todo.jsx';
import { TodoForm } from './TodoForm.jsx';
import { EditTodoForm } from './EditTodoForm.jsx';
import { signOut } from 'firebase/auth';
import { auth, db } from '../src/firebase';
import { 
    collection, 
    query, 
    onSnapshot, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    serverTimestamp 
} from 'firebase/firestore';

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
    const navigate = useNavigate();

    // Check authentication and fetch todos
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/login');
            return;
        }

        const q = query(collection(db, `users/${user.uid}/todos`));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const todosArray = [];
            querySnapshot.forEach((doc) => {
                todosArray.push({
                    id: doc.id,
                    ...doc.data(),
                    isEditing: false
                });
            });
            setTodos(todosArray);
        });

        return () => unsubscribe();
    }, [navigate]);

    const addToDo = async (task) => {
        const user = auth.currentUser;
        if (!user) return;
        
        await addDoc(collection(db, `users/${user.uid}/todos`), {
            task: task,
            completed: false,
            createdAt: serverTimestamp()
        });
    };

    const toggleComplete = async (id) => {
        const user = auth.currentUser;
        if (!user) return;
        
        const todoRef = doc(db, `users/${user.uid}/todos`, id);
        const todo = todos.find(todo => todo.id === id);
        
        await updateDoc(todoRef, {
            completed: !todo.completed
        });
    };

    const deleteToDo = async (id) => {
        const user = auth.currentUser;
        if (!user) return;
        
        await deleteDoc(doc(db, `users/${user.uid}/todos`, id));
    };

    const editToDo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
        ));
    };

    const editTask = async (task, id) => {
        const user = auth.currentUser;
        if (!user) return;
        
        const todoRef = doc(db, `users/${user.uid}/todos`, id);
        
        await updateDoc(todoRef, {
            task: task
        });
        
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, isEditing: false } : todo
        ));
    };

    const toggleCompletedFilter = () => {
        setShowCompleted(!showCompleted);
    };

    const filteredTasks = showCompleted
        ? todos.filter(todo => todo.completed)
        : todos;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto pt-10 pb-16 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Todo List</h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigate('/account')} 
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Account
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Add a Task</h2>
                        <button 
                            onClick={toggleCompletedFilter}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                        >
                            {showCompleted ? 'Show All' : 'Show Completed'}
                        </button>
                    </div>
                    <TodoForm addToDo={addToDo} />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Task List</h2>
                    {filteredTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            {showCompleted 
                                ? "No completed tasks yet." 
                                : "No tasks yet. Add one above!"}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.map((todo) => (
                                todo.isEditing ? (
                                    <EditTodoForm
                                        key={todo.id}
                                        editToDo={editTask}
                                        task={todo}
                                    />
                                ) : (
                                    <Todo
                                        key={todo.id}
                                        task={todo}
                                        toggleComplete={toggleComplete}
                                        deleteToDo={deleteToDo}
                                        editToDo={editToDo}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};