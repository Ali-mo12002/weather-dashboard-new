var form = document.getElementById('cityForm'); // Form element
var cityInput = document.getElementById('city'); // City input field
var weatherInfo = document.getElementById('weatherInfo'); // Weather information container
var apiKey = '0506412134fab4feb423e9a1222790a2'; // Replace 'YOUR_API_KEY' with your actual API key

// Event listener to display search history on page load
document.addEventListener('DOMContentLoaded', () => {
    displaySearchHistory();
});

// Function to display current weather conditions
function displayCurrentWeather(data) {
    // get data from the API 
    var city = data.name;
    var date = new Date(data.dt * 1000).toLocaleDateString('en-US');
    var weatherDescription = data.weather[0].description;
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var iconCode = data.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    // Update the weatherInfo element with the current weather information
    weatherInfo.innerHTML = `
        <h2>Current Weather in ${city}</h2>
        <p>Date: ${date}</p>
        <img src="${iconUrl}" alt="${weatherDescription}">
        <p>Weather: ${weatherDescription}</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

// Function to display the forecast for the next five days
function displayForecast(forecastData) {
    // Loop through the forecast data for the next five days
    var forecastElements = document.querySelectorAll('.day-forecast'); // Select all elements with the class 'day-forecast'
    var currentDate = new Date();

    // Loop through each forecast element and update with corresponding data
    forecastElements.forEach((forecastElement, index) => {
        var forecast = forecastData.list[index];

        if (forecast) {
            var date = new Date(forecast.dt * 1000);
            date.setDate(currentDate.getDate() + index + 1); // Increment the date by the index
            var formattedDate = date.toLocaleDateString('en-US');

            var weatherDescription = forecast.weather[0].description;
            var temperature = forecast.main.temp;
            var windSpeed = forecast.wind.speed;
            var humidity = forecast.main.humidity;
            var iconCode = forecast.weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

            // Update the current forecast element with the forecast information
            forecastElement.innerHTML = `
                <h3>${formattedDate}</h3>
                <img src="${iconUrl}" alt="${weatherDescription}">
                <p>Weather: ${weatherDescription}</p>
                <p>Temperature: ${temperature}°C</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
                <p>Humidity: ${humidity}%</p>
            `;
        } else {
            console.error('Forecast data not available for day', index + 1);
        }
    });
}

// Function to save search history to localStorage
function saveSearchHistory(city) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    searchHistory.unshift(city); // Add the new search to the beginning of the array

    if (searchHistory.length > 4) {
        searchHistory = searchHistory.slice(0, 4);
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to display search history on the page
function displaySearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    var historyList = document.getElementById('searchHistory');

    // Clear existing search history display
    historyList.innerHTML = '';

    // Display each search history item
    if(searchHistory){
    searchHistory.forEach(city => {
        var listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.addEventListener('click', () => {
            fetchWeatherData(city);
        });
        historyList.appendChild(listItem);
    });
}
}

// Function to fetch weather data for a city
async function fetchWeatherData(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Fetch current weather data for the selected city
        var currentWeatherResponse = await fetch(currentWeatherUrl);
        var currentWeatherData = await currentWeatherResponse.json();
        displayCurrentWeather(currentWeatherData);

        // Fetch forecast data for the selected city
        var forecastResponse = await fetch(forecastUrl);
        var forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = 'Failed to fetch weather data. Please try again.';
    }
}

// Event listener for form submission
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    var city = cityInput.value;
    saveSearchHistory(city);
    displaySearchHistory();
    fetchWeatherData(city);
});

// Event listener for search history items
document.getElementById('searchHistory').addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        var city = event.target.textContent;
        fetchWeatherData(city);
    }
});