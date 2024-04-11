document.addEventListener('DOMContentLoaded', function() {
  const cpuSelect = document.getElementById('cpu-select');
  if (!cpuSelect) {
      console.error('CPU select element not found.');
      return;
  }

  cpuSelect.addEventListener('change', function() {
      const socket = cpuSelect.value; // Assuming the value contains the socket type
      // Fetch and update motherboards
      // Note: Adjust URL/path as needed
      fetch(`/api/components/motherboard?socket=${socket}`)
          .then(response => response.json())
          .then(updateMotherboardOptions)
          .catch(error => console.error('Failed to fetch motherboards:', error));
  });

  function updateMotherboardOptions(motherboards) {
      const motherboardSelect = document.getElementById('motherboard-select');
      if (!motherboardSelect) {
          console.error('Motherboard select element not found.');
          return;
      }

      motherboardSelect.innerHTML = ''; // Clear existing options
      motherboards.forEach(mb => {
          const option = new Option(`${mb.name} - $${mb.price}`, mb.name);
          option.dataset.price = mb.price; // Assuming price is important for later
          motherboardSelect.add(option);
      });
  }
});
