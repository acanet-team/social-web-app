import { useLoading } from "./context";

export default function Loading() {
  const { isLoading } = useLoading();

  return (
    isLoading && (
      <div className="c-spinning-loader-wrapper">
        <div className="c-spinning-loader">
          <div className="c-spinning-loader__circle"></div>
          <img
            className="c-spinning-loader__logo"
            width="36"
            height="36"
            src="/assets/images/logo/logo.png"
          />
        </div>
      </div>
    )
  );
}
