
var userInput= document.querySelector(".form-control");
var searchBtn= document.querySelector("button");
var loc= document.querySelector(".location");
var iconEl= document.querySelector("#icon");
var tempEl= document.querySelector(".temp");
var windEl= document.querySelector(".wind");
var humidEl= document.querySelector(".humidity");

function searchHistory(){
  var storage = JSON.parse(localStorage.getItem(`cities`))||[];
  var listGroup=document.querySelector(".list-group");
  for(let i=0; i<storage.length; i++){
    var city=storage[i];
    var button=document.createElement(`button`);
    button.style.margin= "5px";
    button.textContent= city;
    listGroup.appendChild(button);

    listGroup.addEventListener('click', reloadCityData);

    function reloadCityData(event) {
      const cityName = event.target.textContent;

      // Step 3: Fetch the data from the API
      fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?appid=3be2b2b6acc21e3760901d15acf91f72&q=${cityName}&cnt=6&units=imperial`)
        .then(response => response.json())
        .then(data => {
          // Step 4: Update local storage with the new data
          localStorage.setItem(cityName, JSON.stringify(data));

          // Step 5: Update the HTML with the new data
          updateHTML(data);
        });
    }
  }

  function updateHTML(data) {
    const { day }=data.list[0].temp;
    const location =data.city.name;
    const { icon }= data.list[0].weather[0];
    const { gust }= data.list[0];
    const { humidity }= data.list[0];
    var iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    iconEl.src = iconUrl;
    loc.textContent= `${location}`;
    var today = dayjs();
    $('.current').text(today.format('MM/DD/YYYY'));
    tempEl.innerText ='Temperature: '+ day + '°F';
    windEl.innerText = 'Wind: ' + gust + 'MPH';
    humidEl.innerText= 'Humidity: ' + humidity + '%';

    for(let i=1; i<data.list.length; i++){
      let currentDay= data.list[i];
      const url =`https://openweathermap.org/img/wn/${currentDay.weather[0].icon}.png`;
      document.querySelector(`#icon-${i}`).src= url;
      document.querySelector(`.date-${i}`).innerHTML = dayjs.unix(currentDay.dt).format('MM/DD/YYYY');
      document.querySelector(`.temp-${i}`).innerText = `Temperature: ` + currentDay.temp.day+`°F`;
      document.querySelector(`.wind-${i}`).innerText = `Wind: ` + currentDay.gust+`MPH`;
      document.querySelector(`.humidity-${i}`).innerText = `Humidity: ` + currentDay.humidity +`%`;
    }
  }
}
const forecastContainer = document.querySelector('.current-box');
const fiveDayContainer = document.querySelector('.five-day-container');

// Hide them by default
forecastContainer.style.display = 'none';
fiveDayContainer.style.display = 'none';
 
searchBtn.addEventListener("click", function(event){
  event.preventDefault();
  forecastContainer.style.display = 'block';
  fiveDayContainer.style.display = 'flex';
  var storage = JSON.parse(localStorage.getItem(`cities`))||[];
  storage.push(userInput.value);
  localStorage.setItem(`cities`, JSON.stringify(storage));
  searchHistory();
fetch( `https://api.openweathermap.org/data/2.5/forecast/daily?appid=3be2b2b6acc21e3760901d15acf91f72&q=${userInput.value}&cnt=6&units=imperial`)
  .then(response => response.json())
  .then(data =>{
  console.log(data);
  const { day }=data.list[0].temp;
  const location =data.city.name;
  console.log(location);
  const { icon }= data.list[0].weather[0];
  const { gust }= data.list[0];
  const { humidity }= data.list[0];
  var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  iconEl.src = iconUrl;
  loc.textContent= `${location}`;
  var today = dayjs();
  $('.current').text(today.format('MM/DD/YYYY'));
  tempEl.innerText ='Temperature: '+ day + '°F';
  windEl.innerText = 'Wind: ' + gust + 'MPH';
  humidEl.innerText= 'Humidity: ' + humidity + '%';

  for(let i=1; i<data.list.length; i++){
    let currentDay= data.list[i];
    const url =`https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png`;
    console.log(day);
    document.querySelector(`#icon-${i}`).src= url;
    document.querySelector(`.date-${i}`).innerHTML = dayjs.unix(currentDay.dt).format('MM/DD/YYYY');
    document.querySelector(`.temp-${i}`).innerText = `Temperature: ` + currentDay.temp.day+`°F`;
    document.querySelector(`.wind-${i}`).innerText = `Wind: ` + currentDay.gust+`MPH`;
    document.querySelector(`.humidity-${i}`).innerText = `Humidity: ` + currentDay.humidity +`%`;
  }


  })
  .catch(error => console.error(error))
})
const clearBtn = document.querySelector('.clear-history');

clearBtn.addEventListener('click', function() {
  localStorage.clear();
  location.reload(); // Reload the page to update the UI
});

