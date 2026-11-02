import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Deliverables from "@/components/Deliverables";
import DashboardDemo from "@/components/DashboardDemo";
import LandingDemo from "@/components/LandingDemo";
import BudgetCalculator from "@/components/BudgetCalculator";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Deliverables />
        <DashboardDemo />
        <LandingDemo />
        <BudgetCalculator />
        <Contact />
      </main>
    </>
  );
}
