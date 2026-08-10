const fs = require('fs');

const read = (file) => fs.readFileSync(`frontend/components/ShopDetails/ServiceRequest/${file}`, 'utf8');

const vehicle = read('VehicleSelectionStep.jsx');
const details = read('ServiceDetailsStep.jsx');
const photo = read('PhotoUploadStep.jsx');
const urgency = read('UrgencyAppointmentStep.jsx');

// Extract bodies
const getBody = (content) => {
    const match = content.match(/return \([\s\S]*?(?:<div|<>\s*)([\s\S]*?)(?:<\/div>|<\/>\s*)\s*\);\s*\};/);
    if (!match) return "";
    return match[1].trim();
};

const vBody = getBody(vehicle);
const dBody = getBody(details);
const pBody = getBody(photo);
const uBody = getBody(urgency);

const newComponent = `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCar, faPlus, faMotorcycle, faTruck, faTruckPickup, 
    faMapMarkerAlt, faCogs, faBatteryFull, faLifeRing, faWrench, 
    faQuestionCircle, faCamera, faTimes, faClock, faExclamationTriangle 
} from "@fortawesome/free-solid-svg-icons";

export const Step1Form = ({
    shop,
    savedVehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    vehicleCategory,
    setVehicleCategory,
    brand,
    setBrand,
    color,
    setColor,
    requiresTow,
    setRequiresTow,
    handleTowSelection,
    locationStatus,
    pickupLandmark,
    setPickupLandmark,
    issueCategory,
    setIssueCategory,
    description,
    setDescription,
    imageFile,
    setImageFile,
    urgencyLevel,
    setUrgencyLevel,
    preferredDate,
    setPreferredDate,
    preferredTime,
    setPreferredTime
}) => {
    return (
        <div className="space-y-6">
            {/* 1. Vehicle Selection */}
            ${vBody}

            {/* 2. Service Details */}
            ${dBody}

            {/* 3. Photo Upload */}
            ${pBody}

            {/* 4. Urgency / Appointment */}
            ${uBody}
        </div>
    );
};
`;

fs.writeFileSync('frontend/components/ShopDetails/ServiceRequest/Step1Form.jsx', newComponent);
console.log('Step1Form.jsx generated.');
