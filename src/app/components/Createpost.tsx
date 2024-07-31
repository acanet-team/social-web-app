import { createNewPostRequest, getTopics } from "@/api/post";
import Image from "next/image";
import React, { Component } from "react";
import style from "@/styles/modules/createpPost.module.scss";
import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CreatePostProps {
  placeholder?: string;
  avatarUrl?: string;
  liveVideo?: string;
  photoVideo?: string;
  createPost?: string;
}

interface CreatePostState {
  isOpen: boolean;
  postText: string;
  uploadedImages: File[];
  showUploadForm: boolean;
  enlargedImage: File | null;
  topics: any[];
  selectedTopic: string;
  showModal: boolean;
  interestTopicId: string;
}

class CreatePost extends Component<CreatePostProps, CreatePostState> {
  constructor(props: CreatePostProps) {
    super(props);
    this.state = {
      isOpen: false,
      postText: "",
      uploadedImages: [],
      showUploadForm: false,
      enlargedImage: null,
      topics: [],
      selectedTopic: "",
      showModal: false,
      interestTopicId: "",
    };
  }

  fetchTopics = async () => {
    try {
      const response = await getTopics();
      if (response) {
        console.log(response);
        this.setState({ topics: response["data"]["docs"] });
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
  handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      this.setState({
        uploadedImages: [...this.state.uploadedImages, ...files],
      });
    }
  };
  toggleUploadForm = () => {
    this.setState({ showUploadForm: !this.state.showUploadForm });
  };
  removeImage = (index: number) => {
    const newUploadedImages = [...this.state.uploadedImages];
    newUploadedImages.splice(index, 1);
    this.setState({ uploadedImages: newUploadedImages });
  };
  enlargeImage = (image: File) => {
    this.setState({ enlargedImage: image });
  };
  closeEnlarge = () => {
    this.setState({ enlargedImage: null });
  };

  throwToast = (message: string, notiType: string) => {
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
        console.log("Please enter some text for your post.");
        toast.error(message, notiConfig);
      }
    };

    notify();
  };

  submitPost = async () => {
    if (this.state.postText.trim() === "") {
      this.throwToast("Please enter some text for your post.", "error");
      return;
    }

    if (this.state.selectedTopic.trim() === "") {
      this.throwToast("Please select a topic for your post.", "error");
      return;
    }

    try {
      await createNewPostRequest({
        content: this.state.postText,
        images: this.state.uploadedImages,
        interestTopicId: this.state.selectedTopic,
      });
      this.setState({ showModal: false });
      this.throwToast("Post created successfully!", "success");
      this.setState({
        postText: "",
        uploadedImages: [],
        selectedTopic: "",
      });
    } catch (error) {
      console.log("error", error);
    }
    this.closeModal();
  };
  handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedTopic: event.target.value });
  };

  openModal = () => {
    if (this.state.postText.trim() === "") {
      this.throwToast("Please enter some text for your post.", "error");
      return;
    }
    this.fetchTopics();
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false, selectedTopic: "" });
  };

  render() {
    const {
      placeholder,
      avatarUrl,
      liveVideo: live_Video,
      photoVideo: photo_Video,
      createPost,
    } = this.props;
    const {
      uploadedImages,
      showUploadForm,
      enlargedImage,
      topics,
      selectedTopic,
      showModal,
    } = this.state;
    const menuClass = `${this.state.isOpen ? " show" : ""}`;

    return (
      <div className="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
        <div
          className="card-body p-0 mt-3 position-relative"
          id={style["card-body"]}>
          <figure className="avatar position-absolute ms-2 mt-1 top-5">
            <img
              src={avatarUrl}
              alt="icon"
              className="shadow-sm rounded-circle w30"
            />
          </figure>
          <textarea
            maxLength={5000}
            onChange={(event) => {
              this.setState({ postText: event.target.value });
            }}
            name="message"
            className="h100 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
            placeholder={`${placeholder}`}></textarea>

          <div className={style["imagePreview"]}>
            {uploadedImages.map((image, index) => (
              <div key={index} className={style["previewImage"]}>
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Uploaded Image"
                  className={style["previewImage"]}
                  width={211}
                  height={211}
                  onClick={() => this.enlargeImage(image)}
                />
                <button
                  onClick={() => this.removeImage(index)}
                  className={style["close-button"]}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        {enlargedImage && (
          <div
            className={style["enlarged-image-modal"]}
            onClick={this.closeEnlarge}>
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
              <button
                onClick={this.closeEnlarge}
                className={style["close-enlarge"]}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        )}
        <div className="card-body d-flex p-0 mt-0">
          <label
            className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"
            onClick={this.toggleUploadForm}>
            <i className="font-md text-success feather-image me-2"></i>
            <span className="d-none-xs">{`${photo_Video}`}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={this.handleImageUpload}
              id="imageUpload"
              hidden={!showUploadForm}
              max={20}
              className={style["imageUploadInput"]}
            />
          </label>
          <div className={`ms-auto pointer ${menuClass}`}>
            <label
              id="submit"
              className="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
              onClick={this.openModal}>
              <i className="btn-round-sm font-xs text-primary feather-edit-3 me-2 bg-greylight"></i>
              {`${createPost}`}
            </label>
          </div>
        </div>

        {showModal && (
          <div>
            <div className={style["overlay"]}></div>
            <div className={style["modal-custom"]}>
              <div
                className="modal-dialog modal-dialog-centered"
                role="document">
                <div className="modal-content theme-dark card">
                  <div className="modal-header">
                    <h1 className="modal-title">Select a Topic</h1>
                    <button
                      type="button"
                      className={style["close"]}
                      onClick={this.closeModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <select
                      style={{ width: "-webkit-fill-available" }}
                      value={selectedTopic}
                      onChange={this.handleTopicChange}>
                      <option value={"Select Topic"}>Select Topic</option>
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.topicName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={this.closeModal}>
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.submitPost}>
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CreatePost;
