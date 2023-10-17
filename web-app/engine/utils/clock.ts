export const secondsFrom = (startTime: number) => {
    return Number(((Date.now() - startTime) / 1000).toFixed(2));
};
