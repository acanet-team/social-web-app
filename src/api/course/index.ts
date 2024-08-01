export type Course = {
  id: number;
  nameCourse: string;
  author: string;
  imgCourse: string;
  imgAuthor: string;
  price: number;
  discount?: number;
  dateUpdate: string;
  followers: string;
  ratings: number;
  description: string;
  reasonList: { reason: string }[];
  couseContent: {
    label: string;
    course_duration: number;
    childList: { child: string }[];
  }[];
  content: string;
};
