// display current date at top of page
const now  = moment().format("dddd, MMMM Do, YYYY, h:mm a");
$("#currentDay").text(now)

var searchTerm = document.querySelector('#searchCity').value

var searchFunction = function(city) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=108e85e2f410617f090c951efcf86507"
    // make a request to the url    
    fetch(apiUrl)

    console.log(fetch(apiUrl))
    
    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(response) {
    //     console.log(response.data[0]);

    // var responseContainerEl = document.querySelector('#history-container');

    // responseContainerEl.innerHTML = '';

    // var cityList = document.createElement('li');

    // // Append 'gifImg' to the <div>
    // responseContainerEl.appendChild(cityList);

    // console.log(searchFunction)
    // })
}
      
      
      
      
      
        // request was successful

      
      
      
      
//       if (response.ok) {
//         response.json().then(function(data) {
//           displayRepos(data, city);
//         });
//       } else {
//         alert("Error: " + response.statusText);
//       }
//     })
//     .catch(function(error) {
//       // Notice this `.catch()` getting chained onto the end of the `.then()` method
//       alert("blah blah");
//     });
//   };