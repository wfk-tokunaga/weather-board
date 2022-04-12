var searchEl = document.querySelector("#search-form");
var searchCityEl = document.querySelector("#city-search");
var cityNameEl = document.querySelector("#city-name");
var searchResultEl = document.querySelector("#search-result-section");
var forecastEl = document.querySelector("#forecast");

var apiKey = "b7ee02fafe439dca3aed3423ddbcfb21";

var formSubmitHandler = function (event) {
    event.preventDefault();
    var searchCity = searchCityEl.value.trim();
    weatherData = getCityData(searchCity);
}

var getCityData = function (cityName) {
    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var cityCoordinates = { lat: data[0].lat, lon: data[0].lon };
                // Get city weather info
                getCityWeatherData(cityCoordinates, cityName)
            });
        } else {
            alert("Bad coordinate request!");
        }
    });
}

var getCityWeatherData = function (cityCoordinates, cityName) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoordinates.lat}&lon=${cityCoordinates.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
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
                            description: data.daily[1].weather[0].description,
                            temp: data.daily[1].temp.day,
                            wind: data.daily[1].wind_speed,
                            humidity: data.daily[1].humidity,
                        },
                        {
                            description: data.daily[2].weather[0].description,
                            temp: data.daily[2].temp.day,
                            wind: data.daily[2].wind_speed,
                            humidity: data.daily[2].humidity,
                        },
                        {
                            description: data.daily[3].weather[0].description,
                            temp: data.daily[3].temp.day,
                            wind: data.daily[3].wind_speed,
                            humidity: data.daily[3].humidity,
                        },
                        {
                            description: data.daily[4].weather[0].description,
                            temp: data.daily[4].temp.day,
                            wind: data.daily[4].wind_speed,
                            humidity: data.daily[4].humidity,
                        },
                        {
                            description: data.daily[5].weather[0].description,
                            temp: data.daily[5].temp.day,
                            wind: data.daily[5].wind_speed,
                            humidity: data.daily[5].humidity,
                        }
                    ]
                    // 1: {
                    //     description: data.daily[1].weather[0].description,
                    //     temp: data.daily[1].temp.day,
                    //     wind: data.daily[1].wind_speed,
                    //     humidity: data.daily[1].humidity,
                    // },
                    // 2: {
                    //     description: data.daily[2].weather[0].description,
                    //     temp: data.daily[2].temp.day,
                    //     wind: data.daily[2].wind_speed,
                    //     humidity: data.daily[2].humidity,
                    // },
                    // 3: {
                    //     description: data.daily[3].weather[0].description,
                    //     temp: data.daily[3].temp.day,
                    //     wind: data.daily[3].wind_speed,
                    //     humidity: data.daily[3].humidity,
                    // },
                    // 4: {
                    //     description: data.daily[4].weather[0].description,
                    //     temp: data.daily[4].temp.day,
                    //     wind: data.daily[4].wind_speed,
                    //     humidity: data.daily[4].humidity,
                    // },
                    // 5: {
                    //     description: data.daily[5].weather[0].description,
                    //     temp: data.daily[5].temp.day,
                    //     wind: data.daily[5].wind_speed,
                    //     humidity: data.daily[5].humidity,
                    // },
                }
                console.log(weatherData.current);
                console.log(weatherData.forecast);
                loadSearchResult(weatherData);

                loadForecast(weatherData.forecast);
            });
        } else {
            alert("bad request!");
        }
    });
}

var loadSearchResult = function (cityWeatherData) {
    //Get images?
    // var imageApiUrl = `https://api.teleport.org/api/urban_areas/slug:${cityWeatherData.name}/images/`;
    //make a call to this api, if no images, move on.

    cityNameEl.textContent = `${cityWeatherData.name} ${moment().format("L")} ${cityWeatherData.current.description}`;
    console.log(document.querySelector("#city-name"));

    // var children = searchResultEl.children;
    // for (var i = 1; i < children.length; i++) {
    //     children[i].remove();
    // }
    // console.log(searchResultEl.children);

    var tempEl = document.createElement("p");
    tempEl.innerHTML = `<p>Temp: ${cityWeatherData.current.temp} <span>&#176;</span>F</p>`;
    // tempEl.textContent = `Temp: ${cityWeatherData.current.temp} F`;
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

var loadForecast = function (forecastData) {
    forecastData.forEach((day, index) => {
        console.log(index);
        console.log(day);
        // for each day, make an element and append it to forecastEl
        var dayEl = document.createElement("div");
        dayEl.innerHTML =
            `<div class="bg-dark col-2 p-3">
                <h4 class="text-white">${moment().add(index + 1, "days").format("L")}</h4>
                <p class="text-white">Decription: ${day.description}</p>
                <p class="text-white">Temp: ${day.temp} <span>&#176;</span>F</p>
                <p class="text-white">Wind: ${day.wind} MPH</p>
                <p class="text-white">Humidity: ${day.humidity}%</p>
            </div>`
        forecastEl.appendChild(dayEl);
    });
}


var getCityCoordinates = function (cityName) {
    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var cityCoordinates = { lat: data[0].lat, lon: data[0].lon };
                console.log(cityCoordinates);
                var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates.lat}&lon=${cityCoordinates.lon}&units=imperial&appid=${apiKey}`;

                fetch(apiUrl).then(function (response) {
                    console.log(response);
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data);
                        });
                    } else {
                        alert("bad request!");
                    }
                });
            });
        } else {
            alert("Bad coordinate request!");
        }
    });
}

searchEl.addEventListener("submit", formSubmitHandler);