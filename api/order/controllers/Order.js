'use strict';
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */



module.exports = {
    create: async ctx => {
        const { name, total, items, stripeTokenId } = ctx.request.body;
        const { id } = ctx.state.user;

        const charge = await stripe.charges.create({
            amount: Math.round(total * 100),
            currency: 'usd',
            source: stripeTokenId,
            description: `order ${new Date()} by ${ctx.state.user.username}`
        });

        const order = await stripe.services.order({
            name, total, items, user: id
        });

        return order;

    }
};
