/*
 * This component renders a clickable card representing a service category.
 * It displays an image, title, and description for the category.
 */

// Component to display a category card with image and description.
export default function CategoryCard({ name, description, imageUrl, onClick }) {
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <img
        className="h-48 w-full object-cover"
        src={imageUrl}
        alt={name}
        onError={(e) => { e.target.src = 'https://placehold.co/400x300/gray/ffffff?text=Image'; }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </a>
  );
}