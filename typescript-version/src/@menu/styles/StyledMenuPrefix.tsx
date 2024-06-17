// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { RootStylesType } from '../types'

type StyledMenuPrefixProps = RootStylesType

const StyledMenuPrefix = styled.span<StyledMenuPrefixProps>`
  margin-inline-end: 5px;
  display: flex;
  ${({ rootStyles }) => rootStyles};
`

export default StyledMenuPrefix
