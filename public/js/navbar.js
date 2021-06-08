const navbar = document.querySelector('.navbar')
window.addEventListener('scroll', fixNav)

function fixNav() {

    if (window.scrollY > navbar.offsetHeight + 10) {
        navbar.classList.add('active')
    } else {
        navbar.classList.remove('active')
    }

}
const hamburger = document.querySelector('.hamburger')
const mobileMenu = document.querySelector('.mobileMenu')
hamburger.addEventListener('click', menuActive)

function menuActive() {
    console.log;
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active')
    } else {
        mobileMenu.classList.add('active')
    }
}
window.addEventListener('resize', mobileQuery)

function mobileQuery() {
    console.log(window.screen.width);
    if (window.screen.width > 800) {
        hamburger.classList.remove('active')
    } else {
        hamburger.classList.add('active')
    }
}