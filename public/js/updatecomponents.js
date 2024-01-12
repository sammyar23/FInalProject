document.getElementById('cpu-select').addEventListener('change', function(event) {
    const selectedSocket = event.target.value;
    fetch(`/api/components/motherboard?socket=${selectedSocket}`)
      .then(response => response.json())
      .then(motherboards => {
        const motherboardSelect = document.getElementById('motherboard-select');
        motherboardSelect.innerHTML = ''; // Clear existing options
        motherboards.forEach(motherboard => {
          const option = document.createElement('option');
          option.value = motherboard.id; // Assuming each motherboard has an ID
          option.textContent = `${motherboard.name} - ${motherboard.price}`;
          motherboardSelect.appendChild(option);
        });
      });
  });
  