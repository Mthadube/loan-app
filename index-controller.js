app.controller('IndexFormController', function($scope, $timeout) {
    $scope.step = 1;
    $scope.user = {};
    $scope.errors = {};
    $scope.loanAmount = 2500;
    $scope.loanPurpose = '';
    $scope.interest = 0;
    $scope.fees = 0;
    $scope.totalRepayable = 0;
    $scope.repaymentDate = new Date();
$scope.repaymentDays = 5; // Default repayment days

$scope.calculateLoanDetails = function() {
    var baseInterest = $scope.loanAmount * 0.1; // 10% interest
    var baseFees = $scope.loanAmount * 0.03; // 3% fees

    // Additional interest and fees for each extra day
    var additionalInterest = $scope.loanAmount * 0.005 * $scope.repaymentDays; // 2% per day
    var additionalFees = $scope.loanAmount * 0.005 * $scope.repaymentDays; // 2% per day

    $scope.interest = baseInterest + additionalInterest;
    $scope.fees = baseFees + additionalFees;
    $scope.totalRepayable = $scope.loanAmount + $scope.interest + $scope.fees;

    $timeout($scope.updateTooltipPosition);
};

$scope.calculateRepaymentDate = function() {
    var today = new Date();
    $scope.repaymentDate = new Date(today.setDate(today.getDate() + $scope.repaymentDays));
    $scope.calculateLoanDetails(); // Recalculate loan details whenever repayment days change
    $timeout($scope.updateTooltipPosition);
};

$scope.updateTooltipPosition = function() {
    var sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(function(slider) {
        var tooltip = slider.nextElementSibling;
        var value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        tooltip.style.left = `calc(${value}% + (${8 - value * 0.15}px))`;
        
        if (slider.id === 'loanAmount') {
            tooltip.innerHTML = 'R' + slider.value; // Add the currency symbol here
        } else if (slider.id === 'repaymentDays') {
            tooltip.innerHTML = slider.value + ' days'; // Add the word 'days' here
        }
    });
};

    // Initialize calculations
$scope.calculateLoanDetails();
});