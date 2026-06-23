import { Plan } from "@/types";

export const FREE_PLAN_ID = "000000000000000000000001";
export const STANDARD_PLAN_ID = "000000000000000000000002";
export const PROFESSIONAL_PLAN_ID = "000000000000000000000003";

export const subscriptionPlans: Plan[] = [
  {
    _id: FREE_PLAN_ID,
    offer: "free-plan",
    title: "Fortify Free",
    price: 0,
    intendedUsers: "Individuals or small-scale users",
    maxLookups: 10,
    features: [
      {
        _id: "free-url-scans",
        name: "URL scans per month",
        value: 10,
      },
      {
        _id: "free-snapshots",
        name: "basic snapshots of the website per month",
        value: 10,
      },
      {
        _id: "free-screenshot-scans",
        name: "screenshot-based URL scans per month",
        value: 10,
      },
      {
        _id: "free-classification",
        name: "Classification overview",
        value: "",
      },
      {
        _id: "free-analysis",
        name: "Complete analysis",
        value: "",
      },
    ],
  },
  {
    _id: STANDARD_PLAN_ID,
    offer: "standard-plan",
    title: "Standard Plan",
    price: 149,
    intendedUsers: "Regular users or small businesses",
    maxLookups: 115,
    features: [
      {
        _id: "standard-url-scans",
        name: "URL scans per month",
        value: 115,
      },
      {
        _id: "standard-snapshots",
        name: "full website screenshots per month",
        value: 115,
      },
      {
        _id: "standard-screenshot-scans",
        name: "screenshot-based URL scans per month",
        value: 115,
      },
      {
        _id: "standard-classification",
        name: "Classification overview",
        value: "",
      },
      {
        _id: "standard-statistics",
        name: "Detailed analysis statistics",
        value: "",
      },
      {
        _id: "standard-results",
        name: "Detailed analysis result",
        value: "",
      },
      {
        _id: "standard-analysis",
        name: "Complete analysis",
        value: "",
      },
    ],
  },
  {
    _id: PROFESSIONAL_PLAN_ID,
    offer: "professional-plan",
    title: "Professional Plan",
    price: 249,
    intendedUsers: "Cybersecurity teams or large businesses",
    maxLookups: 100,
    features: [
      {
        _id: "professional-url-scans",
        name: "URL scans per month",
        value: 100,
      },
      {
        _id: "professional-snapshots",
        name: "full website screenshots per month",
        value: 100,
      },
      {
        _id: "professional-screenshot-scans",
        name: "screenshot-based URL scans per month",
        value: 100,
      },
      {
        _id: "professional-classification",
        name: "Classification overview",
        value: "",
      },
      {
        _id: "professional-statistics",
        name: "Detailed analysis statistics",
        value: "",
      },
      {
        _id: "professional-results",
        name: "Detailed analysis result",
        value: "",
      },
      {
        _id: "professional-analysis",
        name: "Complete analysis",
        value: "",
      },
    ],
  },
];

export const getPlanById = (planId: unknown) =>
  subscriptionPlans.find((plan) => String(plan._id) === String(planId));

export const getPlanByTitle = (title: string) =>
  subscriptionPlans.find((plan) => plan.title === title);

export const getPlanByPaymentAmount = (amount: unknown) => {
  const normalizedAmount = Number(amount);

  if (!Number.isFinite(normalizedAmount)) {
    return undefined;
  }

  return subscriptionPlans.find(
    (plan) => plan.price === normalizedAmount || plan.price * 100 === normalizedAmount
  );
};

export const getFreePlan = () => subscriptionPlans[0];
