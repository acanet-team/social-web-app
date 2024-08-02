"use client";
import { createNewPostRequest, getTopics } from "@/api/post";
import React, { useState, useEffect, useRef } from "react";
import style from "@/styles/modules/createpPost.module.scss";
import { toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "./CustomSelectStyles.css";
import { useTranslations } from "next-intl";
import { useAccessTokenStore } from "@/store/accessToken";
import { useSession } from "next-auth/react";
import { IUserInfo, type IUserSession } from "@/api/user/model";
import { useRouter } from "next/navigation";
import ImagePreview from "./ImagePreview";

const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [topics, setTopics] = useState<{ value: string; label: any }[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interestTopicId, setInterestTopicId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const t = useTranslations("CreatePost");
  const setAccessToken = useAccessTokenStore((s: any) => s.setAccessToken);

  const topicListRef = useRef(null);

  useEffect(() => {
    console.log(setAccessToken);
    const session = sessionData as IUserSession;
    if (session && session.user) {
      setAccessToken(session.token);
      setUserInfo(session.user as IUserInfo);
      if (!session.user.isProfile) {
        router.push("/account");
      } else {
        router.push("/home");
      }
    }
  }, [sessionData, setAccessToken]);

  const fetchTopics = async (page = 1, search = "") => {
    setIsLoading(true);

    try {
      const response = await getTopics(page, search);
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
      await createNewPostRequest({
        content: postText,
        images: uploadedImages,
        interestTopicId: interestTopicId,
      });
      setShowModal(false);
      throwToast(t("post_create_success"), "success");
      setPostText("");
      setUploadedImages([]);
      setSelectedTopic(null);
    } catch (error) {
      throwToast(t("post_create_error"), "error");
    }
    closeModal();
  };

  const handleTopicChange = (selectedOption: any) => {
    setSelectedTopic(selectedOption);
    setInterestTopicId(selectedOption.value);
  };

  const openModal = () => {
    if (postText.trim() === "") {
      throwToast(t("please_enter_text"), "error");
      return;
    }
    fetchTopics();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTopic(null);
    setInterestTopicId("");
  };

  const menuClass = `${isOpen ? " show" : ""}`;

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
      <div
        className="card-body p-0 mt-3 position-relative"
        id={style["card-body"]}>
        <figure className="avatar position-absolute ms-2 mt-1 top-5">
          <img
            src={userInfo?.photo?.path ?? "/assets/images/user.png"}
            alt="icon"
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

        {/* <div className={style["imagePreview"]}>
          {uploadedImages.map((image, index) => (
            <div key={index} className={style["previewImage"]}>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded Image"
                className={style["previewImage"]}
                width={211}
                height={211}
                onClick={() => enlargeImage(image)}
              />
              <button
                onClick={() => removeImage(index)}
                className={style["close-button"]}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
          ))}
        </div> */}
      </div>
      {/* {enlargedImage && (
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
      )} */}
      <ImagePreview
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
      />
      <div className="card-body d-flex p-0 mt-0">
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
        <div className={`ms-auto pointer ${menuClass}`}>
          <label
            id="submit"
            className="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
            onClick={openModal}>
            <i className="btn-round-sm font-xs text-primary feather-edit-3 me-2"></i>
            {t("create_Post")}
          </label>
        </div>
      </div>

      {showModal && (
        <div>
          <div className={style["overlay"]}></div>
          <div className={style["modal-custom"]}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content theme-dark card">
                <div className="modal-header">
                  <h1 className="modal-title">{t("select_Topic")}</h1>
                  <button
                    type="button"
                    className={style["close"]}
                    onClick={closeModal}>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div ref={topicListRef} className="topic-list">
                    {isLoading && (
                      <div className="text-center">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {t("loading_topics")}
                      </div>
                    )}
                    {topics.length === 0 && !isLoading && (
                      <div className="text-center">{t("no_topics")}</div>
                    )}
                    <Select
                      options={topics}
                      value={selectedTopic}
                      onChange={handleTopicChange}
                      placeholder="Select a topic"
                      isMulti={false}
                      className={style["topic-select"]}
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
                          borderRadius: "10px",
                          boxShadow: "none",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          borderRadius: "10px",
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <div>
                    <label
                      id="button"
                      className={`font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center ${
                        style["right"]
                      }`}
                      onClick={submitPost}>
                      {" "}
                      <i className="btn-round-sm font-xs text-primary feather-save me-2"></i>
                      {t("create_Post")}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
