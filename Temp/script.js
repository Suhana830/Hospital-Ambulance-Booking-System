mapboxgl.accessToken = 'pk.eyJ1Ijoic3VodTEyIiwiYSI6ImNtNDhmaTJ6MTBkdHQya3M5eGRoejlldzYifQ.RfkfwzDkUXgB0MPqwI-nYg'
// Initial driver location and destinations
let driverLng = 77.5946; // Initial longitude of the driver
let driverLat = 12.9716; // Initial latitude of the driver
const destination1 = [77.6101, 12.9259]; // Destination 1 coordinates
const destination2 = [77.6355, 12.9154]; // Destination 2 coordinates

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [driverLng, driverLat],
    zoom: 14,
});

// Add markers for the destinations
new mapboxgl.Marker({ color: 'red' }).setLngLat(destination1).addTo(map);
new mapboxgl.Marker({ color: 'blue' }).setLngLat(destination2).addTo(map);

// Add a driver marker
let driverMarker = new mapboxgl.Marker({ color: 'green' }).setLngLat([driverLng, driverLat]).addTo(map);

// Function to draw the route (red line)
function drawRoute(origin, destination) {
    const routeCoordinates = [origin, destination];

    // Remove any existing route layer
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    }

    // Add the route as a geojson source
    map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: routeCoordinates,
            },
        },
    });

    // Add a layer to display the route (red line)
    map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': '#FF0000', // Red color
            'line-width': 5,
        },
    });
}

// Draw route from driver to destination1 initially
drawRoute([driverLng, driverLat], destination1);

// Function to fetch driver's live location (simulated for demonstration)
function fetchDriverLocation() {
    // Simulate driver movement (Update these values for real-time location fetching)
    driverLng += 0.001; // Simulate movement
    driverLat += 0.001; // Simulate movement
    return [driverLng, driverLat];
}

// Update the driver's location and route every 2 seconds
setInterval(() => {
    const [newLng, newLat] = fetchDriverLocation();
    driverMarker.setLngLat([newLng, newLat]);
    map.setCenter([newLng, newLat]);

    // Check if the driver has reached destination1 (for switching route to destination2)
    const distanceToDestination1 = haversine(newLat, newLng, destination1[1], destination1[0]);

    if (distanceToDestination1 < 50) { // If within 50 meters of destination1
        drawRoute([newLng, newLat], destination2); // Change route to destination2
    }
}, 2000);

// Haversine formula to calculate distance between two points (in meters)
function haversine(lat1, lon1, lat2, lon2) {
    const toRad = (angle) => (Math.PI / 180) * angle;
    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
}
