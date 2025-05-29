// API-functies voor communicatie met JSON-bestanden en later database
// ...later uitwerken...

// OpenRouteService, WeatherAPI, TomTom integratie en ritprijsberekening

const OPENROUTES_API_KEY = window.OPENROUTES_API_KEY || "5b3ce3597851110001cf6248b59dc263cab24bdabda48748cd9122b3";
const WEATHER_API_KEY = window.WEATHER_API_KEY || "9d1afafb80f94518850212856252004";
const TOMTOM_API_KEY = "fLy6nvAxRi3ACx2G69Q9fHabDwHz80fe";

// Haal route en reistijd op via OpenRouteService
async function getRouteInfo(start, end) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTES_API_KEY}`;
  const body = {
    coordinates: [
      [start.lng, start.lat],
      [end.lng, end.lat]
    ]
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (data && data.features && data.features[0]) {
    const summary = data.features[0].properties.summary;
    return {
      afstand: summary.distance / 1000, // km
      duur: summary.duration / 60 // min
    };
  }
  throw new Error("Route ophalen mislukt");
}

// Haal weer op via WeatherAPI
async function getWeather(lat, lng) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lng}&lang=nl`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data.current.condition.text; // bv. "Light rain"
}

// Haal verkeersdrukte op via TomTom (returns congestion level: 1=low, 2=moderate, 3=heavy, 4=severe)
async function getTraffic(lat, lng) {
  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&key=${TOMTOM_API_KEY}`;
  const resp = await fetch(url);
  const data = await resp.json();
  if (data && data.flowSegmentData && data.flowSegmentData.currentSpeed && data.flowSegmentData.freeFlowSpeed) {
    const ratio = data.flowSegmentData.currentSpeed / data.flowSegmentData.freeFlowSpeed;
    if (ratio > 0.8) return 1; // weinig verkeer
    if (ratio > 0.6) return 2; // matig verkeer
    if (ratio > 0.4) return 3; // druk
    return 4; // zeer druk
  }
  return 1; // fallback: weinig verkeer
}

// Ritprijsberekening met toeslagen
function berekenRitprijs(afstand, duur, weer, trafficLevel) {
  let basis = 0;
  if (afstand <= 3) basis = 10;
  else if (afstand <= 4) basis = 11.5;
  else if (afstand <= 5) basis = 13;
  else if (afstand <= 6) basis = 14.5;
  else if (afstand <= 7) basis = 16;
  else if (afstand <= 8) basis = 17.5;
  else if (afstand <= 9) basis = 19;
  else basis = 2.5 + (afstand * 1.5) + (duur * 0.5);

  let weerToeslag = 1;
  if (weer.toLowerCase().includes("patchy rain")) weerToeslag = 1.05;
  else if (weer.toLowerCase().includes("light rain")) weerToeslag = 1.10;
  else if (weer.toLowerCase().includes("moderate rain")) weerToeslag = 1.15;
  else if (weer.toLowerCase().includes("heavy rain")) weerToeslag = 1.20;
  else if (weer.toLowerCase().includes("torrential rain")) weerToeslag = 1.25;
  else if (weer.toLowerCase().includes("thunderstorm")) weerToeslag = 1.25;
  else if (weer.toLowerCase().includes("snow")) weerToeslag = 1.25;

  let verkeerToeslag = 1;
  if (trafficLevel === 2) verkeerToeslag = 1.10;
  else if (trafficLevel === 3) verkeerToeslag = 1.20;
  else if (trafficLevel === 4) verkeerToeslag = 1.30;

  const prijs = basis * weerToeslag * verkeerToeslag;
  return Math.round(prijs * 100) / 100;
}

// Exporteer functies voor gebruik in andere scripts
window.api = {
  getRouteInfo,
  getWeather,
  getTraffic,
  berekenRitprijs
};
