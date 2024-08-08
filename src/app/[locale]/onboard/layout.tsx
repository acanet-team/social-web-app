import Header from "@/app/components/Header";

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header />
      {props.children}
    </div>
  );
}
