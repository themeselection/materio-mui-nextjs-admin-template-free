// Third-party Imports
import styled from '@emotion/styled'

const StyledSubMenuContent = styled.div`
  display: none;
  overflow: hidden;
  z-index: 999;
  transition: ${({ transitionDuration }) => `block-size ${transitionDuration}ms ease-in-out`};
  box-sizing: border-box;
  position: static !important;
  transform: none !important;

  ${({ rootStyles }) => rootStyles};
`

export default StyledSubMenuContent
