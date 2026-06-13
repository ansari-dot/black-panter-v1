import BaseController from '../base/BaseController.js';
import BaseRepository from '../base/BaseRepository.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Team from '../models/Team.js';
import Testimonial from '../models/Testimonial.js';
import Inquiry from '../models/Inquiry.js';

export const pageContentModules = [
  { name: 'products', model: Product },
  { name: 'services', model: Service },
  { name: 'team', model: Team },
  { name: 'testimonials', model: Testimonial },
  { name: 'inquiries', model: Inquiry },
];

export const createController = (model) => new BaseController(new BaseRepository(model));
