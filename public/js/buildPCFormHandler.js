document.getElementById('build-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const buildName = document.getElementById('build-name').value;
  if (!buildName) {
    alert('Please enter a name for your build.');
    return;
  }

  // Define an empty array to hold components data
  const components = [];

  // Function to create component object and validate
  function createComponent(selectId, type) {
    const select = document.getElementById(selectId);
    const option = select.options[select.selectedIndex];
    const price = parseFloat(option.dataset.price);

    if (isNaN(price)) {
      alert(`Invalid price for ${type}. Please select a valid option.`);
      return false; // Validation failed
    }

    components.push({ type, name: option.text, price });
    return true; // Validation successful
  }

  // Collect and validate CPU data
  if (!createComponent('cpu-select', 'cpu')) return;

  // Collect and validate Motherboard data
  if (!createComponent('motherboard-select', 'motherboard')) return;

  // Collect and validate GPU data
  if (!createComponent('gpu-select', 'gpu')) return;

  // Collect and validate Memory data
  if (!createComponent('memory-select', 'memory')) return;

  // Collect and validate Case data
  if (!createComponent('case-select', 'case')) return;

  // Collect and validate Case Fan data
  if (!createComponent('case-fan-select', 'case-fan')) return;

  // Collect and validate CPU Cooler data
  if (!createComponent('cpu-cooler-select', 'cpu-cooler')) return;

  // Collect and validate Internal Hard Drive data
  if (!createComponent('internal-hard-drive-select', 'internal-hard-drive')) return;

  // Collect and validate Power Supply data
  if (!createComponent('power-supply-select', 'power-supply')) return;

  // Collect and validate Sound Card data
  if (!createComponent('sound-card-select', 'sound-card')) return;

  // Now we have an array 'components' with all the validated data
  // Send this data to the server
  fetch('/save-build', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ buildName, components })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Build saved successfully:', data);
    window.location.href = '/saved-builds'; // Redirect to saved builds page
  })
  .catch(error => {
    console.error('Error saving the build:', error);
    alert('Error saving the build. Please try again.');
  });
});
