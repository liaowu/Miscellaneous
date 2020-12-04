angular
    .module('safeToDo')
    .service('employeeDepartureService', ['$http',
        function ($http) {            
            return {                
                createEmployeeDeparture: (payload) => {
                    console.log("This is the Employee departure payload", payload)
                    return $http.post(`${__env.apiUrl}/api/wafs/form-submission-engine/`, payload).then((response) => {
                        return response.data
                    }, (errorParams) => {
                        console.log('Failed to create Employee departure Audit', errorParams)
                    })
                },
            //END
            }        
        }
    ])