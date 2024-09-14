// script.js

// OpenWeatherMap API
const openWeatherMapApiKey = 'c51b1ac2713ff47a901f8201926963a3'; // 正しいAPIキーを入力
const openWeatherMapLat = '35.3175'; // 材木座海岸の緯度
const openWeatherMapLon = '139.5535'; // 材木座海岸の経度
const openWeatherMapApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${openWeatherMapLat}&lon=${openWeatherMapLon}&appid=${openWeatherMapApiKey}&units=metric`;

// Stormglass API
const stormglassApiKey = '05154828-7285-11ef-a732-0242ac130004-051548dc-7285-11ef-a732-0242ac130004'; // 取得したAPIキーに置き換えてください
const stormglassLat = '35.3175'; // 材木座海岸の緯度
const stormglassLon = '139.5535'; // 材木座海岸の経度
const stormglassApiUrl = `https://api.stormglass.io/v2/weather/point?lat=${stormglassLat}&lng=${stormglassLon}&params=waveHeight,windSpeed,airTemperature&source=sg`;

// 情報表示用の <div> を取得
const conditionInfoDiv = document.getElementById('condition-info');

// OpenWeatherMapのフェッチ
const fetchOpenWeatherMap = fetch(openWeatherMapApiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('OpenWeatherMap: ネットワークの問題');
    }
    return response.json();
  });

// Stormglassのフェッチ
const fetchStormglass = fetch(stormglassApiUrl, {
  headers: {
    'Authorization': stormglassApiKey
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Stormglass: ネットワークの問題');
    }
    return response.json();
  });

// 両方のフェッチが完了したらデータを表示
Promise.all([fetchOpenWeatherMap, fetchStormglass])
  .then(([weatherData, stormData]) => {
    console.log('OpenWeatherMapのデータ:', weatherData);
    console.log('Stormglassのデータ:', stormData);

    const weather = weatherData.weather[0].description; // 天気
    const humidity = weatherData.main.humidity; // 湿度

    const latestData = stormData.hours[0];
    const waveHeight = latestData.waveHeight.sg; // 波の高さ
    const windSpeed = latestData.windSpeed.sg; // 風速
    const airTemperature = latestData.airTemperature.sg; // 気温

    // HTMLにデータを表示
    conditionInfoDiv.innerHTML = `
      <p><strong>天気:</strong> ${weather}</p>
      <p><strong>湿度:</strong> ${humidity}%</p>
      <p><strong>波の高さ:</strong> ${waveHeight} m</p>
      <p><strong>風速:</strong> ${windSpeed} m/s</p>
      <p><strong>気温:</strong> ${airTemperature}°C</p>
    `;
  })
  .catch(error => {
    console.error('エラー:', error);
    conditionInfoDiv.innerHTML = `<p>データの取得に失敗しました。しばらくしてから再度お試しください。</p>`;
  });