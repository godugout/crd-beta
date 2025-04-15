
export interface EdgeStyle {
  width?: string;
  height?: string;
  transform: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export const calculateEdgeStyle = (
  position: 'top' | 'bottom' | 'left' | 'right',
  thickness: string
): EdgeStyle => {
  switch (position) {
    case 'top':
      return {
        width: '100%',
        height: thickness,
        transform: `rotateX(90deg) translateZ(calc(-${thickness}/2))`,
        top: `-${thickness}/2`
      };
    case 'bottom':
      return {
        width: '100%',
        height: thickness,
        transform: `rotateX(90deg) translateZ(calc(100% - ${thickness}/2))`,
        bottom: `-${thickness}/2`
      };
    case 'left':
      return {
        width: thickness,
        height: '100%',
        transform: `rotateY(90deg) translateZ(calc(-${thickness}/2))`,
        left: `-${thickness}/2`
      };
    case 'right':
      return {
        width: thickness,
        height: '100%',
        transform: `rotateY(90deg) translateZ(calc(100% - ${thickness}/2))`,
        right: `-${thickness}/2`
      };
  }
};
