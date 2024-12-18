function initWorldMap() {
  const map = document.getElementById('map');
  
  // Add markers for each timezone
  timeZones.forEach(({ city, zone }) => {
    const marker = document.createElement('div');
    marker.className = 'timezone-marker';
    marker.setAttribute('data-city', city);
    
    // Position markers based on approximate coordinates
    // You would need to add specific coordinates for each city
    map.appendChild(marker);
  });
}