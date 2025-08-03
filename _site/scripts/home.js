import gsap from "gsap";

export function initHomePage(){

	const text = document.querySelector(".index_hero_text");
	console.log(text.innerText)
	text.innerHTML = text.innerText
	.split("")
	.map(
		(char, i) => `<span style="transform:rotate(${i * 20}deg)">${char}</span>`
	)
	.join("");
	
	
	const tl = gsap.timeline();
	
	tl.from([".index_hero_h1"],{
		y:"20px",
		duration:1,
		ease:"power2.inOut"
	})
	tl.from([".index_hero_h2"],{
		y:"20px",
		duration:1,
		ease:"power2.inOut"
	},"-=0.95")
}