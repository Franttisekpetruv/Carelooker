mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbnRpc2VrcGV0cnV2IiwiYSI6ImNrcHViMmx6NjB0enYyb3F1bDYzYnp2ZGQifQ.0zS-Kg2AD7WO6ukyxyzAkw';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: hospitalLocal.geometry.coordinates, // starting position [lng, lat]
    zoom: 17 // starting zoom
});
const marker = new mapboxgl.Marker()
    .setLngLat(hospitalLocal.geometry.coordinates)
    .addTo(map)