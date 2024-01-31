const mapModel = require('../models/mapModel');

module.exports = {
    renderMap: (req, res) => {
        const mapData = mapModel.getMapData();
        res.send(renderMapView(mapData));
    },
};

function renderMapView(mapData) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Interactive Map Example</title>
            <style>
                body { margin: 0; }
                #map { height: 100vh; }
            </style>
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        </head>
        <body>
            <div id="map"></div>
            <script src="https://unpkg.com/tangram/dist/tangram.min.js"></script>
            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
            <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
            <script>
            // Tangram scene configuration
            const tangramScene = {
                import: 'https://www.nextzen.org/carto/bubble-wrap-style/10/bubble-wrap-style.zip',
            };
            
            // Initialize Tangram with the scene
            const tangramLayer = Tangram.leafletLayer({ scene: tangramScene });
            
            // Set up the map
            const mapElement = document.getElementById('map');
            const leafletMap = L.map(mapElement).setView([0, 0], 2); // Initial center and zoom level
            leafletMap.addLayer(tangramLayer);
            
            // Add Traffic layer
            const trafficLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            });
            
            // Add Satellite layer
            const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            });
            
            // Create Layer Control
            const baseMaps = {
                "Tangram": tangramLayer,
                "Traffic": trafficLayer,
                "Satellite": satelliteLayer,
            };
            
            L.control.layers(baseMaps).addTo(leafletMap);
            
            // Handle map resize
            window.addEventListener('resize', () => {
                tangramLayer.resize();
                leafletMap.invalidateSize();
            });
            
            // Add draggable marker for starting point
            const startMarker = L.marker([40.7128, -74.0060], { draggable: true })
                .addTo(leafletMap)
                .bindPopup('Draggable Start Marker');
            
            // Routing control with custom icon
            const routingControl = L.Routing.control({
                routeWhileDragging: true,
                waypoints: [L.latLng(40.7128, -74.0060)],
                createMarker: function(i, waypoint, n) {
                    if (i === 0) {
                        return startMarker;
                    }
                    return L.marker(waypoint.latLng, {
                        draggable: true,
                        icon: L.icon({
                            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })
                    });
                }
            }).addTo(leafletMap);
            
            // Update route when the draggable marker is moved
            startMarker.on('dragend', updateRoute);
            
            // Update route when the destination marker is moved
            leafletMap.on('click', function (event) {
                const destinationMarker = L.marker(event.latlng, {
                    draggable: true,
                    icon: L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })
                }).addTo(leafletMap);
            
                destinationMarker.on('dragend', updateRoute);
                updateRoute();
            });
            
            // Function to update the route
            function updateRoute() {
                const waypoints = [startMarker.getLatLng()];
                
                leafletMap.eachLayer(layer => {
                    if (layer instanceof L.Marker && layer !== startMarker) {
                        waypoints.push(layer.getLatLng());
                    }
                });
            
                routingControl.setWaypoints(waypoints);
            }
            

            </script>
        </body>
        </html>
    `;
}
