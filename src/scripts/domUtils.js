export function setTextOnLoadingScreen(textContent) {
    try {
        const loadingScreenHeading = document.querySelector("#loading-screen-text");

        if (!loadingScreenHeading) {
            console.warn("Loading-Screen-Heading not found!");
            return;
        }
        loadingScreenHeading.textContent = textContent;
        return;
    } catch (err) {
        console.error("Error in leave hook:", err);

    }
}
export function getTitleFromHref(href) {

    try {

        if (!href) return "Unknown";

        const url = new URL(href, window.location.origin);
        const slug = url.pathname.replace(/^\/|\/$/g, ""); // remove leading/trailing slashes

        switch (slug) {
            case "":
                return "Home";
            case "contact":
                return "Contact Us";
            case "about":
                return "About";
            default:
                return slug.charAt(0).toUpperCase() + slug.slice(1);
        }

    } catch (err) {
        console.error("Error in leave hook:", err);

    }
}
