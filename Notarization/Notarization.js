document.querySelectorAll('.LegalDocs__Trigger').forEach(function(trigger){
  trigger.addEventListener('click', function(){
    var item = trigger.closest('.LegalDocs__Item');
    var panel = item.querySelector('.LegalDocs__Panel');
    var isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.LegalDocs__Item').forEach(function(i){
      i.classList.remove('is-open');
      i.querySelector('.LegalDocs__Panel').style.maxHeight = null;
    });

    if(!isOpen){
      item.classList.add('is-open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

var burger = document.querySelector('.burger');
var nav = document.querySelector('.header__nav');

burger.addEventListener('click', function(){
  var isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-active');
  burger.setAttribute('aria-expanded', isOpen);
});