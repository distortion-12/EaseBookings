import {
  SparklesIcon,
  HeartIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

/**
 * A clickable card for a category (e.g., "Salon", "Clinic") on the homepage.
 * Displays a relevant icon next to the category name.
 */
const getCategoryIcon = (name) => {
  const n = (name || '').toLowerCase();
  if (/(salon|saloon|spa|beauty)/.test(n)) return SparklesIcon;
  if (/(clinic|medical|dental|health|doctor)/.test(n)) return HeartIcon;
  if (/(fitness|gym|training|yoga)/.test(n)) return AcademicCapIcon;
  if (/(auto|mechanic|car|repair)/.test(n)) return WrenchScrewdriverIcon;
  if (/(store|shop|retail)/.test(n)) return BuildingStorefrontIcon;
  return ShieldCheckIcon; // default, generic services
};

export default function CategoryCard({ name, description, imageUrl, onClick }) {
  const Icon = getCategoryIcon(name);

  // Map category names to Unsplash banner URLs
  const getBannerUrl = (categoryName) => {
    const cat = (categoryName || '').toLowerCase();
    if (/(salon|saloon|spa|beauty)/.test(cat))
      return 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/d34a4864987187.5ae48c9c9aa47.jpg';
    if (/(clinic|medical|dental|health|doctor)/.test(cat))
      return 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1600&auto=format&fit=crop';
    if (/(consultant|consulting|business)/.test(cat))
      return 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop';
    if (/(tutor|education|learning|course)/.test(cat))
      return 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600&auto=format&fit=crop';
    return imageUrl || 'https://placehold.co/400x300/gray/ffffff?text=Category';
  };

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className="group block bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <img
          className="h-48 w-full object-cover"
          src={getBannerUrl(name)}
          alt={name}
          onError={(e) => { e.target.src = 'https://placehold.co/400x300/gray/ffffff?text=Category'; }}
        />
        <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-800 ring-1 ring-gray-200">
          <Icon className="w-4 h-4 text-indigo-600" />
          <span>Popular</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 inline-flex items-center gap-2">
          <Icon className="w-5 h-5 text-indigo-600" />
          <span>{name}</span>
        </h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </a>
  );
}