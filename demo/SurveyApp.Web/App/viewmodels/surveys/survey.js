﻿define(['./relation', './techProduct', 'api/surveyApi'],
function (relation, techProduct, surveyApi) {
    return function (apiSurvey) {
        var self = this;

        //perform custom mappings for child fields of the C# type Survey here
        //otherwise fields will be recursively turned into observables automatically
        //we only do this on fields that we want to 'extend' the functionality of the .NET type

        var settings = {
            Children: {
                create: function (options) {
                    return new relation(options.data, self);
                }    
            },

            TechProducts: { //tech products have special functionality and display logic so we substitue our own .NET type
                create: function (options) {
                    return new techProduct(options.data /*this is the C# TechProduct*/, self);
                }
            }
        };

        ko.mapping.fromJS(apiSurvey, settings, self);
        
        self.PersonIdNumber.extend({
            asyncValidation: function () {
                return surveyApi.validateIdNumberUnique(self.PersonIdNumber(), self.Id());
            }
        });
    };
});