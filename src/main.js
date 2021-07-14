import {getWheatherByCity} from './apiService.js';
import {createDomElements, mapListToDOMElements} from './DOMActions.js';

class WeatherApp {
    constructor() {
        this.year;
        this.month;
        this.day;
        this.viewElems = {};
        this.Capitals = ['Amsterdam', 'Athens', 'Berlin', 'Brussels', 'Copenhagen', 'Kiev', 'Lisbon', 'London', 'Madrid', 'Moscow', 'Paris', 'Rome', 'Stockholm', 'Warsaw'];
        this.initializeApp();
    }

    initializeApp = () => {
        this.connectDomElements();
        this.setupListeners();
        this.dateFormatting();
    }

    connectDomElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        this.viewElems = mapListToDOMElements(listOfIds);
    }

    setupListeners = () => {
        this.viewElems.searchInput.addEventListener('keydown', this.handleSubmit);
        this.viewElems.searchButton.addEventListener('click', this.handleSubmit);
        this.viewElems.returnToSearchBtn.addEventListener('click', this.returnToSearch);
    }

    dateFormatting = () => {
        const date = new Date()
        this.year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        this.month = this.addZeroToDate(month);
        this.day = this.addZeroToDate(day);
    }

    addZeroToDate = date => {
        if(date < 10) date = `0${date}`;
        return date;
    }

    showForecast = (data) => {

        console.log(data.consolidated_weather);
        let dayForecastDiv;
        let dayForecast;
        let weatherIcon;
        let weatherState;
        let maxTem;
        let minTem;
        let windIcon;
        let windSpeed;

        
        for (let day of data.consolidated_weather) {
            if(parseInt(day.applicable_date.substring(8,10)) !== this.day){
                dayForecastDiv = createDomElements('div', 'day-forecast')
                dayForecast = createDomElements('h1');
                weatherIcon = createDomElements('img', 'icon-forecast');
                weatherState = createDomElements('p', 'weather-state')
                maxTem = createDomElements('p', 'max-tem')
                minTem = createDomElements('p', 'min-tem')
                windIcon = createDomElements('img', 'icon-wind')
                windSpeed = createDomElements('p', 'wind-speed')

                this.viewElems.forecastByCity.appendChild(dayForecastDiv);
                dayForecastDiv.appendChild(dayForecast);
                dayForecastDiv.appendChild(weatherIcon);
                dayForecastDiv.appendChild(weatherState);
                dayForecastDiv.appendChild(maxTem);
                dayForecastDiv.appendChild(minTem);
                dayForecastDiv.appendChild(windSpeed);

                const windSpeedInKm = day.wind_speed * 1.609344;

                if (parseInt(day.applicable_date.substring(8,10)) === this.day+1) dayForecast.innerText = 'Tomorrow';
                else dayForecast.innerText = day.applicable_date;
                weatherIcon.src = `https://www.metaweather.com/static/img/weather/${day.weather_state_abbr}.svg`;
                weatherState.innerText = day.weather_state_name;
                maxTem.innerText = `Max Tem: ${day.max_temp.toFixed(2)} °C`;
                minTem.innerText = `Min Tem: ${day.min_temp.toFixed(2)} °C`;
                windSpeed.innerText = `Wind speed: ${windSpeedInKm.toFixed(2)} km/h`;
            }
        }
    }

    handleSubmit = event => {
        if (event.type === 'click' || event.key === 'Enter') {
                this.fadeInOut();
                let query = this.viewElems.searchInput.value;
                getWheatherByCity(query)
                .then(data => {
                    this.showForecast(data)
                    this.displayWeatherData(data);
                    this.viewElems.searchInput.style.borderColor = 'black'
                    this.viewElems.errorData.style.visibility = 'hidden';
                    this.viewElems.searchInput.value = ''
                }).catch(() => {
                    this.fadeInOut();
                    this.viewElems.searchInput.style.borderColor = 'red';
                    this.viewElems.errorData.style.visibility = 'visible';
                })
        }
    }

    fadeInOut = () => {
        if (this.viewElems.mainContainer.style.opacity === '1' || this.viewElems.mainContainer.style.opacity ==='') {
            this.viewElems.mainContainer.style.opacity = '0';
        } else {
            this.viewElems.mainContainer.style.opacity = '1';
        }
    }

    switchView = () => {
        if (this.viewElems.weatherSearchView.style.display !== 'none') {
            this.viewElems.weatherSearchView.style.display = 'none';
            this.viewElems.weatherForecastView.style.display = 'block';
        } else {
            this.viewElems.weatherSearchView.style.display = 'flex'
            this.viewElems.weatherForecastView.style.display = 'none'
            this.viewElems.forecastByCity.innerText = '';
        }
    }

    returnToSearch = () => {
        this.fadeInOut();
    
        setTimeout(() => {
            this.switchView();
            this.fadeInOut();
        }, 500);
    }

    displayWeatherData = data => {
        this.switchView();
        this.fadeInOut();
        console.log(data);
        const weather = data.consolidated_weather[0];
    
        this.viewElems.weatherCity.innerText = data.title;
        this.viewElems.weatherIcon.src = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
        this.viewElems.weatherIcon.alt = weather.weather_state_name;
    
        const currentTemp = weather.the_temp.toFixed(2);
        const maxTemp = weather.max_temp.toFixed(2);
        const minTemp = weather.min_temp.toFixed(2);
        this.viewElems.weatherCurrentTemp.innerText = `Current Temperature: ${currentTemp} °C`;
        this.viewElems.weatherMaxTemp.innerText = `Max Temperature: ${maxTemp} °C`;
        this.viewElems.weatherMinTemp.innerText = `Min Temperature: ${minTemp} °C`;
    }
}

document.addEventListener('DOMContentLoaded', new WeatherApp);
