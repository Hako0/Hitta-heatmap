let heatmap, map;

function initMap(){
    fetch('/data')
        .then(res => res.json())
        .then(data => {
             map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 59.35,
                    lng: 18.033,
                },
                zoom: 9,
                zoomControl: false,
                fullscreenControl: false,
                mapTypeControl: false
            });

            google.maps.event.addListenerOnce(map, 'idle', function () {
                document.getElementById("loader").style.display = "none";
                document.getElementById("content").style.display = "contents";
            });

            const locations = [];
            data.forEach(person => {
                if (person.address && person.address[0].coordinate) {
                    locations.push({
                        lat: person.address[0].coordinate.north,
                        long: person.address[0].coordinate.east,
                    })
                }
            });
            const heatmapData = [];
            for (const location of locations) {
                heatmapData.push(new google.maps.LatLng(location.lat, location.long));
            }
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatmapData,
                radius: 5 * (100/heatmapData.length),
            });
            heatmap.setMap(map);
        });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    const gradient = [
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 191, 255, 1)",
        "rgba(0, 127, 255, 1)",
        "rgba(0, 63, 255, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 0, 223, 1)",
        "rgba(0, 0, 191, 1)",
        "rgba(0, 0, 159, 1)",
        "rgba(0, 0, 127, 1)",
        "rgba(63, 0, 91, 1)",
        "rgba(127, 0, 63, 1)",
        "rgba(191, 0, 31, 1)",
        "rgba(255, 0, 0, 1)"
    ];
    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
    heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
    heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}