import { resetTaskIndexes, saveToStorage } from './add_remove_task.js';

const toggleTaskCompleted = (index) => {
  const TodoList = JSON.parse(localStorage.getItem('myTasks'));
  if (TodoList.length) {
    const selectedTodo = TodoList.find((todo) => Number(todo.index) === index);
    selectedTodo.completed = !selectedTodo.completed;
    saveToStorage(TodoList);
  }
};

const clearAllCompletedTasks = () => {
  const TodoList = JSON.parse(localStorage.getItem('myTasks'));
  const uncompletedTasks = TodoList.filter((task) => task.completed === false);
  saveToStorage(uncompletedTasks);
  resetTaskIndexes(uncompletedTasks);
};

export { toggleTaskCompleted, clearAllCompletedTasks };
