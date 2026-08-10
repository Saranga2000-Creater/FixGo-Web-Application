const fs = require('fs');
const file = fs.readFileSync('frontend/components/ShopDetails/ServiceRequestForm.jsx', 'utf8');
const lines = file.split('\n');
const slice = (start, end) => lines.slice(start - 1, end).join('\n');

const serviceDetails = `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faTruckPickup, faCar, faMapMarkerAlt, faCogs, faBatteryFull, 
    faLifeRing, faWrench, faQuestionCircle, faClock, faExclamationTriangle 
} from "@fortawesome/free-solid-svg-icons";

export const ServiceDetailsStep = ({
    shop,
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
    urgencyLevel,
    setUrgencyLevel,
    preferredDate,
    setPreferredDate,
    preferredTime,
    setPreferredTime
}) => {
    return (
        <>
${slice(372, 496)}
${slice(569, 622)}
        </>
    );
};
`;
fs.writeFileSync('frontend/components/ShopDetails/ServiceRequest/ServiceDetailsStep.jsx', serviceDetails);

const photoUpload = `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCamera } from "@fortawesome/free-solid-svg-icons";

export const PhotoUploadStep = ({ shop, imageFile, setImageFile }) => {
    return (
        <>
${slice(498, 567)}
        </>
    );
};
`;
fs.writeFileSync('frontend/components/ShopDetails/ServiceRequest/PhotoUploadStep.jsx', photoUpload);

const reviewSubmit = `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faWrench, faCamera, faCheckCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export const ReviewSubmitStep = ({
    shop,
    distance,
    vehicleCategory,
    brand,
    color,
    issueCategory,
    urgencyLevel,
    requiresTow,
    preferredDate,
    preferredTime,
    description,
    imageFile,
    agreedToTerms,
    setAgreedToTerms,
    isSubmitting,
    handleSubmit,
    setStep
}) => {
${slice(647, 654)}

    return (
${slice(656, 823)}
    );
};
`;
fs.writeFileSync('frontend/components/ShopDetails/ServiceRequest/ReviewSubmitStep.jsx', reviewSubmit);

const successStep = `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faTimes, faCheck, faCar, faStar, faMapMarkerAlt, faCopy, 
    faBolt, faPaperPlane, faClock, faCheckCircle, faWrench, faInfoCircle, faLock 
} from "@fortawesome/free-solid-svg-icons";

export const SuccessStep = ({
    shop,
    distance,
    referenceId,
    onClose,
    onTrackRequest
}) => {
    return (
${slice(827, 966)}
    );
};
`;
fs.writeFileSync('frontend/components/ShopDetails/ServiceRequest/SuccessStep.jsx', successStep);

const newServiceRequestForm = `${slice(1, 12)}
import { VehicleSelectionStep } from "./ServiceRequest/VehicleSelectionStep";
import { ServiceDetailsStep } from "./ServiceRequest/ServiceDetailsStep";
import { PhotoUploadStep } from "./ServiceRequest/PhotoUploadStep";
import { ReviewSubmitStep } from "./ServiceRequest/ReviewSubmitStep";
import { SuccessStep } from "./ServiceRequest/SuccessStep";

${slice(13, 273)}
    const renderStep1Form = () => (
        <form onSubmit={handleProceedToReview} className="space-y-6 pb-2">
            <VehicleSelectionStep 
                savedVehicles={savedVehicles}
                selectedVehicleId={selectedVehicleId}
                setSelectedVehicleId={setSelectedVehicleId}
                vehicleCategory={vehicleCategory}
                setVehicleCategory={setVehicleCategory}
                brand={brand}
                setBrand={setBrand}
                color={color}
                setColor={setColor}
            />

            <ServiceDetailsStep 
                shop={shop}
                requiresTow={requiresTow}
                setRequiresTow={setRequiresTow}
                handleTowSelection={handleTowSelection}
                locationStatus={locationStatus}
                pickupLandmark={pickupLandmark}
                setPickupLandmark={setPickupLandmark}
                issueCategory={issueCategory}
                setIssueCategory={setIssueCategory}
                description={description}
                setDescription={setDescription}
                urgencyLevel={urgencyLevel}
                setUrgencyLevel={setUrgencyLevel}
                preferredDate={preferredDate}
                setPreferredDate={setPreferredDate}
                preferredTime={preferredTime}
                setPreferredTime={setPreferredTime}
            />

            <PhotoUploadStep 
                shop={shop}
                imageFile={imageFile}
                setImageFile={setImageFile}
            />

${slice(624, 644)}
    
    return (
${slice(969, 990)}
                        {step === 1 && renderStep1Form()}
                        {step === 2 && <ReviewSubmitStep 
                            shop={shop}
                            distance={distance}
                            vehicleCategory={vehicleCategory}
                            brand={brand}
                            color={color}
                            issueCategory={issueCategory}
                            urgencyLevel={urgencyLevel}
                            requiresTow={requiresTow}
                            preferredDate={preferredDate}
                            preferredTime={preferredTime}
                            description={description}
                            imageFile={imageFile}
                            agreedToTerms={agreedToTerms}
                            setAgreedToTerms={setAgreedToTerms}
                            isSubmitting={isSubmitting}
                            handleSubmit={handleSubmit}
                            setStep={setStep}
                        />}
                        {step === 3 && <SuccessStep 
                            shop={shop}
                            distance={distance}
                            referenceId={referenceId}
                            onClose={onClose}
                            onTrackRequest={onTrackRequest}
                        />}
${slice(994, 999)}
`;
fs.writeFileSync('frontend/components/ShopDetails/ServiceRequestForm.jsx', newServiceRequestForm);

console.log("Successfully generated sub-components and updated ServiceRequestForm.jsx!");
