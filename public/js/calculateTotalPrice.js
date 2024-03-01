document.addEventListener('DOMContentLoaded', function() {
  const selects = document.querySelectorAll('select');
  const totalPriceElement = document.getElementById('total-price');

  function updateTotalPrice() {
    let totalPrice = 0;
    selects.forEach(select => {
      const selectedOption = select.options[select.selectedIndex];
      if (selectedOption && selectedOption.dataset.price) {
        totalPrice += parseFloat(selectedOption.dataset.price);
      }
    });
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }

  selects.forEach(select => {
    select.addEventListener('change', updateTotalPrice);
  });

  // Run the calculation once on load
  updateTotalPrice();
});
