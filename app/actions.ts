import mongoose from 'mongoose';
import { Plan, Subscription, WebhookEvent } from '../schemas/Plan'; // Adjust path as needed

export async function syncPlans() {
  configureLemonSqueezy();

  const productVariants = await Plan.find().exec();

  async function _addVariant(variant) {
    await Plan.findOneAndUpdate(
      { variantId: variant.variantId },
      variant,
      { upsert: true, new: true }
    );
    productVariants.push(variant);
  }

  const products = await listProducts({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    include: ["variants"],
  });

  const allVariants = products.data?.included;

  if (allVariants) {
    for (const v of allVariants) {
      const variant = v.attributes;
      if (variant.status === "draft" || (allVariants.length !== 1 && variant.status === "pending")) {
        continue;
      }
      const productName = (await getProduct(variant.product_id)).data?.data.attributes.name ?? "";
      const variantPriceObject = await listPrices({
        filter: {
          variantId: v.id,
        },
      });
      const currentPriceObj = variantPriceObject.data?.data[0];
      const isUsageBased = currentPriceObj?.attributes.usage_aggregation !== null;
      const price = isUsageBased
        ? currentPriceObj?.attributes.unit_price_decimal
        : currentPriceObj.attributes.unit_price;
      const priceString = price !== null ? (price?.toString() ?? "") : "";
      const isSubscription = currentPriceObj?.attributes.category === "subscription";
      if (!isSubscription) {
        continue;
      }
      await _addVariant({
        name: variant.name,
        description: variant.description,
        price: priceString,
        interval: currentPriceObj?.attributes.renewal_interval_unit,
        intervalCount: currentPriceObj?.attributes.renewal_interval_quantity,
        isUsageBased,
        productId: variant.product_id,
        productName,
        variantId: parseInt(v.id),
        trialInterval: currentPriceObj?.attributes.trial_interval_unit,
        trialIntervalCount: currentPriceObj?.attributes.trial_interval_quantity,
        sort: variant.sort,
      });
    }
  }
  revalidatePath("/");
  return productVariants;
}

export async function storeWebhookEvent(eventName, body) {
  /*if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set");
  }*/

  const id = crypto.randomInt(100000000, 1000000000);

  const webhookEvent = new WebhookEvent({
    id,
    eventName,
    processed: false,
    body,
  });

  await webhookEvent.save();
  return webhookEvent;
}

export async function processWebhookEvent(webhookEvent) {
  configureLemonSqueezy();

  const dbWebhookEvent = await WebhookEvent.findById(webhookEvent.id).exec();

  if (!dbWebhookEvent) {
    throw new Error(`Webhook event #${webhookEvent.id} not found in the database.`);
  }

  if (!process.env.WEBHOOK_URL) {
    throw new Error(
      "Missing required WEBHOOK_URL env variable. Please, set it in your .env file.",
    );
  }

  let processingError = "";
  const eventBody = webhookEvent.body;

  if (!webhookHasMeta(eventBody)) {
    processingError = "Event body is missing the 'meta' property.";
  } else if (webhookHasData(eventBody)) {
    if (webhookEvent.eventName.startsWith("subscription_")) {
      const attributes = eventBody.data.attributes;
      const variantId = attributes.variant_id as string;

      const plan = await Plan.findOne({ variantId: parseInt(variantId, 10) }).exec();

      if (!plan) {
        processingError = `Plan with variantId ${variantId} not found.`;
      } else {
        const priceId = attributes.first_subscription_item.price_id;
        const priceData = await getPrice(priceId);

        if (priceData.error) {
          processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
        }

        const isUsageBased = attributes.first_subscription_item.is_usage_based;
        const price = isUsageBased
          ? priceData.data?.data.attributes.unit_price_decimal
          : priceData.data?.data.attributes.unit_price;

        const updateData = {
          lemonSqueezyId: eventBody.data.id,
          orderId: attributes.order_id as number,
          name: attributes.user_name as string,
          email: attributes.user_email as string,
          status: attributes.status as string,
          statusFormatted: attributes.status_formatted as string,
          renewsAt: attributes.renews_at as string,
          endsAt: attributes.ends_at as string,
          trialEndsAt: attributes.trial_ends_at as string,
          price: price?.toString() ?? "",
          isPaused: false,
          subscriptionItemId: attributes.first_subscription_item.id,
          isUsageBased: attributes.first_subscription_item.is_usage_based,
          userId: eventBody.meta.custom_data.user_id,
          planId: plan._id,
        };

        try {
          await Subscription.findOneAndUpdate(
            { lemonSqueezyId: eventBody.data.id },
            updateData,
            { upsert: true, new: true }
          );
        } catch (error) {
          processingError = `Failed to upsert Subscription #${updateData.lemonSqueezyId} to the database.`;
          console.error(error);
        }
      }
    }

    await WebhookEvent.findByIdAndUpdate(webhookEvent.id, {
      processed: true,
      processingError,
    });
  }
}