// Make sure DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const buildForm = document.getElementById('build-form');
  if (!buildForm) {
      console.error('Build form not found.');
      return;
  }

  buildForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // Gather form data
      const buildName = document.getElementById('build-name').value.trim();
      const components = gatherComponentsData();

      if (!buildName) {
          alert('Please enter a build name.');
          return;
      }

      // Define the payload
      const payload = {
          buildName,
          components
      };

      // Send the payload to server
      fetch('/save-build', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Build saved successfully:', data);
          window.location.href = '/saved-builds'; // Redirect on success
      })
      .catch(error => {
          console.error('Error saving the build:', error);
          alert('Failed to save build.');
      });
  });
});

function gatherComponentsData() {
  // Placeholder for gathering component data
  // Replace with actual data gathering logic
  return []; // return the components array
}
