document.querySelectorAll('.LiquidWaste__Carousel').forEach(function(carousel){
  var images = carousel.querySelectorAll('img');
  var current = 0;

  setInterval(function(){
    images[current].classList.remove('is-active');
    current = (current + 1) % images.length;
    images[current].classList.add('is-active');
  }, 2000);
});

var burger = document.querySelector('.burger');
var nav = document.querySelector('.header__nav');

burger.addEventListener('click', function(){
  var isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-active');
  burger.setAttribute('aria-expanded', isOpen);
});