/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchDashboardData, setSystemStatus, addLog } from '../store/dashboardSlice';
import { 
  TInquiry, TService, TProduct, TTeamMember, TEquipmentItem, TPartnerItem, 
  TProject, TWarehouse, TCategory, TQuotation 
} from '../types';
import api from '../utils/api';

const normalizeInquiry = (inquiry: any): TInquiry => ({
  id: inquiry.id || inquiry._id,
  name: inquiry.name || 'Untitled Inquiry',
  company: inquiry.company || '',
  email: inquiry.email || '',
  phone: inquiry.phone || '',
  service: inquiry.service || '',
  subject: inquiry.subject || inquiry.service || 'Client inquiry',
  message: inquiry.message || '',
  date: inquiry.date || (inquiry.createdAt
    ? new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''),
  status: inquiry.status === 'Replied'
    ? 'Replied'
    : inquiry.status === 'Read'
      ? 'Read'
      : inquiry.status === 'replied'
        ? 'Replied'
        : inquiry.status === 'read'
          ? 'Read'
          : 'New',
  replyText: inquiry.replyText || '',
  replyDate: inquiry.replyDate || '',
  type: inquiry.type === 'quote' ? 'quote' : 'inquiry',
  quoteDetails: {
    batteryType: inquiry.quoteDetails?.batteryType || '',
    quantity: inquiry.quoteDetails?.quantity || '',
    location: inquiry.quoteDetails?.location || '',
    address: inquiry.quoteDetails?.address || '',
    billingAddress: inquiry.quoteDetails?.billingAddress || '',
    abn: inquiry.quoteDetails?.abn || '',
    urgency: inquiry.quoteDetails?.urgency || '',
    sourcePage: inquiry.quoteDetails?.sourcePage || '',
    sourceButton: inquiry.quoteDetails?.sourceButton || '',
    submittedAt: inquiry.quoteDetails?.submittedAt || '',
  },
});

const normalizeQuotation = (q: any): TQuotation => ({
  id: q.id || q._id,
  _id: q._id,
  quoteNo: q.quoteNo || '',
  quoteDate: q.quoteDate || '',
  expiryDate: q.expiryDate || '',
  preparedBy: q.preparedBy || '',
  salesRep: q.salesRep || '',
  projectName: q.projectName || '',
  customerRef: q.customerRef || '',
  poReference: q.poReference || '',
  client: {
    companyName: q.client?.companyName || '',
    contactPerson: q.client?.contactPerson || '',
    email: q.client?.email || '',
    phone: q.client?.phone || '',
    siteAddress: q.client?.siteAddress || '',
    billingAddress: q.client?.billingAddress || '',
    abn: q.client?.abn || ''
  },
  battery: {
    batteryType: q.battery?.batteryType || '',
    manufacturer: q.battery?.manufacturer || '',
    model: q.battery?.model || '',
    voltage: q.battery?.voltage || '',
    capacity: q.battery?.capacity || '',
    cells: q.battery?.cells || '',
    banks: q.battery?.banks || '',
    installYear: q.battery?.installYear || '',
    location: q.battery?.location || ''
  },
  description: q.description || '',
  serviceCategory: q.serviceCategory || '',
  scopeOfWork: Array.isArray(q.scopeOfWork) ? q.scopeOfWork : [],
  materials: Array.isArray(q.materials) ? q.materials : [],
  labour: Array.isArray(q.labour) ? q.labour : [],
  equipment: Array.isArray(q.equipment) ? q.equipment : [],
  additionalCharges: Array.isArray(q.additionalCharges) ? q.additionalCharges : [],
  terms: Array.isArray(q.terms) ? q.terms : [],
  notes: Array.isArray(q.notes) ? q.notes : [],
  internalNotes: q.internalNotes || '',
  customerNotes: q.customerNotes || '',
  validityDays: Number(q.validityDays) || 30,
  requireSignature: q.requireSignature === true,
  showBankDetails: q.showBankDetails === true,
  bankName: q.bankName || '',
  accountName: q.accountName || '',
  bsb: q.bsb || '',
  accountNumber: q.accountNumber || '',
  status: q.status || 'Draft',
  grandTotal: Number(q.grandTotal) || 0,
  inquiryId: q.inquiryId || null,
});

