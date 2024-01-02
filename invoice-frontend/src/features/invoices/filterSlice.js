"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectFilter = exports.changeFilter = exports.filterSlice = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var initialState = {
  filter: { draft: false, paid: false, pending: false },
};
exports.filterSlice = (0, toolkit_1.createSlice)({
  name: "filter",
  initialState: initialState,
  reducers: {
    changeFilter: function (state, action) {
      var status = action.payload;
      state.filter[status] = !state.filter[status];
    },
  },
});
exports.changeFilter = exports.filterSlice.actions.changeFilter;
var selectFilter = function (state) {
  return state.filter.filter;
};
exports.selectFilter = selectFilter;
exports.default = exports.filterSlice.reducer;
