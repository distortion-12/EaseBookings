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
    <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 text-white min-h-[320px] flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute -top-24 -left-24 opacity-20" width="400" height="400" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="200" fill="url(#grad)" />
          <defs>
            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative z-10 text-center w-full max-w-5xl px-4">
        <span className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-white/10 ring-1 ring-white/20 text-sm">
          New: Instant booking across top local businesses
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Effortless booking, managed.
        </h1>
        <p className="text-base sm:text-lg text-white/90 mb-6">Find services and businesses near you.</p>
        
        {/* New Search Form */}
        <form
          onSubmit={onSearch}
          className="w-full bg-white/95 backdrop-blur rounded-2xl shadow-xl p-3 flex flex-col sm:flex-row gap-2"
        >
          {/* City Input */}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city..."
            required
            className="w-full sm:w-1/3 p-3 border-gray-200 border sm:border-r rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            list="demo-cities"
          />
          <datalist id="demo-cities">
            <option value="New York" />
            <option value="San Francisco" />
            <option value="Chicago" />
            <option value="Los Angeles" />
            <option value="Seattle" />
          </datalist>
          
          {/* Area/Service Input */}
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Search for area, locality, or service..."
            required
            className="w-full sm:flex-1 p-3 border-gray-200 border sm:border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
          >
            Search
          </button>
        </form>
        <p className="mt-3 text-xs sm:text-sm text-white/80">Popular: Spa, Hair Salon, Fitness, Dental, Auto Care</p>
      </div>
    </header>
  );
}