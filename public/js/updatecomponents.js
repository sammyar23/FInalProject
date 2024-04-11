document.getElementById('cpu-select').addEventListener('change', function(event) {
  const selectedSocket = this.options[this.selectedIndex].getAttribute('data-socket');
  console.log(`CPU changed, selected socket: ${selectedSocket}`); // Debug log

  fetch(`/api/components/motherboard?socket=${selectedSocket}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(motherboards => {
      const motherboardSelect = document.getElementById('motherboard-select');
      motherboardSelect.innerHTML = ''; // Clear existing options

      if (motherboards.length === 0) {
        console.log('No motherboards returned for the selected socket.'); // Debug log
      }

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
