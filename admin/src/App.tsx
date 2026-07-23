/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, FormEvent } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { TTab } from './types';

// Import core layout components
import AdminSidebar from './components/AdminSidebar';
import Header from './components/Header';

// Import our new page-level router views
import DashboardPage from './pages/DashboardPage';
import ServicesPage from './pages/ServicesPage';
import ProductsPage from './pages/ProductsPage';
import InquiriesPage from './pages/InquiriesPage';
import TeamPage from './pages/TeamPage';
import TestimonialsPage from './pages/TestimonialsPage';
import SettingsPage from './pages/SettingsPage';
import PartnersPage from './pages/PartnersPage';
import ProjectsPage from './pages/ProjectsPage';
import HomePagePage from './pages/HomePagePage';
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/InventoryPage';
import HomepageProductsPage from './pages/HomepageProductsPage';
import HomepageServicesPage from './pages/HomepageServicesPage';
import HomepageProjectsPage from './pages/HomepageProjectsPage';
import WarehousePage from './pages/WarehousePage';
import CategoriesPage from './pages/CategoriesPage';
import CreateQuotationPage from './pages/CreateQuotationPage';
import QuotationTemplatesPage from './pages/QuotationTemplatesPage';
import QuotationsPage from './pages/QuotationsPage';
import { TInquiry, TQuotation } from './types';


