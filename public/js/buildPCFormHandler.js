// buildPCFormHandler.js
document.addEventListener('DOMContentLoaded', function() {
  // Ensures the code runs only after the DOM is fully loaded.

  const form = document.getElementById('build-form'); // Make sure 'build-form' is the correct ID
  if (!form) {
    console.error('The build form was not found on this page.');
    return;
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Object to hold the build data
    let buildData = {
      buildName: '',
      components: []
    };

    // Function to collect component data
    const collectComponentData = (selectorId, componentType) => {
      const selectElement = document.getElementById(selectorId);
      if (!selectElement) {
        console.error(`Select element for ${componentType} not found.`);
        return false;
      }

      const selectedOption = selectElement.options[selectElement.selectedIndex];
      if (!selectedOption) {
        console.error(`No option selected for ${componentType}.`);
        return false;
      }

      const price = parseFloat(selectedOption.getAttribute('data-price'));
      if (isNaN(price)) {
        console.error(`Price for ${componentType} is not a valid number.`);
        return false;
      }

      buildData.components.push({
        type: componentType,
        name: selectedOption.text,
        price: price
      });
      
      return true;
    };

    // Collecting build name
    const buildNameInput = document.getElementById('build-name');
    if (buildNameInput && buildNameInput.value) {
      buildData.buildName = buildNameInput.value;
    } else {
      console.error('No build name specified.');
      return;
    }

    // Component types and corresponding select IDs
    const componentInfo = {
      cpu: 'cpu-select',
      motherboard: 'motherboard-select',
      gpu: 'gpu-select',
      memory: 'memory-select',
      case: 'case-select',
      'case-fan': 'case-fan-select',
      'cpu-cooler': 'cpu-cooler-select',
      'internal-hard-drive': 'internal-hard-drive-select',
      'power-supply': 'power-supply-select',
      'sound-card': 'sound-card-select'
    };

    // Collecting components data
    for (const [type, selectorId] of Object.entries(componentInfo)) {
      const isSuccess = collectComponentData(selectorId, type);
      if (!isSuccess) return; // Stop if we encounter an invalid component
    }

    // POST the build data to the server
    fetch('/save-build', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(buildData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Build saved successfully:', data);
      // Redirect to saved builds page or handle success
    })
    .catch(error => {
      console.error('Error saving the build:', error);
      // Handle error
    });
  });
});
