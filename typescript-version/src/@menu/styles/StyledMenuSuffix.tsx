// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { RootStylesType } from '../types'

type StyledMenuSuffixProps = RootStylesType

const StyledMenuSuffix = styled.span<StyledMenuSuffixProps>`
  margin-inline-start: 5px;
  display: flex;
  ${({ rootStyles }) => rootStyles};
`

export default StyledMenuSuffix
