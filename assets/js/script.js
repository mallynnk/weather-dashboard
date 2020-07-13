// variables
const now  = moment().format("dddd, MMMM Do, YYYY, h:mm a");
const searchButton = document.querySelector("#searchBtn");
const apiKey = "&appid=108e85e2f410617f090c951efcf86507"
var cities = JSON.parse(localStorage.getItem("cities")) || [];

//display current day and time at top of page
$("#currentDay").text(now)

//load local storage on main page
for (let index = 0; index < cities.length; index++) {
    addCityHistory(cities[index])
}

//get search term from input 
function getSearchTerm () {
    event.preventDefault();
    //clear previous
    clearInterval();    
    var searchEl = document.querySelector("#searchCity")
    searchFunction(searchEl.value)
    searchEl.value = ""
}

//save search term to local storage
var saveCity = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
}

//display search history on page
function addCityHistory(searchTerm) {
    //create button element
    var listItems = document.createElement("button");
    listItems.setAttribute("class", "searchPrevious")
    listItems.addEventListener("click", function(){
        var searchTool = $(this)[0].innerHTML;
        searchFunction(searchTool)
    })
    var searchTermText = searchTerm;
    listItems.textContent = searchTermText;
    var historyList = document.querySelector(".history");
    historyList.appendChild(listItems)
}

//search for city
var searchFunction = function(searchTerm) {

    //if user doesn't enter information, cue alert
    if (!searchTerm) {
        alert("please enter a valid city")
        return
    }
    
    // format the api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&q=" + searchTerm + apiKey

    // get weather dashboard for the current day    
    fetch(apiUrl)
    .then(function(weatherResponse) {

        //ensure the user enters a city
        if (weatherResponse.ok) {
            cities.push(searchTerm)
            saveCity()
            addCityHistory(searchTerm)

            //remove "hide" classes to display forecasts
            var forecastContainer = document.querySelector(".forecast-container")
            var forecastHeader = document.querySelector(".forecast")
            var forecastBox = document.querySelector(".forecast-box")
            forecastContainer.classList.remove("hide")
            forecastBox.classList.remove("hide")
            forecastHeader.classList.remove("hide")
            
            //return forecast data data 
            return weatherResponse.json().then(function(data) {
                console.log(data);

            //store current forecast data in variables
             const cityName = data.name;
             const temperature = data.main.temp
             var dateOfWeather = getLocalDate(data.dt)
             const windSpeed = data.wind.speed
             const humidity = data.main.humidity

             //store variables for latitude and longitude to send to uvIndex function
             var lat = data.coord.lat
             var lon = data.coord.lon
             fetchuvIndex(lat, lon)
             fetchForecast(searchTerm, dateOfWeather)
            
            //define the area of the html we want to put that data in
            var cityNameDisplay = document.querySelector("#cityName");
            var dateOfWeatherDisplay = document.querySelector("#date");
            var temperatureDisplay = document.querySelector("#temperature")
            var humidityDisplay = document.querySelector("#humidity");
            var windSpeedDisplay = document.querySelector("#windSpeed");
            
            //display data on page
            cityNameDisplay.innerHTML = cityName;
            dateOfWeatherDisplay.innerHTML = "("+ dateOfWeather + ")";
            temperatureDisplay.innerHTML = "Temperature: " + temperature + " &#8457";
            humidityDisplay.innerHTML = "Humidity:  " + humidity + " %";
            windSpeedDisplay.innerHTML = "Wind Speed:  " + windSpeed + " mph";
            
            //get icon for current day and display on page
             var iconCode = data.weather[0].icon
             var weatherIconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
             console.log(weatherIconURL) 
             $("#todayIcon").attr("src", weatherIconURL)
            })

         //if user doesn't enter a correct city, return error message   
        } else {
            alert("Error: " + weatherResponse.statusText)
        }      
    })
}     
        


// retrieve uvIndex and display on page       
var fetchuvIndex = function(lat, lon) {   

    //define uvi api
    var apiUrlIndex = "https://api.openweathermap.org/data/2.5/uvi?appid=7e4c7478cc7ee1e11440bf55a8358ec3&lat=" + lat + "&lon=" + lon;

    //fetch uviIndex
    fetch(apiUrlIndex)
    .then(function(uviResponse) {
    return uviResponse.json().then(function(uviData) {
        console.log(uviData);
        const uvIndex = uviData.value
        var uvIndexDisplay = document.querySelector("#uviLabel");
        uvIndexDisplay.innerHTML = "UV Index = ";
        var uviValue = document.querySelector("#uviValue")
        uviValue.innerHTML = uvIndex
        uviValue.classList.remove("green", "yellow", "orange", "red")

        //set a uvi color scale to display on page
            if (uvIndex <= 3) { 
                uviValue.classList.add("green")
            } else if (uvIndex >= 3 && uvIndex <= 6) {
                uviValue.classList.add("yellow")
            } else if (uvIndex >= 6 && uvIndex <= 8) {
                uviValue.classList.add("orange")
            } else {
                uviValue.classList.add("red")
            }
            })
    }) 
}

              
//retrieve information for 5-day forecast
var fetchForecast = function(searchTerm, dateOfWeather) {

    //api for 5-day forecast
    var apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&q=" + searchTerm + apiKey

    //fetch 5-day forecast data
    fetch(apiUrlForecast)
    .then(function(forecastResponse) {
        return forecastResponse.json().then(function(forecastData) {
           //set forecast array and for loop to retrieve data
            var forecastArr = []
            for (let index = 1; index < 6; index++) {
                const date = addDays(dateOfWeather, index).toLocaleDateString();
                const forecast = forecastData.list.find(forecast => getLocalDate(forecast.dt) === date)
                forecastArr.push(forecast)
                console.log(forecast)
            }
        //send data to forecastDisplay function
        forecastDisplay(forecastArr)
        })
    })
}    

//display 5-day forecast on page
var forecastDisplay = function(forecastArr) {
    for (let index = 0; index < 5; index++) {
        //define the area of the html we want to put that data in
        const forecast = forecastArr[index];
        const dayEl = document.getElementById("day" + index)
        const humidityEl = document.getElementById("humidity" + index)
        const temperatureEl = document.getElementById("temperature" + index)
        
        //display the data on the page
        var dayName = new Date(forecast.dt * 1000 ).toLocaleDateString('en-US', { date: 'numeric' })
        var humidity = forecast.main.humidity
        var temperature = forecast.main.temp
        dayEl.innerHTML = dayName
        dayEl.classList.add("card-title")
        humidityEl.innerHTML = "Humidity: " + humidity + " %" 
        temperatureEl.innerHTML = "Temp: " + temperature + " &#8457"
        
        //icon element
        const iconEl = document.getElementById("img" + index)
        //get icon for current day & display on page
        var iconCode = forecast.weather[0].icon
        var weatherIconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        iconEl.setAttribute("src", weatherIconURL)
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

searchButton.addEventListener("click", getSearchTerm) 