var weatherUrl =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;
var weatherlatUrl=`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={apiKey}`;
var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

var cityName='New York';
var limit='1'
var apiKey='';

fetch(weatherUrl)
.then(function(response){
 return response.json();
 
})
console.log(weatherUrl);