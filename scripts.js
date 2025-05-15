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
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const greeting = document.getElementById("greeting");
  

  function openSidebar() {
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
  }

  toggleBtn.addEventListener('click', openSidebar);
  overlay.addEventListener('click', closeSidebar);

const username = document.getElementById("person");
if (username) {
  const savedUsername = localStorage.getItem("person");
  if (savedUsername) {
    username.value = savedUsername;
  }

  username.addEventListener("change", () => {
    localStorage.setItem("person", username.value);
    console.log("Username disimpan:", username.value);
  });
}

const toggleBtnMode = document.getElementById("toggleDark");

// Simpan dan ambil preferensi dark mode
if(toggleBtnMode){
  const savedTheme = localStorage.getItem("theme");
  console.log(localStorage.getItem("theme"));
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  toggleBtnMode.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    console.log(localStorage.getItem("theme"));
  });
}

  



    
  function getGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const name = localStorage.getItem("person") || "";
  if (hour >= 5 && hour < 12) {
    return "Good Mornig 🌤️<br>" +  name;
  } else if (hour >= 12 && hour < 15) {
    return "Good Afternoon ☀️<br>"+  name;
  } else if (hour >= 15 && hour < 18) {
    return "Good Evening 🌇<br>";
  } else {
    return "Goodnight 🌙<br>";
  }
}

if (greeting) {
  // Contoh menampilkan ke elemen HTML
greeting.innerHTML = getGreeting();

}

const unitSelect = document.getElementById("tempUnitSelect");
if (unitSelect) {
  
  const savedUnit = localStorage.getItem("temperatureUnit") || "metric";
  unitSelect.value = savedUnit;

  unitSelect.addEventListener("change", () => {
    const selectedUnit = unitSelect.value;
    localStorage.setItem("temperatureUnit", selectedUnit);
    console.log("Unit disimpan:", selectedUnit);
    // Kamu bisa langsung call API cuaca di sini juga
    getLocationAndWeather(); 
  });
}



    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
      if (link.getAttribute('href') === page) {
        link.classList.add('text-blue-600'); // warna aktif
        link.querySelector('i').classList.add('!text-blue-600');
      }
    });
  
  if (plantForms && plantLists){
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
      plantLists.innerHTML = '';
      data.forEach(item => {
        const li = document.createElement('li');
        const isoDate =  item.date;
        const dateObj = new Date(isoDate);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
        const year = dateObj.getFullYear();
        
        const formattedDate = `${day}-${month}-${year}`;


        li.className = 'p-4 bg-[#d9e6f6] rounded-2xl flex justify-between items-center dark:bg-zinc-900 ';
        li.innerHTML = `
          <div>
            <p class="text-lg font-semibold text-[#2c4a6e] dark:text-white ">${item.plantName}</p>
            <p class="text-sm text-[#4f7db3] dark:text-white">Tanggal : ${formattedDate}</p>
            <p class="text-sm text-[#4f7db3] dark:text-white">Media : ${item.growMedia}</p>
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
        li.className = 'dark:bg-zinc-800 dark:text-white p-4 bg-[#d9e6f6] rounded-2xl flex justify-between items-center';
        li.innerHTML = `
          <div>
            <p class="text-lg font-semibold text-[#2c4a6e]  dark:text-white">${item.plant}</p>
            <p class="text-sm text-[#4f7db3] dark:text-white">Tanggal : ${formattedDate}</p>
            <p class="text-sm text-[#4f7db3] dark:text-white">Jam : ${item.time}</p>
          </div>
          <i class="fas fa-leaf text-[#4f7db3] text-xl"></i>
        `;
        scheduleLists.appendChild(li);
      });
    }
    // Load jadwal & cuaca saat halaman siap
    loadFromSheet();
  }

  if ( temperature && humidity){
    function getWeather(lat, lon) {
      const unit = localStorage.getItem("temperatureUnit") || "metric";
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
        .then(response => response.json())
        .then(data => {
          const temp = Math.round(data.main.temp);
          const hum = data.main.humidity;
          const loc = data.name;
          const weath = data.weather[0].main;
          const wind = data.wind.speed;
          
  
          if (unit == "metric") {
           temperature.innerText = `${temp}°C`; 
          }else{
            temperature.innerText = `${temp}°F`;
          }
          
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
