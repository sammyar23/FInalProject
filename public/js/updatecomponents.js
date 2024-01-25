document.getElementById('cpu-select').addEventListener('change', function(event) {
  const selectedSocket = this.options[this.selectedIndex].getAttribute('data-socket'); // Assuming you have a data-socket attribute on your CPU options

  fetch(`/api/components/motherboard?socket=${selectedSocket}`)
    .then(response => response.json())
    .then(motherboards => {
      const motherboardSelect = document.getElementById('motherboard-select');
      motherboardSelect.innerHTML = ''; // Clear existing options
      motherboards.forEach(motherboard => {
        const option = document.createElement('option');
        option.value = `${motherboard.name} - $${motherboard.price}`; // Set value as a combination of name and price
        option.textContent = `${motherboard.name} - $${motherboard.price}`;
        motherboardSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching motherboards:', error);
    });
});
