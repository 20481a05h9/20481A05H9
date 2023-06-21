import React, { useState } from 'react';
import Numbers from './Components/Numbers';

function App() {
  const [urls, setUrls] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchNumbers();
  };

  const fetchNumbers = async () => {
    if (!urls) {
      alert('Please enter at least one URL');
      return;
    }

    const urlArray = urls.split(',').map((url) => url.trim());
    const promises = [];

    for (const url of urlArray) {
      promises.push(fetch(url).then((response) => response.json()));
    }

    try {
      const responses = await Promise.allSettled(promises);
      let numbers = [];

      for (const response of responses) {
        if (response.status === 'fulfilled') {
          const data = response.value;

          if (data && Array.isArray(data.numbers)) {
            numbers.push(...data.numbers);
          }
        }
      }

      const uniqueNumbers = [...new Set(numbers)].sort((a, b) => a - b);
      console.log(uniqueNumbers); // Display numbers in the browser console
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="App">
      <h1>Number Management Service</h1>
      <form onSubmit={handleSubmit}>
        <label>
          URLs (comma-separated):
          <input
            type="text"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />
        </label>
        <button type="submit">Fetch Numbers</button>
      </form>
      <Numbers />
    </div>
  );
}

export default App;

