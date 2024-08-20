import Appfooter from "@/app/components/Appfooter";
import Header from "@/app/components/Header";
import Leftnav from "@/app/components/Leftnav";
import Popupchat from "@/app/components/Popupchat";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header isOnboarding={false} />
      {/* <Leftnav /> */}
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">{props.children}</div>
      </div>
      <Popupchat />
      <Appfooter />
    </>
  );
}
