// Third-party Imports
import styled from '@emotion/styled'
import type { CSSObject } from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

type StyledHeaderProps = {
  overrideStyles?: CSSObject
}

const StyledHeader = styled.header<StyledHeaderProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  flex-shrink: 0;
  min-block-size: var(--header-height);

  .${verticalLayoutClasses.navbar} {
    position: relative;
    padding-block: 10px;
    padding-inline: ${themeConfig.layoutPadding}px;
    inline-size: 100%;
    margin-inline: auto;
    max-inline-size: ${themeConfig.compactContentWidth}px;
  }

  ${({ overrideStyles }) => overrideStyles}
`

export default StyledHeader
