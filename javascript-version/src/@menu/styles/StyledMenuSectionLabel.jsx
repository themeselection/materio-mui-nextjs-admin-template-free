// Third-party Imports
import styled from '@emotion/styled'

const StyledMenuSectionLabel = styled.span`
  ${({ textTruncate }) =>
    textTruncate &&
    `
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `};
  ${({ rootStyles }) => rootStyles};
`

export default StyledMenuSectionLabel
