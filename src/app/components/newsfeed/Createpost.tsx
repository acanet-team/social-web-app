import { createNewPostRequest, getTopics } from "@/api/newsfeed";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import style from "@/styles/modules/createpPost.module.scss";
import { toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { useTranslations } from "next-intl";
import { type IMe } from "@/api/onboard/model";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import { usePostStore } from "@/store/newFeed";

const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<File | null>(null);
  const [topics, setTopics] = useState<{ value: string; label: any }[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interestTopicId, setInterestTopicId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [userInfo, setUserInfo] = useState<IMe>();
  const [curTheme, setCurTheme] = useState("");
  const router = useRouter();
  const t = useTranslations("CreatePost");
  const addPost = usePostStore((state) => state.addPost);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) setCurTheme(theme);
    const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    setUserInfo(userInfo);
    fetchTopics();
    setIsLoading(false);
    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme");
      if (theme) setCurTheme(theme);
    };
    window.addEventListener("themeChange", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);
  const topicListRef = useRef(null);

  const fetchTopics = async (page = 1, search = "") => {
    setIsLoading(true);

    try {
      const response = await getTopics(page, search);
      console.log("topics", response);

      if (response) {
        const newTopics = response["data"]["docs"].map((topic) => ({
          value: topic.id,
          label: topic.topicName,
        }));
        const uniqueTopics = [...topics, ...newTopics].filter(
          (topic, index, self) =>
            index === self.findIndex((t) => t.value === topic.value)
        );
        setTopics(uniqueTopics);
        setIsLoading(false);
        setHasNextPage(response["data"]["meta"]["hasNextPage"]);
      }
    } catch (error) {
      throwToast(t("error_fetch_topic"), "error");
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (hasNextPage) {
      setCurrentPage((prevState) => prevState + 1);
      fetchTopics(currentPage, searchTerm);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedImages([...uploadedImages, ...files]);
    }
  };
  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
  };
  const removeImage = (index: number) => {
    const newUploadedImages = [...uploadedImages];
    newUploadedImages.splice(index, 1);
    setUploadedImages(newUploadedImages);
  };
  const enlargeImage = (image: File) => {
    setEnlargedImage(image);
  };
  const closeEnlarge = () => {
    setEnlargedImage(null);
  };

  const throwToast = (message: string, notiType: string) => {
    const notiConfig: ToastOptions = {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    const notify = () => {
      if (message !== "" && notiType === "success") {
        toast.success(message, notiConfig);
      } else if (message !== "" && notiType === "error") {
        toast.error(message, notiConfig);
      }
    };

    notify();
  };

  const submitPost = async () => {
    if (postText.trim() === "") {
      throwToast(t("please_enter_text"), "error");
      return;
    }

    if (!selectedTopic) {
      throwToast(t("please_select_a_topic"), "error");
      return;
    }

    try {
      const newFeed = await createNewPostRequest({
        content: postText,
        images: uploadedImages,
        interestTopicId: interestTopicId,
      });
      addPost(newFeed.data as any);
      setShowModal(false);
      throwToast(t("post_create_success"), "success");
      setPostText("");
      setUploadedImages([]);
      setSelectedTopic(null);
    } catch (error) {
      throwToast(t("post_create_error"), "error");
    }
  };

  const handleTopicChange = (selectedOption: any) => {
    setSelectedTopic(selectedOption);
    setInterestTopicId(selectedOption.value);
  };

  const menuClass = `${isOpen ? " show" : ""}`;
  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 ps-2 pe-2 pb-2 mb-3">
      <div
        className="card-body p-0 mt-3 position-relative"
        id={style["card-body"]}>
        <figure className="avatar position-absolute ms-2 mt-1 top-5">
          <Image
            src={userInfo?.user?.photo?.path ?? "/assets/images/profile.png"}
            alt="Ảnh hồ sơ"
            width={30}
            height={30}
            className="shadow-sm rounded-circle w30"
          />
        </figure>
        <textarea
          maxLength={5000}
          onChange={(event) => {
            setPostText(event.target.value);
          }}
          name="message"
          className="h100 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
          placeholder={t("Whats_on_your_mind")}></textarea>

        <Box
          sx={{
            width: "100%",
            maxHeight: 500,
            overflow: "hidden",
          }}>
          <Masonry
            columns={uploadedImages.length > 3 ? 3 : uploadedImages.length}>
            {uploadedImages.slice(0, 6).map((image, index) => (
              <div key={index} className={style["previewImage"]}>
                <Image
                  security="restricted"
                  src={URL.createObjectURL(image)}
                  alt="Uploaded Image"
                  className={style["imagePreview"]}
                  layout="responsive"
                  width={100}
                  height={100}
                  objectFit="cover"
                  sizes={
                    image.size > 1000000
                      ? "(max-width: 500px) 100vw, 500px"
                      : "(max-width: 211px) 100vw, 211px"
                  }
                  onClick={() => enlargeImage(image)}
                />
              </div>
            ))}
          </Masonry>
        </Box>
      </div>
      {enlargedImage && (
        <div className={style["enlarged-image-modal"]} onClick={closeEnlarge}>
          {" "}
          <div
            className={style["enlarged-image-container"]}
            onClick={(e) => e.stopPropagation()}>
            <Image
              src={URL.createObjectURL(enlargedImage)}
              alt="Enlarged Image"
              width={500}
              height={500}
              className={style["enlarged-preview-image"]}
            />
            <button onClick={closeEnlarge} className={style["close-enlarge"]}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      )}
      <div className={`${style["footer"]} card-body d-flex p-0 mt-0`}>
        <label
          className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"
          onClick={toggleUploadForm}>
          <i className="font-md text-success feather-image me-2"></i>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            id="imageUpload"
            hidden={!showUploadForm}
            max={20}
            className={style["imageUploadInput"]}
          />
          {t("Photo_Video")}
        </label>
        <label
          ref={topicListRef}
          className={`${style["topic-list"]} theme-dark-bg`}>
          {isLoading && (
            <div className="text-center">
              <span className="spinner-border spinner-border-sm me-2"></span>
              {t("loading_topics")}
            </div>
          )}
          <Select
            options={topics}
            value={selectedTopic}
            onChange={handleTopicChange}
            placeholder="Select a topic"
            isMulti={false}
            classNamePrefix={`${style["topic-select"]}`}
            onInputChange={(searchTerm) => {
              setTimeout(() => {
                if (searchTerm.trim() !== "") {
                  setSearchTerm(searchTerm);
                  fetchTopics(1, searchTerm);
                }
              }, 3000);
            }}
            onMenuScrollToBottom={handleScroll}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor:
                  curTheme === "theme-light" ? "#fff" : "#1a1237",
                borderColor: "",
                borderRadius: 5,
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#999",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#e0e0e0" : "#fff",
                color: state.isSelected ? "#333" : "#000",
                "&:hover": {
                  backgroundColor: "#ddd",
                },
              }),
              menu: (provided) => ({
                ...provided,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }),
            }}
          />
        </label>
        <div className={`ms-auto pointer ${menuClass}`}>
          <label
            id="submit"
            className="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
            onClick={submitPost}>
            <i className="btn-round-sm font-xs text-primary feather-edit-3 me-2"></i>
            {t("create_Post")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
