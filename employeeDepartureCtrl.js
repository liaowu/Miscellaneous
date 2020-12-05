safeToDo.component("employeeDepartureForm", {
    // styling found in avatar.css
    templateUrl: 'app/components/employeeDepartureForm/employeeDeparture.html',
    bindings: {
        modalId: '<',
        allData: '<',
        mode: '<',
        incidentId: '<',
        onSave: '&',
        onClose: '&'
    },
    controllerAs: 'vm',
    controller: function ($scope, $q, employeeDepartureService, listService, modalService, profileService) {
        let vm = this
        let dateToday = moment(new Date(), 'YYYY-MM-DD')
        vm.siteList = []
        vm.reasonDepartureList = []
        vm.employeePerformanceList = []
 /*        vm.employeePerformanceSafetyList = []
        vm.employeePerformanceAttendanceList = []
        vm.employeePerformanceAttitudeList = []
        vm.employeePerformanceCareList = [] */
        vm.assetsCollectedList = []
        vm.jobList = []
        vm.jobListSelect = []
        vm.levelList = []
        vm.levelListSelect = []
        vm.employeeList = []
        vm.supervisorList = []
        vm.distributionList = []
        vm.target = ''
        vm.mainButton = null

        //Function to reset form
        function resetForm () {
            document.forms['employeeDepartureForm'].classList.remove('was-validated')
            vm.submitted = false

            vm.currentEmpDisc = {
                form_name: 'EMPLOYEE DEPARTURE',
                employee_name: null,
                site: '',
                job_number: '',
                supervisor: '',               
                headerdate: dateToday.format("YYYY-MM-DD"),
                position: '',
                reasonDeparture: '', 
                provideNotice: '',
                payMiningBonus: '',
                payZeroHarm: '',
                employeePerformance: '',
  /*               employeePerformanceSafety: '',
                employeePerformanceAttendance: '',
                employeePerformanceAttitude: '',
                employeePerformanceCare: '', */
                recommendRehire: '',
                assetsCollected: '',
                arrangeMobile: '',
                additionalInfo: '',
                Report_Distribution1: []
            }
        }

        //Function to create the employee Departure
        vm.createEmpDisc = () => {
            let payload = preparePayload(JSON.parse(JSON.stringify(vm.currentEmpDisc)))
            if(vm.validateForm()) {
                vm.submitted = true
                employeeDepartureService.createEmployeeDeparture(payload).then ((response) =>{
                    vm.closeModal('employeeDepartureModal')
                    $scope.$emit('REFRESH_FORMSUBMISSIONS')
                })
            }
        }
        //Function to get jobs at a site
        vm.getJobList = () => {
            let mainSite = ''
            vm.currentEmpDisc.job_number = ''
            vm.jobListSelect = []
            vm.siteList.forEach((rec) => {
                if(rec.rld_name == vm.currentEmpDisc.site)
                {
                    mainSite = rec.rld_id
                }
            })
            vm.jobList.forEach((rec) => {
                if(rec.rld_parent_detail_rld_id == mainSite)
                    vm.jobListSelect.push(rec)
            })
        }

        //Function to prepare payload data
        function preparePayload(payload) {
            let preparedPayload = payload
            
            preparedPayload.headerdate = moment(payload.headerdate, 'YYYY-MM-DDThh:mm').format('YYYY-MM-DDThh:mm')
  
            return preparedPayload
        }

        //Function to close the modal
        vm.closeModal = (modalId) => {    
            modalService.Close(modalId)
            resetForm()            
        }

        //Function for form validation
        vm.validateForm = () => {
            let formVal = document.forms['employeeDepartureForm']
            formVal.classList.add('was-validated')
            let validated = true
            for (let a = 0; a < formVal.length; a++) {
              if (!formVal[a].validity.valid) {
                validated = false
              }
            }         
            return validated
        }

        //Function to refresh all data
        function refreshData() {
            $q.all([
                listService.getSelectListData('ref_site'),
                listService.getSelectListData('ref_job'),
                listService.getSelectListData('ref_level'),
                listService.getSelectListData('ref_reason_departure'),
                listService.getSelectListData('ref_employee_performance'),
                listService.getSelectListData('ref_assets_collected'),
                profileService.getAllEmployeeProfile(),
                profileService.getAllSupervisorProfile(),
                profileService.getDistributionList()
                
            ]).then((data) => {
                resetForm()
                vm.siteList = data[0]                
                vm.jobList = data[1]
                vm.levelList = data[2]
                vm.reasonDepartureList = data[3]
                vm.employeePerformance= data[4]
/*                 vm.employeePerformanceSafetyList = data[4]
                vm.employeePerformanceAttendanceList = data[4]
                vm.employeePerformanceAttitudeList = data[4]
                vm.employeePerformanceCareList = data[4] */
                vm.assetsCollectedList = data[5]
                vm.employeeList = profileService.readAllEmployeeProfile()
                vm.supervisorList = profileService.readAllSupervisorProfile()  
                vm.distributionList = profileService.readDistributionList()              
            })                    
        }

        refreshData()

    //END
    }
})