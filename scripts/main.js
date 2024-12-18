// Preserve Chrome's original new tab functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the world map
  initWorldMap();
  
  // Handle Chrome's most visited sites
  chrome.topSites?.get((sites) => {
    const mostVisited = document.getElementById('most-visited');
    sites.forEach(site => {
      const link = document.createElement('a');
      link.href = site.url;
      link.textContent = site.title;
      mostVisited.appendChild(link);
    });
  });
});