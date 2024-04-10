ddocument.getElementById('build-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting immediately

  // Collecting all selected components
  let components = [];
  const componentTypes = ['cpu', 'motherboard', 'gpu', 'memory', 'case', 'case-fan', 'cpu-cooler', 'internal-hard-drive', 'power-supply', 'sound-card'];
  
  for (const type of componentTypes) {
    const selectElement = document.getElementById(`${type}-select`);
    if (selectElement) {
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      if (selectedOption && selectedOption.value) {
        // Assuming that the value attribute contains the component name
        const name = selectedOption.value;
        // Check if price data attribute exists and is a valid number
        let price = selectedOption.dataset.price ? parseFloat(selectedOption.dataset.price) : 0;
        if (isNaN(price)) {
          console.error(`Invalid price for component type: ${type}, name: ${name}`);
          price = 0; // Set a default value or handle the error as needed
        }
        components.push({ type, name, price });
      }
    }
  }

  // Assuming you have an element to display the total price with id 'total-price'
  const totalPriceElement = document.getElementById('total-price');
  const totalPrice = totalPriceElement ? parseFloat(totalPriceElement.textContent) : 0;

  // Now we need to send the data as JSON in the body of a fetch request
  fetch('/save-build', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // If you use session-based authentication, ensure cookies are sent with the request
      'credentials': 'include'
    },
    body: JSON.stringify({
      components: components,
      totalPrice: totalPrice // Send the total price if required by your server
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Here you would handle the successful response, such as redirecting
    // to the saved builds page or displaying a success message
    console.log('Build saved successfully:', data);
    window.location.href = '/saved-builds'; // Redirect to saved builds page
  })
  .catch(error => {
    console.error('Error saving the build:', error);
  });
});
