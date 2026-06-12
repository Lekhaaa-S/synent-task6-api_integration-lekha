const cityInput = document.getElementById("cityInput");
const weatherBtn = document.getElementById("weatherBtn");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const cityDropdown = document.getElementById("cityDropdown");
const quoteBtn = document.getElementById("quoteBtn");
const quoteText = document.getElementById("quoteText");
const weatherStatus = document.getElementById("weatherStatus");
const quoteStatus = document.getElementById("quoteStatus");

function setWeatherLoading(isLoading) {
    weatherBtn.disabled = isLoading;
    weatherBtn.textContent = isLoading ? "Loading Weather..." : "Get Weather";
    weatherStatus.textContent = isLoading ? "Fetching weather data..." : "";
    weatherStatus.classList.remove("error");
}

function setQuoteLoading(isLoading) {
    quoteBtn.disabled = isLoading;
    quoteBtn.textContent = isLoading ? "Loading Quote..." : "Get New Quote";
    quoteStatus.textContent = isLoading ? "Fetching a new quote..." : "";
    quoteStatus.classList.remove("error");
}

function showWeatherError(message) {
    weatherStatus.textContent = message;
    weatherStatus.classList.add("error");
}

function showQuoteError(message) {
    quoteStatus.textContent = message;
    quoteStatus.classList.add("error");
}

function getWeatherCondition(weatherCode) {
    if (weatherCode === 0) {
        return "Clear Sky";
    }

    if (weatherCode <= 3) {
        return "Partly Cloudy";
    }

    if (weatherCode <= 48) {
        return "Foggy";
    }

    if (weatherCode <= 67) {
        return "Rainy";
    }

    return "Cloudy";
}
cityInput.addEventListener("input", () => {
    if(cityInput.value.trim() !== ""){
        cityDropdown.value = "";
    }
});

cityDropdown.addEventListener("change", () => {
    if(cityDropdown.value !== ""){
        cityInput.value = "";
    }
});
weatherBtn.addEventListener("click", async () => {

    setWeatherLoading(true);

    const typedCity = cityInput.value.trim();
    const selectedCity = cityDropdown.value;

    if (typedCity !== "" && selectedCity !== "") {
        setWeatherLoading(false);
        showWeatherError(
            "Please either type a city or select one from the dropdown."
        );
        return;
    }

    let city = typedCity || selectedCity;

    if (city === "") {
        setWeatherLoading(false);
        showWeatherError(
            "Please enter or select a city."
        );
        return;
    }

    try {

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        const geoData = await geoResponse.json();

        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {
            throw new Error(
                "Unable to fetch weather data. Please enter a valid city name."
            );
        }

        const cityResult = geoData.results[0];

        /*
            Extra validation:
            Reject weak matches for random words.
        */

        const searchedCity = city.toLowerCase();
        const returnedCity = cityResult.name.toLowerCase();

        if (
            !returnedCity.includes(searchedCity) &&
            !searchedCity.includes(returnedCity)
        ) {
            throw new Error(
                "Unable to fetch weather data. Please enter a valid city name."
            );
        }

        const latitude = cityResult.latitude;
        const longitude = cityResult.longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        temperature.textContent =
            `Temperature: ${weatherData.current.temperature_2m} °C`;

        humidity.textContent =
            `Humidity: ${weatherData.current.relative_humidity_2m}%`;

        wind.textContent =
            `Wind Speed: ${weatherData.current.wind_speed_10m} km/h`;

        condition.textContent =
            `Condition: ${getWeatherCondition(
                weatherData.current.weather_code
            )}`;

    }
    catch (error) {

        console.log(error);

        temperature.textContent = "Temperature: --";
        humidity.textContent = "Humidity: --";
        wind.textContent = "Wind Speed: --";
        condition.textContent = "Condition: --";

        showWeatherError(
            error.message ||
            "Unable to fetch weather data. Please try again."
        );
    }
    finally {
        setWeatherLoading(false);
    }

});
quoteBtn.addEventListener("click", async () => {
    setQuoteLoading(true);

    try{
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        quoteText.textContent = `"${data.quote}" - ${data.author}`;

    }
    catch(error){
        console.log(error);
        showQuoteError("Unable to load quote. Please try again.");

    }
    finally {
        setQuoteLoading(false);
    }

});