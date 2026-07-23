import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '1rem',
};

export function ShopMap({ isLoaded, loadError, userLocation, shopsList, activeMarker, setActiveMarker }) {
    if (loadError) return <div className="p-8 font-mono text-red-500">Error loading maps API</div>;
    if (!isLoaded) return <div className="p-8 font-mono text-[#16a34a]">Loading Map Engine...</div>;

    return (
        <div className="w-full h-[500px] lg:h-[calc(100vh-4rem)] lg:sticky lg:top-20 rounded-2xl border border-gray-200 bg-[#e5e9ea] shadow-sm overflow-hidden relative">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation}
                zoom={12}
                options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    styles: [
                        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
                        { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
                        { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
                        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
                        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e2f4" }] },
                    ]
                }}
            >
                {/* 1. The Blue User Marker */}
                <Marker 
                    position={userLocation}
                    icon={{ url: "https://mt.google.com/vt/icon/name=icons/spotlight/spotlight-waypoint-blue.png" }}
                    title="Your Current Location"
                    animation={2} 
                />

                {/* 2. The Dynamic Red Shop Markers */}
                {shopsList.map((shop) => {
                    const pinLat = parseFloat(shop.latitude || shop.lat);
                    const pinLng = parseFloat(shop.longitude || shop.lng);
                    if (isNaN(pinLat) || isNaN(pinLng)) return null;

                    return (
                        <Marker
                            key={shop.id}
                            position={{ lat: pinLat, lng: pinLng }}
                            title={shop.name} 
                            animation={2} 
                            onClick={() => setActiveMarker(shop)} 
                        />
                    );
                })}

                {/* 3. The Interactive Info Bubble */}
                {activeMarker && (
                    <InfoWindow
                        position={{ lat: parseFloat(activeMarker.latitude || activeMarker.lat), lng: parseFloat(activeMarker.longitude || activeMarker.lng) }}
                        onCloseClick={() => setActiveMarker(null)}
                    >
                        <div className="p-2 font-mono max-w-[200px]">
                            <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-widest">{activeMarker.open_status_text}</p>
                            <p className="font-bold text-base text-black leading-tight mt-1 mb-2">{activeMarker.name}</p>
                            <p className="text-xs text-black/70 flex items-start gap-1">
                                <FontAwesomeIcon icon={faLocationDot} className="mt-[2px] text-[#16a34a]" />
                                {activeMarker.location_text}
                            </p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}