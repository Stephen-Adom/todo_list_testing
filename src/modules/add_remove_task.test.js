/**
 * @jest-environment jsdom
 */

import { addTask, removeTask } from './add_remove_task.js';

const localStorageMock = (() => {
  let store = {};

  return {
    setItem(key, value) {
      store[key] = value;
    },
    getItem(key) {
      return store[key];
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Add & Remove Task', () => {
  const todoListContainer = document.createElement('ul');
  const storageKey = 'myTasks';
  let mockRenderList;

  beforeEach(() => {
    localStorage.clear();

    mockRenderList = jest.fn((TodoList) => {
      if (TodoList && TodoList.length) {
        TodoList.forEach((todo) => {
          const li = document.createElement('li');
          li.textContent = todo.description;
          todoListContainer.appendChild(li);
        });
      } else {
        todoListContainer.innerHTML = '';
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
    const storage = JSON.parse(localStorage.getItem(storageKey));
    mockRenderList(storage);
    expect(todoListContainer.children.length).toEqual(storage.length);
  });

  it('localStorage should be empty when item is removed', () => {
    addTask('Buy Groceries');
    removeTask(1);
    const storage = JSON.parse(localStorage.getItem(storageKey));
    expect(storage.length).toBe(0);
  });

  it('children for todoListContainer should be 0', () => {
    addTask('Buy Groceries');
    removeTask(1);
    const storage = JSON.parse(localStorage.getItem(storageKey));
    mockRenderList(storage);
    expect(todoListContainer.children.length).toBe(0);
  });
});
