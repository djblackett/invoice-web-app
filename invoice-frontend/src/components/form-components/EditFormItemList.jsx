"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputFormItem1_1 = require("./InputFormItem1");
var EditFormItemListStyles_1 = require("../../styles/EditFormItemListStyles");
function EditFormItemList(_a) {
    var isDraft = _a.isDraft, invoice = _a.invoice, isEditOpen = _a.isEditOpen;
    return (<EditFormItemListStyles_1.ListContainer>
      <EditFormItemListStyles_1.ItemTitle>Item List</EditFormItemListStyles_1.ItemTitle>
      <EditFormItemListStyles_1.ItemsHeader>
        <EditFormItemListStyles_1.Col1>Item Name</EditFormItemListStyles_1.Col1>
        <EditFormItemListStyles_1.Col1>Qty.</EditFormItemListStyles_1.Col1>
        <EditFormItemListStyles_1.Col1>Price</EditFormItemListStyles_1.Col1>
        <EditFormItemListStyles_1.Col>Total</EditFormItemListStyles_1.Col>
      </EditFormItemListStyles_1.ItemsHeader>
      <EditFormItemListStyles_1.ItemsContainer>
        <InputFormItem1_1.default isDraft={isDraft} invoice={invoice} isEditOpen={isEditOpen}/>
      </EditFormItemListStyles_1.ItemsContainer>
    </EditFormItemListStyles_1.ListContainer>);
}
EditFormItemList.defaultProps = {
    isEditOpen: true,
    invoice: null
};
exports.default = EditFormItemList;
