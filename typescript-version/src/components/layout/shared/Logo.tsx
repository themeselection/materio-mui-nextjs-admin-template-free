'use client'

// React Imports
import type { CSSProperties } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

type LogoTextProps = {
  color?: CSSProperties['color']
}

const LogoText = styled.span`
  color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
`

const Logo = ({ color }: LogoTextProps) => {
  return (
    <div className='flex items-center'>
      <svg width={22} height={24} viewBox='0 0 22.236 23.8' xmlns='http://www.w3.org/2000/svg' color='#765feb'>
        <g
          fontSize='9pt'
          fillRule='evenodd'
          fill='currentColor'
          strokeWidth='0.25mm'
          stroke='currentColor'
          strokeLinecap='round'
        >
          <path
            fill='currentColor'
            strokeWidth='0.25mm'
            stroke='currentColor'
            vectorEffect='non-scaling-stroke'
            d='M 3.06 23.8 L 0 23.8 L 0 0 L 4.522 0 L 11.118 15.062 L 17.612 0 L 22.236 0 L 22.236 23.8 L 19.006 23.8 L 19.006 4.114 L 12.648 18.428 L 9.452 18.428 L 3.06 4.114 L 3.06 23.8 Z'
          />
        </g>
      </svg>
      <LogoText color={color}>{themeConfig.templateName}</LogoText>
    </div>
  )
}

export default Logo
