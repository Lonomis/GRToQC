sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/BusyIndicator'
], function(Object, Filter, FilterOperator, BusyIndicator) {
    'use strict';
    
    return Object.extend("zmmo071107.slocDialog.SlocDialog", {
        constructor: function(oInputModel, oSlocModel){
            this._inputModel    =   oInputModel;
            this._slocModel     =   oSlocModel;
        },

        openDialog: async function(oView, sObject) {
            var oInputData  =   this._inputModel.getData();
            var oResult     =   {};

            try {
                BusyIndicator.show(0);
                if (oInputData.Reject){
                    oResult = await this._slocModel.buildSlocList(sObject, oInputData.Plant);
                } else {
                    oResult = await this._slocModel.buildSlocPCFList(oInputData.ProductionOrder);
                }
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
                    "zmmo071107.fragment.SlocDialog",
                    this
                );

                oView.addDependent(this._SlocSearchDialog);
            }
        },

        onSlocChoose : function(oEvent) {
            var oInputData  =   this._inputModel.getData();

            oInputData.StorageLocation = oEvent.getParameter("selectedItem").getProperty("title");
            
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