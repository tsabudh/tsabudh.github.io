import gsap from "gsap";

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
                return "Contact";
            case "about":
                return "About";
            default:
                return slug.charAt(0).toUpperCase() + slug.slice(1);
        }

    } catch (err) {
        console.error("Error in leave hook:", err);

    }
}

export function showCurtains() {
    const tl = gsap.timeline();
    console.log("animating on leave")

    tl.to(".barba-load-container", {
        y: "0%",
        duration: 1.2,
        ease: "power3.inOut"
    })
    return tl;
}

export function hideCurtains() {
    const tl = gsap.timeline();
    console.log("animating after enter")
    tl.to(".barba-load-container", {
        y: "-100%",
        duration: 1.5,
        ease: "power4.inOut"

    })

    tl.set(".barba-load-container", {
        y: "110%"
    })
    return tl;
}