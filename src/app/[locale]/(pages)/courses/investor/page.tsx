import React, { Fragment } from "react";
import Pagetitle from "@/app/components/Pagetitle";
import { getTranslations } from "next-intl/server";
import ListCourses from "@/app/components/course/ListCourses";

export default async function Courses() {
  const t = await getTranslations("CoursesList");

  return (
    <Fragment>
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <Pagetitle
              title={t("course_title")}
              intro={t("course_description")}
            />
            <ListCourses />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