export function useDashboardData() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const addSystemLog = useCallback((type: 'info' | 'success' | 'warning' | 'error', message: string, source: string) => {
    dispatch(addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      type,
      message,
      source
    }));
  }, [dispatch]);

  const refetch = useCallback(async () => {
    addSystemLog('info', 'Manual refresh triggered. Querying latest metrics...', 'Dashboard Coordinator');
    await dispatch(fetchDashboardData());
    addSystemLog('success', 'Database synchronization complete.', 'Core System');
  }, [dispatch, addSystemLog]);

  // INQUIRIES ACTIONS
  const markInquiryRead = useCallback(async (id: string) => {
    await api.patch(`/api/inquiries/${id}`, { status: 'read' });
    addSystemLog('info', `Inquiry ${id} viewed and marked as read.`, 'Inquiry Dispatcher');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const replyToInquiry = useCallback(async (id: string, replyText: string) => {
    const replyDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    await api.patch(`/api/inquiries/${id}`, { status: 'replied', replyText, replyDate });
    addSystemLog('success', `Reply dispatched successfully to inquiry: ${id}`, 'Email Gateway');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteInquiry = useCallback(async (id: string) => {
    await api.delete(`/api/inquiries/${id}`);
    addSystemLog('warning', `Inquiry ${id} permanently discarded.`, 'Inquiry Dispatcher');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // SERVICES ACTIONS
  const addService = useCallback(async (serviceData: Omit<TService, 'id'>) => {
    const res = await api.post<any>('/api/services', {
      title: serviceData.name,
      slug: serviceData.slug,
      description: serviceData.description,
      category: serviceData.category,
      status: serviceData.status,
      iconName: serviceData.iconName,
      serviceTagline: serviceData.serviceTagline,
      heroDescription: serviceData.heroDescription,
      imageUrl: serviceData.imageUrl,
      detailImageUrl: serviceData.detailImageUrl,
      ctaText: serviceData.ctaText,
      secondaryText: serviceData.secondaryText,
      keyHighlights: serviceData.keyHighlights || [],
      technicalProcedures: serviceData.technicalProcedures || [],
      displayOrder: serviceData.displayOrder || 0,
    });
    addSystemLog('success', `New Service added: "${res.title || res.name}"`, 'Services Admin');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateServiceStatus = useCallback(async (id: string, status: 'Active' | 'Inactive') => {
    const currentService = state.services.find((srv) => srv.id === id);
    if (!currentService) return;
    await api.put(`/api/services/${id}`, { ...currentService, status, title: currentService.name });
    addSystemLog('info', `Service ${id} state updated as ${status}.`, 'Services Admin');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog, state.services]);

  const updateService = useCallback(async (id: string, serviceData: Partial<TService>) => {
    const payload = { ...serviceData, title: serviceData.title || serviceData.name };
    await api.put(`/api/services/${id}`, payload);
    addSystemLog('success', `Service updated: "${serviceData.name || id}"`, 'Services Admin');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteService = useCallback(async (id: string) => {
    await api.delete(`/api/services/${id}`);
    addSystemLog('warning', `Service ${id} deleted from catalog.`, 'Services Admin');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateServiceFeatured = useCallback(async (id: string, featuredOnHome: boolean) => {
    await api.patch(`/api/services/${id}/featured`, { featuredOnHome });
    addSystemLog('info', `Service ${id} home featured → ${featuredOnHome}`, 'Services Admin');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // PRODUCTS ACTIONS
  const addProduct = useCallback(async (prodData: Omit<TProduct, 'id' | 'addedDate'>) => {
    const res = await api.post<any>('/api/products', prodData);
    addSystemLog('success', `New battery product registered: "${res.name}"`, 'Catalog Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateProduct = useCallback(async (id: string, prodData: Partial<TProduct>) => {
    const res = await api.put<any>(`/api/products/${id}`, prodData);
    addSystemLog('success', `Product updated: "${res.name || id}"`, 'Catalog Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateProductStock = useCallback(async (id: string, stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
    await api.patch(`/api/products/${id}/stock`, { stockStatus });
    addSystemLog('info', `Product ${id} inventory updated to ${stockStatus}.`, 'Catalog Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateProductFeatured = useCallback(async (id: string, featuredOnHome: boolean) => {
    await api.patch(`/api/products/${id}/featured`, { featuredOnHome });
    addSystemLog('info', `Product ${id} home featured → ${featuredOnHome}`, 'Catalog Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteProduct = useCallback(async (id: string) => {
    await api.delete(`/api/products/${id}`);
    addSystemLog('warning', `Product ${id} removed from active listings.`, 'Catalog Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // QUOTATION ACTIONS
  const addQuotation = useCallback(async (quotData: Omit<TQuotation, 'id'>) => {
    const data = await api.post<any>('/api/quotations', quotData);
    const normalized = normalizeQuotation(data);
    addSystemLog('success', `Quotation ${normalized.quoteNo} created`, 'Quotation Engine');
    dispatch(fetchDashboardData());
    return normalized;
  }, [dispatch, addSystemLog]);

  const updateQuotation = useCallback(async (id: string, quotData: Partial<TQuotation>) => {
    const data = await api.put<any>(`/api/quotations/${id}`, quotData);
    const normalized = normalizeQuotation(data);
    addSystemLog('info', `Quotation ${normalized.quoteNo} updated.`, 'Quotation Engine');
    dispatch(fetchDashboardData());
    return normalized;
  }, [dispatch, addSystemLog]);

  const deleteQuotation = useCallback(async (id: string) => {
    await api.delete(`/api/quotations/${id}`);
    addSystemLog('warning', `Quotation with ID ${id} discarded.`, 'Quotation Engine');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // SETTINGS ACTIONS
  const updateSystemStatusValue = useCallback((serviceKey: 'apiServer' | 'database' | 'cdn', stateVal: 'Operational' | 'Degraded' | 'Offline') => {
    const updatedStatus = { ...state.systemStatus, [serviceKey]: stateVal };
    dispatch(setSystemStatus(updatedStatus));
    api.put('/api/settings', { systemStatus: updatedStatus }).catch(() => {});
    addSystemLog('warning', `Service status of ${serviceKey} changed to "${stateVal}"`, 'System Administrator');
  }, [dispatch, state.systemStatus, addSystemLog]);

  // TEAM ACTIONS
  const addTeamMember = useCallback(async (name: string, role: string, email: string, status: 'Active' | 'On Leave', image?: string) => {
    await api.post('/api/team', { name, role, email, status, image });
    addSystemLog('success', `Team Member registered: "${name}" (${role})`, 'Personnel Directory');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateTeamMemberStatus = useCallback(async (id: string, status: 'Active' | 'On Leave') => {
    await api.patch(`/api/team/${id}/status`, { status });
    addSystemLog('info', `Personnel status updated for ID ${id} to "${status}"`, 'Personnel Directory');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteTeamMember = useCallback(async (id: string) => {
    await api.delete(`/api/team/${id}`);
    addSystemLog('warning', `Team Member ID ${id} deleted from catalog.`, 'Personnel Directory');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // TESTIMONIALS ACTIONS
  const fetchTestimonials = useCallback(async () => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const addTestimonial = useCallback(async (formData: FormData) => {
    const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${BASE}/api/testimonials`, { method: 'POST', credentials: 'include', body: formData });
    if (!res.ok) throw new Error('Testimonial addition failed');
    addSystemLog('success', 'Testimonial added', 'Testimonials Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateTestimonialStatus = useCallback(async (id: string, status: 'Approved' | 'Pending' | 'Rejected') => {
    await api.patch(`/api/testimonials/${id}/status`, { status });
    addSystemLog('info', `Testimonial ${id} status → "${status}"`, 'Testimonials Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteTestimonial = useCallback(async (id: string) => {
    await api.delete(`/api/testimonials/${id}`);
    addSystemLog('warning', `Testimonial ID ${id} deleted.`, 'Testimonials Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // EQUIPMENT ACTIONS
  const addEquipment = useCallback(async (item: Omit<TEquipmentItem, 'id' | '_id'>) => {
    await api.post('/api/equipment', item);
    addSystemLog('success', `Equipment added: "${item.title}"`, 'Equipment Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateEquipment = useCallback(async (id: string, item: Omit<TEquipmentItem, 'id' | '_id'>) => {
    await api.put(`/api/equipment/${id}`, item);
    addSystemLog('info', `Equipment updated: "${item.title}"`, 'Equipment Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteEquipment = useCallback(async (id: string) => {
    await api.delete(`/api/equipment/${id}`);
    addSystemLog('warning', `Equipment ID ${id} deleted.`, 'Equipment Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // PARTNER ACTIONS
  const addPartner = useCallback(async (item: Omit<TPartnerItem, 'id' | '_id'>) => {
    await api.post('/api/partners', item);
    addSystemLog('success', `Partner added: "${item.name}"`, 'Partners Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updatePartner = useCallback(async (id: string, item: Omit<TPartnerItem, 'id' | '_id'>) => {
    await api.put(`/api/partners/${id}`, item);
    addSystemLog('info', `Partner updated: "${item.name}"`, 'Partners Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deletePartner = useCallback(async (id: string) => {
    await api.delete(`/api/partners/${id}`);
    addSystemLog('warning', `Partner ID ${id} deleted.`, 'Partners Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // PROJECT ACTIONS
  const addProject = useCallback(async (projectData: Partial<TProject>) => {
    await api.post('/api/projects', projectData);
    addSystemLog('success', `Project added: "${projectData.title}"`, 'Projects Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateProject = useCallback(async (id: string, projectData: Partial<TProject>) => {
    await api.put(`/api/projects/${id}`, projectData);
    addSystemLog('info', `Project updated: "${projectData.title}"`, 'Projects Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateProjectStatus = useCallback(async (id: string, status: 'Active' | 'Inactive') => {
    const current = state.projects.find((p) => p.id === id);
    if (!current) return;
    await api.put(`/api/projects/${id}`, { ...current, status });
    addSystemLog('info', `Project ${id} status → "${status}"`, 'Projects Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, state.projects, addSystemLog]);

  const updateProjectFeatured = useCallback(async (id: string, featuredOnHome: boolean) => {
    await api.patch(`/api/projects/${id}/featured`, { featuredOnHome });
    addSystemLog('info', `Project ${id} home featured → ${featuredOnHome}`, 'Projects Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteProject = useCallback(async (id: string) => {
    await api.delete(`/api/projects/${id}`);
    addSystemLog('warning', `Project ID ${id} deleted.`, 'Projects Hub');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // INVENTORY ACTIONS
  const stockIn = useCallback(async (productId: string, quantity: number, note: string, warehouseId?: string) => {
    await api.post('/api/inventory/movement', { productId, type: 'in', quantity, note, warehouseId: warehouseId || undefined });
    addSystemLog('success', `Stock In: +${quantity} units for product ${productId}`, 'Inventory Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const stockOut = useCallback(async (productId: string, quantity: number, note: string, warehouseId?: string) => {
    await api.post('/api/inventory/movement', { productId, type: 'out', quantity, note, warehouseId: warehouseId || undefined });
    addSystemLog('warning', `Stock Out: -${quantity} units for product ${productId}`, 'Inventory Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateInventoryConfig = useCallback(async (
    productId: string,
    config: { minStock?: number; reorderLevel?: number; location?: string; currentStock?: number }
  ) => {
    await api.patch(`/api/inventory/${productId}/config`, config);
    addSystemLog('info', `Inventory config updated for product ${productId}`, 'Inventory Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // WAREHOUSE ACTIONS
  const addWarehouse = useCallback(async (data: Omit<TWarehouse, '_id' | 'id' | 'createdAt'>) => {
    await api.post('/api/warehouses', data);
    addSystemLog('success', `Warehouse added: "${data.name}" (${data.code})`, 'Warehouse Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateWarehouse = useCallback(async (id: string, data: Partial<TWarehouse>) => {
    await api.put(`/api/warehouses/${id}`, data);
    addSystemLog('info', `Warehouse updated: "${data.name}"`, 'Warehouse Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateWarehouseStatus = useCallback(async (id: string, status: 'Active' | 'Inactive') => {
    await api.patch(`/api/warehouses/${id}/status`, { status });
    addSystemLog('info', `Warehouse ${id} → ${status}`, 'Warehouse Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteWarehouse = useCallback(async (id: string) => {
    await api.delete(`/api/warehouses/${id}`);
    addSystemLog('warning', `Warehouse ${id} deleted.`, 'Warehouse Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  // CATEGORY ACTIONS
  const addCategory = useCallback(async (data: Omit<TCategory, '_id' | 'id' | 'createdAt'>) => {
    await api.post('/api/categories', data);
    addSystemLog('success', `Category added: "${data.name}"`, 'Category Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const updateCategory = useCallback(async (id: string, data: Partial<TCategory>) => {
    await api.put(`/api/categories/${id}`, data);
    addSystemLog('info', `Category updated: "${data.name}"`, 'Category Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  const deleteCategory = useCallback(async (id: string) => {
    await api.delete(`/api/categories/${id}`);
    addSystemLog('warning', `Category deleted.`, 'Category Manager');
    dispatch(fetchDashboardData());
  }, [dispatch, addSystemLog]);

  return {
    inquiries: state.inquiries,
    services: state.services,
    products: state.products,
    movements: state.movements,
    warehouses: state.warehouses,
    categories: state.categories,
    logs: state.logs,
    systemStatus: state.systemStatus,
    team: state.team,
    testimonials: state.testimonials,
    equipment: state.equipment,
    partners: state.partners,
    projects: state.projects,
    quotations: state.quotations,
    isLoading: state.isLoading,
    isError: state.isError,
    errorMsg: state.errorMsg,
    isRefetching: state.isRefetching,

    // Actions
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
    fetchTestimonials,
    // Inventory
    stockIn,
    stockOut,
    updateInventoryConfig,
    // Warehouses
    addWarehouse,
    updateWarehouse,
    updateWarehouseStatus,
    deleteWarehouse,
    // Categories
    addCategory,
    updateCategory,
    deleteCategory,
    // Quotations
    addQuotation,
    updateQuotation,
    deleteQuotation,
  };
}
