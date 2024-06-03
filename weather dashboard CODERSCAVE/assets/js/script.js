$(document).ready(function () {
    const apiKey = '64711a3a34371e60842ce5f4745dc7bf';

    function getWeather(city) {
        const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            displayCurrentWeather(response);
            getForecast(response.coord.lat, response.coord.lon);
        });
    }

    function getForecast(lat, lon) {
        const queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            displayForecast(response);
        });
    }

    function displayCurrentWeather(data) {
        $('.current-date').text(moment().format('LL'));
        $('.city').text(data.name);
        $('.weather-icon').html(`<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`);
        $('.temperature').text(`Temperature: ${data.main.temp} °C`);
        $('.humidity').text(`Humidity: ${data.main.humidity}%`);
        $('.wind').text(`Wind Speed: ${data.wind.speed} m/s`);
        $('.uv').text(''); // Placeholder for UV index
    }

    function displayForecast(data) {
        for (let i = 1; i <= 5; i++) {
            const dailyData = data.daily[i];
            $(`.day-${i}-date`).text(moment().add(i, 'days').format('LL'));
            $(`.day-${i}-icon`).html(`<img src="https://openweathermap.org/img/w/${dailyData.weather[0].icon}.png" alt="${dailyData.weather[0].description}">`);
            $(`.day-${i}-temperature`).text(`Temp: ${dailyData.temp.day} °C`);
            $(`.day-${i}-humidity`).text(`Humidity: ${dailyData.humidity}%`);
        }
    }

    $('.search-button').on('click', function (event) {
        event.preventDefault();
        const city = $('.input').val().trim();
        if (city) {
            getWeather(city);
            saveCity(city);
        }
    });

    function saveCity(city) {
        let cities = JSON.parse(localStorage.getItem('cities')) || [];
        if (!cities.includes(city)) {
            cities.push(city);
            localStorage.setItem('cities', JSON.stringify(cities));
            renderCitiesList();
        }
    }

    function renderCitiesList() {
        const cities = JSON.parse(localStorage.getItem('cities')) || [];
        $('.cities-list').empty();
        cities.forEach(city => {
            const cityButton = $('<button>').addClass('list-group-item list-group-item-action').text(city);
            $('.cities-list').append(cityButton);
            cityButton.on('click', function () {
                getWeather(city);
            });
        });
    }

    renderCitiesList();
});
