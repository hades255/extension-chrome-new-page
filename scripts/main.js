document.addEventListener("DOMContentLoaded", async () => {
  // await Header.init();
  Search.init();
  await TodoList.init();
  initWorldMap();
  updateTimes();
});
