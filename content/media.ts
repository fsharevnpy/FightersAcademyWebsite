import type { ProgramId } from "./programs";

export type CoursePhoto = {
  src: string;
  original: string;
  alt: string;
  caption: string;
  position: string;
};

const rioPracticePhoto = {
  src: "/images/activity-rio-practice.webp",
  original: "source/anhhoatdong/rio/1792209807890_3350274012594387389_3350274012594387389_6f612b7d42a19e0ffbc8efaeaa9fccbd.jpg",
  alt: "Hai học viên thao tác với robot Rio màu xanh trên sa bàn",
  caption: "Thực hành cùng robot",
  position: "50% 48%",
};
const electronicsPhoto = {
  src: "/images/activity-electronics-guidance.webp",
  original: "source/anhhoatdong/dientucoban/1785038271265_4580753154693219409_g3873433740052077826_c638595743fa437873d27195d3edbf64.jpg",
  alt: "Học viên và người hướng dẫn trước máy tính, với mạch điện nối dây trên bàn",
  caption: "Thực hành điện tử",
  position: "50% 50%",
  width: 1280,
  height: 960,
};

export type CourseVideo = {
  src: string;
  original: string;
  poster: string;
  caption: string;
  description: string;
  duration: number;
};
type CourseMedia = {
  representative: { src: string; alt: string; width: number; height: number; original: string };
  photos: readonly CoursePhoto[];
  video: CourseVideo;
};

// Only these two courses have owner-confirmed photographs; other courses retain their illustrations.
export const courseMedia: Partial<Record<ProgramId, CourseMedia>> = {
  rio: {
    representative: {
      src: "/images/course-rio-board.webp",
      original: "source/anhhoatdong/rio/robot-giao-duc-mam-non-rio-tren-ban-do.jpg",
      alt: "Robot Rio màu xanh với các nút lệnh trên sa bàn nhiều màu",
      width: 600, height: 600,
    },
    photos: [
      rioPracticePhoto,
      {
        src: "/images/activity-rio-guidance.webp",
        original: "source/anhhoatdong/rio/1792209808112_3350274012594387389_3350274012594387389_c5ab5c03373e87b84490ac15883b2646.jpg",
        alt: "Người hướng dẫn và học viên quan sát robot Rio trên sa bàn",
        caption: "Khám phá robot cùng người hướng dẫn",
        position: "50% 60%",
      },
      {
        src: "/images/activity-rio-screen.webp",
        original: "source/anhhoatdong/rio/1792209807545_3350274012594387389_3350274012594387389_304b9e2641fc25c2f2411291f803526f.jpg",
        alt: "Nhóm học viên cùng người hướng dẫn quan sát hình sa bàn trên màn hình máy tính",
        caption: "Cùng quan sát và tìm hiểu",
        position: "50% 60%",
      },
    ],
    video: {
      src: "/videos/rio-practice.mp4",
      original: "source/anhhoatdong/rio/1791689462617_281260927700765988_g3873433740052077826.mp4",
      poster: "/images/rio-practice-poster.webp",
      caption: "Thực hành điều khiển robot trên sa bàn",
      description: "Robot Rio di chuyển trên sa bàn giữa các vật đặt trên đường đi; người học thao tác với robot. Video minh họa không có âm thanh.",
      duration: 20,
    },
  },
  "dien-tu-co-ban": {
    representative: electronicsPhoto,
    photos: [
      electronicsPhoto,
      {
        src: "/images/activity-electronics-circuit.webp",
        original: "source/anhhoatdong/dientucoban/1792256970900_281260927700765988_802952788732364519_29255759327b5a6c0f7c2b9aeef4a408.jpg",
        alt: "Mạch điện nối dây với cảm biến và động cơ trên mô hình khối ghép nhiều màu",
        caption: "Kết nối mạch điện và mô hình",
        position: "45% 50%",
      },
      {
        src: "/images/activity-electronics-programming.webp",
        original: "source/anhhoatdong/dientucoban/1792256970789_281260927700765988_802952788732364519_fc7d4fc7de969a4f8a3ae83ff4db7e87.jpg",
        alt: "Màn hình hiển thị chương trình khối lệnh cho cảm biến và động cơ",
        caption: "Thực hành với khối lệnh",
        position: "35% 50%",
      },
      {
        src: "/images/activity-electronics-whiteboard.webp",
        original: "source/anhhoatdong/dientucoban/1785038271329_4580753154693219409_g3873433740052077826_3eef06fe71337c8e9ae2dce2cfbc8ad0.jpg",
        alt: "Người hướng dẫn vẽ sơ đồ mạch điện trên bảng trong phòng học",
        caption: "Tìm hiểu sơ đồ mạch điện",
        position: "50% 45%",
      },
    ],
    video: {
      src: "/videos/electronics-practice.mp4",
      original: "source/anhhoatdong/dientucoban/1792256970700_281260927700765988_802952788732364519.mp4",
      poster: "/images/electronics-practice-poster.webp",
      caption: "Thử nghiệm với mạch điện và mô hình",
      description: "Người học đưa một khối lắp ghép tới mô hình có linh kiện và dây nối trên bàn, quan sát mô hình rồi tiếp tục thao tác. Video minh họa không có âm thanh.",
      duration: 6,
    },
  },
};

