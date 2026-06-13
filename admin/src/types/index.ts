/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Replied';
  replyText?: string;
  replyDate?: string;
}

export interface TService {
  id: string;
  name: string;
  title?: string;
  slug: string;
  status: 'Active' | 'Inactive';
  description: string;
  category?: string;
  iconName: string;
  serviceTagline?: string;
  heroDescription?: string;
  imageUrl?: string;
  detailImageUrl?: string;
  ctaText?: string;
  secondaryText?: string;
  keyHighlights?: string[];
  technicalProcedures?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  gallery?: string[];
  displayOrder?: number;
}

export interface TProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  capacity: string;
  voltage: string;
  warrantyMonths: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  addedDate: string;
  image?: string;
}

export interface TSystemStatus {
  apiServer: 'Operational' | 'Degraded' | 'Offline';
  database: 'Operational' | 'Degraded' | 'Offline';
  cdn: 'Operational' | 'Degraded' | 'Offline';
  lastDeploy: string;
}

export interface TDashboardStats {
  newInquiriesCount: number;
  activeServicesCount: number;
  productsCount: number;
  siteVisitsCount: number;
  inquiriesTrend: string;
  servicesTrend: string;
  productsTrend: string;
  visitsTrend: string;
}

export interface TSystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  source: string;
}

export interface TTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  joinedDate: string;
  image?: string;
  linkedin?: string;
}

export interface TTestimonial {
  _id: string;
  name: string;
  company: string;
  rating: number;
  message: string;
  image?: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  createdAt: string;
}

export interface TEquipmentItem {
  _id?: string;
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface TPartnerItem {
  _id?: string;
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  displayOrder?: number;
}

export interface TProject {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  category?: string;
  status: 'Active' | 'Inactive';
  imageUrl?: string;
  heroTag?: string;
  heroTitleLine1White?: string;
  heroTitleLine1Orange?: string;
  heroTitleLine2White?: string;
  heroTitleLine2Orange?: string;
  gallery?: string[];
  highlights?: string[];
  metrics?: Array<{ label: string; value: string }>;
  process?: string[];
  clientName?: string;
  location?: string;
  sector?: string;
  completedDate?: string;
  timeline?: string;
  unitsInstalled?: string;
  uptime?: string;
  displayOrder?: number;
}

export type TTab = 'dashboard' | 'services' | 'products' | 'inquiries' | 'team' | 'testimonials' | 'settings' | 'partners' | 'projects';
