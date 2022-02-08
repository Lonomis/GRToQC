sap.ui.define([
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/library",
    "sap/ui/model/ValidateException",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/type/Integer"
], function(BusyIndicator, library, ValidateException, ResourceModel, Integer) {
    'use strict';

    return ({
        _MessageType:   library.MessageType,
        _ValueState:    library.ValueState,
        _ResourceBundle:    new ResourceModel({
            bundleName:         "zmmo071107.i18n.i18n",
            supportedLocales:   [""],
            fallbackLocales:    ""
        }).getResourceBundle(),

        getOrder107 :   async function(oOrderModel, oInputModel) {
            try {
                BusyIndicator.show(0);
                await oOrderModel.getOrder107(oInputModel);
                BusyIndicator.hide();
            } catch {
                BusyIndicator.hide();
            }
        },

        getMainOrderData :   async function(oOrderModel, oInputModel, oScreenManager) {
            try {
                BusyIndicator.show(0);
                await oOrderModel.getMainOrderData(oInputModel);
                oScreenManager.openInitScreenPerMode(oInputModel);
                BusyIndicator.hide();
            } catch {
                BusyIndicator.hide();
            }
        },
       
        openSlocSearchDialog : function(oSlocDialog, oView, sObject){
            oSlocDialog.openDialog(oView, sObject);
        },

        clearMessages : function(oMessageStrip, oMessagePopover, oInputModel) {
            oInputModel.refresh(true);
            oMessageStrip.clearMessageStrip();
            oMessagePopover.removeAllMessages();

        },

        validateRequiredFields : function(oMessagePopover){
            var aRequiredFields         = this.getFields('[data-required="true"]');
            var aMessages               = [];
            var aViolation              = [];
            var sMessage                = "";

            aRequiredFields.forEach((requiredField)=>{
                let oField = sap.ui.getCore().byId(requiredField.id);
                if (oField.getValue && !oField.getValue()) {
                    sMessage = this._ResourceBundle.getText("validate.required", [requiredField.name]);
                    aMessages.push(sMessage);
                    aViolation.push("required");
                    oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                    this.setValueState(oField, this._ValueState.Error, sMessage);
                } else {
                    this.setValueState(oField, this._ValueState.None, "");
                }
            });

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
        },

        validateRejectSloc : function(oInputModel, oMessagePopover) {
            var oInputData                  =   oInputModel.getData();
            var sRejectSlocFieldName        =   this._ResourceBundle.getText("rejectSloc");
            var aRejectSloc                 =   this.getFields('[data-name="' + sRejectSlocFieldName + '"]');
            var aMessages                   =   [];
            var aViolation                  =   [];
            var sMessage                    =   "";

            aRejectSloc.forEach((rejectSlocField)=>{
                let oField = sap.ui.getCore().byId(rejectSlocField.id);
                if (oField.getValue){
                    if (this.getLastDigit(oField.getValue()) !== this.getLastDigit(oInputData.ProductionVersion)){
                        sMessage        =   this._ResourceBundle.getText('validate.rejectSlocProdVer', [oInputData.ProductionVersion]);
                        aMessages.push(sMessage);
                        aViolation.push("rejectSloc");
                        oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                        this.setValueState(oField, this._ValueState.Error, sMessage);
                    } else {
                        this.setValueState(oField, this._ValueState.None, "");
                    }
                }
            });

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
        },

        getLastDigit: function(sString){
            var iLength = sString.length;

            return sString.substring(iLength - 1, iLength);
        },

        validateOrder : function(oInputModel, oMessagePopover) {
            var oInputData                  =   oInputModel.getData();
            var sOrderFieldName             =  this._ResourceBundle.getText("productionOrder");
            var aOrderFields                =  this.getFields('[data-name="' + sOrderFieldName +'"]');
            var aMessages   =   [];
            var aViolation  =   [];
            var sMessage    =   "";

            aOrderFields.forEach((orderField)=>{
                let oField = sap.ui.getCore().byId(orderField.id);
                if (oField.getValue && (oField.getValue() !== oInputData.MainProductionOrder)) {
                    sMessage = this._ResourceBundle.getText("validate.invalidOrder");
                    aMessages.push(sMessage);
                    aViolation.push("invalid Order");
                    oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                    this.setValueState(oField, this._ValueState.Error, sMessage);
                } else {
                    this.setValueState(oField, this._ValueState.None, "");
                }
            });

            if (aMessages.length > 0){
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
        },

        validateRequiredFieldsOrder : function(oMessagePopover){
            var aRequiredFields         = this.getFields('[data-requiredOrder="true"]');
            var aMessages               = [];
            var aViolation              = [];
            var sMessage                = "";

            aRequiredFields.forEach((requiredField)=>{
                let oField = sap.ui.getCore().byId(requiredField.id);
                if (oField.getValue && !oField.getValue()) {
                    sMessage = this._ResourceBundle.getText("validate.required", [requiredField.name]);
                    aMessages.push(sMessage);
                    aViolation.push("required");
                    oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                    this.setValueState(oField, this._ValueState.Error, sMessage);
                } else {
                    this.setValueState(oField, this._ValueState.None, "");
                }
            });

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
        },

        setValueState : function(oField, sValueState, sMessage) {
            if(oField.setValueState){
                oField.setValueState(sValueState);
                oField.setValueStateText(sMessage);
            }        
        },

        validateValue : function(oMessagePopover){
            this.validateCountField(oMessagePopover);
        },

        validateCountField : function(oMessagePopover){
            var sCountFieldName         =  this._ResourceBundle.getText("count");
            var aCountFields            =  this.getFields('[data-name="' + sCountFieldName +'"]');
            var aMessages               = [];
            var aViolation              = [];
            var sMessage                = "";
            var oInteger                = new Integer({},{
                minimum : 1,
                maximum : 99
            })

            aCountFields.forEach((countField)=>{
                let oField = sap.ui.getCore().byId(countField.id);
                if (oField.getValue && oField.getValue()){
                    try {
                        oInteger.validateValue(oField.getValue());
                        this.setValueState(oField, this._ValueState.None, "");
                    } catch (oError) {
                        sMessage = oError.message;
                        aMessages.push(sMessage);
                        aViolation = oError.aViolation;
                        oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                        this.setValueState(oField, this._ValueState.Error, sMessage);
                    }
                }
            });

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
        },

        validateCountWithComponent : function(oInputModel, oMessagePopover){
            var sCountFieldName         =  this._ResourceBundle.getText("count");
            var aCountFields            =  this.getFields('[data-name="' + sCountFieldName +'"]');
            var aMessages               = [];
            var aViolation              = [];
            var sMessage                = "";

            aCountFields.forEach((countField)=>{
                let oField = sap.ui.getCore().byId(countField.id);
                if (oField.getValue && oInputModel.findCount(oField.getValue())){
                    sMessage = this._ResourceBundle.getText("validate.duplicatedCount");
                    aMessages.push(sMessage);
                    aViolation.push("duplicated count");
                    oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                    this.setValueState(oField, this._ValueState.Error, sMessage);
                } else {
                    this.setValueState(oField, this._ValueState.None, "");
                }
            });

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
        },

        validateMaximumQty  : function(oInputModel, oMessagePopover){
            var oInputData              =   oInputModel.getData();
            var aMessages               =   [];
            var aViolation              =   [];
            var sMessage                =   "";
            
            if (oInputData.ComponentList.length === parseInt(oInputData.MaximumQty)){
                sMessage    =   this._ResourceBundle.getText("validate.MaximumQty", oInputData.MaximumQty);
                aMessages.push(sMessage);
                aViolation.push("maximum qty exceeded");
                oMessagePopover.addMessage(sMessage, this._MessageType.Error);
            }

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
        },

        resetInputValueState: function(){
            var aInputFields         = this.getFields('[data-input="true"]');

            aInputFields.forEach((inputField)=>{
                let oField = sap.ui.getCore().byId(inputField.id);
                this.setValueState(oField, this._ValueState.None, "");
            });
        },
       
        getFields : function(sSelector){
            var aRequireFieldId = [];

            $(sSelector).each(function(){
                aRequireFieldId.push({
                    id    : $(this).context.id,
                    name  : ($(this).context.attributes["data-name"].value? $(this).context.attributes["data-name"].value : "")
                });
            });

            return aRequireFieldId;
        },

       combineMessages : function(aMessages) {
		    if (aMessages.length === 1) {
			    return aMessages[0];
		    } else {
			    return aMessages.join(". ") + ".";
		    }
        }
        
    });
});