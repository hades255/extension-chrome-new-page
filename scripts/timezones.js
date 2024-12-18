const timeZones = [
  { city: 'Los Angeles', zone: 'America/Los_Angeles' },
  { city: 'New York', zone: 'America/New_York' },
  { city: 'London', zone: 'Europe/London' },
  { city: 'Paris', zone: 'Europe/Paris' },
  { city: 'Dubai', zone: 'Asia/Dubai' },
  { city: 'Tokyo', zone: 'Asia/Tokyo' },
  { city: 'Sydney', zone: 'Australia/Sydney' },
  // Add more major cities and their timezones
];

function updateTimes() {
  const timezoneList = document.getElementById('timezone-list');
  timezoneList.innerHTML = '';

  timeZones.forEach(({ city, zone }) => {
    const time = new Date().toLocaleTimeString('en-US', {
      timeZone: zone,
      hour12: true,
      hour: 'numeric',
      minute: 'numeric'
    });

    const date = new Date().toLocaleDateString('en-US', {
      timeZone: zone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const div = document.createElement('div');
    div.className = 'timezone-item';
    div.innerHTML = `
      <div class="timezone-city">${city}</div>
      <div class="timezone-time">${time}</div>
      <div class="timezone-date">${date}</div>
    `;
    timezoneList.appendChild(div);
  });
}

// Update times every minute
setInterval(updateTimes, 60000);
updateTimes(); // Initial update