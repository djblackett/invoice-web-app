/* eslint-disable react/no-unescaped-entities */

import {AddressDetailInput, BillText, CountryInput, ErrorText, Input, Label} from "../../styles/editStyles";
import LongFormEntry from "./LongFormEntry";
import AddressBox from "./AddressBox";
import {CityPostContainer} from "./CompanyFormInfo";
import FormEntry from "./FormEntry";
import {DateAndPayment} from "./DateAndPayment";
import EditFormItemList from "./EditFormItemList";
import NewInvoiceBottomMenu from "../menus-toolbars/NewInvoiceBottomMenu";
import {useForm} from "react-hook-form";
import PropTypes from "prop-types";
import {useWindowWidth} from "../../hooks/useWindowWidth";
import {useEffect, useState} from "react";

export default function NewInvoiceForm({ editPageWidth, onSubmit, startDate, setStartDate, items, setItems, setIsNewOpen, isSubmitDirty, setSubmitDirty, isDraft, setIsDraft, setSelectedPaymentOption, selectedPaymentOption}) {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        reset
    } = useForm();

    const width = useWindowWidth();

    const errorStyle = (name) => {
        return { border: errors[name] ? "1px solid red" : "" }
    };

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    useEffect(() => {
        reset();
    }, [isSubmitSuccessful])

    const handlePaymentClick = (e) => {

        setIsPaymentOpen(!isPaymentOpen);
    };
    const handleChangeSelectedOption = (option) => {
        setSelectedPaymentOption(option);
    }

    const handlePaymentSelect = (e) => {
        setIsPaymentOpen(false);
    }


    const clientCountryChildren = (
        <>
            <Label
                htmlFor="country"
            >
                Country
            </Label>
            <CountryInput
                style={errorStyle('country')}
                type="text"

                {...register("country", {required: !isDraft })}
            />
        </>
    );


    return (
        // "handleSubmit" will validate your inputs before invoking "onSubmit"
    <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function *, {required: !isDraft /}

          {/*   client details */}
        <BillText>Bill To</BillText>
        <LongFormEntry>
            <Label htmlFor="clientName">Client's Name</Label>
            <Input
                type="text"
                long
                style={errorStyle('clientName')}
                {...register("clientName", {required: !isDraft})}
            />
        </LongFormEntry>
        <LongFormEntry>
            <Label htmlFor="clientEmail">Client's Email</Label>
            <Input
                long
                style={errorStyle('clientEmail')}
                {...register("clientEmail", {required: !isDraft})}
            />
        </LongFormEntry>
        <LongFormEntry>
            <Label htmlFor="clientStreetAddress">Street Address</Label>
            <Input
                long
                style={errorStyle("clientStreetAddress")}
                {...register("clientStreetAddress", {required: !isDraft})}
            />
        </LongFormEntry>
        <AddressBox>
            <CityPostContainer>
                <FormEntry>
                    <Label htmlFor="clientCity">City</Label>
                    <AddressDetailInput
                        style={errorStyle("clientCity")}
                        type="text"
                        {...register("clientCity", {required: !isDraft})}
                    />
                </FormEntry>

                <FormEntry>
                    <Label htmlFor="clientPostalCode">Post Code</Label>
                    <AddressDetailInput
                        type="text"
                        style={errorStyle("clientPostalCode")}
                        {...register("clientPostalCode", {required: !isDraft})}
                    />
                </FormEntry>
            </CityPostContainer>


            {width < 768 && <LongFormEntry isLongOnMobile={editPageWidth < 768}>
                {clientCountryChildren}
            </LongFormEntry>}

            {width >= 768 && <FormEntry>
                {clientCountryChildren}
            </FormEntry>}

        </AddressBox>


        <DateAndPayment editPageWidth={editPageWidth} selected={startDate} onChange={(date) => setStartDate(date)}
                        handlePaymentSelect={handlePaymentSelect} paymentOpen={isPaymentOpen}
                        handlePaymentClick={handlePaymentClick} selectedPaymentOption={selectedPaymentOption}
                        handleChangeSelectedOption={handleChangeSelectedOption}/>


        <LongFormEntry isLongOnMobile={editPageWidth < 768}>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Input
                style={errorStyle("projectDescription")}
                type="text"
                long
                {...register("projectDescription", {required: !isDraft})}
            />
        </LongFormEntry>

        <EditFormItemList
            items={items}
            setItems={setItems}
        />

        {isSubmitDirty && <ErrorText>- All fields must be added</ErrorText>}
        {(isSubmitDirty && items.length === 0) && <ErrorText>- An item must be added</ErrorText>}

        <NewInvoiceBottomMenu setSubmitDirty={setSubmitDirty} setIsDraft={setIsDraft} setIsOpen={setIsNewOpen}
                              saveText={"Save & Send"} closeText={"Discard"}
                              justifyCancel={"flex-start"} reset={reset }
            setItems={setItems}
        />
    </form>

    )}

NewInvoiceForm.propTypes = {
    editPageWidth: PropTypes.number,
    onSubmit: PropTypes.func.isRequired,
    startDate: PropTypes.object.isRequired,
    setStartDate: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    setItems: PropTypes.func.isRequired,
    setIsNewOpen: PropTypes.func.isRequired,
    isSubmitDirty: PropTypes.bool.isRequired,
    setSubmitDirty: PropTypes.func.isRequired,
    isDraft: PropTypes.bool.isRequired,
    setIsDraft: PropTypes.func.isRequired,
    setSelectedPaymentOption: PropTypes.func.isRequired,
    selectedPaymentOption: PropTypes.number.isRequired,
}