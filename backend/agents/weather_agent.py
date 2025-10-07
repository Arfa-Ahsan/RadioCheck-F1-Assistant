from langchain.tools import tool
import requests
import json
import os

def load_circuits():
    with open("f1-locations.json", "r") as f:
        return json.load(f)

def get_circuit_by_name(name):
    circuits = load_circuits()
    for circuit in circuits:
        if name.lower() in circuit["name"].lower():
            return circuit
    return None

open_weather_key = os.getenv('OPEN_WEATHER_API_KEY')

@tool
def get_weather_by_circuit_name(circuit_name: str) -> str:
    """
    Get current weather for a Formula 1 circuit, including chance of rain, humidity, and wind.
    """
    circuit = get_circuit_by_name(circuit_name)
    if not circuit:
        return f"Circuit named '{circuit_name}' not found."
    lat = circuit["lat"]
    lon = circuit["lon"]
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={open_weather_key}&units=metric"
    response = requests.get(url)
    if response.status_code != 200:
        return "Error fetching weather data."
    data = response.json()
    weather = data.get("weather", [{}])[0]
    main = data.get("main", {})
    wind = data.get("wind", {})
    rain = data.get("rain", {})
    description = weather.get("description", "N/A").capitalize()
    temperature = main.get("temp", "N/A")
    humidity = main.get("humidity", "N/A")
    wind_speed = wind.get("speed", "N/A")
    rain_volume = rain.get("1h", rain.get("3h", "No rain data available"))
        # Compose a natural, Gemini-style summary
    rain_str = f"Rain volume: {rain_volume} mm." if isinstance(rain_volume, (int, float)) or (isinstance(rain_volume, str) and rain_volume.replace('.', '', 1).isdigit()) else "No rain data available."
    return (
            f"Currently at {circuit['name']} in {circuit['location']}, the weather is {description.lower()} with a temperature of {temperature}°C. "
            f"Humidity is {humidity}%, and wind is blowing at {wind_speed} m/s. "
            f"{rain_str}"
        )
