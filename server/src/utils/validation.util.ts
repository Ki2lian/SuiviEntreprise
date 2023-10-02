const isValidURL = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

const isValidDate = (date: string) => {
    const dateObject = new Date(date);
    return !isNaN(dateObject.getTime());
};

export default { isValidURL, isValidDate };
