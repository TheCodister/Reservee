import "./Print.css";
import { ReturnButton } from "../../Components";
import { useState } from "react";
import axios from "axios";
const Print = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [updateIcon, setUpdateIcon] = useState(null);
  const [msg, setMsg] = useState("Kéo thả hoặc ấn để tải tài liệu lên");
  const handleUpload = () => {
    if (!file) {
      setMsg("File trống");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);

    setMsg("Đang tải, vui lòng đợi giây lát...");
    setProgress((prevState) => {
      return { ...prevState, started: true };
    });
    axios
      .post("http://httpbin.org/post", fd, {
        onUploadProgress: (progressEvent) => {
          setProgress((prevState) => {
            return { ...prevState, pc: progressEvent.progress * 100 };
          });
        },
        headers: {
          "Custom-Headers": "value",
        },
      })
      .then((res) => {
        setMsg("Tải thành công!");
        setUpdateIcon("./Images/Group 23.png");
        console.log(res.data);
      })
      .catch((err) => {
        setMsg("Tải thất bại");
        console.error(err);
      });
  };
  return (
    <div className="print">
      <div className="print-title">
        <h1>In</h1>
        <ReturnButton />
      </div>
      <div className="print-file">
        <div className="print-file-title">
          <h1>Danh sách tài liệu</h1>
        </div>
        <div className="print-file-section">
          <img src={updateIcon}></img>
        </div>
      </div>
      <div className="print-upload">
        <img src="./Images/upload.svg" />
        {msg && <h1>{msg}</h1>}
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
        />
        <p onClick={handleUpload}>Tải lên</p>
        {progress.started && (
          <progress
            className="print-progress"
            max="100"
            value={progress.pc}
          ></progress>
        )}
      </div>
      <div className="print-confirm">
        <h1>Xác nhận</h1>
        <h1>Xóa</h1>
      </div>
    </div>
  );
};

export default Print;
