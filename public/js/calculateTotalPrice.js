document.addEventListener('DOMContentLoaded', function() {
    const componentSelects = document.querySelectorAll('#cpu-select, #motherboard-select, #gpu-select, #memory-select, #case-select, #case-fan-select, #cpu-cooler-select, #internal-hard-drive-select, #power-supply-select, #sound-card-select');
    const totalPriceElement = document.getElementById('total-price');
  
    function updateTotalPrice() {
      let totalPrice = 0;
      componentSelects.forEach(select => {
        const price = select.options[select.selectedIndex].dataset.price;
        totalPrice += parseFloat(price || 0);
      });
      totalPriceElement.textContent = totalPrice.toFixed(2);
    }
  
    componentSelects.forEach(select => {
      select.addEventListener('change', updateTotalPrice);
    });
  
    // Initial calculation in case there are default selections
    updateTotalPrice();
  });
  