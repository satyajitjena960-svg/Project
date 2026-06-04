import React, { useEffect, useState } from "react";
import ResCard, { WithVegOnly } from "./ResCard";
import { SWIGGY_RES_API } from "../utils/constants";
import Shimmer from "./Shimmer";
import { Link } from "react-router";
import { useOnlineStatus } from "../utils/useOnlineStatus";
import { WithVegOnly } from "./ResCard";

const Body = () => {
  const [resData, setResData] = useState(null);
  const copyOfResData = resData;

  async function fetchRestaurent() {
    const data = await fetch(SWIGGY_RES_API);
    const resDataFromAPI = await data.json();
    console.log(resDataFromAPI);

    setResData(
      resDataFromAPI.data.cards[1].card.card.gridElements.infoWithStyle
        .restaurants,
    );
    console.log(resData);
  }

  useEffect(() => {
    fetchRestaurent();
  }, []);

  function topRes() {
    const a = copyOfResData.filter((res) => {
      return res.info.avgRating > 4.5;
    });
    setResData(a);
  }

  function searchText(e) {
    const a = copyOfResData.filter((res) => {
      const name = res.info.name.toLowerCase();
      return name.includes(e.target.value.toLowerCase());
    });
    setResData(a);
  }

  const isOnline = useOnlineStatus();

  if (isOnline === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          🔴 You are offline
        </h1>
        <p className="text-gray-500 mt-2">
          Please check your internet connection and try again.
        </p>
      </div>
    );
  }

  if (resData == null) {
    return <Shimmer />;
  }
  const RestaurentVeg = WithVegOnly(ResCard);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            onChange={searchText}
            placeholder="Search restaurants..."
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all text-sm"
          />
          <button
            onClick={topRes}
            className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow active:scale-95 transition-all whitespace-nowrap"
          >
            ⭐ Top Rated (4.5+)
          </button>
        </div>

        <div className="text-xs text-gray-400 self-end sm:self-center">
          Showing {resData.length} places
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {resData.map((res) => {
          return (
            <Link
              to={"/resMenu/" + res.info.id}
              key={res.info.id}
              className="transition-transform duration-200 hover:scale-[1.02] block h-full"
            >
              {res?.info?.veg ? (
                <RestaurentVeg
                  name={res.info.name}
                  ratings={res.info.avgRating}
                  cuisines={res.info.cuisines}
                  address={res.info.locality}
                  imgSrc={res.info.cloudinaryImageId}
                  resId={res.info.id}
                />
              ) : (
                <ResCard
                  name={res.info.name}
                  ratings={res.info.avgRating}
                  cuisines={res.info.cuisines}
                  address={res.info.locality}
                  imgSrc={res.info.cloudinaryImageId}
                  resId={res.info.id}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Body;
