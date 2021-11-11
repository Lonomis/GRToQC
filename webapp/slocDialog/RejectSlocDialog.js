sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/BusyIndicator'
], function(Object, Filter, FilterOperator, BusyIndicator) {
    'use strict';
    
    return Object.extend("zmmo071101.slocDialog.RejectSlocDialog", {
        constructor: function(oInputModel, oSlocModel){
            this._inputModel    =   oInputModel;
            this._slocModel     =   oSlocModel;
        },

        openDialog: async function(oView) {
            var oInputData  =   this._inputModel.getData();

            try {
                BusyIndicator.show(0);
                var oResult = await this._slocModel.buildSlocList("REJECT", oInputData.Plant);
                BusyIndicator.hide();
            } catch (oError) {
                BusyIndicator.hide();
            }

            this.buildDialog(oView);

            if (oResult.status === this._slocModel.SuccessStatus) {
                this._SlocSearchDialog.open();
            }

        },

        buildDialog : function(oView) {
            if (!this._SlocSearchDialog) {
                this._SlocSearchDialog = sap.ui.xmlfragment(
                    "zmmo071101.fragment.RejectSlocDialog",
                    this
                );

                oView.addDependent(this._SlocSearchDialog);
            }
        },

        onSlocChoose : function(oEvent) {
            var oInputData  =   this._inputModel.getData();

            oInputData.RejectStorageLocation = oEvent.getParameter("selectedItem").getProperty("title");
            
            this._inputModel.setData(oInputData);
        },

        onSearch: function(oEvent) {
            var sValue      =   oEvent.getParameter("value");
            var oFilter     =   new Filter("StorageLocation", FilterOperator.Contains, sValue); 
            var oBinding    =   oEvent.getSource().getBinding("items");

            oBinding.filter([oFilter]);
        }
    });
});