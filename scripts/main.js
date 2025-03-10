document.addEventListener("DOMContentLoaded", async () => {
  // await Header.init();
  Search.init();
  await TodoList.init();
  initCalendar();
  initWorldMap();
  updateTimes();
});
