export const debugLog = (message, data) => {
    console.log('🔍 Debug:', message);
    if (data) {
        console.log(data);
    }
};
