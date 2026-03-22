import React from 'react';

const StatusBadge = ({ status, className = "" }) => {
    const styles = {
        safe: "bg-safe/10 text-safe border-safe/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        critical: "bg-critical/10 text-critical border-critical/20",
        pending: "bg-warning/10 text-warning border-warning/20",
        verified: "bg-safe/10 text-safe border-safe/20",
        rejected: "bg-critical/10 text-critical border-critical/20",
    };

    const labels = {
        safe: "Safe",
        warning: "Warning",
        critical: "Critical",
        pending: "Pending",
        verified: "Verified",
        rejected: "Rejected",
    };

    const style = styles[status?.toLowerCase()] || "bg-accent-gold/10 text-accent-gold border-accent-gold/20";
    const label = labels[status?.toLowerCase()] || status;

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style} ${className}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
