document.getElementById('cpu-select').addEventListener('change', function(event) {
  const selectedSocket = event.target.value;

  fetch(`/api/components/motherboard?socket=${selectedSocket}`)
    .then(response => response.json())
    .then(motherboards => {
      console.log('Motherboards:', motherboards); // Log to see what you get from the server
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
