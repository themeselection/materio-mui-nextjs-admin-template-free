// React Imports
import type { SVGAttributes } from 'react'

const Close = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' fontSize='1.5rem' viewBox='0 0 24 24' {...props}>
      <path
        fill='currentColor'
        d='m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z'
      />
    </svg>
  )
}

export default Close
