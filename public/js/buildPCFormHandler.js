document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('build-form');
  if (!form) {
      console.log('Build form not found.');
      return;
  }

  form.addEventListener('submit', (event) => {
      event.preventDefault();

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

      const buildName = document.getElementById('build-name').value;
      const payload = {
          buildName,
          components
      };

      fetch('/save-build', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
          console.log('Build saved successfully', data);
          // Redirect or update UI as needed
      })
      .catch(error => console.error('Error saving the build:', error));
  });
});