// Simple fallback and trigger icons
import { AlertTriangle, Plus, X, Battery, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TTab>('dashboard');
  const [autoOpenAddProduct, setAutoOpenAddProduct] = useState(false);
  const [showQuickAddDialog, setShowQuickAddDialog] = useState(false);
  const [quickAddSelection, setQuickAddSelection] = useState<'service' | 'product'>('service');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  const [selectedInquiryForQuote, setSelectedInquiryForQuote] = useState<TInquiry | null>(null);
  const [selectedQuotationForEdit, setSelectedQuotationForEdit] = useState<TQuotation | null>(null);


  // Load state and actions through our custom hooks engine
  const {
    inquiries,
    services,
    products,
    logs,
    systemStatus,
    team,
    testimonials,
    equipment,
    partners,
    projects,
    isLoading,
    isError,
    errorMsg,
    isRefetching,
    
    // Actions dispatcher
    refetch,
    markInquiryRead,
    replyToInquiry,
    deleteInquiry,
    addService,
    updateServiceStatus,
    updateService,
    deleteService,
    updateServiceFeatured,
    addProduct,
    updateProduct,
    updateProductStock,
    updateProductFeatured,
    deleteProduct,
    updateSystemStatusValue,
    addTeamMember,
    updateTeamMemberStatus,
    deleteTeamMember,
    addTestimonial,
    updateTestimonialStatus,
    deleteTestimonial,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addPartner,
    updatePartner,
    deletePartner,
    addProject,
    updateProject,
    updateProjectStatus,
    updateProjectFeatured,
    deleteProject,
    // Inventory
    movements,
    stockIn,
    stockOut,
    updateInventoryConfig,
    // Warehouses
    warehouses,
    addWarehouse,
    updateWarehouse,
    updateWarehouseStatus,
    deleteWarehouse,
    // Categories
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    // Quotations
    quotations,
    addQuotation,
    updateQuotation,
    deleteQuotation,
  } = useDashboardData();

  // Helper values for metric items
  const newInquiriesCount = inquiries.filter((i) => i.status === 'New').length;
  const activeServicesCount = services.filter((s) => s.status === 'Active').length;
  const productsCount = products.length;

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/me`, {
          credentials: 'include',
        });
        if (!response.ok) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          return;
        }
        const data = await response.json();
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadSession();
  }, []);

  // Handle Quick Creator Action dispatch
  const [quickServiceName, setQuickServiceName] = useState('');
  const [quickServiceDesc, setQuickServiceDesc] = useState('');
  const [quickProdName, setQuickProdName] = useState('');
  const [quickProdCap, setQuickProdCap] = useState('');
  const [quickProdCategory, setQuickProdCategory] = useState('Lithium Traction');

  const handleQuickAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (quickAddSelection === 'service') {
      if (!quickServiceName.trim() || !quickServiceDesc.trim()) return;
      const computedSlug = quickServiceName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await addService({
        name: quickServiceName.trim(),
        slug: computedSlug,
        description: quickServiceDesc.trim(),
        category: '',
        status: 'Active',
        iconName: '',
        serviceTagline: quickServiceDesc.trim(),
        heroDescription: quickServiceDesc.trim(),
        imageUrl: '',
        detailImageUrl: '',
        ctaText: '',
        secondaryText: '',
        keyHighlights: [],
        technicalProcedures: [],
        gallery: [],
        displayOrder: 0,
      });
      setQuickServiceName('');
      setQuickServiceDesc('');
    } else {
      if (!quickProdName.trim() || !quickProdCap.trim()) return;
      addProduct({
        name: quickProdName.trim(),
        slug: quickProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: quickProdCategory,
        description: 'Accelerated traction backup system registered via Quick Creator tool.',
        capacity: quickProdCap.trim(),
        voltage: '48V',
        warrantyMonths: 24,
        stockStatus: 'In Stock'
      });
      setQuickProdName('');
      setQuickProdCap('');
    }
    setShowQuickAddDialog(false);
  };

  if (isLoading) {
    return (
      <div id="app-loading-state" className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <div className="text-xs font-semibold tracking-widest font-mono text-muted-foreground uppercase">
            Synchronizing Platform Services...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div id="app-error-state" className="min-h-screen bg-background flex flex-col items-center justify-center font-sans p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-danger mb-4" />
        <h2 className="text-lg font-bold text-foreground">Critical Initialization Failed</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">{errorMsg}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-opacity-90 cursor-pointer text-xs"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div id="app-loading-state" className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <div className="text-xs font-semibold tracking-widest font-mono text-muted-foreground uppercase">
            Checking session...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setIsAuthenticated(true);
          setCurrentUser(user);
        }}
        productsCount={products.length}
        activeServicesCount={services.filter((s) => s.status === 'Active').length}
        clientsCount={500}
      />
    );
  }

  // Handle opening the Quick Add dialog from other subviews
  const handleOpenQuickAdd = (selection: 'service' | 'product') => {
    setQuickAddSelection(selection);
    setShowQuickAddDialog(true);
  };

  return (
    <div id="app-root-container" className="flex min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      
      {/* Side Control panel */}
      <AdminSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={async () => {
          try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/logout`, {
              method: 'POST',
              credentials: 'include',
            });
          } finally {
          setIsAuthenticated(false);
          setCurrentUser(null);
          }
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#f5f5f5' }}>
        
        {/* Navigation Top Header */}
        <Header
          currentTab={currentTab}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onQuickAdd={() => handleOpenQuickAdd('service')}
          user={currentUser}
        />

        {/* Modular Page Rendering and Dynamic Tab Selection */}
        <main className={`flex-1 ${currentTab === 'createQuotation' ? '' : 'px-8 py-8'}`}>
          
          {currentTab === 'dashboard' && (
            <DashboardPage
              inquiries={inquiries}
              services={services}
              products={products}
              logs={logs}
              systemStatus={systemStatus}
              onRefresh={refetch}
              setCurrentTab={setCurrentTab}
              markInquiryRead={markInquiryRead}
              replyToInquiry={replyToInquiry}
              deleteInquiry={deleteInquiry}
              addService={addService}
              updateServiceStatus={updateServiceStatus}
              deleteService={deleteService}
              onOpenQuickAdd={handleOpenQuickAdd}
            />
          )}

          {currentTab === 'services' && (
            <ServicesPage
              services={services}
              onAddService={addService}
              onUpdateService={updateService}
              onUpdateStatus={updateServiceStatus}
              onDeleteService={deleteService}
              equipment={equipment}
              onAddEquipment={addEquipment}
              onUpdateEquipment={updateEquipment}
              onDeleteEquipment={deleteEquipment}
            />
          )}

          {currentTab === 'products' && (
            <ProductsPage
              products={products}
              warehouses={warehouses}
              categories={categories}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onUpdateStock={updateProductStock}
              onDeleteProduct={deleteProduct}
              autoOpenAdd={autoOpenAddProduct}
              onResetAutoOpen={() => setAutoOpenAddProduct(false)}
            />
          )}

          {currentTab === 'inquiries' && (
            <InquiriesPage
              inquiries={inquiries}
              onReply={replyToInquiry}
              onMarkRead={markInquiryRead}
              onDelete={deleteInquiry}
            />
          )}

          {currentTab === 'team' && (
            <TeamPage
              team={team}
              onAddMember={addTeamMember}
              onUpdateStatus={updateTeamMemberStatus}
              onDeleteMember={deleteTeamMember}
            />
          )}

          {currentTab === 'testimonials' && (
            <TestimonialsPage
              testimonials={testimonials}
              onAddTestimonial={addTestimonial}
              onUpdateStatus={updateTestimonialStatus}
              onDeleteTestimonial={deleteTestimonial}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              systemStatus={systemStatus}
              onUpdateStatusValue={updateSystemStatusValue}
            />
          )}

          {currentTab === 'partners' && (
            <PartnersPage
              partners={partners}
              onAddPartner={addPartner}
              onUpdatePartner={updatePartner}
              onDeletePartner={deletePartner}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsPage
              projects={projects}
              onAddProject={addProject}
              onUpdateProject={updateProject}
              onUpdateStatus={updateProjectStatus}
              onDeleteProject={deleteProject}
            />
          )}

          {currentTab === 'homePage' && (
            <HomePagePage
              products={products}
              services={services}
              projects={projects}
              onToggleProductFeatured={updateProductFeatured}
              onToggleServiceFeatured={updateServiceFeatured}
              onToggleProjectFeatured={updateProjectFeatured}
            />
          )}

          {currentTab === 'homepageProducts' && (
            <HomepageProductsPage
              products={products}
              onToggleProductFeatured={updateProductFeatured}
            />
          )}

          {currentTab === 'homepageServices' && (
            <HomepageServicesPage
              services={services}
              onToggleServiceFeatured={updateServiceFeatured}
            />
          )}

          {currentTab === 'homepageProjects' && (
            <HomepageProjectsPage
              projects={projects}
              onToggleProjectFeatured={updateProjectFeatured}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryPage
              products={products}
              movements={movements}
              warehouses={warehouses}
              onStockIn={stockIn}
              onStockOut={stockOut}
              onUpdateConfig={updateInventoryConfig}
              onAddProductClick={() => {
                setCurrentTab('products');
                setAutoOpenAddProduct(true);
              }}
            />
          )}

          {currentTab === 'warehouses' && (
            <WarehousePage
              warehouses={warehouses}
              movements={movements}
              onAdd={addWarehouse}
              onUpdate={updateWarehouse}
              onUpdateStatus={updateWarehouseStatus}
              onDelete={deleteWarehouse}
            />
          )}

          {currentTab === 'categories' && (
            <CategoriesPage
              categories={categories}
              onAdd={addCategory}
              onUpdate={updateCategory}
              onDelete={deleteCategory}
            />
          )}

          {currentTab === 'quotations' && (
            <QuotationsPage
              inquiries={inquiries}
              quotations={quotations}
              onDeleteQuotation={deleteQuotation}
              setCurrentTab={setCurrentTab}
              onSelectInquiryForQuote={setSelectedInquiryForQuote}
              onSelectQuotationForEdit={setSelectedQuotationForEdit}
            />
          )}

          {currentTab === 'quotationTemplates' && (
            <QuotationTemplatesPage setCurrentTab={setCurrentTab} />
          )}

          {currentTab === 'createQuotation' && (
            <CreateQuotationPage
              setCurrentTab={setCurrentTab}
              prefillData={selectedInquiryForQuote}
              onClearPrefill={() => setSelectedInquiryForQuote(null)}
              editData={selectedQuotationForEdit}
              onClearEdit={() => setSelectedQuotationForEdit(null)}
              onAddQuotation={addQuotation}
              onUpdateQuotation={updateQuotation}
              onReplyToInquiry={replyToInquiry}
            />
          )}

        </main>
      </div>

      {/* Quick Add Modal (Unified) */}
      {showQuickAddDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-card border border-border rounded-lg max-w-sm w-full shadow-xl overflow-hidden animate-slide-up bg-white">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground font-headings flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-primary stroke-[2.3]" />
                <span>Quick Admin Creator</span>
              </h3>
              <button
                onClick={() => setShowQuickAddDialog(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selection Switch tabs */}
            <div className="px-5 pt-4">
              <div className="flex rounded-md bg-muted p-0.5 border border-border">
                <button
                  type="button"
                  onClick={() => setQuickAddSelection('service')}
                  className={`flex-1 py-1.5 text-xs font-sans font-semibold rounded cursor-pointer ${
                    quickAddSelection === 'service'
                      ? 'bg-background text-foreground shadow-xs font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  New Service
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAddSelection('product')}
                  className={`flex-1 py-1.5 text-xs font-sans font-semibold rounded cursor-pointer ${
                    quickAddSelection === 'product'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  New Battery Product
                </button>
              </div>
            </div>

            {/* Quick Add Form layout */}
            <form onSubmit={handleQuickAddSubmit} className="p-5 flex flex-col gap-3.5 text-xs">
              {quickAddSelection === 'service' ? (
                <>
                  <div>
                    <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">Service Display Name</label>
                    <input
                      required
                      type="text"
                      value={quickServiceName}
                      onChange={(e) => setQuickServiceName(e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">Catalog Description</label>
                    <textarea
                      rows={2}
                      value={quickServiceDesc}
                      onChange={(e) => setQuickServiceDesc(e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-foreground font-sans"
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">Battery Model Title</label>
                    <input
                      required
                      type="text"
                      value={quickProdName}
                      onChange={(e) => setQuickProdName(e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">Capacity</label>
                      <input
                        required
                        type="text"
                        value={quickProdCap}
                        onChange={(e) => setQuickProdCap(e.target.value)}
                        className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-foreground font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">Category</label>
                      <select
                        value={quickProdCategory}
                        onChange={(e) => setQuickProdCategory(e.target.value)}
                        className="w-full p-2 rounded-md border border-border bg-background focus:outline-none text-foreground cursor-pointer"
                      >
                        <option value="Lithium Traction">Lithium Traction</option>
                        <option value="Solar / Deep Cycle">Solar/Deep Cycle</option>
                        <option value="Lead-Acid Traction">Lead-Acid Traction</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-1 font-sans">
                <button
                  type="button"
                  onClick={() => setShowQuickAddDialog(false)}
                  className="px-3.5 py-2 hover:bg-muted text-muted-foreground font-semibold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold hover:bg-opacity-95 rounded cursor-pointer"
                >
                  Register State Item
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
