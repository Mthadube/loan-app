app.controller('FormController', function($scope, $timeout) {
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
        var additionalInterest = $scope.loanAmount * 0.005 * $scope.repaymentDays; // 0.5% per day
        var additionalFees = $scope.loanAmount * 0.005 * $scope.repaymentDays; // 0.5% per day

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

    $scope.registerUser = function() {
        $scope.errors = {};
        var requiredFields = ['name', 'surname', 'dateOfBirth', 'saIdNumber', 'cellphoneNumber', 'email', 'street', 'suburb', 'city', 'postalCode', 'termsAccepted'];
        requiredFields.forEach(function(field) {
            if (!$scope.user[field]) {
                $scope.errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
            }
        });
        if ($scope.user.email !== $scope.user.confirmEmail) {
            $scope.errors.confirmEmail = "Emails do not match.";
        }
        if (Object.keys($scope.errors).length === 0) {
            $scope.step = 2;
        }
    };

    $scope.submitLoanDetails = function() {
        if ($scope.loanPurpose) {
            $scope.calculateLoanDetails();
            $scope.step = 3;
        }
    };

    $scope.submitDocuments = function() {
        console.log('submitDocuments called');
        if ($scope.uploadForm.$valid) {
            console.log('uploadForm is valid');

            // Generate a unique ID for each application
            $scope.application.id = Date.now();

            // Save application data
            $scope.saveApplication();
            $scope.step = 4;
        } else {
            console.log('uploadForm is not valid');
        }
    };

    $scope.goBack = function() {
        $scope.step--;
    };

    $scope.saveApplication = function() {
        let application = {
            name: $scope.user.name,
            cellphoneNumber: $scope.user.cellphoneNumber,
            surname: $scope.user.surname,
            email: $scope.user.email,
            saIdNumber: $scope.user.saIdNumber,
            loanAmount: $scope.loanAmount,
            loanPurpose: $scope.loanPurpose,
            totalRepayable: $scope.totalRepayable,
            street: $scope.user.street,
            suburb: $scope.user.suburb,
            city: $scope.user.city,
            postalCode: $scope.user.postalCode,
            bankName: $scope.user.bankName,
            accountNumber: $scope.user.accountNumber,
            branchCode: $scope.user.branchCode,
            accountType: $scope.user.accountType,
            repaymentDate: $scope.repaymentDate,
            interest: $scope.interest,
            fees: $scope.fees,
            status: 'pending', // Default status
            statusHistory: [{
                status: 'pending',
                date: new Date()
            }]
        };

        console.log('Saving application:', application);

        let applications = JSON.parse(localStorage.getItem('applications')) || [];
        applications.push(application);
        localStorage.setItem('applications', JSON.stringify(applications));

        console.log('Applications saved:', applications);
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
