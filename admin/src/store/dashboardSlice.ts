import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  TInquiry, TService, TProduct, TSystemLog, TSystemStatus, TTeamMember, 
  TTestimonial, TEquipmentItem, TPartnerItem, TProject, TWarehouse, 
  TCategory, TQuotation, TStockMovement 
} from '../types';
import api from '../utils/api';

export interface DashboardState {
  inquiries: TInquiry[];
  services: TService[];
  products: TProduct[];
  team: TTeamMember[];
  testimonials: TTestimonial[];
  equipment: TEquipmentItem[];
  partners: TPartnerItem[];
  projects: TProject[];
  movements: TStockMovement[];
  warehouses: TWarehouse[];
  categories: TCategory[];
  quotations: TQuotation[];
  logs: TSystemLog[];
  systemStatus: TSystemStatus;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string;
  isRefetching: boolean;
}

const initialStatus: TSystemStatus = {
  apiServer: 'Operational',
  database: 'Operational',
  cdn: 'Operational',
  lastDeploy: 'Just now',
};

const initialState: DashboardState = {
  inquiries: [],
  services: [],
  products: [],
  team: [],
  testimonials: [],
  equipment: [],
  partners: [],
  projects: [],
  movements: [],
  warehouses: [],
  categories: [],
  quotations: [],
  logs: [],
  systemStatus: initialStatus,
  isLoading: true,
  isError: false,
  errorMsg: '',
  isRefetching: false,
};

// Async Thunk to fetch all platform data cleanly via api.ts
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [
        productsRes,
        servicesRes,
        teamRes,
        testimonialsRes,
        equipmentRes,
        partnersRes,
        projectsRes,
        movementsRes,
        warehousesRes,
        categoriesRes,
        inquiriesRes,
        quotationsRes,
        settingsRes,
      ] = await Promise.allSettled([
        api.get<any[]>('/api/products'),
        api.get<any[]>('/api/services'),
        api.get<any[]>('/api/team'),
        api.get<any[]>('/api/testimonials'),
        api.get<any[]>('/api/equipment'),
        api.get<any[]>('/api/partners'),
        api.get<any[]>('/api/projects'),
        api.get<any[]>('/api/inventory/movements'),
        api.get<any[]>('/api/warehouses'),
        api.get<any[]>('/api/categories'),
        api.get<any[]>('/api/inquiries'),
        api.get<any[]>('/api/quotations'),
        api.get<any>('/api/settings'),
      ]);

      const normalize = (res: PromiseSettledResult<any[]>) => 
        res.status === 'fulfilled' && Array.isArray(res.value) ? res.value : [];

      return {
        products: normalize(productsRes).map((p: any) => ({ ...p, id: p._id || p.id })),
        services: normalize(servicesRes).map((s: any) => ({ ...s, id: s._id || s.id, name: s.title || s.name })),
        team: normalize(teamRes).map((t: any) => ({ ...t, id: t._id || t.id })),
        testimonials: normalize(testimonialsRes).map((t: any) => ({ ...t, id: t._id || t.id })),
        equipment: normalize(equipmentRes).map((e: any) => ({ ...e, id: e._id || e.id })),
        partners: normalize(partnersRes).map((p: any) => ({ ...p, id: p._id || p.id })),
        projects: normalize(projectsRes).map((p: any) => ({ ...p, id: p._id || p.id })),
        movements: normalize(movementsRes),
        warehouses: normalize(warehousesRes).map((w: any) => ({ ...w, id: w._id || w.id })),
        categories: normalize(categoriesRes).map((c: any) => ({ ...c, id: c._id || c.id })),
        inquiries: normalize(inquiriesRes).map((i: any) => ({ ...i, id: i._id || i.id })),
        quotations: normalize(quotationsRes).map((q: any) => ({ ...q, id: q._id || q.id })),
        settings: settingsRes.status === 'fulfilled' ? settingsRes.value : null,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSystemStatus: (state, action: PayloadAction<TSystemStatus>) => {
      state.systemStatus = action.payload;
    },
    addLog: (state, action: PayloadAction<TSystemLog>) => {
      state.logs = [action.payload, ...state.logs.slice(0, 19)];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.products = action.payload.products;
        state.services = action.payload.services;
        state.team = action.payload.team;
        state.testimonials = action.payload.testimonials;
        state.equipment = action.payload.equipment;
        state.partners = action.payload.partners;
        state.projects = action.payload.projects;
        state.movements = action.payload.movements;
        state.warehouses = action.payload.warehouses;
        state.categories = action.payload.categories;
        state.inquiries = action.payload.inquiries;
        state.quotations = action.payload.quotations;
        if (action.payload.settings?.systemStatus) {
          state.systemStatus = { ...state.systemStatus, ...action.payload.settings.systemStatus };
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = (action.payload as string) || 'Initialization failed';
      });
  },
});

export const { setSystemStatus, addLog } = dashboardSlice.actions;
export default dashboardSlice.reducer;
