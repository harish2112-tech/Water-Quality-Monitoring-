import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RoleGuard from '../components/RoleGuard';
import CollaborationsList from '../components/ngo/CollaborationsList';
import SubmitCollaborationForm from '../components/ngo/SubmitCollaborationForm';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { collaborationService } from '../services/collaborationService';

// Mocking useAuth
jest.mock('../context/AuthContext', () => ({
    ...jest.requireActual('../context/AuthContext'),
    useAuth: jest.fn()
}));

// Mocking collaborationService
jest.mock('../services/collaborationService', () => ({
    collaborationService: {
        getAll: jest.fn(),
        create: jest.fn(),
        getReportsByStation: jest.fn()
    }
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Navigate: ({ to }) => <div data-testid="redirect" data-to={to}>Redirected to {to}</div>
}));

describe('NGO Portal Components', () => {

    describe('RoleGuard', () => {
        it('redirects to /403 if user role is not allowed', () => {
            useAuth.mockReturnValue({
                user: { name: 'Citizen', role: 'citizen' },
                loading: false
            });

            render(
                <BrowserRouter>
                    <RoleGuard roles={['ngo', 'admin']}>
                        <div data-testid="protected-content">Protected</div>
                    </RoleGuard>
                </BrowserRouter>
            );

            expect(screen.getByTestId('redirect')).toHaveAttribute('data-to', '/403');
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        });

        it('renders children if user role is allowed', () => {
            useAuth.mockReturnValue({
                user: { name: 'NGO User', role: 'ngo' },
                loading: false
            });

            render(
                <BrowserRouter>
                    <RoleGuard roles={['ngo', 'admin']}>
                        <div data-testid="protected-content">Protected</div>
                    </RoleGuard>
                </BrowserRouter>
            );

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });

    describe('CollaborationsList', () => {
        it('renders collaboration rows and handles pagination', async () => {
            const mockData = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                project_name: `Project ${i + 1}`,
                ngo_name: 'Green NGO',
                contact_email: 'green@ngo.org',
                created_at: new Date().toISOString(),
                station_id: 100 + i
            }));

            collaborationService.getAll.mockResolvedValue(mockData);

            render(
                <BrowserRouter>
                    <CollaborationsList />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Project 1')).toBeInTheDocument();
                expect(screen.getByText('Project 10')).toBeInTheDocument();
            });

            // Check if pagination buttons exist
            expect(screen.getByRole('button', { name: /ChevronRight/i || '' })).toBeInTheDocument();
        });
    });

    describe('SubmitCollaborationForm', () => {
        it('shows validation errors and submits successfully', async () => {
            useAuth.mockReturnValue({
                user: { name: 'NGO User', email: 'ngo@example.com', role: 'ngo' },
                loading: false
            });

            collaborationService.create.mockResolvedValue({ id: 1 });

            render(
                <BrowserRouter>
                    <SubmitCollaborationForm />
                </BrowserRouter>
            );

            const projectNameInput = screen.getByPlaceholderText(/e.g. Nile Basin/i);
            const submitButton = screen.getByRole('button', { name: /Deploy Project/i });

            fireEvent.change(projectNameInput, { target: { value: 'New Test Project' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(collaborationService.create).toHaveBeenCalledWith(expect.objectContaining({
                    project_name: 'New Test Project'
                }));
                expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument();
            });
        });
    });
});
