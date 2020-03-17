const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_uDpsb45Q2RafPC94m1LKGYt800b1sJ6Aa5');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.payWithStripe = functions.https.onRequest((request, response) => {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys

    // eslint-disable-next-line promise/catch-or-return
    stripe.charges.create({
        amount: 100,
        currency: 'usd',
        source: request.body.token,
    }).then((charge) => {
        // asynchronously called
        response.send(charge);
    }).catch(err => {
        console.log(err);
    });

});
