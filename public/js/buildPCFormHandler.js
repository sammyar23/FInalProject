document.getElementById('build-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting immediately
  
    // Gather data from form selections
    const selectedCpu = document.getElementById('cpu-select').value;
    const selectedMotherboard = document.getElementById('motherboard-select').value;
    // Continue for other components...
  
    // Create a confirmation message
    const confirmMessage = `You have selected:\nCPU: ${selectedCpu}\nMotherboard: ${selectedMotherboard}\n...Continue?`;
  
    // Show confirmation popup
    if (window.confirm(confirmMessage)) {
      this.submit(); // Submit the form if user confirms
    }
  });
  