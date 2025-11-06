/**
 * A card that displays the details for a single service.
 */
export default function ServiceCard({ service, onBookClick }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between p-6">
        {/* Service Info */}
        <div className="mb-4 sm:mb-0">
          <h3 className="text-xl font-semibold text-gray-900">
            {service.name}
          </h3>
          <p className="text-gray-600 mt-1 max-w-md">
            {service.description}
          </p>
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
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}