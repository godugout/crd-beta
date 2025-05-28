
export const logRenderingInfo = (component: string, info: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${component}] Rendering info:`, info);
  }
};
