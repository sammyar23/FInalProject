document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('build-form');
  if (!form) {
      console.error('Build form not found.');  // Ensure this message appears in the console if the form isn't found
      return;
  }

  form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Gather form data here
      const buildName = document.getElementById('build-name').value;
      if (!buildName) {
          alert('Please enter a build name.');
          return;
      }

      // Assuming all select elements have a consistent naming convention like "components[0].type"
      const selects = document.querySelectorAll('select');
      const components = Array.from(selects).map(select => {
          const selectedIndex = select.selectedIndex;
          const option = select.options[selectedIndex];
          return {
              type: select.name,
              name: option.value,
              price: parseFloat(option.getAttribute('data-price')) || 0
          };
      });

      const payload = {
          buildName,
          components
      };

      fetch('/save-build', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Build saved successfully', data);
          window.location.href = '/saved-builds'; // Redirect or update UI as needed
      })
      .catch(error => {
          console.error('Error saving the build:', error);
      });
  });
});
