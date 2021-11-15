sap.ui.define([
    "sap/ui/model/resource/ResourceModel"
], function(ResourceModel) {
    'use strict';
    
    return {
        _ResourceBundle:    new ResourceModel({
            bundleName:         "zmmo071107.i18n.i18n",
            supportedLocales:   [""],
            fallbackLocales:    ""
        }).getResourceBundle(),
        
        formatMaximumQty : function(aComponentList, iMaximumQty){
            var oResourceBundle     =   new ResourceModel({
                bundleName:         "zmmo071107.i18n.i18n",
                supportedLocales:   [""],
                fallbackLocales:    ""  
            }).getResourceBundle();

            return oResourceBundle.getText("maximumQty", 
                                            [parseFloat(aComponentList.length).toFixed(3), iMaximumQty]);
        }
    }
});