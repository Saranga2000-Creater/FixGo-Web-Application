import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faCar,
    faChevronRight,
    faCircleCheck,
    faEnvelope,
    faLock,
    faMapPin,
    faPhone,
    faPlus,
    faStar,
    faUser,
} from "@fortawesome/free-solid-svg-icons";

// ── Design tokens — exact match to Admin ─────────────────────────────────────
const T = {
    green:     "#16A34A",
    greenLight:"#F0FDF4",
    greenBg:   "#EDF9F0",
    greenMuted:"rgba(22,163,74,0.08)",
    teal:      "#0D9488",
    tealBg:    "rgba(13,148,136,0.08)",
    blue:      "#2563EB",
    blueBg:    "#EDF3FF",
    violet:    "#A855F7",
    violetBg:  "#F5EDFF",
    slate900:  "#111827",
    slate700:  "#374151",
    slate500:  "#6B7280",
    slate400:  "#9CA3AF",
    slate200:  "#E5E7EB",
    slate100:  "#F3F4F6",
    slate50:   "#F9FAFB",
    white:     "#FFFFFF",
    font:      "'Segoe UI', system-ui, sans-serif",
    card: {
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
};

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=16a34a&color=fff&name=";

function StatsCard({ icon, title, value, iconBg, iconColor, borderColor }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: T.white,
            border: `1px solid ${borderColor}`,
            borderRadius: 12,
            padding: "12px 14px",
        }}>
            <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: iconBg, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <FontAwesomeIcon icon={icon} style={{ fontSize: 15, color: iconColor }} />
            </div>
            <div>
                <p style={{ fontSize: 11, color: T.slate500, fontFamily: "monospace", margin: 0 }}>{title}</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: T.slate900, margin: 0 }}>{value}</p>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 14,
            borderBottom: `1px solid ${T.slate100}`,
        }}>
            <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.slate900, margin: 0 }}>{value}</p>
        </div>
    );
}

function SecurityRow({ label, value }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: T.slate50,
            borderRadius: 10,
            padding: "12px 16px",
            border: `1px solid ${T.slate100}`,
        }}>
            <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.slate900, margin: 0 }}>{value}</p>
        </div>
    );
}

