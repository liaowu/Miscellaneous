angular
    .module('safeToDo')
    .service('formsService', ['$http',
      function ($http) {
        let formSubmissions = [];
        let disciplines = [];
        var forms = {
            O: {},
            OR: {}, //reverse name:ID lookup
            A: []
        };
          
        function formatForms(data)  {
          let output = []
          let old = ''
          let a = 0
            data.forEach((record, index)=>{
              if(record.SectionName !== old) {
                output.push({
                  "SectionName" : record.SectionName,
                  "SectionOrder" : a,
                  "Fields" : [{
                      "ID": record.ID,
                      "Order": record.FieldOrder,
                      "Name": record.fieldKey,
                      "Display":record.fieldName ,
                      "Visible" : true,
                      "FieldType": record.fieldType,
                      "Width": null
                  }]
                })
                if(old !== '')
                  a++;
                }
              else {
                output[a].Fields.push( 
                  {
                    "ID": record.ID,
                    "Order": record.FieldOrder,
                    "Name": record.fieldKey,
                    "Display":record.fieldName ,
                    "Visible" : true,
                    "FieldType": record.fieldType,
                    "Width": null
                })
              }
              old = record.SectionName
              })
              return(output)
            }

          //var formsPromise = $http.get('/api/TopForm' + '?bust=' + new Date().getTime())
        var formsPromise = $http.get(`${__env.apiUrl}/api/form/get-all-top-forms/`)          
            .then((response) => {
                for (var i = 0; i < response.data.length; i++) {
                    forms.O[response.data[i].FormID] = response.data[i]
                    forms.OR[response.data[i].FormName] = response.data[i].FormID
                    forms.A.push(response.data[i])
                  }
              }, (args) => {
                console.log('Failed to load top form definitions.')
                console.log(args)
            });
        return {
          
          getFormSubmissions: (payload) => {
              return $http.post(`${__env.apiUrl}/api/form/get-submissions-by-userid-frmdescid/`,payload)
                .then((response) => {
                    //Check for error
                    if (response.data.accessMsg){
                      // console.log(response.data.accessMsg)
                      toastr.error(response.data.accessMsg)
                      return []
                    }
                          let firstRow = response.data[0]
                          if (firstRow && firstRow['error']) {
                              toastr.error(firstRow['error'])
                              return []
                        }
                        formSubmissions = response.data
                        return response.data
                      }, (errorParams) => {
                          console.log('Failed to load Form Submissions', errorParams)
                })
        },
        getSubmissionsPreop: (payload) => {
          return $http.post(`${__env.apiUrl}/api/form/get-submissions-by-userid-frmdescid-preop/`, payload)
            .then((response) => {
              return response.data
            }, (errorParams) => {
              console.log('Failed to load Form Preop Submissions', errorParams)
            })
        },

          readFormSubmissions: () => {
            return formSubmissions
          },

          getFormFieldDescriptions: (formDescriptionId) => {
            return $http.post(`${__env.apiUrl}/api/form/get-form-fields-by-id/`, {"id" : formDescriptionId})
              .then((response) => {
                formatForms(response.data) 
                return formatForms(response.data) 
                }, (errorParams) => {
                    console.log('Failed to load Form Field Descriptions',errorParams)
                });
          },

          getFormDescription: (formDescriptionId) => {
            //return $http.get('/api/forms/' + formDescriptionId + '?bust=' + new Date().getTime())
            return $http.post(`${__env.apiUrl}/api/form/get-form-description-by-id/`, { "id" : formDescriptionId }) 
                .then((response) => {
              return response.data
                }, (errorParams) => {
                  console.log('Failed to load Form Description')
                  console.log(errorParams)
              })
          },

          getTopFormDescriptionsP: () => {
            return formsPromise
          },

          getTopFormDescriptions: () => {
              return forms
          },

          archiveFormSubmissionsP: (submissionIdList) => {
            var patchList = []
            for (var i = 0; i < submissionIdList.length; i++) {
              patchList.push({ ID: submissionIdList[i], IsArchived: true })
            }
            return $http.post(`${__env.apiUrl}/api/submission/update-submission-archive/`, patchList).then(() => {
              return true
            }, (errorParams) => {
              console.log('Failed to delete attachment', errorParams)
              if(errorParams.status === 403 && errorParams.data.detail)
                      toastr.error(errorParams.data.detail)
              return false
            })
          }
      };
      
      }
    ]);