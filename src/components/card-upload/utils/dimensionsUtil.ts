
// Trading card standard aspect ratio 2.5:3.5
export const CARD_ASPECT_RATIO = 2.5 / 3.5;

export const calculateCardDimensions = (width: number, height: number): { width: number; height: number } => {
  // Determine which dimension controls the fit
  if (width / height > CARD_ASPECT_RATIO) {
    // Width is "too wide" for the height, so use height to calculate width
    return {
      height,
      width: height * CARD_ASPECT_RATIO
    };
  } else {
    // Height is "too tall" for the width, so use width to calculate height
    return {
      width,
      height: width / CARD_ASPECT_RATIO
    };
  }
};
