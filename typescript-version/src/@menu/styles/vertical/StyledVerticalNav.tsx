// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { VerticalNavState } from '../../contexts/verticalNavContext'
import type { VerticalNavProps } from '../../components/vertical-menu/VerticalNav'

// Util Imports
import { verticalNavClasses } from '../../utils/menuClasses'

type StyledVerticalNavProps = VerticalNavProps & Pick<VerticalNavState, 'isBreakpointReached' | 'transitionDuration'>

const StyledVerticalNav = styled.aside<StyledVerticalNavProps>`
  position: sticky;
  inset-block-start: 0;
  block-size: 100dvh;
  z-index: 9;

  /* Transition */
  transition-property: inline-size, min-inline-size, margin-inline-start, inset-inline-start;
  transition-duration: ${({ transitionDuration }) => `${transitionDuration}ms`};
  transition-timing-function: ease-in-out;

  /* Width & Min Width & Margin */
  inline-size: ${({ width }) => `${width}px`};
  min-inline-size: ${({ width }) => `${width}px`};

  /* Toggled */
  &.${verticalNavClasses.breakpointReached} {
    position: fixed;
    block-size: 100%;
    inset-block-start: 0;
    inset-inline-start: ${({ width }) => `-${width}px`};
    z-index: 100;
    margin: 0;
    &.${verticalNavClasses.toggled} {
      inset-inline-start: 0;
    }
  }

  ${({ width, isBreakpointReached }) =>
    !isBreakpointReached &&
    `
    &.${verticalNavClasses.toggled} {
      margin-inline-start: -${width}px;
    }
  `}

  /* User Styles */
  ${({ customStyles }) => customStyles}
`

export default StyledVerticalNav
