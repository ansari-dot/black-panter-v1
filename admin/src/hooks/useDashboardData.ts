/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { TInquiry, TService, TProduct, TSystemStatus, TSystemLog, TTeamMember, TTestimonial, TEquipmentItem, TPartnerItem, TProject } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const normalizeInquiry = (inquiry: any): TInquiry => ({
  id: inquiry.id || inquiry._id,
  name: inquiry.name || 'Untitled Inquiry',
  email: inquiry.email || '',
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
});


const normalizeService = (service: any): TService => ({
  id: service._id || service.id || service.slug,
  name: service.title || service.name || 'Untitled Service',
  title: service.title || service.name || 'Untitled Service',
  slug: service.slug || '',
  status: service.status === 'Inactive' ? 'Inactive' : 'Active',
  description: service.description || service.heroDescription || '',
  category: service.category || '',
  iconName: service.iconName || service.icon || 'battery',
  serviceTagline: service.serviceTagline || '',
  heroDescription: service.heroDescription || '',
  imageUrl: service.imageUrl || '',
  detailImageUrl: service.detailImageUrl || '',
  ctaText: service.ctaText || '',
  secondaryText: service.secondaryText || '',
  keyHighlights: Array.isArray(service.keyHighlights) ? service.keyHighlights : [],
  technicalProcedures: Array.isArray(service.technicalProcedures) ? service.technicalProcedures : [],
  displayOrder: Number.isFinite(Number(service.displayOrder)) ? Number(service.displayOrder) : 0,
});

const INITIAL_LOGS: TSystemLog[] = [
  {
    id: 'log-1',
    timestamp: '17:10:45',
    type: 'success',
    message: 'Cloudinary CDN assets synchronized.',
    source: 'CDN Manager'
  },
  {
    id: 'log-2',
    timestamp: '16:05:12',
    type: 'success',
    message: 'MongoDB Atlas primary node heartbeat successful.',
    source: 'Database'
  },
  {
    id: 'log-3',
    timestamp: '15:15:22',
    type: 'info',
    message: 'API server checking container load balances.',
    source: 'Core API'
  }
];

const normalizeProduct = (product: any): TProduct => ({
  id: product._id || product.id,
  name: product.name || 'Untitled Product',
  slug: product.slug || '',
  category: product.category || '',
  description: product.description || '',
  capacity: product.capacity || '',
  voltage: product.voltage || '',
  warrantyMonths: Number(product.warrantyMonths) || 0,
  stockStatus: product.stockStatus === 'Low Stock' || product.stockStatus === 'Out of Stock' ? product.stockStatus : 'In Stock',
  addedDate: product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
  image: product.image || '',
});

