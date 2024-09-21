"use client";
import axios from "axios";
import React from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";
type PricingTier = {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  features: string[];
  popular?: boolean;
  disabled?: boolean;
};

const PricingSection: React.FC = () => {
  const { data: session, status } = useSession();
  const router= useRouter()
  const pricingTiers: PricingTier[] = [
    {
      disabled: true,
    
      id: "tier-standard",
      name: "Standard",
      price: "Free",
      originalPrice: "0₺/$",
      description: "",
      features: ["Free Llama Series", "Free Command R Series", "Customer Support","Lifetime access", "All AI features", "Use GreesyGuard"],
    },
    {
      id: "tier-extended",
      name: "Extended",
      price: "29.99₺",
      originalPrice: "39.99₺",
      description: "Get Higher Limits and Premium models",
      features: [
        "Special Role in Discord Server",
        "Built-in Web Search",
        "Premium Customer Support",
        "Monthly access",
        "All AI features",
        "5000 Total Credits",
        "Use Premium Models",
        "Use Greesychat",
        "Higher Rate limits 20 req per minute",
      ],
      popular: true,
    },
  ];

const handleLemonSqueezyCheckout = async (productId: string) => {
  if (!session?.user) {
    alert("You need to be logged in to make a purchase.");
    return;
  }

  try {
    const response = await axios.post("/api/billing/checkout", {
      customerEmail: session?.user.email,
      productId,
    });
    const { checkoutUrl } = response.data;
console.log(response.data)
    if (checkoutUrl) {
      // Attempt to use router.push for redirection
      try {
        await router.push(checkoutUrl);
      } catch (err) {
        console.error("Router push error:", err);
        // Fallback to window.location.href for redirection
        window.location.href = url;
      }
    } else {
      throw new Error("Checkout URL not received.");
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};
  return (
    <section className="flex flex-col items-center justify-center mt-8 z-10 backdrop-filter border-gradient-to-r bg-opacity-40 backdrop-blur-lg">
      <div className="p-4 sm:px-10 flex flex-col justify-center items-center text-base h-100vh mx-auto" id="pricing">
        <h3 className="text-5xl font-semibold text-center flex gap-2 justify-center mb-10">

        </h3>
        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative p-[2px] rounded-3xl ${
                tier.popular ? "bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500" : ""
              }`}
            >
              <div className="rounded-3xl bg-black p-8 xl:p-10">
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={`${
                      tier.popular ? "text-blue-600" : "text-gray-200"
                    } text-2xl font-semibold leading-8`}
                  >
                    {tier.name}
                  </h3>
                  {tier.popular && (
                    <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                      Most popular
                    </p>
                  )}
                </div>
                <p className="mt-4 text-base leading-6 text-gray-200">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="line-through text-2xl font-sans text-gray-400">{tier.originalPrice}</span>
                  <span className="text-5xl font-bold tracking-tight text-gray-200">{tier.price}</span>
                </p>
                <button
                  onClick={() => handleLemonSqueezyCheckout(tier.id)}
                  className={`${
                    tier.popular
                      ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                      : "text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300"
                  } ${tier.disabled ? "text-blue-700" : ""} mt-6 block rounded-md py-2 px-3 text-center text-base font-medium leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full`}
                >
                  {tier?.disabled ? "You have this" : "Buy now"}
                </button>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-400 xl:mt-10">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex gap-x-3 text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-blue-600"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;