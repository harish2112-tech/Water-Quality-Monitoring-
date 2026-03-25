import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleGuard component protects routes based on user roles.
 * @param {Array} allowedRoles - List of roles permitted to access the route.
 */
const RoleGuard = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        // Redir to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redir to unauthorized page or home if role not permitted
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RoleGuard;
