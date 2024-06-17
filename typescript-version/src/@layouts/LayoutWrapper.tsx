'use client'

// React Imports
import type { ReactElement } from 'react'

const LayoutWrapper = ({ verticalLayout }: { verticalLayout: ReactElement }) => {
  // Return the layout based on the layout context
  return <div className='flex flex-col flex-auto'>{verticalLayout}</div>
}

export default LayoutWrapper
