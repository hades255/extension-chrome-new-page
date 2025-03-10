class EventModal {
  constructor(event, saveCallback, deleteCallback) {
    this.event = event;
    this.saveCallback = saveCallback;
    this.deleteCallback = deleteCallback;
  }

  show() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <input type="datetime-local" id="event-from" value="${
          this.event ? this.event.start : ""
        }">
        <input type="datetime-local" id="event-to" value="${
          this.event ? this.event.end : ""
        }">
        <input type="text" id="event-description" value="${
          this.event ? this.event.description : ""
        }">
        <button id="save-event">Save</button>
        <button id="close-modal">Close</button>
        ${this.event ? '<button id="delete-event">Delete</button>' : ""}
      `;

    document.body.appendChild(modal);

    document
      .getElementById("save-event")
      .addEventListener("click", this.save.bind(this));
    document
      .getElementById("close-modal")
      .addEventListener("click", this.close.bind(this));
    if (this.event) {
      document
        .getElementById("delete-event")
        .addEventListener("click", this.delete.bind(this));
    }
  }

  save() {
    const from = document.getElementById("event-from").value;
    const to = document.getElementById("event-to").value;
    const description = document.getElementById("event-description").value;

    const event = this.event || {};
    event.start = from;
    event.end = to;
    event.description = description;

    this.saveCallback(event);
    this.close();
  }

  delete() {
    this.deleteCallback(this.event.id);
    this.close();
  }

  close() {
    document.querySelector(".modal").remove();
  }
}
