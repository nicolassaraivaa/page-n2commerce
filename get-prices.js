const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Error: STRIPE_SECRET_KEY environment variable is not set");
  console.error("Please set it before running: export STRIPE_SECRET_KEY=sk_test_...");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
  const products = [
    "prod_Tjn2micBC2ILyn",
    "prod_Tjn3Q20jQDAEHm",
    "prod_Tjn6hnSN46Fypg",
  ];

  for (const prod of products) {
    try {
      const prices = await stripe.prices.list({ product: prod, limit: 10 });
      if (prices.data.length > 0) {
        prices.data.forEach((p) => {
          console.log(
            `${prod} => ${p.id} | ${p.unit_amount / 100} ${p.currency} / ${
              p.recurring?.interval
            }`
          );
        });
      } else {
        console.log(`${prod} => No price found`);
      }
    } catch (e) {
      console.error(`Error for ${prod}:`, e.message);
    }
  }
}

main();
