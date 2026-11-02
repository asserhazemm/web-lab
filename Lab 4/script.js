"use strict";
// ===== 2. State: the data the app remembers =====
let todos = [];
let filter = 'all'; // 'all', 'active' or 'completed'
// ===== 3. Select nodes (Lab 3: DOM) =====
// "as ..." tells TypeScript which kind of element it is, so .value / .style are allowed
const input = document.getElementById('new-todo');
const addBtn = document.getElementById('add');
const list = document.getElementById('list');
const count = document.getElementById('count');
const allBtn = document.getElementById('filter-all');
const activeBtn = document.getElementById('filter-active');
const completedBtn = document.getElementById('filter-completed');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');
// ===== 4. Logic (Lab 3: functions, Lab 4: arrays) =====
function addTodo() {
    const text = input.value.trim();
    if (!text)
        return; // ignore empty input
    todos.push({ text: text, completed: false, editing: false });
    input.value = ''; // clear input box
    render();
}
// Which todos should be shown for the current filter? (filter() from Lab 4)
function visibleTodos() {
    if (filter === 'active')
        return todos.filter(t => !t.completed);
    if (filter === 'completed')
        return todos.filter(t => t.completed);
    return todos;
}
// Style a filter button: highlighted if it is the selected one (inline if + style, Lab 3)
function highlight(button, name) {
    button.style.backgroundColor = filter === name ? '#dbeafe' : 'transparent';
    button.style.color = filter === name ? '#1d4ed8' : '#4b5563';
}
// Build the <li> for one todo (createElement + appendChild, Lab 3).
// Each listener below is a closure (Lab 3): it remembers its own "todo".
function createItem(todo) {
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
                const newText = edit.value.trim();
                if (newText)
                    todo.text = newText;
                todo.editing = false;
                render();
            }
            if (e.key === 'Escape') {
                todo.editing = false; // cancel without saving
                render();
            }
        });
        li.appendChild(edit);
        setTimeout(() => edit.focus(), 0); // focus after the input is on the page (async callback, Lab 4)
    }
    else {
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
        todos = todos.filter(t => t !== todo); // keep every todo except this one
        render();
    });
    li.appendChild(del);
    return li;
}
// Redraw the whole screen from the state
function render() {
    list.innerHTML = '';
    visibleTodos().forEach(todo => list.appendChild(createItem(todo)));
    const left = todos.filter(t => !t.completed).length;
    count.textContent = `${left} ${left === 1 ? 'item' : 'items'} left`;
    highlight(allBtn, 'all');
    highlight(activeBtn, 'active');
    highlight(completedBtn, 'completed');
}
// ===== 5. Listen to events (Lab 3: addEventListener) =====
addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
        addTodo();
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
render(); // first draw
