import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import type { BrokerProfile, InterestTopics, User } from "@/api/profile/model";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface ModalEditOtherProps {
  title: string;
  show: boolean;
  handleClose: () => void;
  dataUser: User;
  dataBrokerProfile: BrokerProfile;
  listInterestTopics: InterestTopics[];
}
const ModalEditOtherInfo: React.FC<ModalEditOtherProps> = ({
  show,
  handleClose,
  title,
  dataUser,
  dataBrokerProfile,
  listInterestTopics,
}) => {
  const [formData, setFormData] = useState({
    location: dataBrokerProfile.location || "",
  });
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    if (window) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [service, setService] = React.useState<string[]>([]);
  const [topic, setTopic] = React.useState<string[]>([]);

  useEffect(() => {
    const ser = dataBrokerProfile.skills.map(
      (skill) => skill.interestTopic.topicName,
    );
    setService(ser);
  }, []);
  useEffect(() => {
    const isTopic = dataBrokerProfile.interestTopics.map((t) => t.topicName);
    setTopic(isTopic);
  }, []);

  const handleChangeSelectTopic = (event: SelectChangeEvent<typeof topic>) => {
    const {
      target: { value },
    } = event;
    setTopic(typeof value === "string" ? value.split(",") : value);
  };
  const handleChangeSelectService = (
    event: SelectChangeEvent<typeof service>,
  ) => {
    const {
      target: { value },
    } = event;
    setService(typeof value === "string" ? value.split(",") : value);
  };

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
                value={service}
                onChange={handleChangeSelectService}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Select service offer</em>;
                  }
                  return selected.join(", ");
                }}
                MenuProps={MenuProps}
              >
                {listInterestTopics.map((topic) => (
                  <MenuItem
                    key={topic.id}
                    value={topic.topicName}
                    // style={getStyles(name, personName, theme)}
                  >
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
                value={service}
                onChange={handleChangeSelectService}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Select service offer</em>;
                  }
                  return selected.join(", ");
                }}
                MenuProps={MenuProps}
              >
                {listInterestTopics.map((topic) => (
                  <MenuItem
                    key={topic.id}
                    value={topic.topicName}
                    // style={getStyles(name, personName, theme)}
                  >
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
            // onClick={}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditOtherInfo;
