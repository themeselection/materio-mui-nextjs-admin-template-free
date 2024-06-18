// Third-party Imports
import styled from '@emotion/styled'

const StyledMenuLabel = styled.span`
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
