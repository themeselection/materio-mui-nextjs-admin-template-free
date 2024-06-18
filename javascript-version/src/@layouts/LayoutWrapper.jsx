'use client'

const LayoutWrapper = ({ verticalLayout }) => {
  // Return the layout based on the layout context
  return <div className='flex flex-col flex-auto'>{verticalLayout}</div>
}

export default LayoutWrapper
