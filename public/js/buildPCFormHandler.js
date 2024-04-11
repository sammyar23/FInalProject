document.getElementById('build-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting immediately

  // Collecting all selected components
  let components = [];
  let isValid = true; // Flag to check if all data is valid

  const componentTypes = [
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
  ];
  
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
          isValid = false; // Set isValid to false as the price is not a number
          // You might want to inform the user more visibly, for example:
          alert(`Invalid price for ${type}. Please select a valid option.`);
          break; // Exit the loop as there is invalid data
        }
        components.push({ type, name, price });
      }
    }
  }

  // If any of the components had an invalid price, stop the function
  if (!isValid) {
    console.error('Submission stopped due to invalid data.');
    return;
  }

  // Assuming you have an element to display the total price with id 'total-price'
  const totalPriceElement = document.getElementById('total-price');
  const totalPrice = totalPriceElement ? parseFloat(totalPriceElement.textContent) : 0;

  // Now we need to send the data as JSON in the body of a fetch request
  fetch('/save-build', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include credentials if your authentication requires cookies
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
