import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTruckPickup, faCar, faInfoCircle, faCamera } from "@fortawesome/free-solid-svg-icons";

export const ServiceRequestModal = ({ isOpen, onClose, shop, initialNeedsTow = false }) => {
    // Form State
    const [brand, setBrand] = useState('');
    const [color, setColor] = useState('');
    const [description, setDescription] = useState('');
    const [requiresTow, setRequiresTow] = useState(initialNeedsTow);
    const [imageFile, setImageFile] = useState(null); // New state for the optional image
    
    // Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Reset the form every time the modal opens
    useEffect(() => {
        if (isOpen) {
            setRequiresTow(initialNeedsTow);
            setBrand('');
            setColor('');
            setDescription('');
            setImageFile(null);
            setError('');
            setSuccess('');
        }
    }, [isOpen, initialNeedsTow]);

    if (!isOpen || !shop) return null;

    // Helper function to convert image file to Base64 for JSON payload
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token'); 

            // Convert image to Base64 if the user uploaded one
            let base64Image = null;
            if (imageFile) {
                base64Image = await convertToBase64(imageFile);
            }

            const requestData = {
                customer_id: 4, 
                shop_id: shop.id,
                vehicle_category_id: 2, 
                vehicle_brand: brand,
                vehicle_color: color,
                description: description,
                requires_tow: requiresTow,
                problem_image: base64Image, // New field for the payload
                lat: 6.9061, 
                lng: 79.9696
            };
            console.log("FINAL PAYLOAD:", requestData);

            const response = await fetch('http://localhost:8000/api/createServiceRequest.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit request.');
            }

            setSuccess('Request sent successfully! The garage has been notified.');
            
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#d1e7d7] bg-[#f8f4f0]">
                    <div>
                        <h3 className="text-xl font-bold text-[#14532d]">Request Service</h3>
                        <p className="text-sm font-mono text-[#274c3a] opacity-80 mt-1">Dispatching to: <span className="font-bold">{shop.name}</span></p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors text-gray-500">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm font-mono">
                            <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 text-red-500" />
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {success ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-[#16a34a]/20 text-[#16a34a] rounded-full flex items-center justify-center text-3xl mb-4">
                                ✓
                            </div>
                            <h4 className="text-xl font-bold text-[#14532d] mb-2">Ticket Created!</h4>
                            <p className="text-[#274c3a]">{success}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-mono font-bold text-[#274c3a] uppercase tracking-widest mb-1.5">Vehicle Brand</label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faCar} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Toyota" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#d1e7d7] bg-[#f8f4f0] focus:border-[#16a34a] outline-none transition-colors text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-mono font-bold text-[#274c3a] uppercase tracking-widest mb-1.5">Color</label>
                                    <input type="text" required value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Silver" className="w-full px-4 py-2.5 rounded-xl border border-[#d1e7d7] bg-[#f8f4f0] focus:border-[#16a34a] outline-none transition-colors text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-mono font-bold text-[#274c3a] uppercase tracking-widest mb-1.5">Describe the Issue</label>
                                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What seems to be the problem? e.g. Engine stalled, flat tire..." rows="3" className="w-full px-4 py-3 rounded-xl border border-[#d1e7d7] bg-[#f8f4f0] focus:border-[#16a34a] outline-none transition-colors text-sm resize-none"></textarea>
                            </div>

                            {/* Optional Image Upload - Show for both Garages (1) and Service Centers (2) */}
                            {(shop.category_id === 1 || shop.category_id === 2) && (
                                <div>
                                    <label className="block text-[11px] font-mono font-bold text-[#274c3a] uppercase tracking-widest mb-1.5">Attach Photo (Optional)</label>
                                    <label className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-dashed border-[#16a34a] bg-[#f8f4f0] hover:bg-[#16a34a]/5 cursor-pointer transition-colors text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faCamera} className="text-[#16a34a]" />
                                        <span className="truncate">{imageFile ? imageFile.name : "Click to upload an image of the problem"}</span>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => setImageFile(e.target.files[0])} 
                                            className="hidden" 
                                        />
                                    </label>
                                </div>
                            )}

                            {/* Tow Truck Checkbox - ONLY show if it is a Garage (1) AND they have a tow service */}
                            {shop.category_id === 1 && shop.has_tow_service === 1 && (
                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${requiresTow ? 'border-[#16a34a] bg-[#16a34a]/10' : 'border-[#d1e7d7] bg-[#f8f4f0] hover:bg-white'}`}>
                                    <input type="checkbox" checked={requiresTow} onChange={(e) => setRequiresTow(e.target.checked)} className="w-5 h-5 accent-[#16a34a] cursor-pointer" />
                                    <div className="flex flex-col">
                                        <span className={`font-bold font-mono ${requiresTow ? 'text-[#14532d]' : 'text-gray-700'}`}>I need a Tow Truck</span>
                                        <span className="text-xs text-gray-500">Dispatch {shop.default_truck_brand} ({shop.tow_truck_plate})</span>
                                    </div>
                                    <FontAwesomeIcon icon={faTruckPickup} className={`ml-auto text-xl ${requiresTow ? 'text-[#16a34a]' : 'text-gray-300'}`} />
                                </label>
                            )}

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full py-3.5 rounded-xl font-bold font-mono text-white transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] shadow-md'}`}
                            >
                                {isSubmitting ? 'SENDING REQUEST...' : 'CONFIRM BOOKING'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};