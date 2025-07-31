import barba from 'https://cdn.skypack.dev/@barba/core';
import gsap from 'https://cdn.skypack.dev/gsap';
import { getTitleFromHref, setTextOnLoadingScreen } from './domUtils.js';

const tl = gsap.timeline();
barba.init({
    transitions: [
        {
            name: 'default',
            async leave({ current, next, trigger }) {
                try {
                    const href = trigger?.getAttribute("href");
                    const nextTitle = getTitleFromHref(href);
                    setTextOnLoadingScreen(nextTitle);

                    const tl = gsap.timeline();
                    console.log("animating on leave")

                    tl.to(".barba-load-container", {
                        y: "0%",
                        duration: 1.5,
                        ease: "power4.inOut"
                    })
                    return tl;

                } catch (err) {
                    console.log(err)
                }

            },

            async afterEnter({ current, next }) {

                current.container.style.display = "none";
                const tl = gsap.timeline();
                console.log("animating after enter")
                tl.to(".barba-load-container", {
                    y: "-100%",
                    duration: 1.5,
                    ease: "power4.inOut"

                })
                return tl;
            },


        }
    ]
});
