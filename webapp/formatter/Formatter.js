sap.ui.define([
    "sap/ui/model/resource/ResourceModel"
], function(ResourceModel) {
    'use strict';
    
    return {
        _ResourceBundle:    new ResourceModel({
            bundleName:         "zmmo071101.i18n.i18n",
            supportedLocales:   [""],
            fallbackLocales:    ""
        }).getResourceBundle(),
        
        formatStandardPacking : function(aStdPacking, aComponentList){
            var oResourceBundle     =   new ResourceModel({
                bundleName:         "zmmo071101.i18n.i18n",
                supportedLocales:   [""],
                fallbackLocales:    ""  
            }).getResourceBundle();

            return oResourceBundle.getText("stdPackingComponent", 
                                            [aStdPacking.length, aComponentList.length]);
        }
    }
});