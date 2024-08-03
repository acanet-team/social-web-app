"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/modules/navLink.module.scss";
import { MouseEventHandler, useEffect } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className: string;
}

const NavLink = ({ href, children, className }: NavLinkProps) => {
  const params = useSearchParams();
  const currentTab = params.get("tab") || "for_you";
  const isActive = `/home?tab=${currentTab}` === href;
  console.log("href");
  return (
    <Link href={href}>
      <div className={`${className} ${isActive ? styles["tab-active"] : ""}`}>
        {children}
      </div>
    </Link>
  );
};

export default NavLink;
