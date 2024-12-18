document.addEventListener('DOMContentLoaded', async () => {
  // Initialize all components
  // await Header.init();
  Search.init();
  await TodoList.init();
  initWorldMap();
  updateTimes();
});