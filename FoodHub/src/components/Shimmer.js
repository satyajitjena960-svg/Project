import React from 'react'

const Shimmer = () => {
  // Array of 8 items to easily map out identical placeholder cards
  const placeholderCards = Array(8).fill(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Matches the grid layout of your restaurant cards container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {placeholderCards.map((_, index) => (
          <div 
            key={index} 
            className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3 animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="w-full aspect-video bg-gray-200 rounded-lg" />
            
            {/* Title / Name Placeholder */}
            <div className="h-5 bg-gray-200 rounded w-3/4 mt-2" />
            
            {/* Subtitle / Cuisine Placeholder */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Bottom Info (Rating/Time) Placeholder */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Shimmer