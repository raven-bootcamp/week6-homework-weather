# Week6 Homework: Weather Dashboard
My solution, hosted using Github Pages: https://raven-bootcamp.github.io/week6-homework-weather/

The repository with my code: https://github.com/raven-bootcamp/week6-homework-weather

## The Task
We are to create a simple weather dashboard that allows you to type in the name of a city, and see today's weather conditions for that city.  Additionally, a forecast for the next 5 days of weather will also be displayed for that city.  The dashboard is to remember your previous searches so that you can easily search for them again.

To accomplish this, we are to use the OpenWeather One Call API to retrieve the weather data for the specified city.  

## My Approach
I had to use two different endpoints to retrieve the relevant data.  Also, I nominated a limit of 10 cities to remember in your search history.  Any fewer than that seemed like such a small list, and any more than 10 seemed too large.  I also included a "Clear" button to remove your search history in a single click. 

One of the shortcomings of my application which I didn't implement is a way to specify which country the city is in that you're searching for.  If there is an identical city in two different countries, the application will simply return the first result it finds.  To minimize this confusion slightly, I included the country at the end of the city's name so the user can tell.

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## Mockup
![image](/images/mockup.png)

## Screenshot of Solution
![image](/images/solution.png)
