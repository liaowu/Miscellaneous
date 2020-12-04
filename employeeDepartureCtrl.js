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
        vm.employeePerformanceSafetyList = []
        vm.employeePerformanceAttendanceList = []
        vm.employeePerformanceAttitudeList = []
        vm.employeePerformanceCareList = []
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
                headerdate: dateToday.format("YYYY-MM-DD"),
                site: '',
                reasonDeparture: '', 
                employeePerformanceSafety: '',
                employeePerformanceAttendance: '',
                employeePerformanceAttitude: '',
                employeePerformanceCare: '',
                assetsCollected: '',
                job_number: '',
                level: '',
                position: '',
                supervisor: '',
                employee_name: null,
                Departure_violation: '',
                event_type: '',
                counselled: '',
                event: '',
                signature_employee: '',
                signature_superintendent: '',
                signature_manager: '',
                Report_Distribution1: []
            }
        }

        //Function to get jobs & levels at a site
        vm.getJobsLevels = () => {
            let mainSite = ''
            vm.currentEmpDisc.job_number = ''
            vm.currentEmpDisc.level = ''
            vm.jobListSelect = []
            vm.levelListSelect = []
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
            vm.levelList.forEach((rec) => {
                if(rec.rld_parent_detail_rld_id == mainSite)
                    vm.levelListSelect.push(rec)
            })
            
        }

        vm.openSignModal = (e) => {
            document.getElementById(`sigModalOK`).removeEventListener('click', signFunction)
            vm.mainButton = e.target
            vm.target =  e.target.getAttribute('signaturename')
            $(`#${vm.target}`).val('')
            $(`#${vm.target}_img`).val('')
            $('#output').val('')
            modalService.Open('signatureModal')
            activateSignature()
        }

        function signFunction(e){ 
            e.stopPropagation()
            let vecValue = document.querySelector('#output').value
        
            if(vecValue){
                vm.currentEmpDisc[vm.target] = $(`.sigPadModal .pad2`)[0].toDataURL('image/jpeg')
                $(`#${vm.target}`).next().val(vecValue)
                $(`#${vm.target}_img`).attr('src',$(`.sigPadModal .pad2`)[0].toDataURL('image/jpeg'))
            } else {
                $(`#${vm.target}`).val('')
                $(`#${vm.target}`).next().val('')
                $(`#${vm.target}_img`).attr('src','')
            }

            $(`#sigModal .output`).val('')

            if(vecValue) {
                vm.mainButton.innerHTML = `<i class="fa fa-pen"></i> Re-sign`
                $(`#${vm.target}`).prev().prev().children()[1].classList.remove('d-none')
                $(`#${vm.target}`).prev().prev().children()[0].classList.remove('invalid')
            } 
            else {
                vm.mainButton.innerHTML = `<i class="fa fa-pen"></i> Sign`
                $(`#${vm.target}_img`).attr('src','')
                $(`#${vm.target}`).prev().prev().children()[1].classList.add('d-none')
            }
            
            let sig = $('.sigPadModal').signaturePad({})
            sig.clearCanvas()

            modalService.Close('signatureModal')
        }

        function activateSignature(){
            setTimeout(()=>{
                $('canvas.pad2').attr({"width": $('.pad2').parent().width(),"height":$('.pad2').parent().width()/3})
                    let sig = $('.sigPadModal').signaturePad({
                    lineColour: "#ced4da",
                    drawOnly: true,
                    lineWidth: 0,
                    lineBottom: 10,
                    bgColour: 'rgb(255,255,255)'
                })
                sig.clearCanvas()

                document.getElementById(`sigModalOK`).addEventListener('click',signFunction)
                document.getElementById(`reSignButton`).addEventListener('click',(e) =>{  
                canvas = e.target.parentNode.previousSibling.previousElementSibling.previousElementSibling
                let sig = $('.sigPadModal').signaturePad(	{
                    lineColour: "#ced4da",
                    drawOnly: true,
                    lineWidth: 0,
                    lineBottom: 10,
                    bgColour: 'rgb(255,255,255)'
                    });
                    sig.clearCanvas()
                })
            },300)
              
        }

        $(`.clear_sign`).click((e) => {
            e.target.previousElementSibling.innerHTML = '<i class="fa fa-pen"></i> Sign'
            e.target.parentNode.nextElementSibling.setAttribute('src','')

            vm.currentEmpDisc[e.target.previousElementSibling.getAttribute('signaturename')] = ''
            e.target.parentNode.nextElementSibling.nextElementSibling.value = ''
            e.target.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.value = ''
            e.target.classList.add('d-none')
            if(e.target.parentNode.nextElementSibling.nextElementSibling.hasAttribute('required')){
                e.target.previousElementSibling.classList.add('invalid')
            }
        })    
        
        function clearAllSign () {
            let signImgs = Array.from(document.getElementsByClassName("clear_sign"))

            signImgs.forEach ((img) => {
                img.previousElementSibling.innerHTML = '<i class="fa fa-pen"></i> Sign'
                img.parentNode.nextElementSibling.setAttribute('src','')

                img.parentNode.nextElementSibling.nextElementSibling.value = ''
                img.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.value = ''
                img.classList.add('d-none')
                if(img.parentNode.nextElementSibling.nextElementSibling.hasAttribute('required')){
                    img.previousElementSibling.classList.add('invalid')
                }               
            })
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

        //Function to prepare payload data
        function preparePayload(payload) {
            let preparedPayload = payload
            
            preparedPayload.headerdate = moment(payload.headerdate, 'YYYY-MM-DDThh:mm').format('YYYY-MM-DDThh:mm')
  
            return preparedPayload
        }

        //Function to close the modal
        vm.closeModal = (modalId) => {    
            clearAllSign()        
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
                vm.employeePerformanceSafetyList = data[4]
                vm.employeePerformanceAttendanceList = data[4]
                vm.employeePerformanceAttitudeList = data[4]
                vm.employeePerformanceCareList = data[4]
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