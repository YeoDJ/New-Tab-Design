async function setRenderBackground() {
    const result = await axios.get("https://picsum.photos/1920/1080", {
        responseType: "blob"
    });

    const data = URL.createObjectURL(result.data);
    document.querySelector(".backgroundImage").style.backgroundImage = `url(${data})`;

};

(function setTime() {
    const timer = document.querySelector(".timer");
    setInterval(() => {     //setTimeout과 차이점: 계속 반복함
        //padStart(길이, 'str'): 해당 길이에 도달할 때까지 str을 앞에 추가
        const hours = String(new Date().getHours()).padStart(2, '0');
        const minutes = String(new Date().getMinutes()).padStart(2, '0');
        const seconds = String(new Date().getSeconds()).padStart(2, '0');

        timer.textContent = `${hours}:${minutes}:${seconds}`;

        // 시간에 따라서 인사말 바꾸기
        const ampm = document.querySelector(".greetings");
        if (00 <= Number(hours) && Number(hours) < 06)
            ampm.innerHTML = `<div class="timer-content">Good midnight, Yeo!</div>`
        else if (06 <= Number(hours) && Number(hours) < 12)
            ampm.innerHTML = `<div class="timer-content">Good morning, Yeo!</div>`
        else if (12 <= Number(hours) && Number(hours) < 18)
            ampm.innerHTML = `<div class="timer-content">Good afternoon, Yeo!</div>`
        else
            ampm.innerHTML = `<div class="timer-content">Good evening, Yeo!</div>`
    }, 1000);

})();

function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
}

(function setMemo() {
    const memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", e => {
        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value);
            getMemo();
            memoInput.value = "";
        }
    })
})();

(function deleteMemo() {
    document.addEventListener("click", e => {
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo");
            e.target.textContent = "";
        }
    })
})();

function getPosition(options) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    })
};

async function getWeather(lat, lon) {
    const data = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=16bdaa0658e0a9ddf8e901944bdc64bf`)
    return data;
};

// 현재 날씨 데이터 받아오기
async function getCurrentWeather(lat, lon) {
    const data = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=16bdaa0658e0a9ddf8e901944bdc64bf`)
    return data;
}

(async function renderWeather() {
    let latitude = "";
    let longitude = "";

    try {
        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    }
    catch { }

    const result = await getWeather(latitude, longitude);
    const weatherData = result.data;
    console.log(weatherData);

    const weatherList = weatherData.list.reduce((acc, cur) => {
        if ((cur.dt_txt.indexOf("18:00:00")) > 0) {
            acc.push(cur);
        }
        return acc;
    }, []);

    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = weatherList.map(e => {
        return weatherWrapperComponent(e);
    });

})();

// 현재 날씨를 아이콘으로 표시하기
(async function renderCurrentWeather() {
    let latitude = "";
    let longitude = "";

    try {
        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    }
    catch { }

    const result = await getCurrentWeather(latitude, longitude);
    const weatherData = result.data;

    const nowWeather = document.querySelector(".modal-button");
    nowWeather.innerHTML = `<img src=${matchIcon(weatherData.weather[0].main)} alt="">`;
})();

function weatherWrapperComponent(e) {
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1);

    return `
    <div class="card" style="width: 18rem;">
        <div class="card-header text-black text-center">
            ${e.dt_txt.split(" ")[0]}
        </div>
        <div class="card-body">
            <h5>${e.weather[0].main}</h5>
            <img src="${matchIcon(e.weather[0].main)}" class="card-img-top w-50 h-50" alt="...">
            <p class="card-text mt-2">${changeToCelsius(e.main.temp)} ℃</p>
        </div>
    </div>
    `
}

function matchIcon(weatherData) {
    if (weatherData === "Clear") return "./images/039-sun.png";
    if (weatherData === "Clouds") return "./images/001-cloud.png";
    if (weatherData === "Rain") return "./images/003-rainy.png";
    if (weatherData === "Snow") return "./images/012-snowy-1.png";
    if (weatherData === "Thunderstorm") return "./images/013-storm-2.png";
    if (weatherData === "Drizzle") return "./images/031-snowflake.png";
    if (weatherData === "Atomsphere") return "./images/033-hurricane.png";
}

setRenderBackground();
setInterval(() => {
    setRenderBackground();
}, 5000);