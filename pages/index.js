/**
 * Modular version of the main page using the new component structure
 */

import Head from 'next/head';
import { useState, useEffect } from 'react';
import {
  AppContainer,
  Header,
  Footer,
  VisitList,
  Button,
  LoginForm
} from '../components';
import MultiStepForm from '../components/forms/MultiStepForm';
import { useVisits, useAuth } from '../hooks';

export default function Home() {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [editingVisit, setEditingVisit] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Authentication
  const {
    isAuthenticated,
    loading: authLoading,
    error: authError,
    login,
    logout,
    clearError
  } = useAuth();

  const {
    visits,
    loading,
    currentPage,
    totalPages,
    handleDeleteVisit,
    refreshVisits,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = useVisits();

  // Only load visits when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshVisits();
    }
  }, [isAuthenticated, refreshVisits]);

  useEffect(() => {
    // Check for admin mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    setIsAdminMode(urlParams.has('admin'));
  }, []);

  // Handle login
  const handleLogin = async (password) => {
    clearError();
    const result = await login(password);
    if (!result.success) {
      // Error is already set in the useAuth hook
      return;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    if (authLoading) {
      return (
        <>
          <Head>
            <title>Door2Door Marketing - Loading...</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
          </Head>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #C7E8FF 0%, #A8D8F0 100%)'
          }}>
            <div style={{ textAlign: 'center', color: '#2c3e50' }}>
              <h2>Loading...</h2>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Head>
          <title>Door2Door Marketing - Login</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        </Head>
        <LoginForm
          onLogin={handleLogin}
          loading={authLoading}
          error={authError}
        />
      </>
    );
  }

  const handleAddNewVisit = () => {
    setEditingVisit(null);
    setCurrentView('form');
  };

  const handleEditVisit = (visit) => {
    setEditingVisit(visit);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingVisit(null);
    refreshVisits(); // Refresh the list
  };

  const handleFormSuccess = () => {
    handleBackToList();
  };

  const handleLogoClick = () => {
    // Always return to the list view when logo is clicked
    if (currentView !== 'list') {
      handleBackToList();
    }
  };

  const handleFooterLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      handleLogout();
    }
  };

  return (
    <>
      <Head>
        <title>
          {currentView === 'list'
            ? 'Door2Door Marketing - Visits'
            : 'Door2Door Marketing - Visit Form'
          }
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </Head>

      <AppContainer>
        {/* Header is always visible across all views */}
        <Header
          isAdminMode={isAdminMode}
          onLogoClick={handleLogoClick}
        />

        {currentView === 'list' ? (
          <main style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0, /* Important for flex child to shrink */
            overflow: 'hidden' /* Prevent main from scrolling */
          }}>
            <Button
              onClick={handleAddNewVisit}
              size="large"
              style={{
                width: '100%',
                marginBottom: '30px',
                flexShrink: 0 /* Don't shrink the button */
              }}
            >
              + Add New Visit
            </Button>

            <VisitList
              visits={visits}
              loading={loading}
              isAdminMode={isAdminMode}
              currentPage={currentPage}
              totalPages={totalPages}
              onEditVisit={handleEditVisit}
              onDeleteVisit={handleDeleteVisit}
              onNextPage={nextPage}
              onPrevPage={prevPage}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
            />
          </main>
        ) : (
          <MultiStepForm
            existingData={editingVisit}
            onBack={handleBackToList}
            onSuccess={handleFormSuccess}
          />
        )}

        {/* Footer with logout */}
        <Footer
          onLogout={handleFooterLogout}
          showLogout={true}
        />
      </AppContainer>
    </>
  );
}
