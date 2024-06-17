// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { RootStylesType } from '../../types'
import type { VerticalMenuContextProps } from '../../components/vertical-menu/Menu'

type StyledVerticalNavExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

export const StyledVerticalNavExpandIconWrapper = styled.span<RootStylesType>`
  display: flex;
  margin-inline-start: 5px;
  ${({ rootStyles }) => rootStyles};
`

const StyledVerticalNavExpandIcon = styled.span<StyledVerticalNavExpandIconProps>`
  display: flex;

  & > i,
  & > svg {
    transition: ${({ transitionDuration }) => `transform ${transitionDuration}ms ease-in-out`};
    ${({ open }) => open && 'transform: rotate(90deg);'}

    [dir='rtl'] & {
      transform: rotate(180deg);
      ${({ open }) => open && 'transform: rotate(90deg);'}
    }
  }
`

export default StyledVerticalNavExpandIcon
