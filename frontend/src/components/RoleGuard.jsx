import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * RoleGuard protects routes by checking the user's role.
 * If unauthorized, redirects to /403.
 */
const RoleGuard = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-ocean-deep">
                <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role?.toLowerCase())) {
        return <Navigate to="/403" replace />;
    }

    return children;
};

export default RoleGuard;
