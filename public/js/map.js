console.log("map js loaded");
const map = L.map("map").setView(
    [coordinates[1], coordinates[0]],
    10
);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup("Your listing location")
    .openPopup();
    