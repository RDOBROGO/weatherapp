import {getWheatherByCity} from './apiService.js';

const viewElems = {};

 const getDOMElem = id => {
    return document.getElementById(id);
}

const connectHTMLElems = () => {
    viewElems.mainContainer = getDOMElem('mainContainer');
    viewElems.weatherSearchView = getDOMElem('weatherSearchView');
    viewElems.weatherForecastView = getDOMElem('weatherForecastView');

    viewElems.searchInput = getDOMElem('searchInput');
    viewElems.searchButton = getDOMElem('searchButton');

    viewElems.weatherCityContainer = getDOMElem('weatherCityContainer');

    viewElems.weatherCity = getDOMElem('weatherCity');
    viewElems.weatherIcon = getDOMElem('weatherIcon');

    viewElems.weatherCurrentTemp = getDOMElem('weatherCurrentTemp');
    viewElems.weatherMaxTemp = getDOMElem('weatherMaxTemp');
    viewElems.weatherMinTemp = getDOMElem('weatherMinTemp');

    viewElems.returnToSearchBtn = getDOMElem('returnToSearchBtn');
}

const setupListeners = () => {
    viewElems.searchInput.addEventListener('keydown', onEnterSubmit);
    viewElems.searchButton.addEventListener('click', onClickSubmit);
    viewElems.returnToSearchBtn.addEventListener('click', returnToSearch);
}

const initializeApp = () => {
connectHTMLElems();
setupListeners();
}

const onClickSubmit = () => {
    fadeInOut();
    let query = viewElems.searchInput.value;
        getWheatherByCity(query)
        .then(data => {
            displayWeatherData(data);
        });
        
};

const onEnterSubmit = event => {
    if(event.key === 'Enter') {
        fadeInOut();
        let query = viewElems.searchInput.value;
        getWheatherByCity(query)
        .then(data => {
            displayWeatherData(data);
        });
    }
};

const displayWeatherData = data => {
    switchView();
    fadeInOut();
    console.log(data);
    const weather = data.consolidated_weather[0];

    viewElems.weatherCity.innerText = data.title;
    viewElems.weatherIcon.src = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
    viewElems.weatherIcon.alt = weather.weather_state_name;

    const currentTemp = weather.the_temp.toFixed(2);
    const maxTemp = weather.max_temp.toFixed(2);
    const minTemp = weather.min_temp.toFixed(2);
    viewElems.weatherCurrentTemp.innerText = `Current Temperature: ${currentTemp}`;
    viewElems.weatherMaxTemp.innerText = `Max Temperature: ${maxTemp}`;
    viewElems.weatherMinTemp.innerText = `Min Temperature: ${minTemp}`;

}

const fadeInOut = () => {
    if (viewElems.mainContainer.style.opacity === '1' || viewElems.mainContainer.style.opacity ==='') {
        viewElems.mainContainer.style.opacity = '0';
    } else {
        viewElems.mainContainer.style.opacity = '1';
    }
}

const switchView = () => {
    if (viewElems.weatherSearchView.style.display !== 'none') {
        viewElems.weatherSearchView.style.display = 'none';
        viewElems.weatherForecastView.style.display = 'block';
    } else {
        viewElems.weatherSearchView.style.display = 'flex'
        viewElems.weatherForecastView.style.display = 'none'
    }
}

const returnToSearch = () => {
    fadeInOut();

    setTimeout(() => {
        switchView();
        fadeInOut();
    }, 500);
}


document.addEventListener('DOMContentLoaded', initializeApp);
