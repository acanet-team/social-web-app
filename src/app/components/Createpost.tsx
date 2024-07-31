import { createNewPostRequest, getTopics } from "@/api/post";
import Image from "next/image";
import React, { Component } from "react";
import style from "@/styles/modules/createpPost.module.scss";
import { toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

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
  selectedTopic: any;
  showModal: boolean;
  interestTopicId: string;
  searchTerm: string;
  currentPage: number;
  isLoading: boolean;
  hasMore: boolean;
  hasNextPage: boolean;
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
      selectedTopic: null,
      showModal: false,
      interestTopicId: "",
      searchTerm: "",
      currentPage: 1,
      isLoading: false,
      hasMore: true,
      hasNextPage: true,
    };
    this.topicListRef = React.createRef();
  }

  topicListRef: React.RefObject<HTMLDivElement>;

  fetchTopics = async (page = 1, search = "") => {
    this.setState({ isLoading: true });

    try {
      const response = await getTopics(page, search);
      if (response) {
        const newTopics = response["data"]["docs"].map((topic) => ({
          value: topic.id,
          label: topic.topicName,
        }));
        const hasMore = newTopics.length > 0;
        const uniqueTopics = [...this.state.topics, ...newTopics].filter(
          (topic, index, self) =>
            index === self.findIndex((t) => t.value === topic.value)
        );
        this.setState(() => ({
          topics: uniqueTopics,
          hasMore,
          isLoading: false,
          hasNextPage: response["data"]["meta"]["hasNextPage"],
        }));
      }
    } catch (error) {
      this.throwToast("Error fetching topics.", "error");
      this.setState({ isLoading: false });
    }
  };

  handleScroll = () => {
    if (this.state.hasNextPage) {
      this.setState((prevState) => ({
        currentPage: prevState.currentPage + 1,
      }));
      this.fetchTopics(this.state.currentPage, this.state.searchTerm);
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

    if (!this.state.selectedTopic) {
      this.throwToast("Please select a topic for your post.", "error");
      return;
    }

    try {
      await createNewPostRequest({
        content: this.state.postText,
        images: this.state.uploadedImages,
        interestTopicId: this.state.selectedTopic.value,
      });
      this.setState({ showModal: false });
      this.throwToast("Post created successfully!", "success");
      this.setState({
        postText: "",
        uploadedImages: [],
        selectedTopic: null,
      });
    } catch (error) {
      this.throwToast("Error creating post.", "error");
    }
    this.closeModal();
  };

  handleTopicChange = (selectedOption: any) => {
    this.setState({ selectedTopic: selectedOption });
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
    this.setState({ showModal: false, selectedTopic: null });
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
      showModal,
      isLoading,
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
                  <span aria-hidden="true">×</span>
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
                <span aria-hidden="true">×</span>
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
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div ref={this.topicListRef} className="topic-list">
                      {isLoading && (
                        <div className="text-center">
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Loading...
                        </div>
                      )}
                      {this.state.topics.length === 0 && !isLoading && (
                        <div className="text-center">No topics found.</div>
                      )}
                      <Select
                        options={this.state.topics}
                        value={this.state.selectedTopic}
                        onChange={this.handleTopicChange}
                        placeholder="Select a topic"
                        isMulti={false}
                        className={style["topic-select"]}
                        onInputChange={(searchTerm) => {
                          if (searchTerm.trim() !== "") {
                            this.setState({ searchTerm });
                            this.fetchTopics(1, searchTerm);
                          }
                        }}
                        onMenuScrollToBottom={this.handleScroll}
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
                        onClick={this.submitPost}>
                        {" "}
                        <i className="btn-round-sm font-xs text-primary feather-save me-2 bg-greylight"></i>
                        Save changes
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
  }
}

export default CreatePost;
