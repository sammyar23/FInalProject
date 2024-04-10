document.getElementById('build-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting immediately

  // Collecting all selected components
  let components = [];
  // Assume you have select elements with ids corresponding to each component type
  const componentTypes = ['cpu', 'motherboard', 'gpu', 'memory', 'case', 'case-fan', 'cpu-cooler', 'internal-hard-drive', 'power-supply', 'sound-card'];
  
  componentTypes.forEach(type => {
    const selectElement = document.getElementById(`${type}-select`);
    if (selectElement) {
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      if (selectedOption && selectedOption.value) {
        components.push({
          type: type,
          id: selectedOption.value, // Assuming the value of the option is the component ID
          price: parseFloat(selectedOption.dataset.price), // Assuming you have data-price attributes on your options
          quantity: 1 // If you need to handle quantity, you'll need to adjust this
        });
      }
    }
  });

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
