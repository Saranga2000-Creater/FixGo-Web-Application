import re

with open('frontend/components/Customer/Profile.jsx', 'r') as f:
    content = f.read()

# Add deleteConfirmId state
state_new = """    const [isEditingVehicle, setIsEditingVehicle] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);"""
content = content.replace('    const [isEditingVehicle, setIsEditingVehicle] = useState(false);', state_new)

# Update handleDeleteVehicle to remove alerts
handle_del_old = """    const handleDeleteVehicle = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            const res = await api.post("customer/deleteVehicle.php", { id });
            if (res.success) {
                fetchVehicles();
            } else {
                alert(res.message || "Failed to delete vehicle.");
            }
        } catch (err) {
            alert(err.message || "An error occurred.");
        }
    };"""
handle_del_new = """    const handleDeleteVehicle = async (id) => {
        try {
            const res = await api.post("customer/deleteVehicle.php", { id });
            if (res.success) {
                setModalSuccess("Vehicle deleted successfully.");
                fetchVehicles();
                setDeleteConfirmId(null);
                setTimeout(() => setModalSuccess(""), 2000);
            } else {
                setModalError(res.message || "Failed to delete vehicle.");
            }
        } catch (err) {
            setModalError(err.message || "An error occurred.");
        }
    };"""
content = content.replace(handle_del_old, handle_del_new)

# Update main dashboard vehicle card
dash_card_old = """                                    <button
                                        onClick={() => {
                                            setVehicleFormData({ id: v.id, brand: v.brand, color: v.color, vehicle_category_id: v.vehicle_category_id });
                                            setIsEditingVehicle(true);
                                            openEditModal("vehicles");
                                        }}
                                        className="text-[11px] font-bold text-green-600 bg-transparent border-none cursor-pointer hover:underline"
                                    >
                                        Edit
                                    </button>"""
dash_card_new = """                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setVehicleFormData({ id: v.id, brand: v.brand, color: v.color, vehicle_category_id: v.vehicle_category_id });
                                                setIsEditingVehicle(true);
                                                openEditModal("vehicles");
                                            }}
                                            className="text-[11px] font-bold text-green-600 bg-transparent border-none cursor-pointer hover:underline"
                                        >
                                            Edit
                                        </button>
                                        {deleteConfirmId === v.id ? (
                                            <button 
                                                onClick={() => handleDeleteVehicle(v.id)} 
                                                className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 cursor-pointer"
                                            >
                                                Confirm?
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setDeleteConfirmId(v.id)} 
                                                className="text-[11px] font-bold text-gray-400 hover:text-red-600 bg-transparent border-none cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}
                                    </div>"""
content = content.replace(dash_card_old, dash_card_new)

# Update modal vehicle card
modal_card_old = """                                                            <button type="button" onClick={() => { setVehicleFormData({ id: v.id, brand: v.brand, color: v.color, vehicle_category_id: v.vehicle_category_id }); setIsEditingVehicle(true); }} className="text-[11px] font-bold text-blue-600 bg-transparent border-none cursor-pointer hover:underline">Edit</button>
                                                            <button type="button" onClick={() => handleDeleteVehicle(v.id)} className="text-[11px] font-bold text-red-600 bg-transparent border-none cursor-pointer hover:underline"><FontAwesomeIcon icon={faTrash} /></button>"""
modal_card_new = """                                                            <button type="button" onClick={() => { setVehicleFormData({ id: v.id, brand: v.brand, color: v.color, vehicle_category_id: v.vehicle_category_id }); setIsEditingVehicle(true); }} className="text-[11px] font-bold text-blue-600 bg-transparent border-none cursor-pointer hover:underline">Edit</button>
                                                            {deleteConfirmId === v.id ? (
                                                                <button type="button" onClick={() => handleDeleteVehicle(v.id)} className="text-[11px] font-bold text-white bg-red-600 px-2 py-1 rounded cursor-pointer hover:bg-red-700 border-none">Sure?</button>
                                                            ) : (
                                                                <button type="button" onClick={() => setDeleteConfirmId(v.id)} className="text-[11px] font-bold text-red-600 bg-transparent border-none cursor-pointer hover:underline"><FontAwesomeIcon icon={faTrash} /></button>
                                                            )}"""
content = content.replace(modal_card_old, modal_card_new)

with open('frontend/components/Customer/Profile.jsx', 'w') as f:
    f.write(content)

