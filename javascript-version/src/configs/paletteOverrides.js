// Optional palette overrides to tune light/dark backgrounds and common surface colors.
// Edit these values to change the overall dark/light background tone across the app.
// Leave a field undefined to keep the template defaults from src/@core/theme/colorSchemes.js

const paletteOverrides = {
  light: {
    // Example: override light mode backgrounds (keep defaults if you prefer)
    // background: { default: '#F4F5FA', paper: '#FFFFFF' },
    // customColors: { greyLightBg: '#FAFAFA' }
  },
  dark: {
    // Align to template's purple-ish dark theme
    background: { default: '#28243D', paper: '#312D4B' },
    customColors: { greyLightBg: '#373350' }
  }
}

export default paletteOverrides
