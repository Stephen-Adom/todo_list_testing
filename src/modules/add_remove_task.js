import { debounceTime } from 'rxjs';
import Todo from './todo.model.js';

const saveToStorage = (TodoList) => {
  localStorage.setItem('myTasks', JSON.stringify(TodoList));
};

const resetTaskIndexes = (TodoList) => {
  const updatedTodoList = TodoList.map((todo, index) => ({
    ...todo,
    index: index + 1,
  }));

  debounceTime(500);
  saveToStorage(updatedTodoList);
};

const addTask = (description) => {
  const TodoList = localStorage.getItem('myTasks')
    ? JSON.parse(localStorage.getItem('myTasks'))
    : [];
  const newTodo = new Todo(TodoList.length + 1, description);
  TodoList.push(newTodo);
  saveToStorage(TodoList);
};

const removeTask = (id) => {
  const TodoList = JSON.parse(localStorage.getItem('myTasks'));
  const updatedTodos = TodoList.filter((todo) => todo.index !== id);
  resetTaskIndexes(updatedTodos);
};

const editTaskDescription = (description, index) => {
  const TodoList = JSON.parse(localStorage.getItem('myTasks'));
  const selectedTodo = TodoList.find((todo) => todo.index === index);
  selectedTodo.description = description;
  saveToStorage(TodoList);
};

export {
  addTask,
  removeTask,
  editTaskDescription,
  resetTaskIndexes,
  saveToStorage,
};
