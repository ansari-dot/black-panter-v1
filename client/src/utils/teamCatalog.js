import { resolveImageUrl as resolveUrl } from './api';

export const normalizeTeamMember = (member) => ({
  id: member._id || member.id || '',
  name: member.name || 'Team Member',
  role: member.role || member.title || '',
  image: resolveUrl(member.image || member.imageUrl || ''),
  bio: member.bio || '',
  displayOrder: member.displayOrder || 0,
  status: member.status || 'Active',
});

export const normalizeTeamCatalog = (records = []) =>
  records
    .map(normalizeTeamMember)
    .sort((a, b) => {
      const diff = (a.displayOrder || 0) - (b.displayOrder || 0);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
