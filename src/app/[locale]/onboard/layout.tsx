import Header from "@/app/components/Header";

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <div className="container-fluid px-5">
      <Header />
      {props.children}
    </div>
  );
}
