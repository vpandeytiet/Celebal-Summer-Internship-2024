import React, {useEffect, useState} from 'react'
import {TodoForm} from './TodoForm'
import { v4 as uuidv4 } from 'uuid';
import {Todo} from './Todo';
import EditTodoForm from './EditTodoForm';
uuidv4();

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([])
    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('asc');

    // Load todos from localStorage on initial render
    useEffect(()=>{
        const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        setTodos(savedTodos);
    }, []);

    // Save todos to localStorage whenever they change
    useEffect(()=>{
        localStorage.setItem('todos', JSON.stringify(todos));
    },[todos]);


    const addTodo = todo =>{
        if(!todo.trim()){
            alert('Task cannot be empty');
            return;
        }
        setTodos([...todos, {id: uuidv4(), task: todo, 
            completed:false, isEditing: false}])
            console.log(todos)         
    }

    const toggleComplete = id =>{
        setTodos(todos.map(todo => todo.id === id ? {...
            todo, completed: !todo.completed} : todo))
    }

    const deleteTodo = id =>{
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const editTodo = id =>{
        setTodos(todos.map(todo => todo.id === id ? {...
            todo, isEditing: !todo.isEditing} : todo))
    }

    const editTask = (task, id) => {
        setTodos(todos.map(todo => todo.id === id ? {...
            todo, task, isEditing: !todo.isEditing} : todo
        ))
    }

    const handleFilterChange = (e) =>{
        setFilter(e.target.value);
    }

    const handleSortChange = (e) =>{
        setSortOrder(e.target.value);
    }

    const getFilteredTodos = () =>{
        let filterdTodos = [...todos];
        if(filter === 'completed'){
            filterdTodos = filterdTodos.filter(todo=>todo.completed);
        } else if(filter === 'incomplete'){
            filterdTodos = filterdTodos.filter(todo=>!todo.completed);
        }
        return filterdTodos;
    }

    const getSortedTodos = (todos) =>{
        return todos.sort((a,b) => {
            if(sortOrder === 'asc'){
                return a.task.localeCompare(b.task);
            } else{
                return b.task.localeCompare(a.task);
            }
        })
    }

    const displayedTodos = getSortedTodos(getFilteredTodos());


    return (
        <div className='TodoWrapper'>
            <h1>Get things Done!! <br/> Let's Pen Down Your Day ✍</h1>
            <TodoForm addTodo={addTodo} />
            <div className='controls'>
                <select onChange={handleFilterChange} value={filter}>
                    <option value='all'>All</option>
                    <option value='completed'>Completed</option>
                    <option value='incomplete'>Incomplete</option>
                </select>
                <select onChange={handleSortChange} value={sortOrder}>
                    <option value='asc'>Ascending</option>
                    <option value='desc'>Descending</option>
                </select>
            </div>
            {displayedTodos.map((todo) => (
                todo.isEditing ? (
                    <EditTodoForm key={todo.id} editTodo={editTask} task={todo} />
                ) : (
                    <Todo
                        key={todo.id}
                        task={todo}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                        editTodo={editTodo}
                    />
                )
            ))}
        </div>
    );
}

export default TodoWrapper
