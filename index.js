require('dotenv').load();

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = function(event, context) {

  if(!event.UDID){
    return context.fail(new Error("UDID is mandatory"));
  }

  stripe.charges.create({
    amount:        event.amount,
    source:        event.source,
    currency:      event.currency || 'usd',
    description:   event.description || 'Stripe payment '+event.order_id,
    receipt_email: event.receipt_email || process.env.RECEIPT_EMAIL
  }, function(err, charge) {
    if (err && err.type === 'card_error') {
      context.fail(new Error(err.message));
    } else if(err){
      context.fail(err);
    } else {
      context.succeed({ status: charge.status, success : true });
    }
  });
};
