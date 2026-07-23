import { z } from 'zod';

export const registerSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const productSchema = z.object({
  name:           z.string().min(2),
  slug:           z.string().min(2),
  displayTitle:   z.string().optional().default(''),
  category:       z.string().min(2),
  sku:            z.string().optional().default(''),
  subtitle:       z.string().optional().default(''),
  description:    z.string().min(5),
  price:          z.coerce.number().min(0),
  oldPrice:       z.union([z.coerce.number().min(0), z.null()]).optional(),
  saleLabel:      z.string().optional(),
  imageUrl:       z.string().optional(),
  gallery:        z.array(z.string()).optional(),
  highlights:     z.array(z.string()).optional(),
  technicalProcedures: z.array(z.object({
    title:       z.string().min(2),
    description: z.string().min(2),
    icon:        z.string().optional(),
  })).optional(),
  capacity:       z.string().optional(),
  voltage:        z.string().optional(),
  cycleLife:      z.string().optional(),
  chemistrType:   z.string().optional(),
  ipRating:       z.string().optional(),
  dimensions:     z.string().optional(),
  weight:         z.string().optional(),
  operatingTemp:  z.string().optional(),
  warrantyMonths: z.coerce.number().int().min(0).optional(),
  shipping:       z.string().optional(),
  stockStatus:    z.enum(['In Stock', 'Low Stock', 'Out of Stock']).optional(),
  rating:         z.coerce.number().min(0).max(5).optional(),
  reviewCount:    z.coerce.number().int().min(0).optional(),
  certifications: z.array(z.string()).optional(),
  whatsappMessage: z.string().optional(),
  displayOrder:   z.coerce.number().optional(),
  status:         z.enum(['Active', 'Inactive']).optional(),
});

export const serviceSchema = z.object({
  title:       z.string().min(2),
  slug:        z.string().min(2),
  description: z.string().min(5),
  category:    z.string().optional(),
  status:      z.enum(['Active', 'Inactive']).optional(),
  iconName:    z.string().optional(),
  serviceTagline: z.string().optional(),
  heroDescription: z.string().optional(),
  imageUrl:    z.string().optional(),
  detailImageUrl: z.string().optional(),
  ctaText:     z.string().optional(),
  secondaryText: z.string().optional(),
  keyHighlights: z.array(z.string().min(2)).optional(),
  technicalProcedures: z.array(z.object({
    title: z.string().min(2),
    description: z.string().min(2),
    icon: z.string().min(2),
  })).optional(),
  gallery: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
});

export const teamSchema = z.object({
  name:       z.string().min(2),
  role:       z.string().min(2),
  email:      z.string().email(),
  status:     z.enum(['Active', 'On Leave']).optional(),
  image:      z.string().optional(),
  linkedin:   z.string().url().optional(),
  joinedDate: z.string().optional(),
});


export const testimonialStatusSchema = z.object({
  status: z.enum(['Approved', 'Pending', 'Rejected']),
});

export const inquirySchema = z.object({
  name:    z.string().min(2),
  company: z.string().optional(),
  email:   z.union([z.string().email(), z.literal('')]).optional(),
  phone:   z.string().optional(),
  service: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
  type:    z.enum(['inquiry', 'quote']).optional(),
  quoteDetails: z.object({
    batteryType:  z.string().optional(),
    quantity:     z.string().optional(),
    location:     z.string().optional(),
    urgency:      z.string().optional(),
    sourcePage:   z.string().optional(),
    sourceButton: z.string().optional(),
    submittedAt:  z.string().optional(),
  }).optional(),
});
