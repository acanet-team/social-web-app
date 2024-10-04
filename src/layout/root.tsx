import Appfooter from "@/components/Appfooter";
import Header from "@/components/Header";
import Popupchat from "@/components/Popupchat";
import ToastNoti from "@/components/ToastNoti";
import Head from "next/head";
import { useMediaQuery } from "react-responsive";

export default function RootLayout(props: { children: React.ReactNode }) {
  const isQuery = useMediaQuery({ query: "(max-width: 650px" });
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
      {!isQuery && <ToastNoti />}
      <Popupchat />
      <Appfooter />
    </>
  );
}
