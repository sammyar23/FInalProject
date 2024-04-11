document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
  
    form.addEventListener('submit', function(event) {
      // Prevent the default form submission to validate first
      event.preventDefault();
  
      let isValid = true;
      const components = [
        'cpu',
        'motherboard',
        'gpu',
        'memory',
        'case',
        'case-fan',
        'cpu-cooler',
        'internal-hard-drive',
        'power-supply',
        'sound-card'
      ]; // You need to collect component data from your form inputs
  
      // Validate the components
      components.forEach(component => {
        if (isNaN(component.price)) {
          isValid = false;
          alert('Please fix the prices. They should be numbers.');
        }
      });
  
      // If validation passed, proceed with the form submission
      if (isValid) {
        form.submit();
      }
    });
  });
  