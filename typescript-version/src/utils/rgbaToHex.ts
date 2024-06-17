export const rgbaToHex = (colorStr: string, forceRemoveAlpha: boolean = false) => {
  // Check if the input string contains '/'
  const hasSlash = colorStr.includes('/')

  if (hasSlash) {
    // Extract the RGBA values from the input string
    const rgbaValues = colorStr.match(/(\d+)\s+(\d+)\s+(\d+)\s+\/\s+([\d.]+)/)

    if (!rgbaValues) {
      return colorStr // Return the original string if it doesn't match the expected format
    }

    const [red, green, blue, alpha] = rgbaValues.slice(1, 5).map(parseFloat)

    // Convert the RGB values to hexadecimal format
    const redHex = red.toString(16).padStart(2, '0')
    const greenHex = green.toString(16).padStart(2, '0')
    const blueHex = blue.toString(16).padStart(2, '0')

    // Convert alpha to a hexadecimal format (assuming it's already a decimal value in the range [0, 1])
    const alphaHex = forceRemoveAlpha
      ? ''
      : Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0')

    // Combine the hexadecimal values to form the final hex color string
    const hexColor = `#${redHex}${greenHex}${blueHex}${alphaHex}`

    return hexColor
  } else {
    // Use the second code block for the case when '/' is not present
    return (
      '#' +
      colorStr
        .replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
        .split(',') // splits them at ","
        .filter((string, index) => !forceRemoveAlpha || index !== 3)
        .map(string => parseFloat(string)) // Converts them to numbers
        .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
        .map(number => number.toString(16)) // Converts numbers to hex
        .map(string => (string.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
        .join('')
    )
  }
}
