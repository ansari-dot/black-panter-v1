import { serviceDetailData } from "./serviceDetailData";

const whatsappMessage = (title) =>
  `Hello, I would like to buy the ${title}. Please share the details.`;

export const productData = serviceDetailData.map((service) => ({
  id: service.id,
  slug: service.slug,
  title: service.title,
  displayTitle:
    service.id === 1
      ? "Ni-Cd & Block Nickel"
      : service.title,
  category: service.id <= 4 ? "Core Services" : service.id <= 8 ? "Field Support" : "Industrial Solutions",
  subtitle: service.heroDescription,
  description: service.criticalPowerDescription,
  imageUrl: service.imageUrl,
  highlights: service.keyHighlights,
  price: `$${(84.45 + service.id * 3.5).toFixed(2)}`,
  oldPrice: `$${(100 + service.id * 5).toFixed(2)}`,
  saleLabel: `${10 + (service.id % 4) * 5}%`,
  whatsappMessage: whatsappMessage(service.title),
}));
