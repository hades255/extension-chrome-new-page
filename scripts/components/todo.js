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
      ?.addEventListener("click", async function () {
        const jsonData = await TodoList.loadAllTodos();
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
      .getElementById("loadJsonButton")
      ?.addEventListener("click", async function () {
        try {
          const todosFromJson = [
            {
              text: "prepare call",
              completed: false,
              createdAt: "8/17/2025 11:12:14 AM",
              id: 198,
            },
            {
              text: "parakeet-update parakeet to v3",
              completed: false,
              createdAt: "8/17/2025 11:09:13 AM",
              id: 197,
            },
            {
              text: "ocr-study color detecting code",
              completed: false,
              createdAt: "8/17/2025 11:09:01 AM",
              id: 196,
            },
            {
              text: "parakeet-read old project & find necessary part",
              completed: true,
              createdAt: "8/4/2025 8:38:52 PM",
              id: 195,
            },
            {
              text: "parakeet-read project & install project",
              completed: true,
              createdAt: "8/4/2025 8:38:41 PM",
              id: 194,
            },
            {
              text: "parakeet-compare with VOSK",
              completed: false,
              createdAt: "8/4/2025 8:38:30 PM",
              id: 193,
            },
            {
              text: "hashpolice-do research & install project",
              completed: false,
              createdAt: "8/4/2025 8:38:14 PM",
              id: 192,
            },
            {
              text: "G-update all tg bots to show beautiful view",
              completed: true,
              createdAt: "7/31/2025 4:38:51 AM",
              id: 191,
            },
            {
              text: "G-check D:\\G\\LevelDBDump",
              completed: false,
              createdAt: "7/31/2025 4:38:28 AM",
              id: 190,
            },
            {
              text: "recap-markdown view",
              completed: false,
              createdAt: "7/30/2025 2:41:05 AM",
              id: 189,
            },
            {
              text: "T-running checker",
              completed: true,
              createdAt: "7/28/2025 10:28:05 PM",
              id: 188,
            },
            {
              text: "T-check code which swap and withdraw",
              completed: true,
              createdAt: "7/23/2025 12:30:35 PM",
              id: 186,
            },
            {
              text: "U-If can't, use all assets on octo, ask new proxy",
              completed: false,
              createdAt: "7/23/2025 12:30:18 PM",
              id: 185,
            },
            {
              text: "U-ask $50 for Gabriel",
              completed: false,
              createdAt: "7/23/2025 12:29:18 PM",
              id: 184,
            },
            {
              text: "H-prepare resume for Justin",
              completed: false,
              createdAt: "7/23/2025 12:26:20 PM",
              id: 183,
            },
            {
              text: "H-prepare resume for Helman",
              completed: false,
              createdAt: "7/23/2025 12:26:15 PM",
              id: 182,
            },
            {
              text: "H-prepare resume for GaLi",
              completed: false,
              createdAt: "7/23/2025 12:26:12 PM",
              id: 181,
            },
            {
              text: "H-prepare resume for Sam",
              completed: false,
              createdAt: "7/23/2025 12:26:09 PM",
              id: 180,
            },
            {
              text: "H-prepare resume for Gabriel",
              completed: false,
              createdAt: "7/23/2025 12:26:06 PM",
              id: 179,
            },
            {
              text: "T-write code to get wallets with api",
              completed: true,
              createdAt: "7/17/2025 4:26:05 AM",
              id: 178,
            },
            {
              text: "May-ask about likedin and upwork, discuss payment",
              completed: true,
              createdAt: "7/16/2025 8:38:14 AM",
              id: 177,
            },
            {
              text: "G-upgrade parser",
              completed: true,
              createdAt: "7/16/2025 8:37:57 AM",
              id: 176,
            },
            {
              text: "G-check all assets(log files)",
              completed: true,
              createdAt: "7/16/2025 8:37:51 AM",
              id: 175,
            },
            {
              text: "T-Ask deposit addresses or code to use apis",
              completed: true,
              createdAt: "7/16/2025 8:37:10 AM",
              id: 173,
            },
            {
              text: "U-deposit for connects to Gabriel upwork",
              completed: false,
              createdAt: "7/16/2025 8:36:43 AM",
              id: 172,
            },
            {
              text: "cara-ask again freelancers",
              completed: true,
              createdAt: "7/16/2025 8:36:28 AM",
              id: 171,
            },
            {
              text: "U-check with Gabriel, ask about the payment",
              completed: true,
              createdAt: "7/16/2025 8:36:12 AM",
              id: 170,
            },
            {
              text: "Blackfyre-prepare code for next milestone(website)",
              completed: true,
              createdAt: "7/16/2025 8:35:54 AM",
              id: 169,
            },
            {
              text: "DSD-check Kylie's code",
              completed: true,
              createdAt: "7/16/2025 8:35:35 AM",
              id: 168,
            },
            {
              text: "check novagd912@gmail.com accounts(discord...)",
              completed: true,
              createdAt: "7/4/2025 1:29:21 PM",
              id: 167,
            },
            {
              text: "this-check export function-export all",
              completed: true,
              createdAt: "7/2/2025 5:00:24 PM",
              id: 166,
            },
            {
              text: "dsd-check pipeline again, ask about the deployment",
              completed: false,
              createdAt: "6/30/2025 11:39:40 AM",
              id: 165,
            },
            {
              text: "proxies-deposit",
              completed: true,
              createdAt: "6/30/2025 11:35:52 AM",
              id: 164,
            },
            {
              text: "vps-deposit money-can keep only 5 days alive",
              completed: true,
              createdAt: "6/30/2025 11:35:46 AM",
              id: 163,
            },
            {
              text: "G-decrypt app with password protection",
              completed: true,
              createdAt: "6/30/2025 11:35:06 AM",
              id: 162,
            },
            {
              text: "DSD-check creating report",
              completed: false,
              createdAt: "6/27/2025 2:45:26 PM",
              id: 161,
            },
            {
              text: "DSD-check resources",
              completed: true,
              createdAt: "6/27/2025 2:00:53 PM",
              id: 160,
            },
            {
              text: "Y-prepare cloud, upload all",
              completed: true,
              createdAt: "6/27/2025 10:28:18 AM",
              id: 159,
            },
            {
              text: "GD-check mac, ubuntu ui and window",
              completed: true,
              createdAt: "6/27/2025 10:26:09 AM",
              id: 156,
            },
            {
              text: "cara-continue image matching",
              completed: false,
              createdAt: "6/27/2025 10:24:58 AM",
              id: 155,
            },
            {
              text: "Blackfyre-check task again, calculate possiblity to continue",
              completed: true,
              createdAt: "6/27/2025 10:24:01 AM",
              id: 154,
            },
            {
              text: "Y-check all keys and tokens",
              completed: true,
              createdAt: "6/27/2025 10:23:37 AM",
              id: 153,
            },
            {
              text: "GD-deploy with new domain",
              completed: true,
              createdAt: "6/27/2025 2:57:02 AM",
              id: 151,
            },
            {
              text: "GD-buy domain name in maksym hostinger",
              completed: true,
              createdAt: "6/21/2025 7:37:19 PM",
              id: 150,
            },
            {
              text: "T-deposit",
              completed: true,
              createdAt: "6/21/2025 7:37:00 PM",
              id: 149,
            },
            {
              text: "T-update proxy, check logs",
              completed: true,
              createdAt: "6/21/2025 7:36:50 PM",
              id: 148,
            },
            {
              text: "alphanimics vps - deploy local mongodb",
              completed: true,
              createdAt: "6/16/2025 9:01:37 PM",
              id: 147,
            },
            {
              text: "mecca-apply azure sso",
              completed: true,
              createdAt: "6/16/2025 1:37:08 PM",
              id: 146,
            },
            {
              text: "mecca-build first demo graphic",
              completed: true,
              createdAt: "6/16/2025 1:36:55 PM",
              id: 145,
            },
            {
              text: "blackfyre-ask release payment for milestone 1",
              completed: true,
              createdAt: "6/16/2025 1:36:41 PM",
              id: 144,
            },
            {
              text: "blackfyre-deploy bot",
              completed: true,
              createdAt: "6/16/2025 1:36:40 PM",
              id: 143,
            },
            {
              text: "mecca-check routes for recording and properties",
              completed: true,
              createdAt: "6/12/2025 1:49:23 PM",
              id: 142,
            },
            {
              text: "mecca-check resource files",
              completed: true,
              createdAt: "6/12/2025 2:10:13 AM",
              id: 141,
            },
            {
              text: "dsd-build backend",
              completed: true,
              createdAt: "6/12/2025 2:09:57 AM",
              id: 140,
            },
            {
              text: "blackfyre-check freelancer chat",
              completed: true,
              createdAt: "6/9/2025 8:07:51 PM",
              id: 139,
            },
            {
              text: "cara-receive disc segmentator on fluoro",
              completed: true,
              createdAt: "6/9/2025 7:21:26 PM",
              id: 138,
            },
            {
              text: "ask butter about the new account",
              completed: true,
              createdAt: "6/9/2025 7:21:10 PM",
              id: 137,
            },
            {
              text: "dsd-build pages in task 6",
              completed: true,
              createdAt: "6/9/2025 7:20:56 PM",
              id: 136,
            },
            {
              text: "cara-pre alignment",
              completed: false,
              createdAt: "6/9/2025 7:20:46 PM",
              id: 135,
            },
            {
              text: "mecca-azure dev ops",
              completed: true,
              createdAt: "6/9/2025 7:20:37 PM",
              id: 134,
            },
            {
              text: "recap-quick prompts",
              completed: false,
              createdAt: "6/4/2025 11:38:50 AM",
              id: 133,
            },
            {
              text: "tm-stop duplicated processes",
              completed: false,
              createdAt: "6/1/2025 2:21:13 AM",
              id: 132,
            },
            {
              text: "tm-update daily color, more fade for less 0.5 hrs",
              completed: true,
              createdAt: "5/30/2025 7:09:13 PM",
              id: 131,
            },
            {
              text: "mecca-deploy project",
              completed: true,
              createdAt: "5/28/2025 1:39:09 PM",
              id: 130,
            },
            {
              text: "- download and save mailu data",
              completed: true,
              createdAt: "5/28/2025 10:48:12 AM",
              id: 128,
            },
            {
              text: "cara-optimize code, push on git",
              completed: true,
              createdAt: "5/28/2025 10:30:23 AM",
              id: 125,
            },
            {
              text: "tm-dashboard page-day/week/month slide",
              completed: true,
              createdAt: "5/28/2025 10:30:01 AM",
              id: 124,
            },
            {
              text: "new page extension-get data only for few days or for one week",
              completed: true,
              createdAt: "5/28/2025 10:29:03 AM",
              id: 123,
            },
            {
              text: "ask yaman's tg account",
              completed: true,
              createdAt: "5/28/2025 10:28:23 AM",
              id: 122,
            },
            {
              text: "check signal ldplayer",
              completed: true,
              createdAt: "5/28/2025 10:28:14 AM",
              id: 121,
            },
            {
              text: "recap-check all, build product and deploy, push on git",
              completed: false,
              createdAt: "5/28/2025 10:27:28 AM",
              id: 120,
            },
            {
              text: "- check telegram traking bots & dropbox",
              completed: true,
              createdAt: "5/28/2025 10:26:50 AM",
              id: 119,
            },
            {
              text: "-- ask about trading bot on vps",
              completed: true,
              createdAt: "5/28/2025 10:26:21 AM",
              id: 117,
            },
            {
              text: "- restore gd on vps",
              completed: true,
              createdAt: "5/28/2025 10:26:10 AM",
              id: 116,
            },
            {
              text: "- set tidy & save all resources",
              completed: true,
              createdAt: "5/28/2025 10:25:27 AM",
              id: 115,
            },
            {
              text: "dod-check payment, deposit mine without any lose",
              completed: true,
              createdAt: "5/14/2025 2:08:19 PM",
              id: 113,
            },
            {
              text: "this-review sort function",
              completed: true,
              createdAt: "5/13/2025 2:08:57 PM",
              id: 114,
            },
            {
              text: "= ask about the salary",
              completed: true,
              createdAt: "5/13/2025 2:08:00 PM",
              id: 112,
            },
            {
              text: "dod-check new tasks",
              completed: true,
              createdAt: "5/13/2025 2:07:26 PM",
              id: 110,
            },
            {
              text: "mecca-make it clear about the relationship between client and user",
              completed: true,
              createdAt: "5/13/2025 2:07:14 PM",
              id: 109,
            },
            {
              text: "mecca-check tasks",
              completed: true,
              createdAt: "5/10/2025 1:57:10 AM",
              id: 106,
            },
            {
              text: "mecca-install postgres, connect to laravel project",
              completed: true,
              createdAt: "5/10/2025 1:57:04 AM",
              id: 105,
            },
            {
              text: "tm-copy main app when click directly to run it",
              completed: true,
              createdAt: "5/10/2025 1:56:50 AM",
              id: 104,
            },
            {
              text: "mecca-check work board",
              completed: true,
              createdAt: "5/3/2025 3:38:13 AM",
              id: 101,
            },
            {
              text: "3. detect my voice, test",
              completed: true,
              createdAt: "5/3/2025 3:37:54 AM",
              id: 100,
            },
            {
              text: "- test chrome passwords",
              completed: true,
              createdAt: "5/3/2025 3:37:00 AM",
              id: 99,
            },
            {
              text: "2. find best text to voice online tester",
              completed: true,
              createdAt: "5/3/2025 3:36:44 AM",
              id: 98,
            },
            {
              text: "1. find best voice to text online tester",
              completed: true,
              createdAt: "5/3/2025 3:36:32 AM",
              id: 97,
            },
            {
              text: "pull all git repositories",
              completed: true,
              createdAt: "4/29/2025 6:24:07 PM",
              id: 90,
            },
            {
              text: "setup squad to alphanomics vps",
              completed: true,
              createdAt: "4/29/2025 2:49:16 PM",
              id: 95,
            },
            {
              text: "tm-check token in frontend, logout automatically",
              completed: false,
              createdAt: "4/29/2025 3:15:41 AM",
              id: 93,
            },
            {
              text: "tm-error handling, kill all threads when error occurs, or find another method to flush thread",
              completed: true,
              createdAt: "4/29/2025 2:03:45 AM",
              id: 96,
            },
            {
              text: "tm-offline handler, check again, find exit code and reset",
              completed: true,
              createdAt: "4/28/2025 3:11:56 AM",
              id: 92,
            },
            {
              text: "caller-make plan",
              completed: true,
              createdAt: "4/26/2025 9:23:16 PM",
              id: 89,
            },
            {
              text: "teammonitor-calculate total, work, relax hours in week and month view",
              completed: true,
              createdAt: "4/26/2025 8:40:47 PM",
              id: 87,
            },
            {
              text: "try gpt pro with old cards",
              completed: true,
              createdAt: "3/15/2025 6:11:43 AM",
              id: 84,
            },
            {
              text: "practice graphql+mern example",
              completed: true,
              createdAt: "3/14/2025 11:17:11 PM",
              id: 82,
            },
            {
              text: "check gabriel upwork account from other account",
              completed: true,
              createdAt: "3/14/2025 2:04:54 PM",
              id: 81,
            },
            {
              text: "-check servers again, keep them safe",
              completed: true,
              createdAt: "3/14/2025 12:44:31 PM",
              id: 80,
            },
            {
              text: "deploy luis portfolio",
              completed: true,
              createdAt: "3/14/2025 12:44:08 PM",
              id: 79,
            },
            {
              text: "-prepare portfolio for gabriel upwork, make description",
              completed: true,
              createdAt: "3/14/2025 12:43:37 PM",
              id: 78,
            },
            {
              text: "-comfortable button layout",
              completed: true,
              createdAt: "3/14/2025 12:33:15 AM",
              id: 77,
            },
            {
              text: "-show history/log for that user in admin page",
              completed: true,
              createdAt: "3/14/2025 12:32:54 AM",
              id: 76,
            },
            {
              text: "-log all servers",
              completed: true,
              createdAt: "3/14/2025 12:32:46 AM",
              id: 75,
            },
            {
              text: "change clock color on new page",
              completed: true,
              createdAt: "3/11/2025 12:19:34 AM",
              id: 69,
            },
            {
              text: "make a new extension or use old extension for translator",
              completed: true,
              createdAt: "3/11/2025 12:19:08 AM",
              id: 67,
            },
            {
              text: "complete luis portfolio",
              completed: true,
              createdAt: "3/11/2025 12:18:49 AM",
              id: 66,
            },
            {
              text: "add git commits to gabriel",
              completed: true,
              createdAt: "3/11/2025 12:18:39 AM",
              id: 65,
            },
            {
              text: "add git commits to luis",
              completed: true,
              createdAt: "3/11/2025 12:18:35 AM",
              id: 64,
            },
          ];
          await TodoList.addTodos(todosFromJson, true);
        } catch (err) {
          console.error("Invalid JSON data", err);
          alert("Invalid JSON file or data format.");
        }
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
        const filteredTodos = todos.filter((todo) => {
          const todoDate = new Date(todo.createdAt);
          return (
            !todo.completed || (todoDate >= startDate && todoDate <= endDate)
          );
        });

        // Sort by date
        filteredTodos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(filteredTodos);
      }.bind(this);
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  static async loadAllTodos() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        CONFIG.TODO_STORAGE_KEY,
        "readonly"
      );
      const store = transaction.objectStore(CONFIG.TODO_STORAGE_KEY);
      const request = store.getAll();
      request.onsuccess = function (event) {
        const todos = event.target.result;
        // Sort by date
        todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        resolve(todos);
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

  static async addTodos(todosFromJson, clearFirst = false) {
    if (clearFirst) {
      const clearTx = this.db.transaction(CONFIG.TODO_STORAGE_KEY, "readwrite");
      const clearStore = clearTx.objectStore(CONFIG.TODO_STORAGE_KEY);
      await new Promise((resolve, reject) => {
        const request = clearStore.clear();
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e);
      });
    }

    if (this.todos.length >= CONFIG.MAX_TODOS) {
      alert("Maximum number of todos reached. Please remove some items first.");
      return;
    }

    const transaction = this.db.transaction(
      CONFIG.TODO_STORAGE_KEY,
      "readwrite"
    );
    const store = transaction.objectStore(CONFIG.TODO_STORAGE_KEY);

    for (const todo of todosFromJson) {
      const _todo = {
        text: todo.text,
        completed: todo.completed,
        createdAt: todo.createdAt,
      };
      store.add(_todo);
    }

    this.todos = await this.loadTodos();
    this.render();
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
