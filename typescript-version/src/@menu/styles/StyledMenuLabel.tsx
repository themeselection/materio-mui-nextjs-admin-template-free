// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { RootStylesType } from '../types'

type StyledMenuLabelProps = RootStylesType & {
  textTruncate?: boolean
}

const StyledMenuLabel = styled.span<StyledMenuLabelProps>`
  flex-grow: 1;
  ${({ textTruncate }) =>
    textTruncate &&
    `
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `};
  ${({ rootStyles }) => rootStyles};
`

export default StyledMenuLabel
