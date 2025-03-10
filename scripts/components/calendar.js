class Calendar {
  constructor() {
    this.container = document.getElementById("calendar-container");
    this.events = [];
    this.currentView = "day";
    this.currentDate = new Date();
    this.show = true;
  }

  render() {
    this.container.innerHTML = "";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";
    this.renderNavigationButtons(buttonsContainer);
    this.renderTotalHours(buttonsContainer);
    this.renderViewButtons(buttonsContainer);
    this.container.appendChild(buttonsContainer);

    this.renderGrid();
    this.renderEvents();
  }

  renderViewButtons(buttonsContainer) {
    const viewButtons = ["day", "week", "month"].map((view) => {
      const button = document.createElement("button");
      button.textContent = view.charAt(0).toUpperCase() + view.slice(1);
      button.addEventListener("click", () => {
        this.currentView = view;
        this.render();
      });
      return button;
    });
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "view-buttons";
    viewButtons.forEach((button) => buttonContainer.appendChild(button));
    this.renderAddEventButton(buttonContainer);
    this.renderAddShowHideButton(buttonContainer);
    buttonsContainer.appendChild(buttonContainer);
  }

  renderNavigationButtons(buttonsContainer) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => this.navigate(-1));

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => this.navigate(1));

    const dateSpan = document.createElement("span");
    dateSpan.className = "current-date";
    dateSpan.textContent = this.currentDate.toLocaleDateString();

    const navContainer = document.createElement("div");
    navContainer.className = "nav-buttons";
    navContainer.appendChild(prevButton);
    navContainer.appendChild(dateSpan);
    navContainer.appendChild(nextButton);
    buttonsContainer.appendChild(navContainer);
  }

  navigate(direction) {
    switch (this.currentView) {
      case "day":
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        break;
      case "week":
        this.currentDate.setDate(this.currentDate.getDate() + direction * 7);
        break;
      case "month":
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        break;
    }
    this.render();
  }

  renderTotalHours(buttonsContainer) {
    const totalHours = this.calculateTotalHours();
    const totalHoursElement = document.createElement("div");
    totalHoursElement.className = "total-hours";
    totalHoursElement.textContent = `Total Hours: ${totalHours}`;
    buttonsContainer.appendChild(totalHoursElement);
  }

  calculateTotalHours() {
    let totalMilliseconds = 0;
    const now = new Date();
    const startDate = new Date(this.currentDate);
    let endDate;

    switch (this.currentView) {
      case "day":
        endDate = new Date(startDate);
        startDate.setDate(endDate.getDate() - 1);
        break;
      case "week":
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        break;
      case "month":
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(1);
        endDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0
        );
        break;
    }

    this.events.forEach((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      if (eventEnd <= startDate || eventStart > endDate) return;
      if (eventStart >= startDate)
        if (eventEnd <= endDate) totalMilliseconds += eventEnd - eventStart;
        else totalMilliseconds += endDate - eventStart;
      else if (eventEnd <= endDate) totalMilliseconds += eventEnd - startDate;
    });

    return Math.round(totalMilliseconds / (1000 * 60 * 60));
  }

  renderGrid() {
    const grid = document.createElement("div");
    grid.className = this.show ? "calendar-grid" : "calendar-grid hidden";

    switch (this.currentView) {
      case "day":
        this.renderDayGrid(grid);
        break;
      case "week":
        this.renderWeekGrid(grid);
        break;
      case "month":
        this.renderMonthGrid(grid);
        break;
    }

    this.container.appendChild(grid);
  }

  currentEvents() {
    const startDate = new Date(this.currentDate);
    let endDate;
    switch (this.currentView) {
      case "day":
        endDate = new Date(startDate);
        startDate.setDate(endDate.getDate() - 1);
        break;
      case "week":
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        break;
      case "month":
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(1);
        endDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0
        );
        break;
      default:
        endDate = new Date(startDate);
        startDate.setDate(endDate.getDate() - 1);
        break;
    }
    return this.events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      if (eventEnd >= startDate && eventStart < endDate) return true;
      return false;
    });
  }

  renderDayGrid(grid) {
    const events = this.currentEvents();
    const hours = {};
    events.forEach((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      console.log((eventEnd.getTime() - eventStart.getTime()) / 1000 / 60 / 60);
    });
    for (let i = 0; i < 24; i++) {
      const hour = document.createElement("div");
      hour.className = "hour";
      hour.textContent = `${i}:00`;
      grid.appendChild(hour);
    }
  }

  renderWeekGrid(grid) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach((day) => {
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = day;
      grid.appendChild(dayElement);
    });
  }

  renderMonthGrid(grid) {
    const daysInMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div");
      day.className = "day";
      day.textContent = i;
      grid.appendChild(day);
    }
  }

  renderAddEventButton(buttonsContainer) {
    const addButton = document.createElement("button");
    addButton.textContent = "Add Event";
    addButton.addEventListener("click", () => this.showEventModal());
    buttonsContainer.appendChild(addButton);
  }

  renderAddShowHideButton(buttonsContainer) {
    const showButton = document.createElement("button");
    showButton.textContent = this.show ? "Hide" : "Show";
    showButton.addEventListener("click", () => this.showHide());
    buttonsContainer.appendChild(showButton);
  }

  showEventModal(event = null) {
    const modal = new EventModal(
      event,
      this.saveEvent.bind(this),
      this.deleteEvent.bind(this)
    );
    modal.show();
  }

  showHide() {
    this.show = !this.show;
    this.render();
  }

  saveEvent(event) {
    if (event.id) {
      const index = this.events.findIndex((e) => e.id === event.id);
      this.events[index] = event;
    } else {
      event.id = Date.now();
      this.events.push(event);
    }
    IndexDB.saveEvents(this.events);
    this.render();
  }

  deleteEvent(eventId) {
    this.events = this.events.filter((e) => e.id !== eventId);
    IndexDB.saveEvents(this.events);
    this.render();
  }

  renderEvents() {
    this.events.forEach((event) => {
      const eventElement = document.createElement("div");
      eventElement.className = "event";
      eventElement.textContent =
        event.description +
        ":" +
        new Date(event.start).toLocaleString() +
        "-" +
        new Date(event.end).toLocaleString();
      eventElement.style.top = `${this.getPositionFromTime(event.start)}px`;
      eventElement.style.height = `${
        this.getPositionFromTime(event.end) -
        this.getPositionFromTime(event.start)
      }px`;
      eventElement.addEventListener("click", () => this.showEventModal(event));
      this.container.querySelector(".calendar-grid").appendChild(eventElement);
    });
  }

  getPositionFromTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 50 + (minutes / 60) * 50;
  }
}

const initCalendar = async () => {
  const calendar = new Calendar();
  calendar.events = await IndexDB.getEvents();
  calendar.render();
};
