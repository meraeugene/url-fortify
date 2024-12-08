export const createCheckoutSession = async ({
  amount,
  description,
  name,
  planId,
  userId,
  email,
  fullName,
  invoiceNumber,
}: {
  amount: number;
  description: string;
  name: string;
  planId: string;
  userId: string;
  email: string;
  fullName: string;
  invoiceNumber: string;
}) => {
  try {
    const apiUrl = "https://api.paymongo.com/v1/checkout_sessions";
    const apiKey = process.env.PAYMONGO_SECRET_ACCESS_KEY!;

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: {
              name: fullName,
              email,
            },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            // cancel_url: "http://localhost:3000/available-plans",
            cancel_url: "https://url-fortify.vercel.app/available-plans",
            line_items: [
              {
                currency: "PHP",
                images: [
                  "https://url-fortify.s3.ap-southeast-2.amazonaws.com/url-fortify-logo.png",
                ],
                amount,
                description,
                name,
                quantity: 1,
              },
            ],
            payment_method_types: ["gcash", "grab_pay", "paymaya"],
            success_url: `https://url-fortify.vercel.app/subscription/processing/${invoiceNumber}`,
            // success_url: `https://url-fortify.vercel.app/subscription/success/${invoiceNumber}`,
            description: `${name} / ${description}`,
            metadata: {
              plan_id: planId,
              user_id: userId,
              invoice_number: invoiceNumber,
            },
          },
        },
      }),
    };

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors[0].detail);
    }

    return response.json();
  } catch (error) {
    console.log("console error", error);
    throw error;
  }
};
