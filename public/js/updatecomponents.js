document.addEventListener('DOMContentLoaded', function() {
  const cpuSelect = document.getElementById('cpu-select');
  if (cpuSelect) {
    cpuSelect.addEventListener('change', function(event) {
      const selectedSocket = this.options[this.selectedIndex].getAttribute('data-socket');

      fetch(`/api/components/motherboard?socket=${selectedSocket}`)
        .then(response => response.json())
        .then(motherboards => {
          const motherboardSelect = document.getElementById('motherboard-select');
          motherboardSelect.innerHTML = ''; // Clear existing options

          motherboards.forEach(motherboard => {
            if (motherboard.name && motherboard.price) {
              const option = document.createElement('option');
              option.value = motherboard.name; // Set value
              option.textContent = `${motherboard.name} - $${motherboard.price}`; // Set text
              option.setAttribute('data-price', motherboard.price); // Set data-price attribute
              motherboardSelect.appendChild(option);
            }
          });
        })
        .catch(error => {
          console.error('Error fetching motherboards:', error);
        });
    });
  } else {
    console.error('CPU select not found');
  }
});
