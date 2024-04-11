document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('build-form');

  if (!form) {
      console.error('Build form not found');
      return;
  }

  form.addEventListener('submit', function(event) {
      event.preventDefault();

      const buildName = document.getElementById('build-name').value;
      if (!buildName) {
          alert('Please enter a name for your build.');
          return;
      }

      const components = [];
      const componentSelectors = {
          'cpu': 'cpu-select',
          'motherboard': 'motherboard-select',
          'gpu': 'gpu-select',
          'memory': 'memory-select',
          'case': 'case-select',
          'case-fan': 'case-fan-select',
          'cpu-cooler': 'cpu-cooler-select',
          'internal-hard-drive': 'internal-hard-drive-select',
          'power-supply': 'power-supply-select',
          'sound-card': 'sound-card-select'
      };

      for (const [type, selectId] of Object.entries(componentSelectors)) {
          const select = document.getElementById(selectId);
          if (!select) {
              alert(`No select element found for ${type}`);
              return;
          }

          const selectedOption = select.options[select.selectedIndex];
          if (!selectedOption) {
              alert(`No option selected for ${type}`);
              return;
          }

          const price = parseFloat(selectedOption.dataset.price);
          if (isNaN(price)) {
              alert(`Invalid price for ${type}. Please select a valid option.`);
              return;
          }

          components.push({ type, name: selectedOption.text, price });
      }

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
});
