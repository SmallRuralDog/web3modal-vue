import lightTheme from "./light";
import darkTheme from "./dark";

export const themesList = {
    default: lightTheme,
    [lightTheme.name]: lightTheme,
    [darkTheme.name]: darkTheme
};
