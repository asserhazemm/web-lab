
interface Todo {
  text: string;
  completed: boolean;
  editing: boolean; 
}

let todos: Todo[] = [];
let filter: string = 'all'; 

const input = document.getElementById('new-todo') as HTMLInputElement;
const addBtn = document.getElementById('add') as HTMLButtonElement;
const list = document.getElementById('list') as HTMLElement;
const count = document.getElementById('count') as HTMLElement;
const allBtn = document.getElementById('filter-all') as HTMLButtonElement;
const activeBtn = document.getElementById('filter-active') as HTMLButtonElement;
const completedBtn = document.getElementById('filter-completed') as HTMLButtonElement;
const clearCompletedBtn = document.getElementById('clear-completed') as HTMLButtonElement;
const clearAllBtn = document.getElementById('clear-all') as HTMLButtonElement;

function addTodo(): void {
  const text: string = input.value.trim();
  if (!text) return; 
  todos.push({ text: text, completed: false, editing: false });
  input.value = ''; 
  render();
}


function visibleTodos(): Todo[] {
  if (filter === 'active') return todos.filter(t => !t.completed);
  if (filter === 'completed') return todos.filter(t => t.completed);
  return todos;
}


function highlight(button: HTMLButtonElement, name: string): void {
  button.style.backgroundColor = filter === name ? '#dbeafe' : 'transparent';
  button.style.color = filter === name ? '#1d4ed8' : '#4b5563';
}

function createItem(todo: Todo): HTMLElement {
  const li = document.createElement('li');

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = todo.completed;
  check.addEventListener('change', () => {
    todo.completed = check.checked;
    render();
  });
  li.appendChild(check);

  if (todo.editing) {
    const edit = document.createElement('input');
    edit.type = 'text';
    edit.value = todo.text;
    edit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const newText: string = edit.value.trim();
        if (newText) todo.text = newText;
        todo.editing = false;
        render();
      }
      if (e.key === 'Escape') {
        todo.editing = false; 
        render();
      }
    });
    li.appendChild(edit);
    setTimeout(() => edit.focus(), 0); 
  } else {
    const text = document.createElement('span');
    text.textContent = todo.text;
    text.style.textDecoration = todo.completed ? 'line-through' : 'none';
    text.style.color = todo.completed ? '#9ca3af' : '#111827';
    text.addEventListener('dblclick', () => {
      todo.editing = true;
      render();
    });
    li.appendChild(text);
  }

  const del = document.createElement('button');
  del.textContent = '🗑';
  del.addEventListener('click', () => {
    todos = todos.filter(t => t !== todo); 
    render();
  });
  li.appendChild(del);

  return li;
}


function render(): void {
  list.innerHTML = '';
  visibleTodos().forEach(todo => list.appendChild(createItem(todo)));

  const left: number = todos.filter(t => !t.completed).length;
  count.textContent = `${left} ${left === 1 ? 'item' : 'items'} left`;

  highlight(allBtn, 'all');
  highlight(activeBtn, 'active');
  highlight(completedBtn, 'completed');
}


addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

allBtn.addEventListener('click', () => { filter = 'all'; render(); });
activeBtn.addEventListener('click', () => { filter = 'active'; render(); });
completedBtn.addEventListener('click', () => { filter = 'completed'; render(); });

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  render();
});
clearAllBtn.addEventListener('click', () => {
  todos = [];
  render();
});

render(); 
