const cityInput = document.getElementById("cityInput");
const weatherBtn = document.getElementById("weatherBtn");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

weatherBtn.addEventListener("click", async () => {

    const city = cityInput.value.trim();

    if(city === ""){
        return;
    }

    try{

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        const weatherData = await weatherResponse.json();

        temperature.textContent =
            `Temperature: ${weatherData.current.temperature_2m} °C`;

        humidity.textContent =
            `Humidity: ${weatherData.current.relative_humidity_2m}%`;

        wind.textContent =
            `Wind Speed: ${weatherData.current.wind_speed_10m} km/h`;

        condition.textContent =
            "Condition: Current Weather Available";

    }
    catch(error){

        console.log(error);

    }

});