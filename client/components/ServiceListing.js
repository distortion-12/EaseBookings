/*
 * This component renders a list of available services with filtering and pagination capabilities.
 * It fetches service data from the API, allows users to filter by category and location, and displays the results in a grid.
 */

import { useState, useEffect } from 'react';
import ServiceCard from '@/components/booking/ServiceCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const ITEMS_PER_PAGE = 6;

export default function ServiceListing({ searchFilter }) {
    
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for dynamic filter options derived from fetched data.
    const [serviceCategories, setServiceCategories] = useState([]);
    const [serviceLocations, setServiceLocations] = useState([]);

    // Fetches all available services on component mount.
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const res = await axios.get(`${API_URL}/public/services`);
                
                let fetchedServices = [];
                if (res.data.success) {
                    fetchedServices = res.data.data;
                }

                // Always append dummy data for demonstration purposes
                const dummyServices = [
                    {
                        _id: 'dummy-1',
                        name: 'Relaxing Massage (Demo)',
                        description: 'A 60-minute full body massage to relieve stress.',
                        price: 80,
                        duration: 60,
                        business: {
                            _id: 'dummy-biz-1',
                            businessName: 'Zen Spa',
                            businessType: 'Spa',
                            bookingPageSlug: 'zen-spa-demo',
                            address: { city: 'New York' }
                        }
                    },
                    {
                        _id: 'dummy-2',
                        name: 'Haircut & Style (Demo)',
                        description: 'Professional haircut and styling session.',
                        price: 50,
                        duration: 45,
                        business: {
                            _id: 'dummy-biz-2',
                            businessName: 'Style Studio',
                            businessType: 'Salon',
                            bookingPageSlug: 'style-studio-demo',
                            address: { city: 'Los Angeles' }
                        }
                    },
                    {
                        _id: 'dummy-3',
                        name: 'Dental Checkup (Demo)',
                        description: 'Comprehensive dental exam and cleaning.',
                        price: 120,
                        duration: 30,
                        business: {
                            _id: 'dummy-biz-3',
                            businessName: 'Bright Smiles',
                            businessType: 'Clinic',
                            bookingPageSlug: 'bright-smiles-demo',
                            address: { city: 'Chicago' }
                        }
                    }
                ];

                const allServices = [...fetchedServices, ...dummyServices];
                setServices(allServices);
                
                // Extract unique categories (business types) and locations (cities) for filter lists.
                const categories = [...new Set(allServices.map(s => s.business?.businessType).filter(Boolean))];
                const locations = [...new Set(allServices.map(s => s.business?.address?.city).filter(Boolean))];
                
                setServiceCategories(categories);
                setServiceLocations(locations);

            } catch (error) {
                console.error('Error fetching services:', error);
                // Fallback on error
                 const dummyServices = [
                        {
                            _id: 'dummy-1',
                            name: 'Relaxing Massage (Demo)',
                            description: 'A 60-minute full body massage to relieve stress.',
                            price: 80,
                            duration: 60,
                            business: {
                                _id: 'dummy-biz-1',
                                businessName: 'Zen Spa',
                                businessType: 'Spa',
                                bookingPageSlug: 'zen-spa-demo',
                                address: { city: 'New York' }
                            }
                        },
                        {
                            _id: 'dummy-2',
                            name: 'Haircut & Style (Demo)',
                            description: 'Professional haircut and styling session.',
                            price: 50,
                            duration: 45,
                            business: {
                                _id: 'dummy-biz-2',
                                businessName: 'Style Studio',
                                businessType: 'Salon',
                                bookingPageSlug: 'style-studio-demo',
                                address: { city: 'Los Angeles' }
                            }
                        }
                    ];
                    setServices(dummyServices);
                    setServiceCategories(['Spa', 'Salon']);
                    setServiceLocations(['New York', 'Los Angeles']);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Toggles the selection of a category filter.
    const handleCategoryChange = (category) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    // Toggles the selection of a location filter.
    const handleLocationChange = (location) => {
        setSelectedLocations(
            prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        );
    };

    // Applies filters to the service list whenever filter criteria or data changes.
    useEffect(() => {
        if (loading) return;

        const matchesCategory = service => selectedCategories.length === 0 || selectedCategories.includes(service.business?.businessType);
        const matchesLocation = service => selectedLocations.length === 0 || selectedLocations.includes(service.business?.address?.city);
        const matchesTitle = service => searchFilter.title === "" || service.name.toLowerCase().includes(searchFilter.title.toLowerCase());
        const matchesSearchLocation = service => searchFilter.location === "" || (service.business?.address?.city || '').toLowerCase().includes(searchFilter.location.toLowerCase());

        const newFilteredServices = services.filter(
            service => matchesCategory(service) && matchesLocation(service) && matchesTitle(service) && matchesSearchLocation(service)
        );

        setFilteredServices(newFilteredServices);
        setCurrentPage(1); 
    }, [selectedCategories, selectedLocations, searchFilter, services, loading]);

    // Pagination logic.
    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    const paginatedServices = filteredServices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    
    // Determine if any search filters are currently active.
    const isSearched = searchFilter.title !== "" || searchFilter.location !== "";

    if (loading) {
        return <div className="text-center py-10">Loading services...</div>;
    }

    return (
        <div className='flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
            {/* Sidebar containing filter options */}
            <div className='w-full lg:w-1/4 bg-white px-4'>
                
                {/* Display active search filters */}
                {
                    isSearched && (
                        <>
                            <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                            <div className='mb-4 text-gray-600'>
                                {searchFilter.title && (
                                    <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                        {searchFilter.title}
                                        <XMarkIcon className='cursor-pointer w-4 h-4' onClick={() => {}} /> 
                                    </span>
                                )}
                                {searchFilter.location && (
                                    <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                        {searchFilter.location}
                                        <XMarkIcon className='cursor-pointer w-4 h-4' onClick={() => {}} />
                                    </span>
                                )}
                            </div>
                        </>
                    )
                }

                <button onClick={e => setShowFilters(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
                    {showFilters ? "Close" : "Filters"}
                </button>

                {/* Category Filter Section */}
                <div className={showFilters ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>Filter by Category</h4>
                    <ul className='space-y-2 text-gray-600'>
                        {serviceCategories.map((category, index) => (
                                <li className='flex gap-3 items-center' key={index}>
                                    <input 
                                        className='scale-125' 
                                        type='checkbox'
                                        onChange={() => handleCategoryChange(category)}
                                        checked = {selectedCategories.includes(category)}
                                    />
                                    {category}
                                </li>
                            ))}
                        {serviceCategories.length === 0 && <li>No categories found</li>}
                    </ul>
                </div>

                {/* Location Filter Section */}
                <div className={showFilters ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4 pt-14'>Filter by City</h4>
                    <ul className='space-y-2 text-gray-600'>
                        {serviceLocations.map((location, index) => (
                                <li className='flex gap-3 items-center' key={index}>
                                    <input className='scale-125' 
                                           type='checkbox'
                                           onChange={() => handleLocationChange(location)}
                                           checked = {selectedLocations.includes(location)} 
                                    />
                                    {location}
                                </li>
                            ))}
                        {serviceLocations.length === 0 && <li>No locations found</li>}
                    </ul>
                </div>
            </div>

            {/* Main content area displaying service cards */}
            <section className='w-full lg:w-3/4 text-gray-800 max:lg:px-4'>
                <h3 className='font-medium text-3xl py-2' id='service-list'>Available Services</h3>
                <p className='mb-8'>Book your desired service from top providers</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                        {paginatedServices.map((service, index) => (
                            <ServiceCard 
                                key={index} 
                                service={service} 
                                businessSlug={service.business?.bookingPageSlug} 
                            />
                        ))}
                        {paginatedServices.length === 0 && <p>No services found matching your criteria.</p>}
                </div>

                {/* Pagination Controls */}
                {filteredServices.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                        <a href="#service-list">
                            <ChevronLeftIcon onClick={prevPage} className="w-6 h-6 text-gray-500 hover:text-blue-500" />
                        </a>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <a key={index} href="#service-list">
                                <button onClick={() => setCurrentPage(index + 1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>{index + 1}</button>
                            </a>
                        ))}
                        <a href="#service-list">
                            <ChevronRightIcon onClick={nextPage} className="w-6 h-6 text-gray-500 hover:text-blue-500" />
                        </a>
                    </div>
                )}
            </section>
        </div>
    );
}