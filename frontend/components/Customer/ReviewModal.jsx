import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";

const T = {
    green: "#16A34A",
    amber: "#F59E0B",
    slate900: "#111827",
    slate700: "#374151",
    slate500: "#6B7280",
    slate200: "#E5E7EB",
    white: "#FFFFFF",
    font: "'Segoe UI', system-ui, sans-serif",
};

export default function ReviewModal({ isOpen, onClose, serviceRequestId, shopId, shopName, onSubmitted }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Reset all modal state whenever it opens (or when the target request changes)
    useEffect(() => {
        if (isOpen) {
            setRating(0);
            setHoverRating(0);
            setComment("");
            setError("");
            setSubmitting(false);
        }
    }, [isOpen, serviceRequestId]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating < 1) {
            setError("Please select a star rating.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const token = localStorage.getItem("jwt_token");
            const res = await fetch("http://localhost:8000/api/submitReview.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    service_request_id: serviceRequestId,
                    shop_id: shopId,
                    rating,
                    comment,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                onSubmitted(serviceRequestId);
                onClose();
            } else {
                setError(data.message || "Could not submit review. Please try again.");
            }
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
            <div style={{
                background: T.white, borderRadius: 20, padding: "28px 26px",
                maxWidth: 440, width: "100%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                fontFamily: T.font,
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <p style={{ fontSize: 17, fontWeight: 700, color: T.slate900, margin: 0 }}>Rate your experience</p>
                        <p style={{ fontSize: 13, color: T.slate500, margin: "4px 0 0" }}>
                            {shopName ? `How was your service with ${shopName}?` : "How was your service?"}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.slate500, fontSize: 16, padding: 4 }}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "24px 0 8px" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <FontAwesomeIcon
                            key={s}
                            icon={faStar}
                            onClick={() => setRating(s)}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{
                                fontSize: 32, cursor: "pointer",
                                color: (hoverRating || rating) >= s ? T.amber : T.slate200,
                                transition: "color 0.1s",
                            }}
                        />
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your experience (optional)"
                    rows={4}
                    style={{
                        width: "100%", marginTop: 16, padding: 12,
                        borderRadius: 12, border: `1px solid ${T.slate200}`,
                        fontSize: 13, fontFamily: T.font, color: T.slate700,
                        resize: "vertical", outline: "none", boxSizing: "border-box",
                    }}
                />

                {error && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 8 }}>{error}</p>}

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button onClick={onClose} disabled={submitting} style={{
                        flex: 1, padding: "11px 0", borderRadius: 12,
                        border: `1.5px solid ${T.slate200}`, background: T.white,
                        color: T.slate700, fontSize: 14, fontWeight: 600,
                        cursor: submitting ? "not-allowed" : "pointer", fontFamily: T.font,
                    }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={submitting} style={{
                        flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
                        background: submitting ? T.slate200 : T.green,
                        color: submitting ? T.slate500 : T.white,
                        fontSize: 14, fontWeight: 700,
                        cursor: submitting ? "not-allowed" : "pointer", fontFamily: T.font,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                        {submitting ? <><FontAwesomeIcon icon={faSpinner} spin /> Submitting…</> : "Submit Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}