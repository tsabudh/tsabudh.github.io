import gsap from "gsap";

export function initAboutPageHero() {
  const text = document.querySelector(".index_hero_text");
  text.innerHTML = text.innerText
    .split("")
    .map(
      (char, i) => `<span style="transform:rotate(${i * 20}deg)">${char}</span>`
    )
    .join("");

  const tl = gsap.timeline();

//   tl.from("#sabudh span", {
//     y: "20px",
//     duration: 1,
//     ease: "power2.inOut",
//   });

//   tl.from([".index_hero_h1"], {
//     y: "20px",
//     duration: 1,
//     ease: "power2.inOut",
//   });
//   tl.from(
//     [".index_hero_h2"],
//     {
//       y: "20px",
//       duration: 1,
//       ease: "power4.Out",
//     },
//     "-=0.95"
//   );
}
