// variables
const now  = moment().format("dddd, MMMM Do, YYYY, h:mm a");

const searchButton = document.querySelector("#searchBtn");
const apiKey = "&appid=108e85e2f410617f090c951efcf86507"
var cities = JSON.parse(localStorage.getItem("cities")) || [];

//display current day and time at top of page
$("#currentDay").text(now)

//load local storage on main page
for (let index = 0; index < cities.length; index++) {
    cityList(cities[index])
}


function getSearchTerm () {
    event.preventDefault();
    //clear previous
    clearInterval();     
    var searchTerm = document.querySelector("#searchCity").value
    cityList(searchTerm)
    searchFunction(searchTerm)
}

//save cities to local storage
var saveCity = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
    event.preventDefault();
}

//create city list and display on page
function cityList(searchTerm) {
    var listItems = document.createElement("li");
    //i don't understand this
    var searchTermText = searchTerm;
    listItems.textContent = searchTermText;
    var historyList = document.querySelector(".history");
    historyList.appendChild(listItems)
    //call searchFunction here
}



//search for cities
var searchFunction = function() {
    var searchTerm = document.querySelector('#searchCity').value
    cities.push(searchTerm)
    saveCity()

    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&q=" + searchTerm + apiKey
    
    // var weatherIcon = "https://openweathermap.org/img/wn/" + searchTerm.weather[0].icon + "@2x.png";


    // get weather dashboard for current day    
        fetch(apiUrl)
        .then(function(weatherResponse) {
       return weatherResponse.json().then(function(data) {
           console.log(data);
        const cityName = data.name;
        const temperature = data.main.temp
        var dateOfWeather = getLocalDate(data.dt)
        const windSpeed = data.wind.speed
        const humidity = data.main.humidity
        var lat = data.coord.lat
        var lon = data.coord.lon
        fetchuvIndex(lat, lon)
        fetchForecast(searchTerm, dateOfWeather)

          //grab the area of the html we want to put that data in
          var cityNameDisplay = document.querySelector("#cityName");
          var dateOfWeatherDisplay = document.querySelector("#date");
          var temperatureDisplay = document.querySelector("#temperature")
          var humidityDisplay = document.querySelector("#humidity");
          var windSpeedDisplay = document.querySelector("#windSpeed");
         
  
          cityNameDisplay.innerHTML = cityName; 
          dateOfWeatherDisplay.innerHTML = dateOfWeather;
          temperatureDisplay.innerHTML = "Temperature: " + temperature;
          humidityDisplay.innerHTML = "Humidity:  " + humidity + " %";
          windSpeedDisplay.innerHTML = "Windspeed:  " + windSpeed + " mph";
          })
      })
  }
        
        
// retrieve uvIndex and display        
var fetchuvIndex = function(lat, lon) {   
    var apiUrlIndex = "https://api.openweathermap.org/data/2.5/uvi?appid=7e4c7478cc7ee1e11440bf55a8358ec3&lat=" + lat + "&lon=" + lon;

    fetch(apiUrlIndex)
    .then(function(uviResponse) {
    return uviResponse.json().then(function(uviData) {
        console.log(uviData);
        const uvIndex = uviData.value
        var uvIndexDisplay = document.querySelector("#uvIndex");
        uvIndexDisplay.innerHTML = "UV Index = " + uvIndex;
        })
    }) 
}

var fetchForecast = function(searchTerm, dateOfWeather) {
    var apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + apiKey
    fetch(apiUrlForecast)
    .then(function(forecastResponse) {
        return forecastResponse.json().then(function(forecastData) {
            console.log(forecastData);
            var forecastArr = []
            for (let index = 1; index < 6; index++) {
                const date = addDays(dateOfWeather, index).toLocaleDateString();
                const forecast = forecastData.list.find(forecast => getLocalDate(forecast.dt) === date)
                forecastArr.push(forecast)
                console.log(forecast)
            }
        forecastDisplay(forecastArr)
        })
    })
}    

var forecastDisplay = function(forecastArr) {
    for (let index = 0; index < 1; index++) {
        const forecast = forecastArr[index];
        const dayEl = document.getElementById("day" + index)
        console.log("#day" + index)
        var dayName = new Date(forecast.dt * 1000 ).toLocaleDateString('en-US', { weekday: 'long' })
        dayEl.innerHTML = dayName
        
    }
}
      

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getLocalDate(unixTimeStamp) {
    return new Date(unixTimeStamp*1000).toLocaleDateString();
}

            // const day1 = data.daily.temp;
            // const day2 = data.list[2];
            // const day3 = data.list[3];
            // const day4 = data.list[4];
            // const day5 = data.list[5];

    //         var day1Dis = document.querySelector("#day1");

    //         day1Dis.innerHTML = day1
    //     //add html we want to put data in 
    //     var dashboard = document.createElement("card")
    //     // var searchTermText = searchTerm;
    //     // listItems.textContent = searchTermText;
    //     // var dashboardDisplay = document.querySelector(".day1");
    //     // dashboardDisplay.appendChild(dashboard)
    //     })
    // })
   


searchButton.addEventListener("click", getSearchTerm) 