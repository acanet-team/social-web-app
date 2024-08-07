import Header from "@/app/components/Header";
import Popupchat from "@/app/components/Popupchat";
import Appfooter from "@/app/components/Appfooter";
import Leftnav from "@/app/components/Leftnav";

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Leftnav />
      {props.children}
      <Popupchat />
      <Appfooter />
    </>
  );
}
