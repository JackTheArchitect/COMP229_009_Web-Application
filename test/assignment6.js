// Jaeuk Kim 301145308

// Variables
var cityNameInput = document.getElementById("cityNameInput");
var curLocWeatherBtn = document.getElementById("curLocWeather");
var myLocationBtn = document.getElementById("getMyLocation");
var latitude;
var longitude;
var qNum // whether 1 or 2 or 3 for getWeather

var openweatherUrl = "https://api.openweathermap.org/data/2.5/weather"

var openweatherAPIID = "APPID=05133d1f5bf76305f6fe343eea364bd6";
var googleMapsUrl;
var cityName;



var httpRequest = false;



//Add eventListeners
cityNameInput.addEventListener("change", sendRequestWithCityName, false);
curLocWeatherBtn.addEventListener("click", getMyLocation, false);
myLocationBtn.addEventListener("click", getMyLocationOnGoogleMaps, false);



// jsonp?

// function sendRequestWithCityName() {
//     cityName = cityNameInput.value          
//     var script = document.createElement("script");

//     script.id = "jsonp";
//     script.src = openweatherUrl+"?"+ "q="+ cityName + "&" + openweatherAPIID;
//     document.body.appendChild(script);
    
//     //window.open("https://"+openweatherUrl+"?"+ "q="+ cityName + "&" + openweatherAPIID);
 
// }


function sendRequestWithCityName() {
    cityName = cityNameInput.value
    

    if(!httpRequest)
    {
       httpRequest = getRequestObject();
    }
    httpRequest.abort();
    httpRequest.open("get", openweatherUrl+"?"+ "q="+ cityName + "&" + openweatherAPIID, true);
    httpRequest.send();

    qNum = 1;
    httpRequest.onreadystatechange = getWeahter; 
}


function sendRequestWithCurrentLocation() {
    //getMyLocation(); // assign current location into the empty latitude/longitude variables
    
    if(!httpRequest)
    {
       httpRequest = getRequestObject();
    }
    httpRequest.abort();
    httpRequest.open("get", openweatherUrl+"?"+ "lat="+ latitude + "&" + "lon=" + longitude + "&" + openweatherAPIID, true);
    httpRequest.send();

    qNum = 2;
    httpRequest.onreadystatechange = getWeahter; 
}

function getWeahter() {
    if(httpRequest.readyState  === 4 && httpRequest.status === 200) {                

        // weather data from openweathermap
        var weatherInfo = JSON.parse(httpRequest.responseText);
        var weather = weatherInfo.weather[0].main;
        var temp = convertKelToCel(weatherInfo.main.temp);
        var feelsLike = convertKelToCel(weatherInfo.main.feels_like);
        var tempMin = convertKelToCel(weatherInfo.main.temp_min);
        var tempMax = convertKelToCel(weatherInfo.main.temp_max);
        var humidity = weatherInfo.main.humidity;        

        // function to convert temp in Kelvin to one in Celcius
        function convertKelToCel(tempK) {
            return Math.round(tempK - 273.15);
        }

        // style for the dispaly                
        document.getElementsByTagName("table")[qNum - 1].style.textAlign = "left";
        document.getElementsByTagName("caption")[qNum - 1].style.fontWeight = "bold" 
        document.getElementsByTagName("caption")[qNum - 1].style.fontSize = "26px" 

        // Assign the data into the html
        if(qNum == 1) {
            document.getElementsByTagName("caption")[qNum - 1].innerHTML = cityName.toUpperCase();
        } else if (qNum == 2) {
            document.getElementsByTagName("caption")[qNum - 1].innerHTML = "Current Location";
        }        
        
        document.getElementsByClassName("q"+qNum)[0].innerHTML = "Weather: ";
        document.getElementsByClassName("q"+qNum)[1].innerHTML = weather;
        document.getElementsByClassName("q"+qNum)[2].innerHTML = "Temp: ";
        document.getElementsByClassName("q"+qNum)[3].innerHTML = temp + "°C";
        document.getElementsByClassName("q"+qNum)[4].innerHTML = "Feels like: ";
        document.getElementsByClassName("q"+qNum)[5].innerHTML = feelsLike + "°C";
        document.getElementsByClassName("q"+qNum)[6].innerHTML = "Minimum Temp : ";
        document.getElementsByClassName("q"+qNum)[7].innerHTML = tempMin + "°C";
        document.getElementsByClassName("q"+qNum)[8].innerHTML = "Maximun Temp: ";
        document.getElementsByClassName("q"+qNum)[9].innerHTML = tempMax + "°C";
        document.getElementsByClassName("q"+qNum)[10].innerHTML = "Humidity: ";
        document.getElementsByClassName("q"+qNum)[11].innerHTML = humidity + "%";        
        
    }
}



function getMyLocation() {       
        
    navigator.geolocation.getCurrentPosition(function (pos) {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;

        sendRequestWithCurrentLocation();
    });
}



function getMyLocationOnGoogleMaps() {       
        
    navigator.geolocation.getCurrentPosition(function (pos) {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;

        CurrLocMap(latitude, longitude);
    });
}


function CurrLocMap(cLat,cLng) {
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(cLat, cLng),
        mapTypeId: 'roadmap'
    };
    
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(cLat, cLng),
        map: map,
        title: "My Current Location",
     });    
    
}



function initMap() {
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(45.4215, -75.6972), // default Otawa
        mapTypeId: 'roadmap'
    };
var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}





function getRequestObject() {
    try {
        httpRequest = new XMLHttpRequest();
    } catch (error) {
        var pError = document.querySelector("p.error");
        pError.innerHTML = "Forecast not supported by your browser";
        pError.style.display = "block";
    }
    return httpRequest;
}








