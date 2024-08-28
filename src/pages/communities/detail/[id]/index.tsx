import Profilephoto from "@/app/components/Profilephoto";
import CommunityHeader from "@/app/components/CommunityHeader";

import React, { Fragment, useState } from "react";
import DotWaveLoader from "@/app/components/DotWaveLoader";
import CreatePost from "@/app/components/newsfeed/Createpost";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { getACommunity, getCommunityPosts } from "@/api/community";
import { useSession } from "next-auth/react";
import CommunityOverview from "@/app/components/CommunityOverview";
import CommunityFeed from "@/app/components/communities/CommunityFeed";
import page from "@/pages/courses/investor/page";

const TAKE = 10;
export default function CommunityView({
  communityMetaData,
  communityFeed,
  page,
  totalPage,
  groupId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log("group feed", communityFeed);
  const [curTab, setCurTab] = useState<string>("suggestion");
  const { data: session } = useSession() as any;

  return (
    <Fragment>
      <div className="middle-sidebar-left nunito-font pe-0">
        <div className="row">
          <div className="col-xl-12 mb-3">
            <CommunityHeader
              community={communityMetaData}
              setCurTab={setCurTab}
            />
          </div>

          <div className="col-xl-4 col-xxl-3 col-lg-4 pe-0">
            <CommunityOverview />
            <Profilephoto />
          </div>
          <div className="col-xl-8 col-xxl-9 col-lg-8">
            <CreatePost userSession={session} />
            <CommunityFeed
              posts={communityFeed}
              take={TAKE}
              allPage={totalPage}
              curPage={page}
              groupId={groupId}
            />
            <DotWaveLoader />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const groupId = context.query?.id as string;
  const response = await getACommunity(groupId);
  const communityFeed = await getCommunityPosts(1, TAKE, "community", groupId);
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      groupId: groupId,
      communityMetaData: response.data,
      communityFeed: communityFeed.data?.docs,
      totalPage: communityFeed.data?.meta?.totalPage,
      page: communityFeed.data?.meta.page,
    },
  };
}
