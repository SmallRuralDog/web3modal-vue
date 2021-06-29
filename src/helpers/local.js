export let local;

if (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
) {
    local = window.localStorage;
}

export const setLocal = (key, data) => {
    const jsonData = JSON.stringify(data);
    if (local) {
        local.setItem(key, jsonData);
    }
};

export const getLocal = (key) => {
    let data = null;
    let raw = null;
    if (local) {
        raw = local.getItem(key);
    }
    if (raw && typeof raw === "string") {
        try {
            data = JSON.parse(raw);
        } catch (error) {
            return null;
        }
    }
    return data;
};

export const removeLocal = (key) => {
    if (local) {
        local.removeItem(key);
    }
};

export const updateLocal = (key, data) => {
    const localData = getLocal(key) || {};
    const mergedData = {...localData, ...data};
    setLocal(key, mergedData);
};
