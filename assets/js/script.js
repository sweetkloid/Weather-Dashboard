// varriables we pull form html so we can manipulate them with js
var userInput= document.querySelector(".form-control");
var searchBtn= document.querySelector("button");
var loc= document.querySelector(".location");
var iconEl= document.querySelector("#icon");
var tempEl= document.querySelector(".temp");
var windEl= document.querySelector(".wind");
var humidEl= document.querySelector(".humidity");

// search button to collect the users input and grab it from localStorage
function searchHistory(){
  var storage = JSON.parse(localStorage.getItem(`cities`))||[];
  var listGroup=document.querySelector(".list-group");
  for(let i=0; i<storage.length; i++){
    var city=storage[i];
    var button=document.createElement(`button`); //adds a new html element
    button.style.margin= "5px";
    button.textContent= city;
    listGroup.appendChild(button); //puts the new data collected into the newly created button

    listGroup.addEventListener('click', reloadCityData); //with this click we are able to reload localStorage data of previously searched cities

    function reloadCityData(event) {
      const cityName = event.target.textContent;

      // We re-Fetch the data from the API when the previously searched city is reclicked
      fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?appid=3be2b2b6acc21e3760901d15acf91f72&q=${cityName}&cnt=6&units=imperial`)
        .then(response => response.json())
        .then(data => {
          
          localStorage.setItem(cityName, JSON.stringify(data));

          // This leads into our html function below
          updateHTML(data);
        });
    }
  }

  function updateHTML(data) { //this function reloads the data into our five-day container
    const { day }=data.list[0].temp; //going through the loaded array data to select temp
    const location =data.city.name;
    const { icon }= data.list[0].weather[0];
    const { gust }= data.list[0];
    const { humidity }= data.list[0];
    var iconUrl = `https://openweathermap.org/img/wn/${icon}.png`; //grabs icon element

    iconEl.src = iconUrl;
    loc.textContent= `${location}`;
    var today = dayjs();
    $('.current').text(today.format('MM/DD/YYYY'));
    tempEl.innerText ='Temperature: '+ day + '°F'; //once the information is grab we convert it to text to add to the html
    windEl.innerText = 'Wind: ' + gust + 'MPH';
    humidEl.innerText= 'Humidity: ' + humidity + '%';

    for(let i=1; i<data.list.length; i++){ //lopping through the 5 day forecast elements to print to page
      let currentDay= data.list[i];
      const url =`https://openweathermap.org/img/wn/${currentDay.weather[0].icon}.png`;
      document.querySelector(`#icon-${i}`).src= url; //accessing our predefined elements and adding to them with i element into html elements that we have predefined
      document.querySelector(`.date-${i}`).innerHTML = dayjs.unix(currentDay.dt).format('MM/DD/YYYY');
      document.querySelector(`.temp-${i}`).innerText = `Temperature: ` + currentDay.temp.day+`°F`;
      document.querySelector(`.wind-${i}`).innerText = `Wind: ` + currentDay.gust+`MPH`;
      document.querySelector(`.humidity-${i}`).innerText = `Humidity: ` + currentDay.humidity +`%`;
    }
  }
}
const forecastContainer = document.querySelector('.current-box');
const fiveDayContainer = document.querySelector('.five-day-container');

// Hiding these container until a user adds a city by default
forecastContainer.style.display = 'none';
fiveDayContainer.style.display = 'none';
 
searchBtn.addEventListener("click", function(event){ //when user inputs a city 1/2
  event.preventDefault(); //prevents the user from losing their inputed data by a page refresh
  forecastContainer.style.display = 'block';
  fiveDayContainer.style.display = 'flex';
  var storage = JSON.parse(localStorage.getItem(`cities`))||[];
  storage.push(userInput.value);
  localStorage.setItem(`cities`, JSON.stringify(storage));
  searchHistory();
fetch( `https://api.openweathermap.org/data/2.5/forecast/daily?appid=3be2b2b6acc21e3760901d15acf91f72&q=${userInput.value}&cnt=6&units=imperial`) //the api is accessed so we can grap data from it 2/2
  .then(response => response.json()) //we then convert the data collected to jason
  .then(data =>{
  console.log(data);
  const { day }=data.list[0].temp; //grabbing the information we want relative to the large array/object the api gives us
  const location =data.city.name;
  console.log(location);
  const { icon }= data.list[0].weather[0];
  const { gust }= data.list[0];
  const { humidity }= data.list[0];
  var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; //grabbing the icons form the api

  iconEl.src = iconUrl; //adding icon to html
  loc.textContent= `${location}`;
  var today = dayjs(); 
  $('.current').text(today.format('MM/DD/YYYY')); //adding current date
  tempEl.innerText ='Temperature: '+ day + '°F'; //adding collected data into our predefined html
  windEl.innerText = 'Wind: ' + gust + 'MPH';
  humidEl.innerText= 'Humidity: ' + humidity + '%';

  for(let i=1; i<data.list.length; i++){ //lopping through the large amount of data the api give us limited asspects
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

clearBtn.addEventListener('click', function() { //creating a clear button to delete search cities
  localStorage.clear(); //clearing localStorage
  location.reload(); // Reload the page to update the UI
});

