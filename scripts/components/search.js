class Search {
  static init() {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', this.handleSearch);
  }

  static handleSearch(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    console.log(query)
    
    if (!query) return;

    const url = query.includes('.') && !query.includes(' ') 
      ? `https://${query}`
      : `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    window.location.href = url;
  }
}