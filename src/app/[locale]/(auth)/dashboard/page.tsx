import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

const Dashboard = () => (
  <div className="[&_p]:my-6">
    <div className="[&_p]:container">
      <div className="[&_p]:row">
        <div className="[&_p]:col-12">
          <h1 className="[&_p]:fw-700 [&_p]:display1-size [&_p]:display2-md-size">
            Dashboard
          </h1>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
