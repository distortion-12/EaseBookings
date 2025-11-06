/**
 * The main "hero" banner on the Platform Homepage.
 */
export default function HeroSection({
  city,
  setCity,
  area,
  setArea,
  onSearch,
}) {
  return (
    <header className="relative bg-gray-800 text-white h-[250px] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://placehold.co/1200x250/334155/e2e8f0?text=Professional+Service')",
        }}
      ></div>
      <div className="relative z-10 text-center w-full max-w-4xl px-4">
        <h1 className="text-4xl font-extrabold mb-3">
          Effortless booking, managed.
        </h1>
        <p className="text-lg mb-6">Find services and businesses near you.</p>
        
        {/* New Search Form */}
        <form
          onSubmit={onSearch}
          className="w-full bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2"
        >
          {/* City Input */}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city..."
            required
            className="w-full sm:w-1/3 p-3 border-gray-200 border sm:border-r rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Area/Service Input */}
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Search for area, locality, or service..."
            required
            className="w-full sm:flex-1 p-3 border-gray-200 border sm:border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}