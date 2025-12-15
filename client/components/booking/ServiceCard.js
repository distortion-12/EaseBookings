/**
 * A card that displays the details for a single service.
 */
const guessImageForService = (name) => {
  const n = (name || '').toLowerCase();
  if (/(hair|style|cut)/.test(n)) return 'https://images.unsplash.com/photo-1519741491150-1f0d2f7f1f9c?q=80&w=800&auto=format&fit=crop';
  if (/(manicure|pedicure|nail)/.test(n)) return 'https://images.unsplash.com/photo-1519014816548-bf5fe8b4a3f0?q=80&w=800&auto=format&fit=crop';
  if (/(massage|spa)/.test(n)) return 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop';
  if (/(facial|skin)/.test(n)) return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop';
  return 'https://placehold.co/160x120/eeeeee/666666?text=Service';
};

export default function ServiceCard({ service, onBookClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4">
        {/* Service Info */}
        <div className="flex items-start gap-4 flex-1">
          <img
            src={service.imageUrl || guessImageForService(service.name)}
            alt={service.name}
            className="w-24 h-24 rounded-xl object-cover ring-1 ring-gray-200 hidden sm:block"
            onError={(e) => { e.target.src = 'https://placehold.co/160x120/eeeeee/666666?text=Service'; }}
          />
          <div className="mb-4 sm:mb-0">
            <h3 className="text-xl font-semibold text-gray-900">
              {service.name}
            </h3>
            <p className="text-gray-600 mt-1 max-w-md">
              {service.description}
            </p>
          </div>
        </div>
        
        {/* Price and Duration */}
        <div className="flex items-center space-x-6 mb-4 sm:mb-0">
          <span className="text-lg font-semibold text-gray-800">
            ${service.price}
          </span>
          <span className="text-gray-500">{service.duration} min</span>
        </div>
        
        {/* Book Button */}
        <button
          onClick={onBookClick}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}