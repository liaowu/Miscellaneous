angular
    .module('safeToDo')
    .controller('FormsCtrl', ['$compile','$sce', '$scope', '$routeParams', '$window', '$timeout', 'formsService', 'signoffService', 'gridService', 'modalService', 'employeesService', 'profileService', 'menuService',
    function ($compile, $sce, $scope, $routeParams, $window, $timeout, formsService, signoffService, gridService, modalService, employeesService, profileService, menuService) {
        var vm = this
        vm.canArchiveSubmissions = false
        vm.topSearch = ""
        vm.reportURL = null
        vm.appAvailable = null
        vm.employees = []
        if (!!$routeParams.submissionId) {
            vm.topSearch = '?submissionId=' + $routeParams.submissionId
        }
        
        let formDescriptionId = $routeParams.formDescriptionId
        vm.reportInputs = ""
        vm.canExportCSV = true
        vm.canExportXLS = true
        vm.sfilter = []

        let submissionId = $routeParams.submissionId;

        if (formDescriptionId === '1137') {
            vm.canExportCSV = false
            vm.canExportXLS = false
        }

        vm.gridSections = []
        vm.attachmentModalFiles = []

        vm.options = gridService.getCommonOptions()
        vm.options.groupSuppressBlankHeader = true
        vm.options.groupSuppressAutoColumn = true

        vm.options.isExternalFilterPresent = () => {
            vm.sfilter = vm.topSearch.split(' ')
            return vm.sfilter !== ""
        }


        $scope.$on('DATERANGE', (range) => {
               vm.mainDateFilter = {
                   start_date: moment(range.targetScope.vm.range.start,'YYYY-MM-DD').format('YYYY-MM-DD'),
                   end_date: moment(range.targetScope.vm.range.end,'YYYY-MM-DD').format('YYYY-MM-DD')
               }
               refreshForms()
        })

        profileService.getAllEmployeeProfile().then((response) => {
            vm.employees = profileService.readAllEmployeeProfile()
        })
    
        //Functions to convert IDs to names.
        function getEmployeeName(value) {
            let name = value.replace(" </br>", "")
            vm.employees.forEach((emp)=>{
                if(emp.per_id == name) {
                    name = emp.per_full_name
                }
            })
            return name
        }   

        vm.options.doesExternalFilterPass = (gridRow) => {
            let pass = false
            if (vm.topSearch.indexOf('?') === 0) {
                var submissionId = vm.topSearch.replace('?submissionId=', '')
            if (gridRow.data['ID'] == submissionId) {
                    return true
            }
                return false
            } else {
                if (vm.sfilter[0] === '')
                    pass = true
            
                let searchArray = []
                for (var property in gridRow.data) {
                    if (gridRow.data.hasOwnProperty(property)) {
                            //any property in the row matches search box
                        vm.sfilter.forEach((data) => {
                            if ((gridRow.data[property] + "").toLowerCase().indexOf(data.toLowerCase()) > -1) {
                                searchArray[data] = 1
                            }
                        })
                    }
                }
                let a = 0
                for (data in searchArray) 
                    a++

                if (a === vm.sfilter.length)
                    pass = true
            
                return pass
            }
        }

        vm.options.dateComponent = JUIDateComponent

        vm.exportDisabled = true
        //Function to disable action button
        vm.options.onSelectionChanged = (params) => {
            var selectedRows = vm.options.api.getSelectedRows()

            vm.exportDisabled = selectedRows.length === 0
            
            var urlParams = ""
            for (var i = 0; i < selectedRows.length; i++) {
                urlParams += "&ids=" + selectedRows[i].ID
                vm.parentHeaderId = selectedRows[i].ID
            }
            vm.reportInputs = urlParams
            $scope.$apply()
        }

        //Function to update grid when search is changed
        vm.topSearchChanged = () =>{
            vm.options.api.onFilterChanged();
        }

        //Function to open modals
        vm.openModal = (id) => {
            if ($scope.$$phase !== '$apply' && $scope.$$phase !== '$digest')
                $scope.$apply();
                switch(vm.activeFormID) {
                    case 372298: formTag = 'generalActionModal'
                        break
                    case 131042: formTag = 'hazardActionModal'
                        break
                    case 166071: formTag = 'positiveRecognitionModal'
                        break
                    default: formTag = `form-${vm.activeFormID}`
                        break
                }
            if(id === 'signoffConfirmationModal') {
                formTag = 'signoffConfirmationModal'
            }
            $('.modal .scroll').scrollTop(0);
            modalService.Open(formTag);
            vm.initializeSelect2(formTag)
        }

        //Function to close modals
        vm.closeModal = (id) => {
            modalService.Close(id)
        }

        //Function to open view attachment modal
        vm.openAttachmentModal = (attachmentMode, attachments, subId, fieldId) => {
            vm.attachmentModalFiles.length = 0
            vm.attachmentModalFiles.push.apply(vm.attachmentModalFiles, attachments)
            vm.attachmentMode = attachmentMode
            vm.selectedSubId = subId
            vm.selectedFieldId = fieldId
            vm.openModal('formModal')
        }

        //Function to open view signiture modal
        vm.openSigModal = (attachmentMode, attachments, subId, fieldId) => {
            vm.attachmentModalFiles.length = 0
            vm.attachmentModalFiles.push.apply(vm.attachmentModalFiles, attachments)
            vm.attachmentMode = attachmentMode
            vm.selectedSubId = subId
            vm.selectedFieldId = fieldId
            vm.openModal('sigModal')
        }

        vm.options.defaultColDef = {
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'columnsMenuTab'],
            headerCheckboxSelection: (params) => {
                var displayedColumns = params.columnApi.getAllDisplayedColumns()
                var thisIsFirstColumn = displayedColumns[0] === params.column
                return thisIsFirstColumn
            },
            checkboxSelection: (params) => {
                var displayedColumns = params.columnApi.getAllDisplayedColumns()
                var thisIsFirstColumn = displayedColumns[0] === params.column
                return thisIsFirstColumn
            }
        }

        //Set Ag-Grid column settings for hazards
        let formColumns = [
            {
                headerName: '',
                field: 'dummyCheckbox',
                maxWidth: 50,
                minWidth: 50,
                checkboxSelection: true,
                suppressMenu: true,
                suppressSorting: true,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
            },
            {
                field: "",
                headerName: "Review",
                minWidth: 125,
                maxWidth: 125,
                suppressSizeToFit: true,
                cellRenderer: function (params) {
                    return `<span ng-click="forms.signoff(data)" class="{{ data.MySignoffID > 0 ? 'text-success ' : 'pointer'}}" title="Review Submission"><i class="far fa-file-alt fa-lg"></i></span>`
                        + '<span title="Submission Review History" class="source signoff-count" ng-class="{ transparent: !data.signoffCount, pointer: !!data.signoffCount }" ng-click="forms.viewSignoffHistory(data);">{{ data.signoffCount }}</span>'
                        + `<span class="pointer text-left" ng-click="forms.viewReports($event,${params.data.ID})"><i class="fa fa-external-link-alt" title="Launch Report"></i></span>`;
                }, filter: 'agSetColumnFilter', menuTabs: ['filterMenuTab', 'columnsMenuTab']
            },
            {
                field: "ID",
                headerName: "ID",
                minWidth: 40,
                maxWidth: 40,
                hide: true,
                sort: 'desc'
            },
            {
                field: "FormSubmissionDate",
                headerName: "Submission Date",
                minWidth: 150,
                maxWidth: 150,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "SubmittedBy",
                headerName: "Submitted By",
                minWidth: 150,
                maxWidth: 250,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "HeaderDate",
                headerName: "Date",
                minWidth: 120,
                maxWidth: 120,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "equipment_identifier",
                headerName: "Equipment ID",
                hide: true,
                minWidth: 150,
                maxWidth: 150,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "site",
                headerName: "site",
                minWidth: 200,
                maxWidth: 250,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "job_number",
                headerName: "job_number",
                minWidth: 150,
                maxWidth: 150,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "level",
                headerName: "level",
                minWidth: 150,
                maxWidth: 150,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "workplace",
                headerName: "workplace",
                minWidth: 150,                
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "supervisor",
                headerName: "supervisor",
                minWidth: 150,
                maxWidth: 250,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },  
            {
                field: "equipment_name",
                headerName: "Equipment Name",
                hide: true,
                minWidth: 150,                
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                field: "equipment_comments",
                headerName: "Comments",
                hide:true,
                minWidth: 150,
                maxWidth: 250,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'columnsMenuTab'],
                cellRenderer: 'tippyCellRenderer',
            },
            {
                headerName:"Employee Name",
                field: "employee_name",
                minWidth: 150,
                maxWidth: 250,
                cellRenderer: function (params) {
                    return getEmployeeName(params.data.employee_name)
                    
                },
                valueGetter: function (params) {
                    return getEmployeeName(params.data.employee_name)
                    
                }
            } 
        ]

        vm.options.columnDefs = formColumns
  
        //Function to prep export
        vm.prepExport = () => {
            var exportFields = []
            for (var i = 0; i < vm.sections.length; i++) {
                for (let b = 0; b < vm.sections[i].Fields.length; b++) {
                    exportFields.push(vm.sections[i].Fields[b].Name)
                }
            }
            return {
                onlySelected: true,
                columnKeys: exportFields,
                processCellCallback: (params) => {
                    if (!!params.column.colDef.isAttachment) {
                    // return params.value.length;
                    }
                    return params.value
                }
            }
        }

        //Function to export csv
        vm.exportCSV = () => {
            var exportOptions = vm.prepExport()
            vm.options.api.exportDataAsCsv(exportOptions)
        }

        //Function to export xls
        vm.exportXLS = () => {
            var exportOptions = vm.prepExport()
            vm.options.api.exportDataAsExcel(exportOptions)
        }

        //Function to open archive submission modal
        vm.archiveSubmissions = () => {
            var rs = vm.options.api.getSelectedRows()
            if (rs.length > 0) {
                vm.subArchiveCount = rs.length
                vm.openModal('submissionArchiveModal')
            }
        }

        //Function to archive a submission
        vm.confirmArchiveSubmissions = () => {
            var rs = vm.options.api.getSelectedRows()
            var ids = []
            for (var i = 0; i < rs.length; i++) {
                ids.push(rs[i].ID)
            }
            formsService.archiveFormSubmissionsP(ids).then((r) => {
                if (r === true) {
                    vm.closeModal('submissionArchiveModal')
                    var trans = {
                        remove: rs
                    }
                    vm.options.api.updateRowData(trans)
                }
            })
        }

        //Function to launch report
        vm.viewReports = (e,id=null) =>{
            if(!e.ctrlKey){
                if(id == null)
                {
                    let rows = vm.options.api.getSelectedRows() 
                    rows.forEach(emp => {            
                    vm.reportURL =  $sce.trustAsResourceUrl(`${__env.pentahoUrl}/pentaho/api/repos/%3A${window.__env.pentahoPath}%3A${vm.singleServeReportUrl}/viewer?userid=${__env.pentahoUserName}&password=${window.__env.pentahoPassword}&paramid=${emp.ID}&paramurl=${__env.pentahoImagesUrl}&output-target=pageable/pdf`)
                    $window.open(vm.reportURL, "_blank")
                    })
                }
                else{
                    vm.reportURL =  $sce.trustAsResourceUrl(`${__env.pentahoUrl}/pentaho/api/repos/%3A${window.__env.pentahoPath}%3A${vm.singleServeReportUrl}/viewer?userid=${__env.pentahoUserName}&password=${window.__env.pentahoPassword}&paramid=${id}&paramurl=${__env.pentahoImagesUrl}&output-target=pageable/pdf`)
                    $window.open(vm.reportURL, "_blank")
                }

            }

        }        

        vm.headerDataContext = null
        //vm.signoffIdContext = null

        //Function to open review confirmation modal
        vm.signoff = (headerData) => {
            vm.headerDataContext = headerData
            if (headerData.MySignoffID > 0) {
                toastr.success("You have already Acknowleged this submission")
            } 
            else {
                vm.openModal('signoffConfirmationModal')
            }
        }

        //Function to add review
        vm.confirmSignoff = (headerData) => {
            signoffService.addSignoff(headerData.ID)
            .then((newSignoffId) => {
                if (newSignoffId.Payload != null) {
                    headerData.MySignoffID = newSignoffId.Payload
                    headerData.signoffCount = headerData.signoffCount + 1
                }
                vm.closeModal('signoffConfirmationModal')
            })
                 
        }

        //Function to open view review history modal
        vm.viewSignoffHistory = (rowData) => {
            if (!rowData.signoffCount) {
                return
            }
            vm.currentSignoffHistory = []
            vm.openModal('signoffHistoryModal')
            signoffService.getSignoffsByHeader(rowData.ID)
                .then((data) => {
                    vm.currentSignoffHistory = data
                })
        }

        //Get permissions for the user
        menuService.getPagePermissions().then((data) => {
            vm.permissions = data
            vm.canArchiveSubmissions = vm.permissions.includes('Archive Submissions') ? true : false
        })

        vm.back = ()=>{
            vm.reportURL = null
            refreshForms()
        }

        $(window).click((e) => {
            $('#myDropdown').removeClass('show')
        })

        $('.pointer').click(function (e){  
            if (e.ctrlKey) {
                return false;
            }
        });
        
        vm.exportPressed = () => {
            $('#myDropdown').addClass('show')
        }

        //Function to get form name & report url
        formsService.getFormDescription(formDescriptionId).then((formDescription) => { 
            vm.activeFormName = formDescription[0].FormName.replace('PARENT', "")
            vm.activeFormID = formDescription[0].FormID
            vm.appAvailable = formDescription[0].rpt_app_available
            formTag = `<form-${formDescription[0].FormID}></form-${formDescription[0].FormID}>`
            switch(formDescription[0].FormID) {
                case 372298:  formTag = `<general-action-form></general-action-form>`
                    break
                case 131042: formTag = `<hazard-action-form></hazard-action-form>`
                    break
                case 166071: formTag = '<positive-recognition-form></positive-recognition-form>'
                    break                    
                default: formTag = `<form-${formDescription[0].FormID}></form-${formDescription[0].FormID}>`
                    break
            }
            $("#form-placeholder").html($compile(formTag)($scope))

            if (formDescription[0].FormName.toLowerCase() === 'positive identification'){
                vm.activeFormName = 'Positive Recognition Report'
            }
            vm.singleServeReportUrl = formDescription[0].ReportURL
            vm.reportId = formDescription.SingleReportID
        })

        vm.currentUserName = null
        //Function to refresh data
        function refreshForms() {
            formsService.getFormFieldDescriptions(formDescriptionId).then((sections) => {
                vm.sections = sections
                payload = {
                    "frmdescid" : formDescriptionId,
                    "start_date" : vm.mainDateFilter.start_date,
                    "end_date" : vm.mainDateFilter.end_date
                }
                formsService.getFormSubmissions(payload).then((submissions) => {
                    if(formDescriptionId == 1389) {
                        formsService.getSubmissionsPreop(vm.mainDateFilter).then((preopSubmissions) => {
                           preopData =  insertPreOPData(collateSubmissions(submissions),preopSubmissions)
                           vm.options.columnApi.setColumnsVisible(['equipment_identifier', 'equipment_name', 'equipment_comments'], true)
                            vm.options.api.setRowData(preopData)
                                vm.options.api.sizeColumnsToFit()
                        })
                    } 
                    else {
                        if (!submissions) {
                            return
                        }
                            vm.options.api.setRowData(collateSubmissions(submissions))
                        vm.options.api.sizeColumnsToFit()
                    } 
           
                })
            })

        }

        // Initial refresh of forms
        // refreshForms()
        
        // function to insert preop data into the submissions
        function insertPreOPData(sub, preopSub){
            sub.forEach((rec)=>{
                let  obj= preopSub.find(obj => obj.SubmissionHeaderID == rec.ID)
                if(obj){
                    rec.equipment_identifier = obj.EquipmentIdentifier ? obj.EquipmentIdentifier : ""
                    rec.equipment_name = obj.EquipDesc ? obj.EquipDesc: ""
                    rec.equipment_comments = obj.comments ? obj.comments : ""
                }
            })
            return sub
        }

        //Function to prepare data for Ag-Grid
        function collateSubmissions(submissions) {
            console.log(submissions)
            let myIDs = []
            let myRecs = []
            submissions.forEach((subs) => {
                if (!myIDs.includes(subs.ID)) {
                    myIDs.push(subs.ID)                    

                    let recdata = {
                        ID: subs.ID,
                        Duration: subs.Duration,
                        FormCreationDate: subs.FormCreationDate,
                        FormSubmissionDate: subs.FormSubmissionDate,                        
                        MySignoffID: subs.MySignoffID,
                        JobNumber: subs.JobNumber,
                        Site: subs.Site,
                        SiteLevel: subs.SiteLevel,
                        SubmissionId: subs.SubmissionId,
                        SubmittedBy: subs.SubmittedBy,
                        Supervisor: subs.Supervisor,
                        Workplace: subs.Workplace,
                        signoffCount: subs.signoffCount
                    }    
                    
                    recdata.exceptionFields = ['SubmissionId']
                    if(subs.HeaderDate != null)
                        recdata.HeaderDate = moment(subs.HeaderDate).format('YYYY-MM-DD')
                    else
                        recdata.HeaderDate = ''

                    myRecs.push(recdata)
                }
            })
            submissions.forEach((recsubs) => {
                myRecs.forEach((recs) => {          
                    if (recs.ID === recsubs.ID ) {    
                        if(recs[recsubs.fieldKey] == null)
                        {
                        recs[recsubs.fieldKey] = ''
                        } 
                        let myDate = ""
                        if(recsubs.itemTimeStamp) {
                            myDate = ` (${moment(recsubs.itemTimeStamp).format('YYYY-MM-DD hh:mm:ss')})`
                        }
                        recs[recsubs.fieldKey] += (recsubs.itemValue + myDate + " </br> " )
                    }
                })
            })
            console.log("RECS:",myRecs)
            return myRecs
        }

        //Refresh grid when any form is submitted
        $scope.$on('REFRESH_FORMSUBMISSIONS', (event) => {
            refreshForms()
        })

        //Function to initialize select2
        vm.initializeSelect2 = (parent)=> {
        setTimeout(()=>{
        $('.select-single, .select-multiple')
            .select2({ theme: "material", allowClear: true, placeholder: "", width: '100%', dropdownParent: $(`#${parent} .modal-body`) })
            .on('select2:select', () => {
                $(this).parent().find('label').addClass('filled')
            })
            $('.select2-selection__arrow b').addClass("fa fa-caret-down") // Add caret on selects
        }, 100)
        $('.datepicker').pickadate({
            format: 'yyyy-mm-dd',            
        }).removeAttr('readonly')
        $('.datepicker').on('mousedown',function(event){
            event.preventDefault();})
        $('.timepicker').pickatime({
            twelvehour: true, 
            'default': '24:00'
        })
        $('.timepicker').on('mousedown',function(event){
            event.preventDefault();})
        }           

        //Update Ag-Grid size when window is resized
        $(window).on('resize', () => {
            $timeout(function () {
            if (vm.options.api) {
            vm.options.api.sizeColumnsToFit()
            }
            })
        })  
        vm.options.onGridReady= () =>{
            let fdi =  $routeParams.formDescriptionId
            if(fdi == 1386 || fdi == 1385 || fdi == 1381  ){
                 vm.options.columnApi.setColumnVisible('employee_name', true)
             } else {
                vm.options.columnApi.setColumnVisible ('employee_name', false) 
            }
        }

    //END
    }
])