export const courseIllustrations = {
  "starter-kit": { src: "/images/course-starter-kit.png", width: 1200, height: 900, alt: "Minh họa bộ điều khiển và kết nối linh kiện" },
  "lap-trinh": { src: "/images/course-logic-programming.png", width: 1200, height: 900, alt: "Minh họa cửa sổ lập trình và ký hiệu lệnh" },
};

export function getCourseRepresentative(id: ProgramId) {
  if (id === "starter-kit" || id === "lap-trinh") return courseIllustrations[id];
  const photo = courseMedia[id]?.representative;
  if (!photo) throw new Error(`Missing course representative: ${id}`);
  return photo;
}

// Photos from different classes and activities, not a single event.
export const activityPhotos = [
  {
    src: "/images/activity-learning-together.webp",
    original: "source/workshop/702866388_122105127939301313_1567237496226860039_n.jpg",
    alt: "Học viên và người hướng dẫn cùng thực hành với mô hình và linh kiện trong phòng học",
    caption: "Học tập thông qua trải nghiệm",
    position: "50% 50%",
  },
  electronicsPhoto,
  {
    src: "/images/activity-built-models.webp",
    original: "source/workshop/702857751_122105127435301313_2668905042239233707_n.jpg",
    alt: "Các mô hình xe bánh vàng được lắp từ những khối ghép nhiều màu",
    caption: "Từ những chi tiết đến mô hình",
    position: "50% 50%",
  },
  {
    src: "/images/activity-model-exploration.webp",
    original: "source/workshop/702867258_122105131119301313_886655649761742485_n.jpg",
    alt: "Học viên bên khay linh kiện và mô hình xe lắp ghép chở các vật nhỏ màu cam",
    caption: "Khám phá mô hình lắp ghép",
    position: "50% 55%",
  },
  {
    src: "/images/activity-group-guidance.webp",
    original: "source/workshop/702718142_122105132055301313_5363659602071230597_n.jpg",
    alt: "Nhóm học viên đứng nghe người hướng dẫn trao đổi",
    caption: "Lắng nghe và cùng khám phá",
    position: "50% 50%",
  },
  rioPracticePhoto,
];

export const learningExamplePhoto = {
  src: "/images/activity-building-together.webp",
  original: "source/workshop/702612076_122105128461301313_5904756913491615003_n.jpg",
  alt: "Nhóm học viên cùng chọn linh kiện và lắp các khối ghép lên mô hình xe, nhìn từ trên xuống",
  caption: "Tự tay lắp ráp, cùng nhau khám phá.",
};

export const learningProcessPhotos = [
  {
    src: "/images/group-robotics.webp",
    alt: "Người hướng dẫn cùng ba học viên lắp ráp linh kiện, với mô hình robot trên bàn",
    caption: "Thực hành cùng linh kiện và mô hình",
  },
  {
    src: "/images/guided-programming.webp",
    alt: "Người hướng dẫn chỉ vào chương trình trên màn hình trong lúc học viên quan sát",
    caption: "Có người hướng dẫn đồng hành",
  },
];
