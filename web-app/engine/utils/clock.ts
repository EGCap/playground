export const secondsFrom = (startTime: number) => {
    return ((Date.now() - startTime) / 1000).toFixed(2);
};
