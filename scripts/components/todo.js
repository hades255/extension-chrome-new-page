class TodoList {
  static async init() {
    this.date = new Date().toLocaleDateString();

    this.db = await this.openDB();
    this.todos = (await this.loadTodos()) || [];
    this.render();
    this.initListeners();
  }

  static async initListeners() {
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

    document
      .getElementById("add-todo")
      .addEventListener("click", async function () {
        document.getElementById("new-todo").focus();
      });

    document
      .getElementById("saveJsonButton")
      .addEventListener("click", async function () {
        const jsonData = TodoList.getTodos();
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
      .getElementById("todo-prev")
      .addEventListener("click", async function () {
        TodoList.setDate(-1);
      });

    document
      .getElementById("todo-next")
      .addEventListener("click", async function () {
        TodoList.setDate(1);
      });

    document
      .getElementById("todo-today")
      .addEventListener("click", async function () {
        TodoList.setDate(0);
      });
  }

  static async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("todoDB", 1);
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore(CONFIG.TODO_STORAGE_KEY, {
          keyPath: "id",
          autoIncrement: true,
        });
      };
      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  static async loadTodos() {
    console.log(this.date)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        CONFIG.TODO_STORAGE_KEY,
        "readonly"
      );
      const store = transaction.objectStore(CONFIG.TODO_STORAGE_KEY);
      const request = store.getAll();
      request.onsuccess = function (event) {
        const todos = event.target.result;
        // Calculate date range
        const oneWeekInMs = 15 * 24 * 60 * 60 * 1000;
        const startDate = new Date(new Date(this.date).getTime() - oneWeekInMs);
        const endDate = new Date(new Date(this.date).getTime() + oneWeekInMs);
        
        // Filter todos within date range
        const filteredTodos = todos.filter(todo => {
          const todoDate = new Date(todo.createdAt);
          return todoDate >= startDate && todoDate <= endDate;
        });
        
        // Sort by date
        filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        resolve(filteredTodos);
      }.bind(this);
      request.onerror = function (event) {
        reject(event.target.error);
      };
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
      text,
      completed: false,
      createdAt: this.date + " " + new Date().toLocaleTimeString(),
    };
    const transaction = this.db.transaction(
      CONFIG.TODO_STORAGE_KEY,
      "readwrite"
    );
    const store = transaction.objectStore(CONFIG.TODO_STORAGE_KEY);
    store.add(todo);
    this.todos = await this.loadTodos();
    this.render();
    input.value = "";
  }

  static async deleteTodo(id) {
    const transaction = this.db.transaction(
      CONFIG.TODO_STORAGE_KEY,
      "readwrite"
    );
    const store = transaction.objectStore(CONFIG.TODO_STORAGE_KEY);
    store.delete(Number(id));
    this.todos = await this.loadTodos();
    this.render();
  }

  static async toggleTodo(id) {
    const transaction = this.db.transaction(
      CONFIG.TODO_STORAGE_KEY,
      "readwrite"
    );
    const store = transaction.objectStore(CONFIG.TODO_STORAGE_KEY);
    const todo = this.todos.find((todo) => todo.id === Number(id));
    todo.completed = !todo.completed;
    store.put(todo);
    this.todos = await this.loadTodos();
    this.render();
  }

  static async setDate(diff) {
    if (diff === 0) this.date = new Date().toLocaleDateString();
    else {
      const newDay = new Date(this.date);
      newDay.setDate(newDay.getDate() + diff);
      this.date = newDay.toLocaleDateString();
    }
    this.todos = (await this.loadTodos()) || [];
    this.render();
  }

  static getTodos() {
    return this.todos;
  }

  static getDate() {
    return this.date;
  }

  static render() {
    const todoList = document.getElementById("todo-list");

    const currentDate = this.date;
    const todayTodos = this.todos.filter((todo) =>
      todo.createdAt.includes(currentDate)
    );
    const otherTodos = this.todos.filter(
      (todo) => !todo.createdAt.includes(currentDate)
    );

    todoList.innerHTML =
      (todayTodos.length === 0
        ? `<div>No todos this day</div>`
        : todayTodos
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
            .join("")) +
      `<hr></hr>` +
      otherTodos
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
            <div class="todo-content">
              <span class="todo-text">${todo.text}</span>
              <span class="todo-item-date">${new Date(
                todo.createdAt
              ).toLocaleString()}</span>
            </div>
            <button class="delete-todo" data-id="${todo.id}">×</button>
          </div>
        `
        )
        .join("");

    document.getElementById("todo-date").textContent = new Date(
      this.date
    ).toDateString();
  }
}
