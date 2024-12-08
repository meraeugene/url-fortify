import { navItems } from "@/data";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { getUser, verifySession } from "@/lib/dal";

const Home = async () => {
  const authenticatedUserData = await getUser();

  // Parse the data before passing it to the client component
  const parsedAuthenticatedUserData = JSON.parse(
    JSON.stringify(authenticatedUserData)
  );

  const session = await verifySession();
  const isAuth = session?.isAuth;

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
      <div className="max-w-[85rem] w-full">
        <FloatingNav
          isAuth={isAuth}
          navItems={navItems}
          authenticatedUserData={parsedAuthenticatedUserData}
        />
        <Hero authenticatedUserData={parsedAuthenticatedUserData} />
        <SubscriptionPlans
          isAuth={isAuth}
          authenticatedUserData={parsedAuthenticatedUserData}
        />
        <Clients />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
