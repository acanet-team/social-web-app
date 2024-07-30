import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/modules/navLink.module.scss";
import { MouseEventHandler } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const NavLink = ({ href, children, className, onClick }: NavLinkProps) => {
  const router = useSearchParams();
  const currentTab = router.get("tab") || "you";
  console.log(currentTab);
  console.log(href);
  const isActive = `/home?tab=${currentTab}` === href;
  console.log(isActive);

  return (
    <Link href={href}>
      <div
        className={`${className} ${isActive ? styles["tab-active"] : ""}`}
        onClick={onClick}
      >
        {children}
      </div>
    </Link>
  );
};

export default NavLink;
