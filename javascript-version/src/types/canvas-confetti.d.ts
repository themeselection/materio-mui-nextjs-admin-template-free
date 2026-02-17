declare module 'canvas-confetti' {
  type Shape = any;

  // default export is a function that also has helper functions as properties
  function confetti(opts?: any): void;

  namespace confetti {
    function shapeFromText(opts: { text: string, scalar?: number}): Shape;
    function shapeFromPath(opts: { path: string, scalar?: number}): Shape;
  }

  export default confetti;
}
