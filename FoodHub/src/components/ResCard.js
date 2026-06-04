import React from 'react'

const ResCard = (props)=>{

  const RES_IMG_URL="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/"

  return (
   <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col h-full">
        <img className='w-full aspect-video object-cover' src={RES_IMG_URL+props.imgSrc} />
        <div className='p-4 flex flex-col flex-grow gap-1'>
        <h3 className='font-bold text-lg text-gray-800 line-clamp-1'>{props.name}</h3>
        <h5 className='flex items-center gap-1 font-semibold text-sm text-green-700'>⭐ {props.ratings}</h5>
        <h5 className='text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50'>{props.address}</h5>
        </div>
    </div>
  )
}

//Restaurant Card Component -> Higher Order Component -> Restaurant Card Component+ Veg

export const WithVegOnly= (ResCard)=>{
  return (props)=>{
    return(
      <div className='relative'>
      <label className='absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md'>Veg</label>
      <ResCard {...props} />
      </div>
    )
  }
}

export default ResCard



