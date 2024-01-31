module.exports = {
    render: (mapData) => {
        return `<html>
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
                        <script src="/js/app.js"></script>
                        <script>
                            const mapData = ${JSON.stringify(mapData)};
                        </script>
                    </body>
                </html>`;
    },
};
