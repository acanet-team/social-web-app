import CommunityHeader from "@/app/components/CommunityHeader";
import React, { Fragment, useState } from "react";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { getACommunity, getCommunityPosts } from "@/api/community";
import { useSession } from "next-auth/react";
import CommunityFeed from "@/app/components/communities/CommunityFeed";
import MemberTable from "@/app/components/communities/MemberTable";

const TAKE = 10;
export default function CommunityView({
  communityMetaData,
  communityFeed,
  page,
  totalPage,
  groupId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log("group data", communityMetaData);
  const [curTab, setCurTab] = useState<string>("posts");
  const { data: session } = useSession() as any;

  return (
    <Fragment>
      <div className="pe-0 mb-5">
        <div className="mb-3">
          <CommunityHeader
            community={communityMetaData}
            setCurTab={setCurTab}
            curTab={curTab}
          />
        </div>

        {curTab === "posts" && (
          <CommunityFeed
            userSession={session}
            posts={communityFeed}
            take={TAKE}
            allPage={totalPage}
            curPage={page}
            groupId={groupId}
            // groupOwnerId={communityMetaData.owner?.userId}
            groupData={communityMetaData}
          />
        )}

        {curTab !== "posts" && <MemberTable tab={curTab} groupId={groupId} />}
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
