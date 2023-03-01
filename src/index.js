import { debounceTime, fromEvent } from 'rxjs';
import './styles.css';

import arrowDown from './assets/bend-arrow-right-svgrepo-com.svg';
import TodoLogo from './assets/list.png';
import {
  addTask,
  removeTask,
  editTaskDescription,
  toggleTaskCompleted,
  clearAllCompletedTasks,
} from './modules/index.js';

const todoListContainer = document.querySelector('.list-group');
const submitBtn = document.querySelector('.submitBtn img');
const form = document.querySelector('form');
const logoContainer = document.querySelector('.logo-container img');
const todoContainer = document.querySelector('.todo-container');

const renderCheckBoxIfCompletedIsFalse = (todo) => {
  if (todo.completed) {
    return `<span class="completed-check" id="${todo.index}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
  
    </span>`;
  }
  return `<input
    aria-label="make-bed"
    class="form-check-input"
    type="checkbox"
    value=""
    id="${todo.index}"
  />`;
};

const checkIfTaskCompleted = (completed) => {
  if (completed) {
    return 'completed';
  }
  return '';
};

// display all todoList
const renderTodoList = () => {
  const TodoList = JSON.parse(localStorage.getItem('myTasks'));
  if (TodoList && TodoList.length) {
    let todoHtml = '';

    TodoList.forEach((todo) => {
      todoHtml += `
            <li class="list-group-item ${checkIfTaskCompleted(todo.completed)}">
            <section
              class="todo-item d-flex align-items-center justify-content-between"
            >
              <div class="d-flex align-items-center gap-3 w-75">
                ${renderCheckBoxIfCompletedIsFalse(todo)}
                <input type="text" class="w-100 todo-content" value="${
  todo.description
}" id="${todo.index}"></input>
              </div>

              <div class="todo-action">
                <button title="move" class="move_action_btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                </button>

                <button title="delete" class="delete_action_btn" id="${
  todo.index
}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>              
                </button>
              </div>
            </section>
          </li>
            `;
    });

    todoListContainer.innerHTML = todoHtml;
  } else {
    todoListContainer.innerHTML = '';
  }
};

const removeAllActiveClassFromTodoItem = () => {
  const allTodoItem = document.querySelectorAll('.list-group-item');

  allTodoItem.forEach((item) => {
    item.classList.remove('active');
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (form.description.value.length) {
    addTask(form.description.value);
    form.reset();
    renderTodoList();
  }
});

todoListContainer.addEventListener('click', (e) => {
  if (e.target.matches('section')) {
    removeAllActiveClassFromTodoItem();
    e.target.parentNode.classList.add('active');
  } else if (e.target.matches('section input')) {
    removeAllActiveClassFromTodoItem();
    e.target.parentNode.parentNode.parentNode.classList.add('active');
  }

  if (e.target.matches('button svg')) {
    removeTask(Number(e.target.parentElement.getAttribute('id')));
    renderTodoList();
  } else if (e.target.matches('button svg path')) {
    removeTask(Number(e.target.parentElement.parentElement.getAttribute('id')));
    renderTodoList();
  }

  if (e.target.matches('span svg')) {
    toggleTaskCompleted(Number(e.target.parentElement.getAttribute('id')));
    renderTodoList();
  } else if (e.target.classList.contains('form-check-input')) {
    toggleTaskCompleted(Number(e.target.getAttribute('id')));
    renderTodoList();
  }
});

todoContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('clear_completed')) {
    e.preventDefault();
    clearAllCompletedTasks();
    debounceTime(500);
    renderTodoList();
  }
});

fromEvent(todoListContainer, 'input')
  .pipe(debounceTime(800))
  .subscribe((e) => {
    editTaskDescription(e.target.value.trim(), Number(e.target.id));
  });

window.addEventListener('DOMContentLoaded', () => {
  renderTodoList();
  submitBtn.src = arrowDown;
  logoContainer.src = TodoLogo;
});
