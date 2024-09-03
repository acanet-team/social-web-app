import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import type {
  BrokerProfile,
  InterestTopics,
  Skill,
  User,
} from "@/api/profile/model";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { updateOtherProfile } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import WaveLoader from "../WaveLoader";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface ModalEditOtherProps {
  title: string;
  show: boolean;
  handleClose: () => void;
  dataUser: User;
  dataBrokerProfile: BrokerProfile;
  listInterestTopics: InterestTopics[];
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  setInterestTopics: React.Dispatch<React.SetStateAction<InterestTopics[]>>;
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const ModalEditOtherInfo: React.FC<ModalEditOtherProps> = ({
  show,
  handleClose,
  title,
  dataUser,
  dataBrokerProfile,
  listInterestTopics,
  setLocation,
  setInterestTopics,
  setSkills,
}) => {
  const [formData, setFormData] = useState({
    location: dataBrokerProfile.location || "",
    selectedServiceIds: dataBrokerProfile.skills.map(
      (skill) => skill.interestTopic.id,
    ),
    selectedTopicIds: dataBrokerProfile.interestTopics.map((topic) => topic.id),
  });

  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.value,
      }));
    },
    [],
  );

  const handleChangeSelectTopic = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedTopicIds: event.target.value as string[],
      }));
    },
    [],
  );

  const handleChangeSelectService = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedServiceIds: event.target.value as string[],
      }));
    },
    [],
  );

  const submitOtherInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const formDt = new FormData();
      formDt.append("location", formData.location);
      setLocation(formData.location);
      formDt.append(
        "interestTopicIds",
        JSON.stringify(formData.selectedTopicIds),
      );
      setInterestTopics(
        formData.selectedTopicIds
          .map((id) =>
            dataBrokerProfile.interestTopics.find((topic) => topic.id === id),
          )
          .filter((topic) => topic !== undefined),
      );
      if (formData.selectedServiceIds) {
        const brokerProfies = {
          skills: formData.selectedServiceIds,
        };
        formDt.append("brokerProfile", JSON.stringify(brokerProfies));
        setSkills(
          formData.selectedServiceIds
            .map((id) =>
              dataBrokerProfile.skills.find((topic) => topic.id === id),
            )
            .filter((topic) => topic !== undefined),
        );
      }
      await updateOtherProfile(formDt);
      throwToast("Updated successfully", "success");
      handleClose();
    } catch (error) {
      throwToast("Error updating", "error");
    } finally {
      setIsLoading(false);
    }
  }, [formData, handleClose]);

  return (
    <>
      <Modal
        fullscreen={fullscreen}
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        className={`${styles["customModal"]} nunito-font`}
      >
        <Modal.Header
          closeButton={fullscreen === "sm-down" ? false : true}
          className={styles["modal-header"]}
        >
          {fullscreen && (
            <i
              className={`${styles["modal-back__btn"]} bi bi-arrow-left h1 m-0`}
              onClick={handleClose}
            ></i>
          )}
          <Modal.Title>
            <h1 className="m-0 fw-bold">{title}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles["modal-content"]}>
          <form className="p-1">
            <p className="m-0 py-1 fw-600 font-xss">Email</p>
            <input
              className="px-2"
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                height: "32px",
              }}
              value={dataUser.email}
              name="email"
              disabled
            />
            <p className="m-0 py-1 fw-600 font-xss">Location</p>
            <input
              className="px-2"
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                height: "32px",
              }}
              value={formData.location}
              name="location"
              onChange={handleChange}
              placeholder="Please enter your location"
            />
            <p className="m-0 py-1 fw-600 font-xss">Service offer</p>
            <FormControl className="w-100">
              <Select
                multiple
                displayEmpty
                value={formData.selectedServiceIds}
                onChange={handleChangeSelectService}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Select service offer</em>;
                  }
                  return selected
                    .map(
                      (id) =>
                        listInterestTopics.find((topic) => topic.id === id)
                          ?.topicName,
                    )
                    .filter((name) => name !== undefined)
                    .join(", ");
                }}
                MenuProps={MenuProps}
              >
                {listInterestTopics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.topicName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <p className="m-0 py-1 fw-600 font-xss">Interest Topic</p>
            <FormControl className="w-100">
              <Select
                multiple
                displayEmpty
                value={formData.selectedTopicIds}
                onChange={handleChangeSelectTopic}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Select topic offer</em>;
                  }
                  return selected
                    .map(
                      (id) =>
                        listInterestTopics.find((topic) => topic.id === id)
                          ?.topicName,
                    )
                    .filter((name) => name !== undefined)
                    .join(", ");
                }}
                MenuProps={MenuProps}
              >
                {listInterestTopics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.topicName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            onClick={submitOtherInfo}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <WaveLoader />}
    </>
  );
};

export default ModalEditOtherInfo;
