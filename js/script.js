// Todo App JavaScript
let todos = [];
let filterStatus = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
});

document.getElementById('todo-app').addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
});

document.getElementById('filter-btn').addEventListener('click', () => {
    if (filterStatus === 'all') {
        filterStatus = 'pending';
        document.getElementById('filter-btn').textContent = 'Pending';
        document.getElementById('filter-btn').classList.remove('bg-blue-500/80', 'hover:bg-blue-600');
        document.getElementById('filter-btn').classList.add('bg-yellow-500/80', 'hover:bg-yellow-600');
    } else if (filterStatus === 'pending') {
        filterStatus = 'completed';
        document.getElementById('filter-btn').textContent = 'Completed';
        document.getElementById('filter-btn').classList.remove('bg-yellow-500/80', 'hover:bg-yellow-600');
        document.getElementById('filter-btn').classList.add('bg-green-500/80', 'hover:bg-green-600');
    } else {
        filterStatus = 'all';
        document.getElementById('filter-btn').textContent = 'Filter';
        document.getElementById('filter-btn').classList.remove('bg-green-500/80', 'hover:bg-green-600');
        document.getElementById('filter-btn').classList.add('bg-blue-500/80', 'hover:bg-blue-600');
    }
    renderTodos();
});

document.getElementById('delete-all-btn').addEventListener('click', () => {
    if (todos.length === 0) return;
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        todos = [];
        renderTodos();
    }
});

function addTodo() {
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('tanggal');
    
    const todoText = input.value.trim();
    const dueDate = dateInput.value;
    
    if (todoText === '') return;
    
    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        dueDate: dueDate,
        createdAt: new Date().toISOString()
    };
    
    todos.unshift(newTodo);
    input.value = '';
    dateInput.value = '';
    
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    document.getElementById('todo-input').value = todo.text;
    document.getElementById('tanggal').value = todo.dueDate || '';
    deleteTodo(id);
    document.getElementById('todo-input').focus();
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');

    let filteredTodos = todos;
    if (filterStatus === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    } else if (filterStatus === 'pending') {
        filteredTodos = todos.filter(t => !t.completed);
    }

    if (filteredTodos.length === 0) {
        emptyState.style.display = 'block';
        todoList.innerHTML = '';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    todoList.innerHTML = filteredTodos.map(todo => {
        const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed; 
        return `
            <div class="todo-item bg-white/90 rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
                <div class="grid grid-cols-12 gap-4 items-center">
                    <div class="col-span-4">
                        <p class="text-gray-800 font-medium ${todo.completed ? 'line-through opacity-60' : ''}">${todo.text}</p>
                    </div>
                    
                    <div class="col-span-3">
                        ${todo.dueDate ? `
                            <p class="text-sm ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-600'}">
                                📅 ${formatDate(todo.dueDate)}
                                ${isOverdue ? '<span class="block text-xs">(Overdue!)</span>' : ''}
                            </p>
                        ` : '<p class="text-gray-400 text-sm">No due date</p>'}
                    </div>
                    
                    <div class="col-span-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                ${todo.completed ? 'checked' : ''}
                                onchange="toggleTodo(${todo.id})"
                                class="w-4 h-4 rounded cursor-pointer accent-purple-500"
                            >
                            <span class="text-sm ${todo.completed ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}">
                                ${todo.completed ? 'Done' : 'Pending'}
                            </span>
                        </label>
                    </div>
                    
                    <div class="col-span-3 flex gap-2 justify-center">
                        <button 
                            onclick="editTodo(${todo.id})"
                            class="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all text-sm font-medium"
                        >
                            Edit
                        </button>
                        <button 
                            onclick="deleteTodo(${todo.id})"
                            class="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all text-sm font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}