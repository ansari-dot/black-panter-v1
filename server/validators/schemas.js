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
  category:       z.string().min(2),
  description:    z.string().min(5),
  capacity:       z.string().min(1),
  voltage:        z.string().min(1),
  warrantyMonths: z.number().int().positive(),
  stockStatus:    z.enum(['In Stock', 'Low Stock', 'Out of Stock']).optional(),
  image:          z.string().optional(),
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

export const testimonialSchema = z.object({
  name:    z.string().min(2),
  company: z.string().min(2),
  message: z.string().min(5),
  rating:  z.number().min(1).max(5),
  image:   z.string().optional(),
  status:  z.enum(['Approved', 'Pending', 'Rejected']).optional(),
});

export const testimonialStatusSchema = z.object({
  status: z.enum(['Approved', 'Pending', 'Rejected']),
});

export const inquirySchema = z.object({
  name:    z.string().min(2),
  company: z.string().optional(),
  email:   z.string().email(),
  phone:   z.string().optional(),
  service: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});
