function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
    return `${hours}:${minutes}`;
  }
}

function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

// function showForecast(response) {
//   let forecastElement = document.querySelector("#forecast");
//   forecastElement.innerHTML = null;
//   let forecast = null;

//   for (let index = 0; index < 6; index++) {
//     forecast = response.data.list[index];
//     forecastElement.innerHTML += `<div class="col-2">
//               <h3>${formatHours(forecast.dt * 1000)}</h3>
//               <img src="https://openweathermap.org/img/wn/${
//                 forecast.weather[0].icon
//               }@2x.png" alt="" />
//               <div class="weather-forecast-temperature">
//                 <strong>${Math.round(
//                   forecast.main.temp_max
//                 )}°</strong>${Math.round(forecast.main.temp_min)}°
//               </div>`;
//   }
// }

function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `<div class="col-2">
              <h3>${formatHours(forecast.dt * 1000)}</h3>
              <img src="https://openweathermap.org/img/wn/${
                forecast.weather[0].icon
              }@2x.png" alt="" />
              <div class="weather-forecast-temperature">
                <strong><span class="forecast-max">${Math.round(
                  forecast.main.temp_max
                )}</span>°</strong><span class="forecast-min">${Math.round(
      forecast.main.temp_min
    )}</span>°
              </div>`;
  }
}

function search(city) {
  let apiKey = "88a366563aa00a334a8bb9a66693ece7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}
function handleSubmit(event) {
  event.preventDefault();
  // let cityInputElement = document.querySelector("#city-input");
  // search(cityInputElement.value);

  //
  celsiusLink.removeEventListener("click", showCelsiusTemperature);
  fahrenheitLink.addEventListener("click", showFahrenheitTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let cityInputElement = document.querySelector("#city-input");
  if (cityInputElement.value) {
    search(cityInputElement.value);
  } else {
    alert(`Please enter a city to submit your search.`);
  }
  //
}
function showCurrentCity(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "88a366563aa00a334a8bb9a66693ece7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function searchCurrentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentCity);
}

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  //
  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });
  let forecastMin = document.querySelectorAll(".forecast-min");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  celsiusLink.addEventListener("click", showCelsiusTemperature);
  fahrenheitLink.removeEventListener("click", showFahrenheitTemperature);
  //
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  //
  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });
  let forecastMin = document.querySelectorAll(".forecast-min");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });
  celsiusLink.removeEventListener("click", showCelsiusTemperature);
  fahrenheitLink.addEventListener("click", showFahrenheitTemperature); //
}

celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

let button = document.querySelector("#city-current");
button.addEventListener("click", searchCurrentCity);

search("London");
