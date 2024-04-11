document.addEventListener('DOMContentLoaded', () => {
  const cpuSelect = document.getElementById('cpu-select');
  if (!cpuSelect) {
      console.log('CPU select element not found.');
      return;
  }

  cpuSelect.addEventListener('change', () => {
      const socket = cpuSelect.value;
      fetch(`/api/components/motherboard?socket=${socket}`)
          .then(response => response.json())
          .then(motherboards => {
              const motherboardSelect = document.getElementById('motherboard-select');
              motherboardSelect.innerHTML = ''; // Clear existing options

              motherboards.forEach(motherboard => {
                  const option = new Option(`${motherboard.name} - $${motherboard.price}`, motherboard.name);
                  option.dataset.price = motherboard.price;
                  motherboardSelect.appendChild(option);
              });
          })
          .catch(error => console.error('Failed to fetch motherboards:', error));
  });
});
