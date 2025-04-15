
interface EdgeStyleResult {
  width?: string;
  height?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  transform?: string;
}

/**
 * Calculate the CSS styles for a card edge based on its position and thickness
 */
export const calculateEdgeStyle = (
  position: 'top' | 'bottom' | 'left' | 'right',
  thickness: string
): EdgeStyleResult => {
  const style: EdgeStyleResult = {};
  
  switch (position) {
    case 'top':
      style.height = thickness;
      style.width = '100%';
      style.left = '0';
      style.top = '0';
      style.transform = `rotateX(-90deg) translateZ(${thickness})`;
      break;
    case 'bottom':
      style.height = thickness;
      style.width = '100%';
      style.left = '0';
      style.bottom = '0';
      style.transform = `rotateX(90deg) translateZ(${thickness})`;
      break;
    case 'left':
      style.width = thickness;
      style.height = '100%';
      style.left = '0';
      style.top = '0';
      style.transform = `rotateY(90deg) translateZ(${thickness})`;
      break;
    case 'right':
      style.width = thickness;
      style.height = '100%';
      style.right = '0';
      style.top = '0';
      style.transform = `rotateY(-90deg) translateZ(${thickness})`;
      break;
  }
  
  return style;
};
