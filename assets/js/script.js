var searchEl = document.querySelector("#search-form");
var searchCityEl = document.querySelector("#city-search");

var formSubmitHandler = function (event) {
    event.preventDefault();
    console.log(event);
    var searchCity = searchCityEl.value.trim();

    console.log(searchCity);
}

searchEl.addEventListener("submit", formSubmitHandler);