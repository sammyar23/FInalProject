document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('build-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = new FormData(form);
      const buildData = {
        buildName: formData.get('buildName'),
        components: []
      };

      // Example for CPU, repeat for other components as needed
      const cpu = document.getElementById('cpu-select');
      if (cpu) {
        buildData.components.push({
          type: 'cpu',
          name: cpu.options[cpu.selectedIndex].text,
          price: cpu.options[cpu.selectedIndex].getAttribute('data-price')
        });
      }

      // Repeat the process for other components

      fetch('/save-build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Build saved successfully:', data);
        window.location.href = '/saved-builds';
      })
      .catch(error => {
        console.error('Error saving the build:', error);
      });
    });
  } else {
    console.error('Build form not found');
  }
});
