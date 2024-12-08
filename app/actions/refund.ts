export const createRefundSession = async ({
  amount,
  reason,
  paymentId,
  userId,
  paymentMongoId,
}: {
  amount: string;
  reason: string;
  paymentId: string;
  userId: string;
  paymentMongoId: string;
}) => {
  try {
    const apiUrl = "https://api.paymongo.com/refunds";
    const apiKey = process.env.PAYMONGO_SECRET_ACCESS_KEY!;

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount,
            payment_id: paymentId,
            reason,
            metadata: {
              user_id: userId,
              payment_mongo_id: paymentMongoId,
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
  } catch (error: any) {
    console.log("console error", error);
    throw error;
  }
};
