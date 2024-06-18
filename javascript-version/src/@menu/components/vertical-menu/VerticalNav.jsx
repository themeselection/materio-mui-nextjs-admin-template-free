'use client'

// React Imports
import { useEffect } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useMediaQuery from '../../hooks/useMediaQuery'
import useVerticalNav from '../../hooks/useVerticalNav'

// Util Imports
import { verticalNavClasses } from '../../utils/menuClasses'

// Styled Component Imports
import StyledBackdrop from '../../styles/StyledBackdrop'
import StyledVerticalNav from '../../styles/vertical/StyledVerticalNav'
import StyledVerticalNavContainer from '../../styles/vertical/StyledVerticalNavContainer'
import StyledVerticalNavBgColorContainer from '../../styles/vertical/StyledVerticalNavBgColorContainer'

// Default Config Imports
import { defaultBreakpoints, verticalNavToggleDuration } from '../../defaultConfigs'

const VerticalNav = props => {
  // Props
  const {
    width = 260,
    breakpoint = 'lg',
    customBreakpoint,
    breakpoints,
    transitionDuration = verticalNavToggleDuration,
    backdropColor,
    className,
    customStyles,
    children,
    ...rest
  } = props

  // Vars
  const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints }

  // Hooks
  const {
    updateVerticalNavState,
    width: widthContext,
    isBreakpointReached: isBreakpointReachedContext,
    isToggled: isToggledContext,
    transitionDuration: transitionDurationContext
  } = useVerticalNav()

  // Find the breakpoint from which screen size responsive behavior should enable and if its reached or not
  const breakpointReached = useMediaQuery(customBreakpoint ?? (breakpoint ? mergedBreakpoints[breakpoint] : breakpoint))

  // UseEffect, update verticalNav state to set initial values and update values on change
  useEffect(() => {
    updateVerticalNavState({
      width,
      transitionDuration,
      isBreakpointReached: breakpointReached
    })

    if (!breakpointReached) {
      updateVerticalNavState({ isToggled: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, breakpointReached, updateVerticalNavState])

  // Handle Backdrop(Content Overlay) Click
  const handleBackdropClick = () => {
    // Close the verticalNav
    updateVerticalNavState({ isToggled: false })
  }

  return (
    <StyledVerticalNav
      width={width}
      isBreakpointReached={isBreakpointReachedContext}
      customStyles={customStyles}
      transitionDuration={transitionDurationContext}
      className={classnames(
        verticalNavClasses.root,
        {
          [verticalNavClasses.toggled]: isToggledContext,
          [verticalNavClasses.breakpointReached]: isBreakpointReachedContext
        },
        className
      )}
      {...rest}
    >
      <StyledVerticalNavContainer
        width={widthContext}
        className={verticalNavClasses.container}
        transitionDuration={transitionDurationContext}
      >
        {/* VerticalNav Container to apply styling like background */}
        <StyledVerticalNavBgColorContainer className={verticalNavClasses.bgColorContainer}>
          {children}
        </StyledVerticalNavBgColorContainer>
      </StyledVerticalNavContainer>

      {/* When verticalNav is toggled on smaller screen, show/hide verticalNav backdrop */}
      {isToggledContext && breakpointReached && (
        // eslint-disable-next-line lines-around-comment
        /* VerticalNav Backdrop */
        <StyledBackdrop
          role='button'
          tabIndex={0}
          aria-label='backdrop'
          onClick={handleBackdropClick}
          onKeyPress={handleBackdropClick}
          className={verticalNavClasses.backdrop}
          backdropColor={backdropColor}
        />
      )}
    </StyledVerticalNav>
  )
}

export default VerticalNav
