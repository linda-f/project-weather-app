// Building the URL
const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const API_KEY = "b34ca1ebc43d2420cd2a70a7d29aa6c4";
const place = "Zurich";
const units = "units=metric";
const dataWeather = "weather";
const dataForecast = "forecast";

const URLWeather = `${BASE_URL}${dataWeather}?q=${place}&${units}&appid=${API_KEY}`;
const URLForecast = `${BASE_URL}${dataForecast}?q=${place}&${units}&appid=${API_KEY}`;

// DOM Selectors
const container = document.getElementById("container");
const mainWeather = document.getElementById("main-weather");
const title = document.getElementById("title");
const sun = document.getElementById("sun");
const img = document.getElementById("img");
const dates = document.getElementById("dates");
const temp = document.getElementById("temp");

// Global Variable
let styleMainWeather;

////////// Everything with the Weather URL/////////
// Changing the HTML with the data of the API
const changeWeather = (json) => {
  const sunriseEpoch = json.sys.sunrise;
  const sunriseHuman = new Date(sunriseEpoch * 1000);
  const sunriseLocal = sunriseHuman.toLocaleTimeString(undefined, {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
  });

  const sunsetEpoch = json.sys.sunset;
  const sunsetHuman = new Date(sunsetEpoch * 1000);
  const sunsetLocal = sunsetHuman.toLocaleTimeString(undefined, {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
  });
  styleMainWeather = json.weather[0].main;
  mainWeather.innerHTML = `${styleMainWeather} | ${json.main.temp.toFixed(1)}°`;
  sun.innerHTML = `
    sunrise ${sunriseLocal} <br>
    sunset ${sunsetLocal}`;
};

// Fetching the Data from the Weather Endpoint
const fetchWeather = () => {
  fetch(URLWeather)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      changeWeather(json);
      changeStyle(styleMainWeather);
      changeTitle(json, title);
      changeImg(img);
    })
    .catch((error) => {
      container.innerHTML = `There has been an error. Please reload the page and try again.`;
      console.log(error);
    });
};

fetchWeather();

////////// Everything with the Forecast URL //////////
// Changing the HTML with the data of the API
const changeForecast = (json) => {
  const dateEpoch = [];
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const now = new Date();
  const currentDayOfWeek = weekdays[now.getDay()];

  const daytimeForecast = json.list.filter((element) => {
    const time = element.dt_txt.split(" ")[1];
    const dayOfWeek = weekdays[new Date(element.dt * 1000).getDay()];
    return time === "12:00:00" && dayOfWeek !== currentDayOfWeek;
  });

  daytimeForecast.forEach((element) => {
    const dayOfWeek = weekdays[new Date(element.dt * 1000).getDay()];
    dates.innerHTML += `<li class="list-style">${dayOfWeek}</li>`;
    temp.innerHTML += `<li class="list-style">${Math.round(
      element.main.temp
    )}°</li>`;
    dateEpoch.push(element.dt);
  });
};

// Fetching the Data from the Forecast Endpoint
const fetchForecast = () => {
  fetch(URLForecast)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      changeForecast(json);
    })
    .catch((error) => {
      container.innerHTML = `There has been an error. Please reload the page and try again.`;
      console.log(error);
    });
};

fetchForecast();

////////Change Styling depending on Weather/////////
// Add different Class
const changeStyle = (styleMainWeather) => {
  const list = document.querySelectorAll(".list-style");
  if (styleMainWeather === "Clear") {
    container.classList.add("clear");
    mainWeather.classList.add("clear");
    title.classList.add("clear");
    sun.classList.add("clear");
    img.classList.add("clear");
    dates.classList.add("clear");
    temp.classList.add("clear");
    list.forEach((element) => {
      element.classList.add("clear");
    });
  } else if (styleMainWeather === "Clouds") {
    container.classList.add("clouds");
    mainWeather.classList.add("clouds");
    title.classList.add("clouds");
    img.classList.add("clouds");
    sun.classList.add("clouds");
    dates.classList.add("clouds");
    temp.classList.add("clouds");
    list.forEach((element) => {
      element.classList.add("clouds");
    });
  } else if (styleMainWeather === "Rain") {
    container.classList.add("rain");
    mainWeather.classList.add("rain");
    title.classList.add("rain");
    img.classList.add("rain");
    sun.classList.add("rain");
    dates.classList.add("rain");
    temp.classList.add("rain");
    list.forEach((element) => {
      element.classList.add("rain");
    });
  } else if (styleMainWeather === "Snow") {
    container.classList.add("snow");
    mainWeather.classList.add("snow");
    title.classList.add("snow");
    img.classList.add("snow");
    sun.classList.add("snow");
    dates.classList.add("snow");
    temp.classList.add("snow");
    list.forEach((element) => {
      element.classList.add("snow");
    });
  } else if (styleMainWeather) {
    container.classList.add("default");
    mainWeather.classList.add("default");
    title.classList.add("default");
    img.classList.add("default");
    sun.classList.add("default");
    dates.classList.add("default");
    temp.classList.add("default");
    list.forEach((element) => {
      element.classList.add("default");
    });
  }
};

// Change the text depending on the class
const changeTitle = (json, title) => {
  if (title.classList.contains("clear")) {
    title.innerText = `Get your sunnies on. ${json.name} is looking rather great today.`;
  } else if (title.classList.contains("clouds")) {
    title.innerText = `Light a fire and get cosy. ${json.name} is looking grey today.`;
  } else if (title.classList.contains("rain")) {
    title.innerText = `Don't forget your umbrella. It's wet in ${json.name} today.`;
  } else if (title.classList.contains("snow")) {
    title.innerText = `Don't forget your hat. It's quite cold in ${json.name} today.`;
  } else if (title.classList.contains("default")) {
    title.innerText = `Enjoy your day with the current ${json.name} weather.`;
  }
};

// Change the Img depending on the class
const changeImg = (img) => {
  if (img.classList.contains("clear")) {
    img.src = "./design/noun_Sunglasses_2055147.png";
  } else if (img.classList.contains("clouds")) {
    img.src = "./design/noun_Cloud_1188486.png";
  } else if (img.classList.contains("rain")) {
    img.src = "./design/noun_Umbrella_2030530.png";
  } else if (img.classList.contains("snow")) {
    img.src = "./design/snow.png";
  } else if (img.classList.contains("default")) {
    img.src = "./design/default.png";
  }
};
