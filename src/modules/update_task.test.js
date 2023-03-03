import { toggleTaskCompleted, clearAllCompletedTasks } from './update_task.js';
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
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Update Task', () => {
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

  it('should make task of buy groceries as completed', () => {
    addTask('Buy Groceries');
    toggleTaskCompleted(1);
    const storage = JSON.parse(localStorage.getItem(storageKey));
    expect(storage[0].completed).toBeTruthy();
  });

  it('should remove all completed todos resulting to empty store', () => {
    addTask('Buy Groceries');
    toggleTaskCompleted(1);
    clearAllCompletedTasks();
    const storage = JSON.parse(localStorage.getItem(storageKey));
    expect(storage.length).toBe(0);
  });

  it('should remove all li element in the DOM after clearing all completed todos', () => {
    addTask('Buy Groceries');
    toggleTaskCompleted(1);
    clearAllCompletedTasks();
    const storage = JSON.parse(localStorage.getItem(storageKey));
    mockRenderList(storage);
    expect(todoListContainer.children.length).toBe(0);
  });
});