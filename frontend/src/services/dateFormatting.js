export const fDate = (date, { includeTime = true } = {}) => {
        const options = includeTime ? {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZone: "UTC"
        } : {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC"
        };
        return new Date(date).toLocaleString('en-US', options);
    };