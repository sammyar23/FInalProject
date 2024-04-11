// updatecomponents.js
document.addEventListener('DOMContentLoaded', function() {
  const cpuSelect = document.getElementById('cpu-select');
  if (!cpuSelect) {
    console.error('CPU select not found.');
    return;
  }

  cpuSelect.addEventListener('change', function() {
    const socket = cpuSelect.value;

    fetch(`/api/components/motherboard?socket=${socket}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
      })
      .then(motherboards => {
        const motherboardSelect = document.getElementById('motherboard-select');
        motherboardSelect.innerHTML = ''; // Clear current motherboard options

        motherboards.forEach(motherboard => {
          const option = document.createElement('option');
          option.value = motherboard.name;
          option.textContent = `${motherboard.name} - $${motherboard.price}`;
          option.dataset.price = motherboard.price;
          motherboardSelect.appendChild(option);
        });
      })
      .catch(error => console.error('There has been a problem with your fetch operation:', error));
  });
});
