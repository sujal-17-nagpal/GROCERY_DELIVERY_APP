import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";
// place oder COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
  try {
    // console.log(req.body)
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    //calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // add tax charge (2%)
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res
      .status(200)
      .json({ success: true, message: "order placed successfully" });
  } catch (err) {
    console.log("order place error");
    return res.status(400).json({ message: err.message });
  }
};

// place oder STRIPE : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    let productData = [];

    //calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // add tax charge (2%)
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "ONLINE",
    });

    // STRIPE GATEWAY INITIALIZE
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Create line items for stripe
    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    // create session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

//Stripe Webhooks to Verify Payment Action : /action

export const stripeWebhooks = async (request, response) => {
  //STRIPE GATEWAY INITIALIZE

  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Getting session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;

      // Mark payment as paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      //clear user cart
      await User.findByIdAndUpdate(userId, { cartItems: {} });

      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Getting session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.error(`unhandled event type  ${event.type}`);
      break;
  }
  response.json({ received: true });
};

// get orders by user Id : /api/order/user

export const getUserOrder = async (req, res) => {
  try {
    // console.log(req.body)
    const userId = req.userId;
    // console.log()
    const orders = await Order.find({
      userId,
      
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

//get All orders (for seller/admin) : /api/order/seller

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find() 
      .populate("items.product address")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

