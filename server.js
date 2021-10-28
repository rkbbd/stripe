var express = require('express');
var app = express();
app.set('view engine', 'ejs');

let stripe;

app.get('/', function (req, res) {
  try {
    stripe = require("stripe")('sk_test_51JcWm6AvjocdzRpfvenHnGF5b96jyNPkF0DBXlUbkwPyicekoGBvPGpUDBY6XTuf8NTsO8d83SOi3fwsjJFQd3BY00x9awPg6v');
    res.render('pages/client', {
      client_key: 'pk_test_51JcWm6AvjocdzRpfn9r9y9uNwv9jabzsBKpIplHbJIDvu75oT2rDR1Yz4WnVoM0yqRgk84BBB0sXvC4nQl61O6IM00dqhjYWKb',
      amount: 1000,
    });
  } catch (error) {
    res.send("Internal server error!")
  }
});

app.post('/create-payment-intent', async function (req, res) {
  try {
    // const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency: "eur"
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.log(err)
  }
});




//TEST
//TEST Checkout--Successful
///////////Summary///////////
// Checkout and recurring payment
////////////////////////////
app.get('/public/checkout', async (req, res) => {
  stripe = require("stripe")('sk_test_51JcWm6AvjocdzRpfvenHnGF5b96jyNPkF0DBXlUbkwPyicekoGBvPGpUDBY6XTuf8NTsO8d83SOi3fwsjJFQd3BY00x9awPg6v');
  const customer = await stripe.customers.create();

  const intent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: 'off_session',
    amount: 1099,
    currency: 'eur',
    payment_method_types: ['card'],
  });

  res.render('pages/checkout', { client_secret: intent.client_secret });
});

app.get('/public/success-redirect', //Checkout_page success url
  async (req, res) => {
    res.render('pages/success-redirect');
  });

app.get('/public/recurring-payment',
  async (req, res) => {
    try {
      stripe = require("stripe")('sk_test_51JcWm6AvjocdzRpfvenHnGF5b96jyNPkF0DBXlUbkwPyicekoGBvPGpUDBY6XTuf8NTsO8d83SOi3fwsjJFQd3BY00x9awPg6v');
      const paymentMethods = await stripe.paymentMethods.list({
        customer: 'cus_KSHGXwZtkOH3eA',
        type: 'card',
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1200,
        currency: 'eur',
        customer: 'cus_KSHGXwZtkOH3eA',
        payment_method: paymentMethods.data[0].id,
        off_session: true,
        confirm: true,
      });

    } catch (err) {
      // Error code will be authentication_required if authentication is needed
      console.log('Error code is: ', err);
      const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
      console.log('PI retrieved: ', paymentIntentRetrieved.id);
    }
    res.send("end");
  })

//TEST 1- Checkout page
///////////Summary///////////
// customer created automatically, redirect to stripe page with product info
////////////////////////////
// app.route('/public/stripe_client_accept_payment')
//     .get(async (req, res) => {

//         const session = await stripe.checkout.sessions.retrieve('pk_test_51JcWm6AvjocdzRpfn9r9y9uNwv9jabzsBKpIplHbJIDvu75oT2rDR1Yz4WnVoM0yqRgk84BBB0sXvC4nQl61O6IM00dqhjYWKb');
//         console.log('retrieve', session)

//         res.render('pages/stripe_client_accept_payment');
//     })
// app.route('/public/create-checkout-session')
//     .post(async (req, res) => {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: 'T-shirt',
//                         },
//                         unit_amount: 2000,
//                     },
//                     quantity: 1

//                 },
//             ],

//             mode: 'payment',
//             success_url: 'https://example.com/success',
//             cancel_url: 'https://example.com/cancel',
//         });

//         console.log('session checkout', session)
//         res.redirect(303, session.url);
//     });

//TEST 2- Create Customer
/////////////////////////////
// doc: https://stripe.com/docs/api/customers/create
/////////////////////////////
// app.route('/public/stripe_client_accept_payment')
//     .get(async (req, res) => {
//         const customer = await stripe.customers.create({
//             description: 'My First Test Customer (created for API docs)',
//             email: 'rakib@email.com'
//         });
//         console.log('customer created', customer)
//         res.render('pages/stripe_client_accept_payment');
//     })

//TEST 3- Retrieve Customer
/////////////////////////////
// doc: https://stripe.com/docs/api/customers/retrieve
/////////////////////////////
// app.route('/public/stripe_client_accept_payment')
//     .get(async (req, res) => {
//         const customer = await stripe.customers.retrieve(
//             'cus_KHpT0qSAAqsJMf'
//         );
//         console.log('retrieve customer', customer)
//         res.render('pages/stripe_client_accept_payment');
//     })

//TEST 4- Future Payment - incomplete
// app.route('/public/stripe_client_accept_payment')
//     .get(async(req, res) => {

//         // const session = await stripe.checkout.sessions.retrieve('cs_test_MlZAaTXUMHjWZ7DcXjusJnDU4MxPalbtL5eYrmS2GKxqscDtpJq8QM0k');
//         // console.log('session', session);
//         res.render('pages/stripe_client_accept_payment');
//     })
// app.route('/public/create-checkout-session')
//     .post(async (req, res) => {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             mode: 'setup',
//             customer: 'cus_KHpT0qSAAqsJMf',
//             success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
//             cancel_url: 'https://example.com/cancel',
//         });
//         console.log('created session',session)
//     });


//TEST 4- Future Payment
/////////////////////////////
// doc: https://stripe.com/docs/payments/save-and-reuse
/////////////////////////////


app.get('/public/card_wallet', async (req, res) => {
  const customer = await stripe.customers.create();
  console.log('customer-', customer)
  const intent = await stripe.setupIntents.create({
    customer: customer.id,
  });
  console.log('intent', intent);
  res.render('pages/stripe/card_wallet', {
    client_key: 'pk_test_51JcWm6AvjocdzRpfn9r9y9uNwv9jabzsBKpIplHbJIDvu75oT2rDR1Yz4WnVoM0yqRgk84BBB0sXvC4nQl61O6IM00dqhjYWKb',
    client_secret: intent.client_secret
  });
})
app.get('/public/future_payment', async (req, res) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: 'cus_KOpMNoqrx94iiG',
    type: 'card',
  });

  console.log('payment method', paymentMethods)


  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'eur',
      customer: 'cus_KOpMNoqrx94iiG',
      payment_method: 'pm_1Jjm3XAvjocdzRpfo4U7Dl7Z',
      off_session: true,
      confirm: true,
    });

    res.send({
      clientSecret: paymentIntent
    });

    console.log('paymentIntent', paymentIntent)
  } catch (err) {
    console.log(err)
    // Error code will be authentication_required if authentication is needed
    // console.log('Error code is: ', err.code);
    // const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
    // console.log('PI retrieved: ', paymentIntentRetrieved.id);
  }


});









app.listen(8080);
console.log('Server is listening on port 8080');

///npm run serve