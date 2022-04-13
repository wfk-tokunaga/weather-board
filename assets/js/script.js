var searchEl = document.querySelector("#search-form");
var searchCityEl = document.querySelector("#city-search");
var cityNameEl = document.querySelector("#city-name");
var searchResultEl = document.querySelector("#search-result-section");
var searchResultCard = document.querySelector("#search-result-card");
var forecastEl = document.querySelector("#forecast");
var searchHistoryEl = document.querySelector("#search-history");

var icons = {
    sun: `<i class="bi bi-sun-fill"></i>`,
    rain: `<i class="bi bi-cloud-rain-heavy-fill"></i>`,
    cloud: `<i class="bi bi-clouds-fill"></i>`,
    snow: `<i class="bi bi-snow"></i>`,
    thunderStorm: `<i class="bi bi-cloud-lightning-rain-fill"></i>`,
}

var searchHistory = [];

var apiKey = "b7ee02fafe439dca3aed3423ddbcfb21";

var formSubmitHandler = event => {
    event.preventDefault();
    var searchCityName = searchCityEl.value.trim();
    searchCityEl.value = "";
    weatherData = getCityData(searchCityName);
}

var saveHistory = () => localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

var loadHistory = function () {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (!searchHistory) {
        searchHistory = [];
    }
    searchHistory.forEach(term => updateSearchHistory(term));
}

var historyClickHandler = event => {
    event.preventDefault();
    getCityData(event.target.getAttribute("data-name"));
}

var updateSearchHistory = searchTerm => {
    var searchTermEl = document.createElement("button");
    searchTermEl.innerText = searchTerm;
    searchTermEl.classList = "btn btn-secondary search-history-btn mt-2";
    searchTermEl.setAttribute("data-name", searchTerm);
    searchHistoryEl.insertBefore(searchTermEl, searchHistoryEl.firstChild);
}

var getCityData = cityName => {
    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    // Getting coordinates
    fetch(apiUrl).then(response => {
        console.log(response);
        if (response.ok) {
            // Only wanna include something in the history if it's a valid search term
            response.json().then(data => {
                if (data.length === 0) {
                    searchResultEl.innerHTML = "";
                    forecastEl.innerHTML = "";
                    alert(`No results for ${cityName}`);
                } else {
                    if (!searchHistory.includes(cityName)) {
                        searchHistory.push(cityName);
                        saveHistory();
                        updateSearchHistory(cityName);
                        console.log(searchHistory);
                    }
                    var cityCoordinates = { lat: data[0].lat, lon: data[0].lon };
                    // Get city weather info with coordinates
                    getCityWeatherData(cityCoordinates, cityName)
                }
            });
        } else {
            alert("Bad coordinate request!");
        }
    });
}

var getCityWeatherData = (cityCoordinates, cityName) => {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoordinates.lat}&lon=${cityCoordinates.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;
    fetch(apiUrl).then(response => {
        if (response.ok) {
            response.json().then(data => {
                var weatherData = {
                    name: cityName,
                    current: {
                        description: data.current.weather[0].main,
                        wind: data.current.wind_speed,
                        temp: data.current.temp,
                        humidity: data.current.humidity,
                        uvi: data.current.uvi,
                    },
                    forecast: [
                        {
                            description: data.daily[1].weather[0].main,
                            temp: data.daily[1].temp.day,
                            wind: data.daily[1].wind_speed,
                            humidity: data.daily[1].humidity,
                        },
                        {
                            description: data.daily[2].weather[0].main,
                            temp: data.daily[2].temp.day,
                            wind: data.daily[2].wind_speed,
                            humidity: data.daily[2].humidity,
                        },
                        {
                            description: data.daily[3].weather[0].main,
                            temp: data.daily[3].temp.day,
                            wind: data.daily[3].wind_speed,
                            humidity: data.daily[3].humidity,
                        },
                        {
                            description: data.daily[4].weather[0].main,
                            temp: data.daily[4].temp.day,
                            wind: data.daily[4].wind_speed,
                            humidity: data.daily[4].humidity,
                        },
                        {
                            description: data.daily[5].weather[0].main,
                            temp: data.daily[5].temp.day,
                            wind: data.daily[5].wind_speed,
                            humidity: data.daily[5].humidity,
                        }
                    ]
                }
                loadSearchResult(weatherData);
                loadForecast(weatherData.forecast);
            });
        } else {
            alert("bad request!");
        }
    });
}

