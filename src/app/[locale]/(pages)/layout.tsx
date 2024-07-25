import Header from "@/app/components/Header";
import Popupchat from "@/app/components/Popupchat";
import Appfooter from "@/app/components/Appfooter";

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {props.children}
      <Popupchat />
      <Appfooter />
    </>
  );
}
