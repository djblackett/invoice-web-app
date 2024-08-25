import {render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import {HashRouter} from "react-router-dom";
import React from "react";
import AllInvoices from "../pages/AllInvoices";
import store from "../app/store";


describe("AllInvoices", () => {
  it("renders without crashing", () => {
    const setScrollPosition = jest.fn();
    render(
      <Provider store={store}>
        <HashRouter>
          <AllInvoices  setScrollPosition={setScrollPosition}/>
        </HashRouter>
      </Provider>
    );

    expect(screen.getByText("Invoices")).toBeInTheDocument();
    expect(screen.getByText(/new invoice/i)).toBeInTheDocument();
  });
});