const normalizeTeam = (member: any): TTeamMember => ({
  id: member._id || member.id,
  name: member.name || 'Untitled Member',
  role: member.role || '',
  email: member.email || '',
  status: member.status === 'On Leave' ? 'On Leave' : 'Active',
  joinedDate: member.joinedDate || (member.createdAt ? new Date(member.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''),
  image: member.image || '',
  linkedin: member.linkedin || '',
});

const normalizeTestimonial = (testimonial: any): TTestimonial => ({
  _id: testimonial._id || testimonial.id,
  name: testimonial.name || testimonial.clientName || 'Untitled Client',
  company: testimonial.company || '',
  rating: Number(testimonial.rating) || 0,
  message: testimonial.message || testimonial.feedback || '',
  image: testimonial.image || '',
  status: testimonial.status === 'Approved' || testimonial.status === 'Rejected' ? testimonial.status : 'Pending',
  createdAt: testimonial.createdAt || testimonial.date || '',
});

const normalizeEquipment = (item: any): TEquipmentItem => ({
  id: item._id || item.id,
  _id: item._id,
  title: item.title || '',
  description: item.description || '',
  imageUrl: item.imageUrl || '',
  displayOrder: Number.isFinite(Number(item.displayOrder)) ? Number(item.displayOrder) : 0,
});

const normalizePartner = (item: any): TPartnerItem => ({
  id: item._id || item.id,
  _id: item._id,
  name: item.name || '',
  logoUrl: item.logoUrl || '',
  websiteUrl: item.websiteUrl || '',
  displayOrder: Number.isFinite(Number(item.displayOrder)) ? Number(item.displayOrder) : 0,
});

const normalizeProject = (item: any): TProject => ({
  id: item._id || item.id,
  title: item.title || '',
  slug: item.slug || '',
  subtitle: item.subtitle || '',
  description: item.description || '',
  category: item.category || '',
  status: item.status === 'Inactive' ? 'Inactive' : 'Active',
  imageUrl: item.imageUrl || '',
  heroTag: item.heroTag || 'Project Detail',
  heroTitleLine1White: item.heroTitleLine1White || '',
  heroTitleLine1Orange: item.heroTitleLine1Orange || '',
  heroTitleLine2White: item.heroTitleLine2White || '',
  heroTitleLine2Orange: item.heroTitleLine2Orange || '',
  gallery: Array.isArray(item.gallery) ? item.gallery : [],
  highlights: Array.isArray(item.highlights) ? item.highlights : [],
  metrics: Array.isArray(item.metrics) ? item.metrics : [],
  process: Array.isArray(item.process) ? item.process : [],
  clientName: item.clientName || '',
  location: item.location || '',
  sector: item.sector || '',
  completedDate: item.completedDate || '',
  timeline: item.timeline || '',
  unitsInstalled: item.unitsInstalled || '',
  uptime: item.uptime || '',
  displayOrder: Number.isFinite(Number(item.displayOrder)) ? Number(item.displayOrder) : 0,
});

export function useDashboardData() {
  const [inquiries, setInquiries] = useState<TInquiry[]>([]);
  const [services, setServices] = useState<TService[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [logs, setLogs] = useState<TSystemLog[]>([]);
  const [team, setTeam] = useState<TTeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<TTestimonial[]>([]);
  const [equipment, setEquipment] = useState<TEquipmentItem[]>([]);
  const [partners, setPartners] = useState<TPartnerItem[]>([]);
  const [projects, setProjects] = useState<TProject[]>([]);
  const [systemStatus, setSystemStatus] = useState<TSystemStatus>({
    apiServer: 'Operational',
    database: 'Operational',
    cdn: 'Operational',
    lastDeploy: '2 hours ago'
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  // Initialize and load from client storage
  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        // Simulate minor async latency to showcase high-quality loading skeletons
        setTimeout(() => {
          const storedLogs = localStorage.getItem('bp_logs');
          const storedStatus = localStorage.getItem('bp_status');
          if (storedLogs) setLogs(JSON.parse(storedLogs));
          else {
            setLogs(INITIAL_LOGS);
            localStorage.setItem('bp_logs', JSON.stringify(INITIAL_LOGS));
          }

          fetch(`${API}/api/products`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setProducts(data.map(normalizeProduct)); })
            .catch(() => setProducts([]));

          fetch(`${API}/api/team`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setTeam(data.map(normalizeTeam)); })
            .catch(() => setTeam([]));

          fetch(`${API}/api/testimonials`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setTestimonials(data.map(normalizeTestimonial)); })
            .catch(() => setTestimonials([]));

          fetch(`${API}/api/equipment`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setEquipment(data.map(normalizeEquipment)); })
            .catch(() => setEquipment([]));

          fetch(`${API}/api/partners`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setPartners(data.map(normalizePartner)); })
            .catch(() => setPartners([]));

          fetch(`${API}/api/projects`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setProjects(data.map(normalizeProject)); })
            .catch(() => setProjects([]));

          fetch(`${API}/api/inquiries`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => {
              if (Array.isArray(data)) {
                setInquiries(data.map(normalizeInquiry));
              } else {
                setInquiries([]);
              }
            })
            .catch(() => {
              setInquiries([]);
            });

          if (storedStatus) setSystemStatus(JSON.parse(storedStatus));

          fetch(`${API}/api/services`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setServices(data.map(normalizeService)); })
            .catch(() => setServices([]));
          
          setIsLoading(false);
          setIsError(false);
        }, 600);
      } catch (err) {
        setIsLoading(false);
        setIsError(true);
        setErrorMsg('Failed to fetch dashboard data. Caching is disabled or localStorage is full.');
      }
    };

    loadData();
  }, []);

  // Save changes helper
  const saveState = useCallback((key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  }, []);

  // Logger helper
  const addSystemLog = useCallback((type: 'info' | 'success' | 'warning' | 'error', message: string, source: string) => {
    const newLog: TSystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      type,
      message,
      source
    };
    setLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 19)]; // limit to 20 logs
      saveState('bp_logs', updated);
      return updated;
    });
  }, [saveState]);

  // Refetch / Synchronize data simulation
  const refetch = useCallback(async () => {
    setIsRefetching(true);
    addSystemLog('info', 'Manual refresh triggered. Querying latest metrics...', 'Dashboard Coordinator');
    setTimeout(() => {
      setIsRefetching(false);
      addSystemLog('success', 'Database synchronization complete. Caching locally.', 'Core System');
    }, 500);
  }, [addSystemLog]);

  // INQUIRIES ACTIONS
  const markInquiryRead = useCallback(async (id: string) => {
    const response = await fetch(`${API}/api/inquiries/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Inquiry update failed');
    const normalized = normalizeInquiry(data);
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? normalized : inq)));
    addSystemLog('info', `Inquiry ${id} viewed and marked as read.`, 'Inquiry Dispatcher');
  }, [addSystemLog]);

  const replyToInquiry = useCallback(async (id: string, replyText: string) => {
    const replyDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const response = await fetch(`${API}/api/inquiries/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'replied', replyText, replyDate }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Inquiry reply failed');
    const normalized = normalizeInquiry(data);
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? normalized : inq)));
    addSystemLog('success', `Reply dispatched successfully to inquiry: ${id}`, 'Email Gateway');
  }, [addSystemLog]);

  const deleteInquiry = useCallback(async (id: string) => {
    const response = await fetch(`${API}/api/inquiries/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Inquiry delete failed');
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    addSystemLog('warning', `Inquiry ${id} permanently discarded.`, 'Inquiry Dispatcher');
  }, [addSystemLog]);

  // SERVICES ACTIONS
  const addService = useCallback(async (serviceData: Omit<TService, 'id'>) => {
    const response = await fetch(`${API}/api/services`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Service creation failed');
    const normalized = normalizeService(data);
    setServices((prev) => {
      const updated = [normalized, ...prev.filter((srv) => srv.slug !== normalized.slug)];
      saveState('bp_services', updated);
      return updated;
    });
    addSystemLog('success', `New Service added: "${normalized.name}"`, 'Services Admin');
  }, [addSystemLog, saveState]);

  const updateServiceStatus = useCallback(async (id: string, status: 'Active' | 'Inactive') => {
    const currentService = services.find((srv) => srv.id === id);
    if (!currentService) return;
    const response = await fetch(`${API}/api/services/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...currentService, status, title: currentService.title || currentService.name }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Service update failed');
    const normalized = normalizeService(data);
    setServices((prev) => {
      const updated = prev.map((srv) => (srv.id === id ? normalized : srv));
      saveState('bp_services', updated);
      return updated;
    });
    addSystemLog('info', `Service ${id} state updated as ${status}.`, 'Services Admin');
  }, [addSystemLog, saveState, services]);

  const updateService = useCallback(async (id: string, serviceData: Partial<TService>) => {
    const payload = { ...serviceData, title: serviceData.title || serviceData.name };
    const response = await fetch(`${API}/api/services/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Service update failed');
    const normalized = normalizeService(data);
    setServices((prev) => {
      const updated = prev.map((srv) => (srv.id === id ? normalized : srv));
      saveState('bp_services', updated);
      return updated;
    });
    addSystemLog('success', `Service updated: "${normalized.name}"`, 'Services Admin');
  }, [addSystemLog, saveState]);

  const deleteService = useCallback(async (id: string) => {
    const response = await fetch(`${API}/api/services/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Delete failed');
    setServices((prev) => {
      const updated = prev.filter((srv) => srv.id !== id);
      saveState('bp_services', updated);
      return updated;
    });
    addSystemLog('warning', `Service ${id} deleted from catalog.`, 'Services Admin');
  }, [addSystemLog, saveState]);

  // PRODUCTS ACTIONS
  const addProduct = useCallback((prodData: Omit<TProduct, 'id' | 'addedDate'>) => {
    return fetch(`${API}/api/products`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodData),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Product creation failed');
        const normalized = normalizeProduct(data);
        setProducts((prev) => [normalized, ...prev]);
        addSystemLog('success', `New battery product registered: "${normalized.name}"`, 'Catalog Manager');
      });
  }, [addSystemLog]);

  const updateProductStock = useCallback((id: string, stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
    return fetch(`${API}/api/products/${id}/stock`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockStatus }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Stock update failed');
        const normalized = normalizeProduct(data);
        setProducts((prev) => prev.map((prod) => (prod.id === id ? normalized : prod)));
        addSystemLog('info', `Product ${id} inventory updated to ${stockStatus}.`, 'Catalog Manager');
      });
  }, [addSystemLog]);

  const deleteProduct = useCallback((id: string) => {
    return fetch(`${API}/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) throw new Error('Delete failed');
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
      addSystemLog('warning', `Product ${id} removed from public active listings.`, 'Catalog Manager');
    });
  }, [addSystemLog]);

  // SETTINGS ACTIONS
  const updateSystemStatusValue = useCallback((serviceKey: 'apiServer' | 'database' | 'cdn', state: 'Operational' | 'Degraded' | 'Offline') => {
    setSystemStatus((prev) => {
      const updated = { ...prev, [serviceKey]: state };
      localStorage.setItem('bp_status', JSON.stringify(updated));
      return updated;
    });
    addSystemLog('warning', `Manual override changed service status of ${serviceKey} to "${state}"`, 'System Administrator');
  }, [addSystemLog]);

  // TEAM ACTIONS
  const addTeamMember = useCallback((name: string, role: string, email: string, status: 'Active' | 'On Leave', image?: string) => {
    return fetch(`${API}/api/team`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role, email, status, image }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Team member creation failed');
        const normalized = normalizeTeam(data);
        setTeam((prev) => [normalized, ...prev]);
        addSystemLog('success', `Team Member registered: "${name}" (${role})`, 'Personnel Directory');
      });
  }, [addSystemLog]);

  const updateTeamMemberStatus = useCallback((id: string, status: 'Active' | 'On Leave') => {
    return fetch(`${API}/api/team/${id}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Team update failed');
        const normalized = normalizeTeam(data);
        setTeam((prev) => prev.map((member) => (member.id === id ? normalized : member)));
        addSystemLog('info', `Personnel status updated for ID ${id} to "${status}"`, 'Personnel Directory');
      });
  }, [addSystemLog]);

  const deleteTeamMember = useCallback((id: string) => {
    return fetch(`${API}/api/team/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) throw new Error('Delete failed');
      setTeam((prev) => prev.filter((member) => member.id !== id));
      addSystemLog('warning', `Team Member ID ${id} deleted from catalog.`, 'Personnel Directory');
    });
  }, [addSystemLog]);

  // TESTIMONIALS ACTIONS — real REST API
  const fetchTestimonials = useCallback(async () => {
    const res = await fetch(`${API}/api/testimonials`, { credentials: 'include' });
    const data = await res.json();
    setTestimonials(data);
  }, []);

  const addTestimonial = useCallback(async (formData: FormData) => {
    const res = await fetch(`${API}/api/testimonials`, { method: 'POST', credentials: 'include', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setTestimonials((prev) => [normalizeTestimonial(data), ...prev]);
    addSystemLog('success', `Testimonial added: "${data.name}" from "${data.company}"`, 'Testimonials Hub');
  }, [addSystemLog]);

  const updateTestimonialStatus = useCallback(async (id: string, status: 'Approved' | 'Pending' | 'Rejected') => {
    const res = await fetch(`${API}/api/testimonials/${id}/status`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setTestimonials((prev) => prev.map((t) => (t._id === id ? normalizeTestimonial(data) : t)));
    addSystemLog('info', `Testimonial ${id} status → "${status}"`, 'Testimonials Hub');
  }, [addSystemLog]);

  const deleteTestimonial = useCallback(async (id: string) => {
    const res = await fetch(`${API}/api/testimonials/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error('Delete failed');
    setTestimonials((prev) => prev.filter((t) => t._id !== id));
    addSystemLog('warning', `Testimonial ID ${id} deleted.`, 'Testimonials Hub');
  }, [addSystemLog]);

  const addEquipment = useCallback(async (item: Omit<TEquipmentItem, 'id' | '_id'>) => {
    const res = await fetch(`${API}/api/equipment`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Equipment creation failed');
    const normalized = normalizeEquipment(data);
    setEquipment((prev) => [normalized, ...prev]);
    addSystemLog('success', `Equipment added: "${normalized.title}"`, 'Equipment Hub');
  }, [addSystemLog]);

  const updateEquipment = useCallback(async (id: string, item: Omit<TEquipmentItem, 'id' | '_id'>) => {
    const res = await fetch(`${API}/api/equipment/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Equipment update failed');
    const normalized = normalizeEquipment(data);
    setEquipment((prev) => prev.map((entry) => (entry.id === id ? normalized : entry)));
    addSystemLog('info', `Equipment updated: "${normalized.title}"`, 'Equipment Hub');
  }, [addSystemLog]);

  const deleteEquipment = useCallback(async (id: string) => {
    const res = await fetch(`${API}/api/equipment/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Equipment delete failed');
    setEquipment((prev) => prev.filter((entry) => entry.id !== id));
    addSystemLog('warning', `Equipment ID ${id} deleted.`, 'Equipment Hub');
  }, [addSystemLog]);

  const addPartner = useCallback(async (item: Omit<TPartnerItem, 'id' | '_id'>) => {
    const res = await fetch(`${API}/api/partners`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Partner creation failed');
    const normalized = normalizePartner(data);
    setPartners((prev) => [normalized, ...prev]);
    addSystemLog('success', `Partner added: "${normalized.name}"`, 'Partners Hub');
  }, [addSystemLog]);

  const updatePartner = useCallback(async (id: string, item: Omit<TPartnerItem, 'id' | '_id'>) => {
    const res = await fetch(`${API}/api/partners/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Partner update failed');
    const normalized = normalizePartner(data);
    setPartners((prev) => prev.map((entry) => (entry.id === id ? normalized : entry)));
    addSystemLog('info', `Partner updated: "${normalized.name}"`, 'Partners Hub');
  }, [addSystemLog]);

  const deletePartner = useCallback(async (id: string) => {
    const res = await fetch(`${API}/api/partners/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Partner delete failed');
    setPartners((prev) => prev.filter((entry) => entry.id !== id));
    addSystemLog('warning', `Partner ID ${id} deleted.`, 'Partners Hub');
  }, [addSystemLog]);

  const addProject = useCallback(async (projectData: Partial<TProject>) => {
    const res = await fetch(`${API}/api/projects`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Project creation failed');
    const normalized = normalizeProject(data);
    setProjects((prev) => [normalized, ...prev]);
    addSystemLog('success', `Project added: "${normalized.title}"`, 'Projects Hub');
  }, [addSystemLog]);

  const updateProject = useCallback(async (id: string, projectData: Partial<TProject>) => {
    const res = await fetch(`${API}/api/projects/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Project update failed');
    const normalized = normalizeProject(data);
    setProjects((prev) => prev.map((p) => (p.id === id ? normalized : p)));
    addSystemLog('info', `Project updated: "${normalized.title}"`, 'Projects Hub');
  }, [addSystemLog]);

  const updateProjectStatus = useCallback(async (id: string, status: 'Active' | 'Inactive') => {
    const current = projects.find((p) => p.id === id);
    if (!current) return;
    const res = await fetch(`${API}/api/projects/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...current, status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Project status update failed');
    const normalized = normalizeProject(data);
    setProjects((prev) => prev.map((p) => (p.id === id ? normalized : p)));
    addSystemLog('info', `Project ${id} status → "${status}"`, 'Projects Hub');
  }, [addSystemLog, projects]);

  const deleteProject = useCallback(async (id: string) => {
    const res = await fetch(`${API}/api/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Project delete failed');
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addSystemLog('warning', `Project ID ${id} deleted.`, 'Projects Hub');
  }, [addSystemLog]);

  return {
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
    
    // Actions
    refetch,
    markInquiryRead,
    replyToInquiry,
    deleteInquiry,
    addService,
    updateServiceStatus,
    updateService,
    deleteService,
    addProduct,
    updateProductStock,
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
    deleteProject,
    fetchTestimonials,
  };
}

