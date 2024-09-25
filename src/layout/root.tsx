import Appfooter from "@/components/Appfooter";
import Header from "@/components/Header";
import Leftnav from "@/components/Leftnav";
import Popupchat from "@/components/Popupchat";
import Head from "next/head";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, viewport-fit=cover"
        />
        <title>Acanet</title>
      </Head>
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
