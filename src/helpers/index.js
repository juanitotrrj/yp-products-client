const parseQueryStringToJson = (str) => {
    const trimmedStr = str.trim();
    if (trimmedStr.length > 0) {
        return JSON.parse('{"' + decodeURI(str.replace(/\?/, "").replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
    }

    return {};
}

export { parseQueryStringToJson };
