/**
 * @jest-environment jsdom
 */

import { addTask } from './add_remove_task.js';

const localStorageMock = (() => {
  let store = {};

  return {
    setItem(key, value) {
      store[key] = value;
    },
    getItem(key) {
      return store[key];
    },
    clear() {
      store = {};
    },
  };
})();

// let renderTodoList = () => {
//   const TodoList = JSON.parse(localStorage.getItem('myTasks'));
//   if (TodoList && TodoList.length) {
//     TodoList.forEach((todo) => {
//       const li = document.createElement('li');
//       li.textContent = todo.description;
//       todoListContainer.appendChild(li);
//     });
//   }
// };

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Add & Remove Task', () => {
  const todoListContainer = document.querySelector('.list-group');
  const storageKey = 'myTasks';
  let mockRenderList;

  beforeEach(() => {
    localStorage.clear();

    mockRenderList = jest.fn(() => {
      const TodoList = JSON.parse(localStorage.getItem('myTasks'));
      if (TodoList && TodoList.length) {
        TodoList.forEach((todo) => {
          const li = document.createElement('li');
          li.textContent = todo.description;
          todoListContainer.appendChild(li);
        });
      }
    });
  });

  it('expect todoList to be defined', () => {
    expect(todoListContainer).toBeDefined();
  });

  it('add new task to the localStore', () => {
    addTask('Buy Groceries');
    const storage = JSON.parse(localStorage.getItem(storageKey));
    expect(storage.length).toEqual(1);
  });

  it('localStorage length should be the same number as the list in the DOM', () => {
    addTask('Buy Groceries');
    mockRenderList();
    const storage = JSON.parse(localStorage.getItem(storageKey));
    expect(todoListContainer.children.length).toEqual(storage.length);
  });
});
