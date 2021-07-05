// get relevant elements from page for use
var cityInput = document.querySelector("#city-input");
var cityBtn = document.querySelector("#search-btn");
var cityNameEl = document.querySelector("#city-name");
var historyClearBtn = document.querySelector("#clear-btn");

// set up some other variables for use within the script
var cityArr = [];
var apiKey = "4fce33c2507da6a14728115e9b8910d3"; // my personal key from my account

// clear search history button
historyClearBtn.addEventListener("click", function() {
    localStorage.removeItem("cities");
    window.location.reload();
  })

// handle the user's input, and begin the search if they've entered correctly, otherwise warn them
var formHandler = function(event) {
    // formats city name
    var selectedCity = cityInput.value.trim().toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");

    if (selectedCity) {
        getCoords(selectedCity);
        cityInput.value = "";
    } else {
        alert("Please enter a city!");
    };
};

// use "current weather api" to fetch latitude and longitude
var getCoords = function(city) {
    var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(currentWeatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lon = data.coord["lon"];
                var lat = data.coord["lat"];
                var country = data.sys["country"];
                getCityForecast(city, lon, lat, country);

                // saves searched city and refreshes recent city list
                if (document.querySelector(".city-list")) {
                    document.querySelector(".city-list").remove();
                }

                saveCity(city);
                loadCities();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function(error) {
        alert("Unable to load weather.");
    })
}

// uses latitude and longitude to get current weather and forecast
var getCityForecast = function(city, lon, lat, country) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                // populate city name and country, and the day/date
                cityNameEl.textContent = `${city}, ${country} (${moment().format("dddd, Do of MMMM YYYY")})`; 

                // populate the data for today and next 5 days
                currentForecast(data);
                fiveDayForecast(data);
            });
        }
    })
}

// select HTML element and display temperature
var displayTemp = function(element, temperature) {
    var tempEl = document.querySelector(element);
    var elementText = Math.round(temperature);
    tempEl.textContent = elementText;
}

// displays current forecast
var currentForecast = function(forecast) {
    var forecastEl = document.querySelector(".city-forecast");
    forecastEl.classList.remove("hide");

    // display the correct icon
    var weatherIconEl = document.querySelector("#today-icon");
    var currentIcon = forecast.current.weather[0].icon;
    weatherIconEl.setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}.png`);
    weatherIconEl.setAttribute("alt", forecast.current.weather[0].main)

    // display the various temperature fields
    displayTemp("#current-temp", forecast.current["temp"]);
    displayTemp("#current-feels-like", forecast.current["feels_like"]);
    displayTemp("#current-high", forecast.daily[0].temp.max);
    displayTemp("#current-low", forecast.daily[0].temp.min);

    // display the current conditions summary with the correct case
    var currentConditionEl = document.querySelector("#current-condition");
    currentConditionEl.textContent = forecast.current.weather[0].description
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");

    // display the humidity
    var currentHumidityEl = document.querySelector("#current-humidity");
    currentHumidityEl.textContent = forecast.current["humidity"];

    // display the wind speed
    var currentWindEl = document.querySelector("#current-wind-speed")
    currentWindEl.textContent = forecast.current["wind_speed"];

    // display the UV index
    var uviEl = document.querySelector("#current-uvi")
    var currentUvi = forecast.current["uvi"];
    uviEl.textContent = currentUvi;

    // Set the correct UV index colours
    switch (true) {
        case (currentUvi <= 2):
            uviEl.className = "badge badge-success";
            break;
        case (currentUvi <= 5):
            uviEl.className = "badge badge-warning";
            break;
        case (currentUvi <=7):
            uviEl.className = "badge badge-danger";
            break;
        default:
            uviEl.className = "badge badge-danger";
    }
}

// display five day forecast
var fiveDayForecast = function(forecast) { 
    
    for (var i = 1; i < 6; i++) {
        var dateP = document.querySelector("#date-" + i);
        dateP.textContent = moment().add(i, "days").format("ddd, Do MMMM YYYY");

        var iconImg = document.querySelector("#icon-" + i);
        var iconCode = forecast.daily[i].weather[0].icon;
        iconImg.setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}.png`);
        iconImg.setAttribute("alt", forecast.daily[i].weather[0].main);

        displayTemp("#temp-" + i, forecast.daily[i].temp.day);
        displayTemp("#high-" + i, forecast.daily[i].temp.max);
        displayTemp("#low-" + i, forecast.daily[i].temp.min);

        var humiditySpan = document.querySelector("#humidity-" + i);
        humiditySpan.textContent = forecast.daily[i].humidity;

        var windSpan = document.querySelector("#wind-speed-" + i);
        windSpan.textContent = forecast.daily[i].wind_speed;
    }
}

// saves cities into local storage
var saveCity = function(city) {

    // prevents duplicate city from being saved and moves it to the end
    for (var i = 0; i < cityArr.length; i++) {
        if (city === cityArr[i]) {
            cityArr.splice(i, 1);
        }
    }

    cityArr.push(city);
    localStorage.setItem("cities", JSON.stringify(cityArr));
}

// loads cities from local storage
var loadCities = function() {
    cityArr = JSON.parse(localStorage.getItem("cities"));

    if (!cityArr) {
        cityArr = [];
        return false;
    } else if (cityArr.length > 10) {
        // only save up to the ten most recent cities
        cityArr.shift();
    }

    // add to the history list
    var recentCities = document.querySelector("#recent-cities");
    var cityListUl = document.createElement("ul");
    cityListUl.className = "list-group list-group-flush city-list";
    recentCities.appendChild(cityListUl);

    // create the list as a button with the correct stylings
    for (var i = 0; i < cityArr.length; i++) {
        var cityListItem = document.createElement("button");
        cityListItem.setAttribute("type", "button");
        cityListItem.className = "list-group-item bg-dark text-white";
        cityListItem.setAttribute("value", cityArr[i]);
        cityListItem.textContent = cityArr[i];
        cityListUl.prepend(cityListItem);
    }

    // search for the city that is clicked in the history list
    var cityList = document.querySelector(".city-list");
    cityList.addEventListener("click", selectRecent)
}

// get the city name from the history item that was clicked, so we can search for it
var selectRecent = function(event) {
    var clickedHistory = event.target.getAttribute("value");
    getCoords(clickedHistory);
}

// on page load, create the list of history from local storage
loadCities();

// handle the user's input when they click the search button
cityBtn.addEventListener("click", formHandler)

// search for your city when you press enter, as opposed to clicking the search button
cityInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        cityBtn.click();
    }
});