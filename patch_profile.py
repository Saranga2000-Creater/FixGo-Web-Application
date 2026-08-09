import re

with open('frontend/components/Customer/Profile.jsx', 'r') as f:
    content = f.read()

# 1. Add states and icons
icons_import_old = "    faExclamationCircle,\n} from \"@fortawesome/free-solid-svg-icons\";"
icons_import_new = "    faExclamationCircle,\n    faTrash,\n    faCarSide,\n} from \"@fortawesome/free-solid-svg-icons\";"
content = content.replace(icons_import_old, icons_import_new)

state_old = "    const [modalSuccess, setModalSuccess] = useState(\"\");"
state_new = """    const [modalSuccess, setModalSuccess] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [vehicleCategories, setVehicleCategories] = useState([]);
    const [vehicleFormData, setVehicleFormData] = useState({ id: null, brand: "", color: "", vehicle_category_id: "" });
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);"""
content = content.replace(state_old, state_new)

# 2. Add fetch vehicles and categories
fetch_old = "    useEffect(() => {\n        fetchProfile();\n    }, []);"
fetch_new = """    useEffect(() => {
        fetchProfile();
        api.get("customer/getVehicles.php").then(res => {
            if (res.success) setVehicles(res.vehicles || []);
        });
        api.get("getCategories.php").then(res => {
            if (res.vehicles) setVehicleCategories(res.vehicles);
        });
    }, []);
    
    const fetchVehicles = () => {
        api.get("customer/getVehicles.php").then(res => {
            if (res.success) setVehicles(res.vehicles || []);
        });
    };"""
content = content.replace(fetch_old, fetch_new)

# 3. Add handleSaveVehicle
save_old = "    const handleSave = async (e) => {"
save_new = """    const handleSaveVehicle = async (e) => {
        e.preventDefault();
        setModalError(""); setModalSuccess(""); setSaving(true);
        try {
            const url = vehicleFormData.id ? "customer/updateVehicle.php" : "customer/addVehicle.php";
            const method = vehicleFormData.id ? "PUT" : "POST";
            const res = await api({ url, method, data: vehicleFormData });
            if (res.success) {
                setModalSuccess(res.message);
                fetchVehicles();
                setIsEditingVehicle(false);
            } else {
                setModalError(res.message || "Failed to save vehicle.");
            }
        } catch (err) {
            setModalError(err.message || "An error occurred.");
        } finally {
            setSaving(false);
        }
    };
    
    const handleDeleteVehicle = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            const res = await api({ url: "customer/deleteVehicle.php", method: "DELETE", data: { id } });
            if (res.success) {
                fetchVehicles();
            } else {
                alert(res.message || "Failed to delete vehicle.");
            }
        } catch (err) {
            alert(err.message || "An error occurred.");
        }
    };

    const handleSave = async (e) => {"""
content = content.replace(save_old, save_new)

# 4. Modify Security section to include Vehicles grid
sec_old = """            {/* ── Security ── */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">"""
sec_new = """            {/* ── Lower Section (Security & Vehicles) ── */}
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {/* Security */}
                <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">"""
content = content.replace(sec_old, sec_new)

sec_close_old = """                    <SecurityRow label="Member Since" value={customer.memberSince} />
                </div>
            </div>"""
sec_close_new = """                    <SecurityRow label="Member Since" value={customer.memberSince} />
                </div>
            </div>

            {/* My Vehicles */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCarSide} className="text-gray-400" />
                        <h3 className="text-[15px] font-bold text-gray-900 m-0">My Vehicles</h3>
                    </div>
                    <button
                        onClick={() => {
                            setIsEditingVehicle(false);
                            setVehicleFormData({ id: null, brand: "", color: "", vehicle_category_id: "" });
                            openEditModal("vehicles");
                        }}
                        className="flex items-center gap-[5px] text-xs font-bold text-green-600 bg-transparent border-none cursor-pointer"
                        style={{ fontFamily: FONT }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add Vehicle
                    </button>
                </div>

                {vehicles.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {vehicles.map(v => {
                            const cat = vehicleCategories.find(c => c.id == v.vehicle_category_id);
                            return (
                                <div key={v.id} className="flex justify-between items-center p-3.5 bg-gray-50 border border-gray-200 rounded-[10px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[rgba(22,163,74,0.08)] flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCarSide} className="text-green-600 text-[15px]" />
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-bold text-gray-900 m-0">{v.brand}</p>
                                            <p className="text-[12px] text-gray-500 m-0">{v.color} • {cat ? cat.name : "Vehicle"}</p>
                                        </div>
                                    </div>
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
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                            <FontAwesomeIcon icon={faCarSide} className="text-gray-300 text-lg" />
                        </div>
                        <p className="text-[13px] font-semibold text-gray-700 m-0">Your garage is empty</p>
                        <p className="text-[12px] text-gray-500 mt-1 mb-4">Add your vehicles for faster service requests.</p>
                        <button
                            onClick={() => {
                                setIsEditingVehicle(false);
                                setVehicleFormData({ id: null, brand: "", color: "", vehicle_category_id: "" });
                                openEditModal("vehicles");
                            }}
                            className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                        >
                            Add Your First Vehicle
                        </button>
                    </div>
                )}
            </div>
        </div>"""
