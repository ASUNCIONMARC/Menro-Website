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
    var councilorList = document.getElementById('councilorList');
    var employeeList = document.getElementById('employeeList');
    var placeFilter = document.getElementById('placeFilter');

    function getPlaceNames(place){
      if (Array.isArray(place)){
        return place.map(function(p){ return p.name; });
      }
      return [place];
    }

    // Populate filter dropdown with unique places
    var places = Array.from(new Set(
      members.flatMap(function(m){ return getPlaceNames(m.place); })
    ));
    places.forEach(function(place){
      var opt = document.createElement('option');
      opt.value = place;
      opt.textContent = place;
      placeFilter.appendChild(opt);
    });

    function renderEmployees(employees){
      employeeList.innerHTML = '';
      var chunkSizes = [5, 6, 7, 8];
      var startIndex = 0;

      chunkSizes.forEach(function(size){
        var chunk = employees.slice(startIndex, startIndex + size);
        if (chunk.length === 0) return;

        var row = document.createElement('div');
        row.className = 'Members__EmployeeRow';
        row.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';

        chunk.forEach(function(m){
          var card = document.createElement('div');
          card.className = 'Members__EmployeeCard';
          card.innerHTML =
            '<img src="' + m.image + '" alt="' + m.name + '">' +
            '<div class="Members__EmployeeName">' + m.name + '</div>';
          card.addEventListener('click', function(){
            window.location.href = '/MembersInfo/MembersInfo.html?id=' + m.id;
          });
          row.appendChild(card);
        });

        employeeList.appendChild(row);
        startIndex += size;
      });
    }

    function render(filterPlace){
      councilorList.innerHTML = '';

      var filtered = members.filter(function(m){
        return filterPlace === 'all' || getPlaceNames(m.place).indexOf(filterPlace) !== -1;
      });

      filtered.filter(function(m){ return m.role === 'councilor'; }).forEach(function(m){
        var row = document.createElement('div');
        row.className = 'Members__CouncilorRow';
        row.innerHTML =
          '<div class="Members__CouncilorPhoto"><img src="' + m.image + '" alt="' + m.name + '"></div>' +
          '<div class="Members__CouncilorName">' + m.name + '</div>';
        row.addEventListener('click', function(){
          window.location.href = '/MembersInfo/MembersInfo.html?id=' + m.id;
        });
        councilorList.appendChild(row);
      });

      renderEmployees(filtered.filter(function(m){ return m.role === 'employee'; }));
    }

    render('all');

    placeFilter.addEventListener('change', function(){
      render(placeFilter.value);
    });
  })
  .catch(function(err){
    console.error('Failed to load members data:', err);
  });