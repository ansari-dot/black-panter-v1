import {
  AlertCircle,
  Battery,
  Cog,
  Droplets,
  MapPin,
  RefreshCw,
  Recycle,
  Server,
  Settings,
  Shield,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ICON_MAP = {
  battery: Battery,
  settings: Settings,
  recycle: Recycle,
  server: Server,
  alertcircle: AlertCircle,
  alert: AlertCircle,
  refresh: RefreshCw,
  refreshcw: RefreshCw,
  mappin: MapPin,
  droplet: Droplets,
  droplets: Droplets,
  wrench: Wrench,
  zap: Zap,
  shield: Shield,
  sparkles: Sparkles,
  cog: Cog,
};

const slugify = (value = '') => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

const titleCase = (value = '') => value
  .replace(/[-_]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .split(' ')
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const resolveImageUrl = (value = '') => {
  if (!value) return '';
  if (value.startsWith('/uploads/')) return `${API}${value}`;
  if (value.startsWith('uploads/')) return `${API}/${value}`;
  return value;
};

const splitHeroTitle = (title = '') => {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length <= 2) {
    return {
      line1: { white: `${title} `, orange: '' },
      line2: { white: '', orange: '' },
    };
  }

  const midpoint = Math.ceil(words.length / 2);
  return {
    line1: { white: `${words.slice(0, midpoint - 1).join(' ')} `, orange: words[midpoint - 1] || '' },
    line2: { white: `${words.slice(midpoint, words.length - 1).join(' ')} `, orange: words[words.length - 1] || '' },
  };
};

const buildProcedures = (service) => {
  if (Array.isArray(service?.technicalProcedures) && service.technicalProcedures.length > 0) {
    return service.technicalProcedures;
  }

  return [];
};

const buildHighlights = (service) => {
  if (Array.isArray(service?.keyHighlights) && service.keyHighlights.length > 0) {
    return service.keyHighlights;
  }

  return [];
};

const buildGallery = (service) => {
  if (Array.isArray(service?.gallery) && service.gallery.length > 0) {
    return service.gallery.map(resolveImageUrl);
  }
  return [];
};

const buildServiceCards = (catalog, activeSlug) =>
  catalog
    .filter((service) => service.status !== 'Inactive')
    .map((service) => ({
      name: service.title,
      slug: service.slug,
      active: service.slug === activeSlug,
    }));

const getIconComponent = (iconName = '', title = '') => {
  const normalizedIcon = iconName.toLowerCase().replace(/[\s-]/g, '');
  if (ICON_MAP[normalizedIcon]) return ICON_MAP[normalizedIcon];

  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes('recycle')) return Recycle;
  if (normalizedTitle.includes('emergency')) return AlertCircle;
  if (normalizedTitle.includes('field')) return MapPin;
  if (normalizedTitle.includes('clean')) return Droplets;
  if (normalizedTitle.includes('maintenance')) return Settings;
  if (normalizedTitle.includes('testing')) return Zap;
  if (normalizedTitle.includes('conditioning')) return Cog;
  if (normalizedTitle.includes('support')) return Server;
  if (normalizedTitle.includes('reconditioning')) return RefreshCw;
  if (normalizedTitle.includes('work')) return Wrench;
  return Battery;
};

const normalizeServiceRecord = (service, catalog = []) => {
  const title = service.title || service.name || '';
  const slug = service.slug || slugify(title);
  const description = service.description || service.heroDescription || '';
  const heroDescription = service.heroDescription || description;
  const heroTitle = service.heroTitle || splitHeroTitle(title);
  const keyHighlights = buildHighlights(service);
  const technicalProcedures = buildProcedures(service);
  const gallery = buildGallery(service);
  const services = buildServiceCards(catalog.filter(Boolean), slug);
  const imageUrl = resolveImageUrl(service.imageUrl || '');
  const detailImageUrl = resolveImageUrl(service.detailImageUrl || service.imageUrl || '');

  return {
    id: service._id || service.id || slug,
    title,
    slug,
    description,
    status: service.status || 'Active',
    iconName: service.iconName || service.icon || 'battery',
    heroBadge: service.heroBadge || title || 'Service Detail',
    heroTitle,
    heroDescription,
    criticalPowerTitle: service.criticalPowerTitle || title,
    criticalPowerDescription: service.criticalPowerDescription || description,
    keyHighlights,
    services,
    technicalProcedures,
    gallery,
    emergencyTitle: service.emergencyTitle || '',
    emergencyDescription: service.emergencyDescription || '',
    certificationTitle: service.certificationTitle || '',
    certificationDescription: service.certificationDescription || '',
    imageUrl,
    detailImageUrl,
    displayOrder: service.displayOrder || 0,
  };
};

export const normalizeServiceCatalog = (records = []) => {
  const normalizedRecords = records.map((record) => normalizeServiceRecord(record, records));

  return normalizedRecords.sort((left, right) => {
    const orderDifference = (left.displayOrder || 0) - (right.displayOrder || 0);
    if (orderDifference !== 0) return orderDifference;
    return left.title.localeCompare(right.title);
  });
};

export const getServiceCardIcon = (iconName, title) => getIconComponent(iconName, title);

export const buildServiceDetail = (service, catalog = []) => normalizeServiceRecord(service, catalog);

export { API, slugify, titleCase };
