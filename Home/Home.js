var burger = document.querySelector('.burger');
var nav = document.querySelector('.header__nav');
var branding = document.querySelector('.branding');

burger.addEventListener('click', function(){
  var isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-active');
  burger.setAttribute('aria-expanded', isOpen);
  branding.classList.toggle('is-disabled', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// TC-003 fix: close the mobile menu with the Escape key
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && nav.classList.contains('is-open')){
    burger.click();
  }
});


// ---------- Latest Collection ----------
fetch('/data/latest-collection.json')
  .then(function(res){ return res.json(); })
  .then(function(entries){
    var ticker = document.getElementById('collectionTicker');

    // TC-011 fix: show a real message instead of "undefined" when there's no data
    if (!entries || entries.length === 0){
      ticker.parentElement.innerHTML = '<p style="text-align:center; padding:2rem;">No collection records yet.</p>';
      return;
    }

    var doubled = entries.concat(entries);
    doubled.forEach(function(entry){
      var row = document.createElement('div');
      row.className = 'LatestCollection__Row';
      row.innerHTML =
        '<span>' + entry.date + '</span>' +
        '<span>' + entry.name + '</span>' +
        '<span>' + entry.place + '</span>' +
        '<span>' + entry.amount + '</span>';
      ticker.appendChild(row);
    });

    var pos = 0;
    var speed = 0.4;
    var paused = false;
    var halfHeight = 0;

    requestAnimationFrame(function measure(){
      halfHeight = ticker.scrollHeight / 2;
      if (halfHeight === 0) {
        requestAnimationFrame(measure);
        return;
      }
      startScroll();
    });

    function startScroll(){
      setInterval(function(){
        if (paused) return;
        pos -= speed;
        if (Math.abs(pos) >= halfHeight) pos = 0;
        ticker.style.transform = 'translateY(' + pos + 'px)';
      }, 16);
    }

    ticker.parentElement.addEventListener('mouseenter', function(){ paused = true; });
    ticker.parentElement.addEventListener('mouseleave', function(){ paused = false; });
  })
  .catch(function(err){
    // TC-012 fix: show a real error message instead of staying blank
    console.error('Failed to load collection data:', err);
    var viewport = document.querySelector('.LatestCollection__TickerViewport');
    if (viewport){
      viewport.innerHTML = '<p style="text-align:center; padding:2rem; color:#a33;">Unable to load the latest collections right now.</p>';
    }
  });


// ---------- Collector of the Month ----------
fetch('/data/collector-of-the-month.json')
  .then(function(res){ return res.json(); })
  .then(function(collectors){
    var photo = document.getElementById('collectorPhoto');
    var monthLabel = document.getElementById('collectorMonthLabel');
    var nameLabel = document.getElementById('collectorName');
    var amountLabel = document.getElementById('collectorAmount');
    var infoBlock = document.querySelector('.CollectorMonth__Info');

    // TC-016 fix: show a real message instead of a blank photo/heading when there's no data
    if (!collectors || collectors.length === 0){
      infoBlock.innerHTML = '<p style="text-align:center;">No collector data for this month yet.</p>';
      photo.style.display = 'none';
      return;
    }

    var highestAmount = Math.max.apply(null, collectors.map(function(c){ return c.amount; }));
    var topCollectors = collectors.filter(function(c){ return c.amount === highestAmount; });

    var index = 0;

    function formatAmount(amount){
      return '₱' + amount.toLocaleString();
    }

    function render(i){
      var c = topCollectors[i];
      photo.src = c.image;
      photo.alt = c.name + ' - collector of the month';
      monthLabel.textContent = c.month;
      nameLabel.textContent = c.name;
      amountLabel.textContent = formatAmount(c.amount);
    }

    render(0);

    if (topCollectors.length > 1){
      setInterval(function(){
        photo.classList.add('is-fading');
        infoBlock.classList.add('is-fading');

        setTimeout(function(){
          index = (index + 1) % topCollectors.length;
          render(index);
          photo.classList.remove('is-fading');
          infoBlock.classList.remove('is-fading');
        }, 600);

      }, 4000);
    }
  })
  .catch(function(err){
    console.error('Failed to load collector data:', err);
  });


// ---------- Recent Activity ----------
fetch('/data/recent-activity.json')
  .then(function(res){ return res.json(); })
  .then(function(activities){
    var list = document.getElementById('recentActivityList');

    activities.forEach(function(activity, index){
      var row = document.createElement('div');
      row.className = 'RecentActivity__Row';

      var carousel = document.createElement('div');
      carousel.className = 'RecentActivity__Carousel';
      carousel.setAttribute('tabindex', '0'); // TC-019 fix: makes the carousel keyboard-focusable

      activity.images.forEach(function(src, i){
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Recent activity photo';
        if (i === 0) img.classList.add('is-active');
        carousel.appendChild(img);
      });

      var caption = document.createElement('div');
      caption.className = 'RecentActivity__Caption';
      caption.textContent = activity.caption;

      row.appendChild(carousel);
      row.appendChild(caption);
      list.appendChild(row);

      var images = carousel.querySelectorAll('img');
      var current = 0;
      if (images.length > 1){
        setInterval(function(){
          images[current].classList.remove('is-active');
          current = (current + 1) % images.length;
          images[current].classList.add('is-active');
        }, 2000);
      }
    });
  })
  .catch(function(err){
    console.error('Failed to load recent activity data:', err);
  });