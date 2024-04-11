document.addEventListener('DOMContentLoaded', function() {
  const buildForm = document.getElementById('build-form');
  if (!buildForm) {
      console.error('Build form not found');
      return;
  }

  buildForm.addEventListener('submit', handleSubmit);

  function handleSubmit(event) {
      event.preventDefault();

      const buildNameInput = document.getElementById('build-name');
      if (!buildNameInput) {
          console.error('Build name input not found');
          return;
      }

      const buildName = buildNameInput.value.trim();
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
