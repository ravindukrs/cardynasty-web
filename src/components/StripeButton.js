import React from 'react'
import StripeCheckout from 'react-stripe-checkout'

const StripeButton = ({price, setToken}) => {
    const stripePrice = price*100;
    const publishableKey = "pk_test_51HAFbBFw1TPPOgkrl0oBys0MaEC1B6CHfWoCToO8iiczS78AGesuyWjm3yXhyPeeSZw7Y6QflA6LCPbczAQ2M07B00o7utrcpb"

    const onToken = (token) => {
        console.log(token);
        setToken(token)
        alert("Payment Completed")
    }

    return(
        <StripeCheckout
            label="Purchase Report"
            name="CarDynasty - Report Payment"
            description={`Your total is $${price}`}
            amount={stripePrice}
            panelLabel="Purchase Report"
            token={onToken}
            stripeKey={publishableKey}
        />
    )
}

export default StripeButton