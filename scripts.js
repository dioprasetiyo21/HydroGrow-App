document.addEventListener('DOMContentLoaded', function () {
  const scheduleForms = document.getElementById('scheduleForm');
  const scheduleLists = document.getElementById('scheduleList');
  const location = document.getElementById('location')
  const humidity = document.getElementById('humidity')
  const weather = document.getElementById('weather')
  const windSpeed = document.getElementById('wind')
  const temperature = document.getElementById('temperature')
  const apiKey = 'd05e59725984356dfa3aa7a2aa2fb839'; // Ganti dengan API key-mu
  const url = 'https://script.google.com/macros/s/AKfycbzrSXAhYMN7IcLi-0dSE-xmDbre1Bt8P7GJhBb8Cq8gOsqgkQ5cHRyXCgGHU9q1hlhB/exec';
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1); // misalnya: 'schedule.html'
  const plantForms = document.getElementById('plantForm');
  const plantLists = document.getElementById('plantList');


    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
      if (link.getAttribute('href') === page) {
        link.classList.add('text-blue-600'); // warna aktif
        link.querySelector('i').classList.add('!text-blue-600');
      }
    });
  
  if (plantForms && plantLists){
    console.log('masuk plants');
    plantForms.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const plant = document.getElementById('plantName').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('growingMedia').value;
      const type = 'plant';
    
  
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant, date, time,type }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Data berhasil dikirim:', data);
          alert('Jadwal berhasil ditambahkan!');
          scheduleForms.reset();
          loadFromSheetPlants();
        })
        .catch((error) => {
          console.error('Gagal mengirim data:', error);
          alert('Gagal mengirim data ke Google Sheets.');
        });
    });

    function loadFromSheetPlants() {
      fetch(url+'?sheet=plants')
        .then(response => response.json())
        .then(data => {
          renderPlants(data);
        })
        .catch(error => {
          console.error('Gagal memuat jadwal:', error);
        });
    }
  
    function renderPlants(data) {
      console.log(data)
      plantLists.innerHTML = '';
      data.forEach(item => {
        const li = document.createElement('li');
        const isoDate =  item.date;
        const dateObj = new Date(isoDate);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
        const year = dateObj.getFullYear();
        
        const formattedDate = `${day}-${month}-${year}`;


        li.className = 'p-4 bg-[#d9e6f6] rounded-2xl flex justify-between items-center';
        li.innerHTML = `
          <div>
            <p class="text-lg font-semibold text-[#2c4a6e]">${item.plantName}</p>
            <p class="text-sm text-[#4f7db3]">Tanggal : ${formattedDate}</p>
            <p class="text-sm text-[#4f7db3]">Media : ${item.growMedia}</p>
          </div>
          <i class="fas fa-leaf text-[#4f7db3] text-xl"></i>
        `;
        plantLists.appendChild(li);
      });
    }
    // Load jadwal & cuaca saat halaman siap
    loadFromSheetPlants();
  }

  
  if (scheduleForms && scheduleLists){

    scheduleForms.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const plant = document.getElementById('plantName').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const type = 'schedule';
    
  
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant, date, time,type }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Data berhasil dikirim:', data);
          alert('Jadwal berhasil ditambahkan!');
          scheduleForms.reset();
          loadFromSheet();
        })
        .catch((error) => {
          console.error('Gagal mengirim data:', error);
          alert('Gagal mengirim data ke Google Sheets.');
        });
    });
  
    function loadFromSheet() {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          renderSchedules(data);
        })
        .catch(error => {
          console.error('Gagal memuat jadwal:', error);
        });
    }
  
    function renderSchedules(data) {
      scheduleLists.innerHTML = '';
      data.forEach(item => {
        const li = document.createElement('li');
        const isoDate =  item.date;
        const dateObj = new Date(isoDate);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
        const year = dateObj.getFullYear();
        
        const formattedDate = `${day}-${month}-${year}`;
        li.className = 'p-4 bg-[#d9e6f6] rounded-2xl flex justify-between items-center';
        li.innerHTML = `
          <div>
            <p class="text-lg font-semibold text-[#2c4a6e]">${item.plant}</p>
            <p class="text-sm text-[#4f7db3]">Tanggal : ${formattedDate}</p>
            <p class="text-sm text-[#4f7db3]">Jam : ${item.time}</p>
          </div>
          <i class="fas fa-leaf text-[#4f7db3] text-xl"></i>
        `;
        scheduleLists.appendChild(li);
      });
    }
    // Load jadwal & cuaca saat halaman siap
    loadFromSheet();
  }

  if (location && temperature && humidity){
    function getWeather(lat, lon) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          const temp = Math.round(data.main.temp);
          const hum = data.main.humidity;
          const loc = data.name;
          const weath = data.weather.main;
          const wind = data.wind.speed;
          
  
          
          temperature.innerText = `${temp}°`;
          humidity.innerText = `${hum}%`;
          location.innerText = `${loc}`;
          weather.innerText = `${weath}`;
          windSpeed.innerText = `${wind}`;

          
        })
        .catch(err => console.error('Error fetching weather:', err));
    }
  
    function getLocationAndWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
          },
          error => {
            console.error('Geolocation error:', error);
          }
        );
      } else {
        console.error('Geolocation not supported by this browser.');
      }
    }
    window.onload = getLocationAndWeather;
  }
  
});
