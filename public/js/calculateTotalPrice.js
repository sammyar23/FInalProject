document.addEventListener('DOMContentLoaded', function() {
    // Function to update the total price
    const updateTotalPrice = () => {
      let totalPrice = 0;
  
      // Find all the select elements for components
      const selects = document.querySelectorAll('.form-section select');
      
      // Loop over each select and add the selected option's price to the total
      selects.forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.getAttribute('data-price')) {
          const price = parseFloat(selectedOption.getAttribute('data-price'));
          if (!isNaN(price)) {
            totalPrice += price;
          }
        }
      });
  
      // Update the total price on the page
      document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    };
  
    // Attach the updateTotalPrice function to the change event of each select element
    document.querySelectorAll('.form-section select').forEach(select => {
      select.addEventListener('change', updateTotalPrice);
    });
  
    // Initialize the total price when the page loads
    updateTotalPrice();
  });
  