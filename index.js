window.addEventListener('scroll', function myfunction()
{
    var sticker = this.document.querySelector(".nav");
    sticker.classList.toggle("sticky", window.scrollY > 0)

})

console.log(scrollY);