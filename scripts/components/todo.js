class TodoList {
  static async init() {
    this.todos = (await StorageUtil.get(CONFIG.TODO_STORAGE_KEY)) || [];
    this.render();
    this.initListeners();
  }

  static initListeners() {
    document.getElementById("todo-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTodo();
    });

    document.getElementById("todo-list").addEventListener("click", (e) => {
      if (e.target.matches(".delete-todo")) {
        this.deleteTodo(e.target.dataset.id);
      } else if (e.target.matches(".todo-checkbox")) {
        this.toggleTodo(e.target.dataset.id);
      }
    });
  }

  static async addTodo() {
    const input = document.getElementById("new-todo");
    const text = input.value.trim();

    if (!text) return;

    if (this.todos.length >= CONFIG.MAX_TODOS) {
      alert("Maximum number of todos reached. Please remove some items first.");
      return;
    }

    const todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.todos.unshift(todo);
    await this.save();
    this.render();
    input.value = "";
  }

  static async deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== Number(id));
    await this.save();
    this.render();
  }

  static async toggleTodo(id) {
    const todo = this.todos.find((todo) => todo.id === Number(id));
    if (todo) {
      todo.completed = !todo.completed;
      await this.save();
      this.render();
    }
  }

  static async save() {
    await StorageUtil.set(
      CONFIG.TODO_STORAGE_KEY,
      this.todos.sort((a, b) => {
        if (a.completed) return 1;
        if (b.completed) return -1;
        return 0;
      })
    );
  }

  static render() {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = this.todos
      .sort((a, b) => {
        if (a.completed) return 1;
        if (b.completed) return -1;
        return 0;
      })
      .map(
        (todo) => `
      <div class="todo-item ${todo.completed ? "completed" : ""}" title="${
          todo.createdAt
        }">
        <input type="checkbox" 
               class="todo-checkbox" 
               data-id="${todo.id}" 
               ${todo.completed ? "checked" : ""}>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-todo" data-id="${todo.id}">×</button>
      </div>
    `
      )
      .join("");
  }
}

document
  .getElementById("saveJsonButton")
  .addEventListener("click", async function () {
    const jsonData = (await StorageUtil.get(CONFIG.TODO_STORAGE_KEY)) || [];

    const jsonString = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `todo-${Date.now()}.json`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

document
  .getElementById("add-todo")
  .addEventListener("click", async function () {
    document.getElementById("new-todo").focus();
  });
