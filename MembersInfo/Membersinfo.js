var burger = document.querySelector('.burger');
var nav = document.querySelector('.header__nav');

burger.addEventListener('click', function(){
  var isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-active');
  burger.setAttribute('aria-expanded', isOpen);
});

fetch('/data/members.json')
  .then(function(res){ return res.json(); })
  .then(function(members){
    var params = new URLSearchParams(window.location.search);
    var currentId = params.get('id');
    var index = members.findIndex(function(m){ return m.id === currentId; });
    if (index === -1) index = 0;

    var photo = document.getElementById('staffPhoto');
    var map = document.getElementById('staffMap');
    var name = document.getElementById('staffName');
    var position = document.getElementById('staffPosition');
    var place = document.getElementById('staffPlace');
    var facebook = document.getElementById('staffFacebook');
    var phone = document.getElementById('staffPhone');

    var placeCarouselInterval = null;

    function setMap(loc){
      var zoomLevel = loc.zoom || 12;
      map.src = 'https://www.google.com/maps?q=' + loc.lat + ',' + loc.lng + '&z=' + zoomLevel + '&output=embed';
      place.textContent = 'Place: ' + loc.name;
    }

    function render(i){
      var m = members[i];

      // clear any previous carousel timer before rendering a new person
      if (placeCarouselInterval){
        clearInterval(placeCarouselInterval);
        placeCarouselInterval = null;
      }

      photo.src = m.image;
      photo.alt = m.name;
      name.textContent = 'Full Name: ' + m.name;
      position.textContent = 'Position: ' + m.position;
      facebook.href = m.facebook;
      phone.textContent = 'Phone Number: ' + m.phone;

      if (Array.isArray(m.place)){
        // multiple locations: carousel between them
        var locIndex = 0;
        setMap(m.place[locIndex]);

        placeCarouselInterval = setInterval(function(){
          locIndex = (locIndex + 1) % m.place.length;
          setMap(m.place[locIndex]);
        }, 4000);
      } else {
        // single location: use the member's own lat/lng/zoom/place fields
        setMap({ name: m.place, lat: m.lat, lng: m.lng, zoom: m.zoom || 12 });
      }

      var newUrl = window.location.pathname + '?id=' + m.id;
      window.history.replaceState(null, '', newUrl);
    }

    render(index);

    document.getElementById('prevBtn').addEventListener('click', function(){
      index = (index - 1 + members.length) % members.length;
      render(index);
    });

    document.getElementById('nextBtn').addEventListener('click', function(){
      index = (index + 1) % members.length;
      render(index);
    });
  })
  .catch(function(err){
    console.error('Failed to load member data:', err);
  });