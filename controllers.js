app.controller('DashboardController', function($scope) {
    console.log('Dashboard loaded.');
    var applications = JSON.parse(localStorage.getItem('applications')) || [];
    $scope.applications = applications.reverse(); // Reverse the order to display newer applications first

    $scope.showDetails = false;
    $scope.searchText = '';
    $scope.statusFilter = '';
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.filteredApplications = [];

    function filterApplications() {
        let filtered = applications.filter(function(app) {
            let matchesSearch = !$scope.searchText || Object.values(app).some(value => value.toString().toLowerCase().includes($scope.searchText.toLowerCase()));
            let matchesStatus = !$scope.statusFilter || app.status === $scope.statusFilter;
            return matchesSearch && matchesStatus;
        });
        $scope.filteredApplications = filtered;
        paginate();
    }

    function paginate() {
        var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
        var end = begin + $scope.itemsPerPage;
        $scope.pagedItems = $scope.filteredApplications.slice(begin, end);
    }

    $scope.viewMore = function(index) {
        $scope.selectedApplication = $scope.pagedItems[index];
        $scope.showDetails = true;
    };

    $scope.backToDashboard = function() {
        $scope.showDetails = false;
    };

    $scope.printDetails = function() {
        var printContents = document.querySelector('[ng-show="showDetails"]').innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        $scope.$apply();  // Reapply the AngularJS bindings
    };

    $scope.downloadPDF = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let details = `
        Name: ${$scope.selectedApplication.name} ${$scope.selectedApplication.surname}
        Cellphone Number: ${$scope.selectedApplication.cellphoneNumber}
        Email: ${$scope.selectedApplication.email}
        ID Number: ${$scope.selectedApplication.saIdNumber}
        Loan Amount: ${$scope.selectedApplication.loanAmount}
        Total Repayable: ${$scope.selectedApplication.totalRepayable}
        Bank Name: ${$scope.selectedApplication.bankName}
        Account Number: ${$scope.selectedApplication.accountNumber}
        Branch Code: ${$scope.selectedApplication.branchCode}
        Account Type: ${$scope.selectedApplication.accountType}
        `;

        doc.text(details, 10, 10);
        doc.save('application-details.pdf');
    };

    $scope.updateStatus = function(application, status) {
        application.statusHistory = application.statusHistory || [];
        application.statusHistory.push({
            status: status,
            date: new Date()
        });
        application.status = status;
        localStorage.setItem('applications', JSON.stringify($scope.applications));
        filterApplications();
    };

    $scope.exportToExcel = function() {
        var ws = XLSX.utils.json_to_sheet($scope.applications);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Applications");
        XLSX.writeFile(wb, "applications.xlsx");
    };

    $scope.previousPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage -= 1;
            paginate();
        }
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages()) {
            $scope.currentPage += 1;
            paginate();
        }
    };

    $scope.totalPages = function() {
        return Math.ceil($scope.filteredApplications.length / $scope.itemsPerPage);
    };

    $scope.deleteApplication = function(index) {
        var actualIndex = $scope.applications.indexOf($scope.pagedItems[index]);
        $scope.applications.splice(actualIndex, 1);
        localStorage.setItem('applications', JSON.stringify($scope.applications));
        filterApplications();
    };

    $scope.$watch('searchText', filterApplications);
    $scope.$watch('statusFilter', filterApplications);

    filterApplications();
    console.log('Dashboard loaded. Applications: ', $scope.applications);
});
