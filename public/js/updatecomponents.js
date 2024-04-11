document.addEventListener('DOMContentLoaded', function() {
  const cpuSelect = document.getElementById('cpu-select');
  const motherboardSelect = document.getElementById('motherboard-select');

  if (cpuSelect && motherboardSelect) {
    cpuSelect.addEventListener('change', function() {
      const socket = this.options[this.selectedIndex].getAttribute('data-socket');
      fetch(`/api/components/motherboard?socket=${socket}`)
        .then(response => response.json())
        .then(data => {
          motherboardSelect.innerHTML = ''; // Clear existing options
          data.forEach(mb => {
            const option = document.createElement('option');
            option.textContent = `${mb.name} - $${mb.price}`;
            option.value = mb.name;
            motherboardSelect.appendChild(option);
          });
        })
        .catch(error => console.error('Error:', error));
    });
  } else {
    console.error('CPU select or motherboard select not found.');
  }
});
