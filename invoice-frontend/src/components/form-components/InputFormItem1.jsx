"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_hook_form_1 = require("react-hook-form");
// import { v4 as uuidv4 } from "uuid";
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var editFormItemStyles_1 = require("../../styles/editFormItemStyles");
var NewItemButton_1 = require("../buttons/NewItemButton");
var useWindowWidth_1 = require("../../hooks/useWindowWidth");
var EditFormItemListStyles_1 = require("../../styles/EditFormItemListStyles");
function InputFormItem1(_a) {
  var isDraft = _a.isDraft,
    invoice = _a.invoice,
    isEditOpen = _a.isEditOpen;
  var _b = (0, react_hook_form_1.useFormContext)(),
    formState = _b.formState,
    register = _b.register,
    watch = _b.watch,
    clearErrors = _b.clearErrors,
    setError = _b.setError,
    resetField = _b.resetField;
  var _c = (0, react_hook_form_1.useFieldArray)({
      name: "items",
      rules: { required: true, minLength: 1 },
    }),
    fields = _c.fields,
    remove = _c.remove,
    append = _c.append;
  var errors = formState.errors,
    isSubmitting = formState.isSubmitting;
  var watchItems = watch("items", []);
  var watcher = watch();
  var width = (0, useWindowWidth_1.default)();
  var isInitialRender = (0, react_1.useRef)(true);
  // eslint-disable-next-line no-console
  // console.log(errors);
  (0, react_1.useEffect)(
    function () {
      if (!fields.length && !isInitialRender.current) {
        setError("myFieldArray", {
          type: "required",
          message: "At least one item is required",
        });
      } else {
        clearErrors("myFieldArray");
      }
      if (isInitialRender.current) {
        isInitialRender.current = false;
      }
    },
    [fields, isSubmitting],
  );
  (0, react_1.useEffect)(
    function () {
      if (invoice && isEditOpen) {
        // const {items} = getValues();
        // console.log(items);
        invoice.items.forEach(function (i) {
          // if (!items.includes(i)) {
          append({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            total: i.total,
          });
          // }
        });
      }
      if (!isEditOpen) {
        setTimeout(function () {
          resetField("items");
        }, 200);
      }
      // console.log("items added to form");
    },
    [invoice, isEditOpen],
  );
  // validation check for at least one item
  (0, react_1.useEffect)(
    function () {
      if (!watcher.items || watcher.items.length === 0) {
        setError("items", { type: "custom", message: "An item must be added" });
      }
    },
    [watcher.items],
  );
  var mobileRender = function (index) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return (
      <editFormItemStyles_1.ItemContainer>
        <editFormItemStyles_1.Box
          style={{ width: "100%", marginBottom: "1.5rem" }}
        >
          <EditFormItemListStyles_1.Col1 style={{ marginBottom: "1rem" }}>
            Item Name
          </EditFormItemListStyles_1.Col1>
          <editFormItemStyles_1.ItemName
            {...register("items[".concat(index, "].name"), {
              required: !isDraft,
            })}
            placeholder="Item name"
            defaultValue={
              invoice
                ? (_b =
                    (_a =
                      invoice === null || invoice === void 0
                        ? void 0
                        : invoice.items) === null || _a === void 0
                      ? void 0
                      : _a[index]) === null || _b === void 0
                  ? void 0
                  : _b.name
                : ""
            }
            type="text"
            style={{
              border:
                Array.isArray(errors.items) &&
                ((_d =
                  (_c =
                    errors === null || errors === void 0
                      ? void 0
                      : errors.items) === null || _c === void 0
                    ? void 0
                    : _c[index]) === null || _d === void 0
                  ? void 0
                  : _d.name)
                  ? "1px solid #EC5757"
                  : "",
            }}
          />
        </editFormItemStyles_1.Box>
        <editFormItemStyles_1.SmallBoxContainer>
          <editFormItemStyles_1.Box>
            <EditFormItemListStyles_1.Col style={{ marginBottom: "0.625rem" }}>
              Qty.
            </EditFormItemListStyles_1.Col>
            <editFormItemStyles_1.Quantity
              {...register("items[".concat(index, "].quantity"), {
                required: !isDraft,
                max: 100,
              })}
              placeholder="0"
              type="text"
              style={{
                border:
                  Array.isArray(errors.items) &&
                  ((_f =
                    (_e =
                      errors === null || errors === void 0
                        ? void 0
                        : errors.items) === null || _e === void 0
                      ? void 0
                      : _e[index]) === null || _f === void 0
                    ? void 0
                    : _f.quantity)
                    ? "1px solid #EC5757"
                    : "",
              }}
              defaultValue={
                invoice
                  ? (_h =
                      (_g =
                        invoice === null || invoice === void 0
                          ? void 0
                          : invoice.items) === null || _g === void 0
                        ? void 0
                        : _g[index]) === null || _h === void 0
                    ? void 0
                    : _h.quantity
                  : ""
              }
            />
          </editFormItemStyles_1.Box>
          <editFormItemStyles_1.Box>
            <EditFormItemListStyles_1.Col style={{ marginBottom: "0.625rem" }}>
              Price
            </EditFormItemListStyles_1.Col>
            <editFormItemStyles_1.Price
              {...register("items[".concat(index, "].price"), {
                required: !isDraft,
                max: 100000,
              })}
              placeholder="0.00"
              type="text"
              defaultValue={
                invoice
                  ? (_k =
                      (_j =
                        invoice === null || invoice === void 0
                          ? void 0
                          : invoice.items) === null || _j === void 0
                        ? void 0
                        : _j[index]) === null || _k === void 0
                    ? void 0
                    : _k.price
                  : ""
              }
              style={{
                border:
                  Array.isArray(errors.items) &&
                  ((_m =
                    (_l =
                      errors === null || errors === void 0
                        ? void 0
                        : errors.items) === null || _l === void 0
                      ? void 0
                      : _l[index]) === null || _m === void 0
                    ? void 0
                    : _m.price)
                    ? "1px solid #EC5757"
                    : "",
              }}
            />
          </editFormItemStyles_1.Box>
          <editFormItemStyles_1.TotalBox style={{ width: "fit-content" }}>
            <EditFormItemListStyles_1.Col style={{ marginBottom: "0.625rem" }}>
              Total
            </EditFormItemListStyles_1.Col>
            <editFormItemStyles_1.Total>
              {(
                Number(
                  (_o =
                    watchItems === null || watchItems === void 0
                      ? void 0
                      : watchItems[index]) === null || _o === void 0
                    ? void 0
                    : _o.quantity,
                ) *
                Number(
                  (_p =
                    watchItems === null || watchItems === void 0
                      ? void 0
                      : watchItems[index]) === null || _p === void 0
                    ? void 0
                    : _p.price,
                )
              ).toFixed(2)}
            </editFormItemStyles_1.Total>
          </editFormItemStyles_1.TotalBox>
        </editFormItemStyles_1.SmallBoxContainer>
        <editFormItemStyles_1.Box>
          <EditFormItemListStyles_1.Col style={{ marginBottom: "0.625rem" }}>
            {"  "}
          </EditFormItemListStyles_1.Col>
          <editFormItemStyles_1.SVG
            name="removeButton"
            onClick={function () {
              return remove(index);
            }}
          >
            {editFormItemStyles_1.deleteIcon}
          </editFormItemStyles_1.SVG>
        </editFormItemStyles_1.Box>
      </editFormItemStyles_1.ItemContainer>
    );
  };
  var tabletAndDesktopRender = function (index) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return (
      <editFormItemStyles_1.ItemContainer>
        <editFormItemStyles_1.MobileHelperContainer>
          <editFormItemStyles_1.ItemName
            {...register("items[".concat(index, "].name"), {
              required: !isDraft,
            })}
            placeholder="Item name"
            defaultValue={
              invoice
                ? (_b =
                    (_a =
                      invoice === null || invoice === void 0
                        ? void 0
                        : invoice.items) === null || _a === void 0
                      ? void 0
                      : _a[index]) === null || _b === void 0
                  ? void 0
                  : _b.name
                : ""
            }
            type="text"
            style={{
              border:
                Array.isArray(errors.items) &&
                ((_d =
                  (_c =
                    errors === null || errors === void 0
                      ? void 0
                      : errors.items) === null || _c === void 0
                    ? void 0
                    : _c[index]) === null || _d === void 0
                  ? void 0
                  : _d.name)
                  ? "1px solid #EC5757"
                  : "",
            }}
          />
          <editFormItemStyles_1.Quantity
            {...register("items[".concat(index, "].quantity"), {
              required: !isDraft,
              max: 100,
            })}
            placeholder="0"
            type="text"
            style={{
              border:
                Array.isArray(errors.items) &&
                ((_f =
                  (_e =
                    errors === null || errors === void 0
                      ? void 0
                      : errors.items) === null || _e === void 0
                    ? void 0
                    : _e[index]) === null || _f === void 0
                  ? void 0
                  : _f.quantity)
                  ? "1px solid #EC5757"
                  : "",
            }}
            defaultValue={
              invoice
                ? (_h =
                    (_g =
                      invoice === null || invoice === void 0
                        ? void 0
                        : invoice.items) === null || _g === void 0
                      ? void 0
                      : _g[index]) === null || _h === void 0
                  ? void 0
                  : _h.quantity
                : ""
            }
          />

          <editFormItemStyles_1.Price
            {...register("items[".concat(index, "].price"), {
              required: !isDraft,
              max: 100000,
            })}
            placeholder="0.00"
            type="text"
            defaultValue={
              invoice
                ? (_k =
                    (_j =
                      invoice === null || invoice === void 0
                        ? void 0
                        : invoice.items) === null || _j === void 0
                      ? void 0
                      : _j[index]) === null || _k === void 0
                  ? void 0
                  : _k.price
                : ""
            }
            style={{
              border:
                Array.isArray(errors.items) &&
                ((_m =
                  (_l =
                    errors === null || errors === void 0
                      ? void 0
                      : errors.items) === null || _l === void 0
                    ? void 0
                    : _l[index]) === null || _m === void 0
                  ? void 0
                  : _m.price)
                  ? "1px solid #EC5757"
                  : "",
            }}
          />

          <editFormItemStyles_1.Total>
            {(
              Number(
                (_o =
                  watchItems === null || watchItems === void 0
                    ? void 0
                    : watchItems[index]) === null || _o === void 0
                  ? void 0
                  : _o.quantity,
              ) *
              Number(
                (_p =
                  watchItems === null || watchItems === void 0
                    ? void 0
                    : watchItems[index]) === null || _p === void 0
                  ? void 0
                  : _p.price,
              )
            ).toFixed(2)}
          </editFormItemStyles_1.Total>
          <editFormItemStyles_1.SVG
            name="removeButton"
            onClick={function () {
              return remove(index);
            }}
          >
            {editFormItemStyles_1.deleteIcon}
          </editFormItemStyles_1.SVG>
        </editFormItemStyles_1.MobileHelperContainer>
      </editFormItemStyles_1.ItemContainer>
    );
  };
  return (
    <>
      <ul style={{ listStyle: "none", marginLeft: "0", paddingLeft: 0 }}>
        {fields.map(function (item, index) {
          return (
            <li key={item.id}>
              <div>
                {width < 600 && mobileRender(index)}
                {width >= 600 && tabletAndDesktopRender(index)}
              </div>
            </li>
          );
        })}
      </ul>
      <NewItemButton_1.default
        append={append}
        items={invoice ? invoice.items : []}
      />
    </>
  );
}
exports.default = InputFormItem1;
InputFormItem1.defaultProps = {
  isEditOpen: false,
  invoice: null,
};
InputFormItem1.propTypes = {
  isDraft: prop_types_1.default.bool.isRequired,
  isEditOpen: prop_types_1.default.bool,
  // invoice: PropTypes.instanceOf(Invoice)
};