var getWeatherIcon = weatherDescription => {
    // What if none?
    switch (weatherDescription) {
        case "Clouds":
            return icons.cloud;
        case "Clear":
            return icons.sun;
        case "Snow":
            return icons.snow;
        case "Rain":
            return icons.rain;
        case "Drizle":
            return icons.rain;
        case "Thunderstorm":
            return icons.thunderStorm;
    }
}

var getCityImageUrl = cityName => {
    //Get images?
    var imageApiUlr = `https://api.teleport.org/api/urban_areas/slug:${cityName.toLowerCase()}/images/`;
    fetch(imageApiUlr).then(response => {
        if (response.ok) {
            // If there is a picture for the specified location
            response.json().then(data => {
                console.log(data);
                var imageUrl = data.photos[0].image.web;
                return imageUrl;
                var imageEl = document.createElement("img");
                imageEl.setAttribute("src", `${imageUrl}`);
                imageEl.setAttribute("alt", "Card image cap");
                imageEl.classList = "card-img-top";
                searchResultCard.insertBefore(imageEl, searchResultCard.firstChild);
                // console.log(data.photos[0].image.web);
            });
        } else {
            console.log("bad request!");
            return "";
        }
    })
}

var loadSearchResult = cityWeatherData => {
    searchResultEl.innerHTML = "";

    //Get images?
    // var cityImageUrl = 
    // getCityImageUrl(cityWeatherData.name).then(imageUrl => console.log(imageUrl));
    // console.log(cityImageUrl);
    //make a call to this api, if no images, move on.

    // Change the last part to be the icon
    var weatherIcon = getWeatherIcon(cityWeatherData.current.description);

    var searchCityNameEl = document.createElement("h2");
    searchCityNameEl.innerHTML =
        `<h2 class="card-title" id="city-name">${cityWeatherData.name.toUpperCase()} ${moment().format("L")} ${weatherIcon}</h2>`;
    searchResultEl.appendChild(searchCityNameEl);

    var tempEl = document.createElement("p");
    tempEl.innerHTML = `<p>Temp: ${cityWeatherData.current.temp} <span>&#176;</span>F</p>`;

    var windEl = document.createElement("p");
    windEl.textContent = `Wind: ${cityWeatherData.current.wind} MPH`;

    var humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${cityWeatherData.current.humidity}%`;

    var uvIndexEl = document.createElement("p");
    uvIndexEl.innerHTML = `<p>UV Index: <span>${cityWeatherData.current.uvi}</span></p>`;
    uvIndexEl.textContent = `UV Index: ${cityWeatherData.current.uvi}`;

    searchResultEl.appendChild(tempEl);
    searchResultEl.appendChild(windEl);
    searchResultEl.appendChild(humidityEl);
    searchResultEl.appendChild(uvIndexEl);
}

var loadForecast = forecastData => {
    // Clears out previous search results
    forecastEl.innerHTML = "";
    forecastData.forEach((day, index) => {
        var weatherIcon = getWeatherIcon(day.description);
        // for each day, make an element and append it to forecastEl
        var dayEl = document.createElement("div");
        dayEl.innerHTML =
            `<div class="card day-card">
                <div class="card-body bg-secondary text-white">
                    <h5 class="card-title">${moment().add(index + 1, "days").format("L")}</h5>
                    ${weatherIcon}
                </div>
                <ul class="list-group list-group-flush bg-secondary text-white">
                    <li class="list-group-item bg-secondary text-white">Temp: ${day.temp}</li>
                    <li class="list-group-item bg-secondary text-white">Wind: ${day.wind}</li>
                    <li class="list-group-item bg-secondary text-white">Humidity ${day.humidity}</li>
                </ul>
            </div>`;
        forecastEl.appendChild(dayEl);
    });
}

loadHistory();

searchEl.addEventListener("submit", formSubmitHandler);

searchHistoryEl.addEventListener("click", historyClickHandler);