function Profile() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        fetch("http://localhost:8000/api/getCustomerProfile.php", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setCustomer(data);
                else setError(data.message || "Failed to load profile");
                setLoading(false);
            })
            .catch(() => {
                setError("Could not connect to server");
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 13, color: T.slate500 }}>Loading profile...</p>
        </div>
    );

    if (error) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 13, color: "#DC2626" }}>{error}</p>
        </div>
    );

    const avatarSrc = customer.profilePhoto
        ? customer.profilePhoto
        : DEFAULT_AVATAR + encodeURIComponent(customer.name);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: T.font }}>

            {/* ── Page heading — mirrors Admin DashboardView header ── */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
                borderRadius: 18,
                padding: "24px",
                border: `1px solid ${T.slate200}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>My Profile</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                        Manage your personal information, addresses and preferences.
                    </p>
                </div>
            </div>

            {/* ── Profile hero card ── */}
            <div style={{ ...T.card, padding: 24 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>

                    {/* Avatar + contact details */}
                    <div style={{ display: "flex", gap: 24, flex: 1, minWidth: 280, alignItems: "flex-start" }}>
                        <img
                            src={avatarSrc}
                            alt={customer.name}
                            style={{
                                width: 100, height: 100,
                                borderRadius: "50%",
                                objectFit: "cover",
                                flexShrink: 0,
                                outline: `3px solid ${T.greenMuted}`,
                                outlineOffset: 2,
                            }}
                        />
                        <div>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: T.slate900, margin: 0 }}>{customer.name}</h2>
                                <span style={{
                                    background: T.greenMuted, color: T.green,
                                    borderRadius: 99, padding: "3px 12px",
                                    fontSize: 11, fontWeight: 700,
                                }}>Customer</span>
                            </div>
                            <p style={{ fontSize: 12, color: T.slate400, marginTop: 4, marginBottom: 12 }}>
                                Member since {customer.memberSince}
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                {[
                                    { icon: faEnvelope, val: customer.email },
                                    { icon: faPhone,    val: customer.contactNumber || "Not provided" },
                                    { icon: faMapPin,   val: customer.address       || "Not provided" },
                                ].map(({ icon, val }) => (
                                    <div key={val} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.slate500 }}>
                                        <FontAwesomeIcon icon={icon} style={{ color: T.green, opacity: 0.6, width: 14 }} />
                                        <span>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Account overview */}
                    <div style={{
                        background: T.slate50,
                        border: `1px solid ${T.slate200}`,
                        borderRadius: 18,
                        padding: 20,
                        minWidth: 280,
                        width: 400,
                        flexShrink: 0,
                    }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: "0 0 14px" }}>Account Overview</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <StatsCard icon={faCar}          title="Total Repairs"     value="0" iconBg={T.greenMuted} iconColor={T.green}  borderColor={T.slate200} />
                            <StatsCard icon={faCircleCheck}  title="Completed"         value="0" iconBg={T.tealBg}    iconColor={T.teal}   borderColor={T.slate200} />
                            <StatsCard icon={faCalendarDays} title="Appointments"      value="0" iconBg={T.blueBg}    iconColor={T.blue}   borderColor={T.slate200} />
                            <StatsCard icon={faStar}         title="Reviews Given"     value="0" iconBg={T.violetBg}  iconColor={T.violet} borderColor={T.slate200} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Personal info + Addresses ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>

                {/* Personal Info */}
                <div style={{ ...T.card, padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                        <FontAwesomeIcon icon={faUser} style={{ color: T.slate400 }} />
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: 0 }}>Personal Information</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <InfoRow label="Full Name"     value={customer.name} />
                        <InfoRow label="Email Address" value={customer.email} />
                        <InfoRow label="Phone Number"  value={customer.contactNumber || "Not provided"} />
                        <InfoRow label="Address"       value={customer.address       || "Not provided"} />
                        <InfoRow label="Member Since"  value={customer.memberSince} />
                    </div>
                </div>

                {/* Addresses */}
                <div style={{ ...T.card, padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FontAwesomeIcon icon={faMapPin} style={{ color: T.slate400 }} />
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: 0 }}>Addresses</h3>
                        </div>
                        <button style={{
                            display: "flex", alignItems: "center", gap: 5,
                            fontSize: 12, fontWeight: 700,
                            color: T.green, background: "none", border: "none", cursor: "pointer", fontFamily: T.font,
                        }}>
                            <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} /> Add New
                        </button>
                    </div>

                    {customer.address ? (
                        <div style={{
                            background: T.slate50,
                            borderRadius: 12,
                            border: `1px solid ${T.slate200}`,
                            padding: 16,
                        }}>
                            <span style={{
                                background: T.greenMuted, color: T.green,
                                borderRadius: 99, padding: "3px 12px",
                                fontSize: 11, fontWeight: 700,
                            }}>Default</span>
                            <p style={{ fontSize: 13, color: T.slate700, marginTop: 10, marginBottom: 8 }}>
                                {customer.address}
                            </p>
                            <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>
                                <FontAwesomeIcon icon={faPhone} style={{ marginRight: 8, color: T.green, opacity: 0.6 }} />
                                {customer.contactNumber || "No number"}
                            </p>
                        </div>
                    ) : (
                        <p style={{ fontSize: 13, color: T.slate400 }}>No address saved yet.</p>
                    )}

                    <button
                        style={{
                            marginTop: 16, width: "100%",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            padding: "12px 0", borderRadius: 10,
                            border: `1.5px dashed ${T.green}55`,
                            background: "none",
                            fontSize: 13, fontWeight: 700, color: T.green,
                            cursor: "pointer", fontFamily: T.font,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = T.greenMuted}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ fontSize: 11 }} /> Add New Address
                    </button>
                </div>
            </div>

            {/* ── Security ── */}
            <div style={{ ...T.card, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <FontAwesomeIcon icon={faLock} style={{ color: T.slate400 }} />
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: 0 }}>Security</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <SecurityRow label="Password"     value="••••••••••" />
                    <SecurityRow label="Member Since" value={customer.memberSince} />
                </div>
            </div>

        </div>
    );
}

export default Profile;
