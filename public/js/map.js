async function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${mapToken}`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error("Google Maps API failed to load."));
        document.head.appendChild(script);
    });
}

async function initMap() {
    try {
        await loadGoogleMapsAPI();

        if (!window.google || !window.google.maps) {
            console.error("Google Maps API did not load.");
            return;
        }

        const { Map, Marker, InfoWindow } = google.maps;

        // Default position (fallback to a known location)
        const position = { lat: coordinates[1] || 28.6139, lng: coordinates[0] || 77.2090 };

        // Initialize map
        const map = new Map(document.getElementById("map"), {
            zoom: 10,
            center: position,
            mapId: "DEMO_MAP_ID",
        });

        // 🎨 Simple Custom Marker Icon
        const customIcon = {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Custom red marker
            scaledSize: new google.maps.Size(40, 40), // Adjust size
        };

        // 📍 Create Marker
        const marker = new Marker({
            position,
            map,
            title: showlist?.location || "Unknown Location",
            icon: customIcon,
        });

        // ℹ️ InfoWindow with location details
        const infoWindow = new InfoWindow({
            content: `<h5><strong>${showlist?.location || "No Location Info"}</strong></h5>`,
        });

        // Show info window on click
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

    } catch (error) {
        console.error("Error initializing Google Maps:", error);
    }
}

window.onload = initMap;
