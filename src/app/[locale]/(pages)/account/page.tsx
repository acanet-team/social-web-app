import React from "react";
import "react-toastify/dist/ReactToastify.css";
import type { AxiosError } from "axios";
import Link from "next/link";
import { getRegionRequest } from "@/api/user";
import Account from "@/app/components/account/Account";

const getRegions = async () => {
  try {
    const response = await getRegionRequest();
    return response;
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: "can't fetch regions",
      data: { key: "regions", value: [], type: "json" },
    };
  }
};

export default async function AccountPage() {
  const response = await getRegions();
  const regions = response.data.value.map((obj) => obj.name);

  return (
    <>
      <div className="create-profile main-content bg-lightblue theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                  <Link href="/defaultsettings" className="d-inline-block mt-2">
                    <i className="ti-arrow-left font-sm text-white" />
                  </Link>
                  <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">
                    Account Details
                  </h4>
                </div>

                <Account regions={regions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
