mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbnRpc2VrcGV0cnV2IiwiYSI6ImNrcHViMmx6NjB0enYyb3F1bDYzYnp2ZGQifQ.0zS-Kg2AD7WO6ukyxyzAkw';
var map = new mapboxgl.Map({
    container: 'michigan-map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-84.65859, 43.377636], // starting position [lng, lat]
    zoom: 6 // starting zoom
});

for (let hospital of hospitals) {
    const marker = new mapboxgl.Marker()
        .setLngLat(hospital.geometry.coordinates)
        .addTo(map)

};