content = content.replace(sec_close_old, sec_close_new)

# 5. Add Modal Tab
tab_old = """                            <button
                                onClick={() => { setActiveTab("password"); setModalError(""); }}
                                className={`py-3 px-4 text-xs font-bold border-b-2 bg-transparent cursor-pointer transition-colors ${activeTab === "password" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Security & Password
                            </button>"""
tab_new = """                            <button
                                onClick={() => { setActiveTab("password"); setModalError(""); }}
                                className={`py-3 px-4 text-xs font-bold border-b-2 bg-transparent cursor-pointer transition-colors ${activeTab === "password" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Security & Password
                            </button>
                            <button
                                onClick={() => { setActiveTab("vehicles"); setModalError(""); setIsEditingVehicle(false); setVehicleFormData({ id: null, brand: "", color: "", vehicle_category_id: "" }); }}
                                className={`py-3 px-4 text-xs font-bold border-b-2 bg-transparent cursor-pointer transition-colors ${activeTab === "vehicles" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                My Vehicles
                            </button>"""
content = content.replace(tab_old, tab_new)

# 6. Add Modal Content for Vehicles
form_start = '                        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">'
form_start_new = '                        <form onSubmit={activeTab === "vehicles" ? (isEditingVehicle ? handleSaveVehicle : handleSaveVehicle) : handleSave} className="p-6 flex flex-col gap-4">'
content = content.replace(form_start, form_start_new)

form_old = """                            {activeTab === "password" && ("""
form_new = """                            {activeTab === "vehicles" && (
                                <>
                                    {!isEditingVehicle && vehicles.length > 0 ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-sm font-bold text-gray-900 m-0">Saved Vehicles</h4>
                                                <button type="button" onClick={() => { setIsEditingVehicle(true); setVehicleFormData({ id: null, brand: "", color: "", vehicle_category_id: "" }); }} className="text-xs font-bold text-green-600 bg-transparent border-none cursor-pointer">
                                                    + Add New
                                                </button>
                                            </div>
                                            {vehicles.map(v => {
                                                const cat = vehicleCategories.find(c => c.id == v.vehicle_category_id);
                                                return (
                                                    <div key={v.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                                        <div>
                                                            <p className="text-[13px] font-bold text-gray-900 m-0">{v.brand}</p>
                                                            <p className="text-[11px] text-gray-500 m-0">{v.color} • {cat ? cat.name : "Vehicle"}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button type="button" onClick={() => { setVehicleFormData({ id: v.id, brand: v.brand, color: v.color, vehicle_category_id: v.vehicle_category_id }); setIsEditingVehicle(true); }} className="text-[11px] font-bold text-blue-600 bg-transparent border-none cursor-pointer hover:underline">Edit</button>
                                                            <button type="button" onClick={() => handleDeleteVehicle(v.id)} className="text-[11px] font-bold text-red-600 bg-transparent border-none cursor-pointer hover:underline"><FontAwesomeIcon icon={faTrash} /></button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-bold text-gray-900 m-0">{vehicleFormData.id ? "Edit Vehicle" : "Add New Vehicle"}</h4>
                                                {vehicles.length > 0 && (
                                                    <button type="button" onClick={() => setIsEditingVehicle(false)} className="text-[11px] text-gray-500 bg-transparent border-none cursor-pointer hover:underline">Cancel Edit</button>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-gray-700">Vehicle Type *</label>
                                                <select
                                                    value={vehicleFormData.vehicle_category_id}
                                                    onChange={e => setVehicleFormData({...vehicleFormData, vehicle_category_id: e.target.value})}
                                                    className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                                                    required
                                                >
                                                    <option value="">Select Type</option>
                                                    {vehicleCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-gray-700">Brand / Make *</label>
                                                <input
                                                    type="text"
                                                    value={vehicleFormData.brand}
                                                    onChange={e => setVehicleFormData({...vehicleFormData, brand: e.target.value})}
                                                    className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                                                    placeholder="e.g. Toyota Camry"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-gray-700">Color *</label>
                                                <input
                                                    type="text"
                                                    value={vehicleFormData.color}
                                                    onChange={e => setVehicleFormData({...vehicleFormData, color: e.target.value})}
                                                    className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                                                    placeholder="e.g. Silver"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {activeTab === "password" && ("""
content = content.replace(form_old, form_new)

btn_old = """                                    {saving ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} className="text-xs" /> Save Changes
                                        </>
                                    )}"""
btn_new = """                                    {saving ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} className="text-xs" /> {activeTab === "vehicles" && !isEditingVehicle && vehicles.length > 0 ? "Done" : "Save Changes"}
                                        </>
                                    )}"""
content = content.replace(btn_old, btn_new)

with open('frontend/components/Customer/Profile.jsx', 'w') as f:
    f.write(content)
