"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/modules/navLink.module.scss";
import { MouseEventHandler } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className: string;
}

const NavLink = ({ href, children, className }: NavLinkProps) => {
  const router = useSearchParams();
  const currentTab = router.get("tab") || "you";
  const isActive = `/home?tab=${currentTab}` === href;

  return (
    <Link href={href}>
      <div className={`${className} ${isActive ? styles["tab-active"] : ""}`}>
        {children}
      </div>
    </Link>
  );
};

export default NavLink;
