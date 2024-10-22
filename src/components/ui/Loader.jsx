import React from 'react'

const Loader = ({ height }) => {
  return (
    <div className={`flex space-x-2 justify-center items-center bg-[#131214] ${height}`}>
      <span className='sr-only'>Loading...</span>
      <div className='h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='h-5 w-5 bg-white rounded-full animate-bounce'></div>
    </div>
  )
}

export default Loader