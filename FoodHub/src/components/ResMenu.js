import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

// --- CHILD ACCORDION COMPONENT ---
const MenuCategory = ({ categoryData, showItems, setShowIndex }) => {
  const itemCards = categoryData?.itemCards || [];

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-xl my-4 overflow-hidden">
      {/* Accordion Header */}
      <div 
        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors select-none"
        onClick={setShowIndex}
      >
        <span className="font-bold text-lg text-gray-800">
          {categoryData.title} ({itemCards.length})
        </span>
        <span className="text-gray-500 transform transition-transform duration-200">
          {showItems ? "▲" : "▼"}
        </span>
      </div>

      {/* Accordion Body (Items List) */}
      {showItems && (
        <div className="divide-y divide-gray-100 px-4">
          {itemCards.map((menu) => (
            <div key={menu.card.info.id} className="flex justify-between items-center gap-6 py-4 group">
              <p className="text-gray-800 font-medium text-base sm:text-lg flex flex-col gap-1">
                <span className="group-hover:text-blue-600 transition-colors">{menu.card.info.name}</span>
                <span className="text-gray-900 font-semibold text-sm">
                  {/* Handle both price and defaultPrice scenarios */}
                  ₹{(menu.card.info.price || menu.card.info.defaultPrice) / 100}
                </span>
              </p>
              {menu.card.info.imageId && (
                <img 
                  src={"https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/" + menu.card.info.imageId} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm"
                  alt={menu.card.info.name}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN PARENT COMPONENT ---
const ResMenu = () => {
  const [categories, setCategories] = useState([]);
  const [resData, setResData] = useState({});
  const [showIndex, setShowIndex] = useState(0); // Index 0 means the first category is open by default

  const { resId } = useParams();
  
  const Menu_URL = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=13.0035068&lng=77.5890953&restaurantId=${resId}`;
  
  async function fetchRestaurantMenu() {
    try {
      const data = await fetch(Menu_URL);
      const json = await data.json();

      // Find the specific object containing the full restaurant info dynamically
      const infoCard = json?.data?.cards?.find(x => x?.card?.card?.info)?.card?.card?.info;
      if (infoCard) setResData(infoCard);

      // Find the group containing categories dynamically
      const groupedCard = json?.data?.cards?.find(x => x?.groupedCard)?.groupedCard;
      
      // Filter for items that explicitly hold ItemCategory details (Recommended Swiggy API Parsing)
      const filteredCategories = groupedCard?.cardGroupMap?.REGULAR?.cards?.filter(
        (c) => c?.card?.card?.["@type"] === "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
      ) || [];

      setCategories(filteredCategories);
    } catch (error) {
      console.error("Error fetching restaurant menu:", error);
    }
  }

  useEffect(() => {
    fetchRestaurantMenu();
  }, [resId]);
  
  if (categories.length === 0) return <div className="text-center mt-20 font-medium text-gray-500">Loading Menu...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{resData?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{resData?.cuisines?.join(", ")}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 flex items-center justify-center shadow-sm">
          <span className="text-green-700 font-bold text-base flex items-center gap-1">⭐ Ratings: {resData?.avgRatingString}</span>
        </div>
      </div>
      
      {/* Accordion Categories Container */}
      <div className="space-y-4">
        {categories.map((category, index) => (
          <MenuCategory 
            key={category?.card?.card?.title} 
            categoryData={category?.card?.card}
            showItems={index === showIndex}
            setShowIndex={() => setShowIndex(index === showIndex ? null : index)} // Toggles open/close
          />
        ))}
      </div>
    </div>
  );
};

export default ResMenu;