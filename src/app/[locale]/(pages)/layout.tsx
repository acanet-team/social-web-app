import Header from '@/app/components/Header';
import Leftnav from '@/app/components/Leftnav';
import Popupchat from '@/app/components/Popupchat';
import Appfooter from '@/app/components/Appfooter';

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
