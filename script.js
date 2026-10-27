// 1. Maak de Leaflet-kaart.
const map = L.map("map").setView([51.0543, 3.7253], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 2. LAAD de gegevens. Deze functie tekent zelf niets.
function laadGegevens() {
    fetch("stad.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            toonKaart(data);
        })
        .catch(function (fout) {
            console.error("JSON laden mislukt:", fout);
        });
}

// 3. Geef de juiste gegevens door aan de aparte tekenfuncties.
function toonKaart(data) {
    map.setView(data.stad.centrum, 14);

    toonMarker(data.favorietePlaats);
    toonCirkel(data.school);
    toonPolygon(data.buurt);
    toonRoute(data.route);
}

// 4. Teken de marker van de favoriete plaats.
function toonMarker(plaats) {
    const marker = L.marker(plaats.coordinaten).addTo(map);
    marker.bindPopup(plaats.naam);

    marker.on("click", function () {
        toonInfo(plaats.naam, "Favoriete plaats", plaats.beschrijving);
    });
}

// 5. Teken de cirkel rond de school.
function toonCirkel(school) {
    const cirkel = L.circle(school.coordinaten, {
        radius: school.straal,
        color: "blue"
    }).addTo(map);

    cirkel.bindPopup(school.naam);

    cirkel.on("click", function () {
        toonInfo(school.naam, "School", school.adres + " — straal: " + school.straal + " meter");
    });
}

// 6. Teken de polygon rond de woonbuurt.
function toonPolygon(buurt) {
    const polygon = L.polygon(buurt.polygon, {
        color: "orange"
    }).addTo(map);

    polygon.bindPopup(buurt.naam);

    polygon.on("click", function () {
        toonInfo(buurt.naam, "Woonbuurt", buurt.beschrijving);
    });
}

// 7. Maak één array: start, alle tussenpunten, eindpunt.
function toonRoute(route) {
    const punten = [
        route.start,
        ...route.coordinates,
        route.end
    ];

    const lijn = L.polyline(punten, {
        color: "red",
        weight: 5
    }).addTo(map);

    lijn.bindPopup(route.naam);

    lijn.on("click", function () {
        toonInfo(route.naam, "Route", "Van mijn woonbuurt naar mijn school.");
    });
}

// 8. DOM-manipulatie staat in een APARTE herbruikbare functie.
function toonInfo(naam, type, detail) {
    document.getElementById("info-naam").textContent = naam;
    document.getElementById("info-type").textContent = type;
    document.getElementById("info-detail").textContent = detail;
}

// Start het programma.
laadGegevens();
