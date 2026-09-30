/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab, LocationId, ToastMessage, UserRole } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BranchOverviewView } from './components/BranchOverviewView';
import { KitchenDisplayView } from './components/KitchenDisplayView';
import { PreferredFlavorsView } from './components/PreferredFlavorsView';
import { MenuStudioView } from './components/MenuStudioView';
import { StaffPayrollView } from './components/StaffPayrollView';
import { InventorySupplyView } from './components/InventorySupplyView';
import { GSTComplianceView } from './components/GSTComplianceView';
import { VIPGuestCRMView } from './components/VIPGuestCRMView';
import { AuditSecurityView } from './components/AuditSecurityView';
import { SettingsIntegrationsView } from './components/SettingsIntegrationsView';
import { UserProfileView } from './components/UserProfileView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { QuickOrderModal } from './components/QuickOrderModal';
import { Toast } from './components/Toast';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';
import { useOfflineSync } from './hooks/useOfflineSync';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('branch-overview');
  const [currentLocation, setCurrentLocation] = useState<LocationId>('all');
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (title: string, description: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({
      id: `${Date.now()}`,
      title,
      description,
      type,
    });
  };

  // Offline Edge Resilience & Cloud Failover Sync
  const {
    isOnline,
    offlineQueue,
    isSyncing,
    cloudKitchenFailoverActive,
    syncPendingQueue,
    toggleCloudKitchenFailover,
    simulateOfflineToggle,
  } = useOfflineSync(showToast);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-body flex">
      {/* Sidebar Navigation Rail */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        tablesOccupiedPercent={84}
        dispatchVelocity={142}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        {/* Global Executive Header */}
        <Header
          currentLocation={currentLocation}
          onLocationChange={(loc) => {
            setCurrentLocation(loc);
            showToast(
              'Location Scope Filtered',
              loc === 'all'
                ? 'Displaying consolidated portfolio data across all 6 metropolitan nodes.'
                : `Active viewport restricted to ${loc.toUpperCase()} outpost telemetry.`,
              'info'
            );
          }}
          onOpenQuickOrder={() => setQuickOrderOpen(true)}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          notificationCount={4}
          onOpenProfile={() => setCurrentTab('user-profile')}
          userName="Adarsa Parida"
          userRole="Managing Partner / Executive Director"
          currentRole={currentRole}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onShowToast={showToast}
        />

        {/* Content Canvas */}
        <main className="flex-1 w-full pt-16 flex flex-col min-w-0">
          {/* Offline Resilience & Auto Cloud Failover Indicator */}
          <OfflineSyncBanner
            isOnline={isOnline}
            offlineQueue={offlineQueue}
            isSyncing={isSyncing}
            cloudKitchenFailoverActive={cloudKitchenFailoverActive}
            onSync={syncPendingQueue}
            onToggleFailover={toggleCloudKitchenFailover}
            onSimulateToggle={simulateOfflineToggle}
          />

          <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
            {currentTab === 'branch-overview' && (
              <BranchOverviewView
                currentLocation={currentLocation}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'kitchen-display' && (
              <KitchenDisplayView
                onShowToast={showToast}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'preferred-flavors' && (
              <PreferredFlavorsView
                currentLocation={currentLocation}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'menu-studio' && (
              <MenuStudioView onShowToast={showToast} />
            )}

            {currentTab === 'staff-payroll' && (
              <StaffPayrollView onShowToast={showToast} />
            )}

            {currentTab === 'inventory-supply' && (
              <InventorySupplyView onShowToast={showToast} />
            )}

            {currentTab === 'gst-compliance' && (
              <GSTComplianceView onShowToast={showToast} />
            )}

            {currentTab === 'vip-crm' && (
              <VIPGuestCRMView
                onShowToast={showToast}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'audit-security' && (
              <AuditSecurityView
                currentRole={currentRole}
                onRoleChange={setCurrentRole}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'settings-integrations' && (
              <SettingsIntegrationsView onShowToast={showToast} />
            )}

            {currentTab === 'user-profile' && (
              <UserProfileView
                onShowToast={showToast}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Slide-over Priority Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Express Order / Reserve Modal */}
      <QuickOrderModal
        isOpen={quickOrderOpen}
        onClose={() => setQuickOrderOpen(false)}
        onSuccess={(summary) => showToast('Order / Reservation Confirmed', summary)}
        currentLocation={currentLocation}
      />

      {/* Toast Feedback Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
