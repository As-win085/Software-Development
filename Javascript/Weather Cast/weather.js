const apiKey = "YOUR_API_KEY"; // 

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const result = document.getElementById("weatherResult");

    if (!city) {
        result.innerHTML = "❗ Please enter a city name.";
        return;
    }

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    Promise.all([
            fetch(currentUrl).then(res => {
                if (!res.ok) throw new Error("City not found");
                return res.json();
            }),
            fetch(forecastUrl).then(res => {
                if (!res.ok) throw new Error("Forecast not found");
                return res.json();
            })
        ])
        .then(([currentData, forecastData]) => {
            let forecastHTML = "<h4>🌤️ 5-Day Forecast:</h4><div class='forecast'>";

            const filteredForecast = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

            filteredForecast.forEach(day => {
                const date = new Date(day.dt_txt);
                forecastHTML += `
        <div class="forecast-day">
          <strong>${date.toDateString().split(' ').slice(0, 3).join(' ')}</strong>
          <p>${day.weather[0].main}</p>
          <p>🌡️ ${day.main.temp} °C</p>
          <p>💧 ${day.main.humidity}%</p>
        </div>
      `;
            });

            forecastHTML += "</div>";

            result.innerHTML = `
      <h3>📍 ${currentData.name}, ${currentData.sys.country}</h3>
      <p>🌡️ Temperature: ${currentData.main.temp} °C</p>
      <p>☁️ Weather: ${currentData.weather[0].description}</p>
      <p>💧 Humidity: ${currentData.main.humidity}%</p>
      <p>🌬️ Wind Speed: ${currentData.wind.speed} m/s</p>
      ${forecastHTML}
    `;
        })
        .catch(err => {
            console.error(err);
            result.innerHTML = `⚠️ ${err.message}`;
        });
}
