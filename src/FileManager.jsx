import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Card,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import "./FileManager.css";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [shareDisabled, setShareDisabled] = useState(false);
  const [activeSharedFileId, setActiveSharedFileId] = useState(null);
  const [copiedAlert, setCopiedAlert] = useState(false); // ✅ new state for copy alert

  const countdownInterval = useRef(null);
  const token = localStorage.getItem("jwt");

  // ------------------- Fetch -------------------
  const fetchFiles = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get("/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data || []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalSize = files.reduce((total, file) => total + file.fileSize, 0);

  // ------------------- Upload -------------------
  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements.data.files[0];
    if (!file) return;

    const allowedExtensions = [
      "jpg",
      "png",
      "jpeg",
      "pdf",
      "docx",
      "ppt",
      "pptx",
      "mp4",
      "mp3",
      "html",
    ];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const maxSize = 200 * 1024 * 1024;
    const maxSizeVideo = 100 * 1024 * 1024;

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Invalid file type");
      return;
    }
    if (fileExtension === "mp4" && file.size > maxSizeVideo) {
      alert("MP4 exceeds 100MB");
      return;
    }
    if (file.size > maxSize) {
      alert("File exceeds 200MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/cs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const uploadedFile = response.data;
      setFiles([...files, uploadedFile]);
      setUploadSuccess(true);
      e.target.reset();
      setTimeout(() => setUploadSuccess(false), 5000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + (error.response?.data || error.message));
    }
  };

  // ------------------- Delete -------------------
  const handleDelete = async () => {
    if (selectedFile) {
      try {
        await axios.delete(`/api/files/${selectedFile.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(files.filter((file) => file.id !== selectedFile.id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
      setShowDeleteModal(false);
      setSelectedFile(null);
    }
  };

  // ------------------- Download -------------------
  const handleDownload = async (fileId) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    const link = `${axios.defaults.baseURL}/api/files/${fileId}/download`;

    try {
      const response = await axios.get(link, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = file.fileName || "downloaded_file";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("❌ Failed to download file.");
    }
  };

  // ------------------- Share -------------------
  const handleShare = async (fileId) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setShareDisabled(true);
    setActiveSharedFileId(fileId);
    setShowShareAlert(true);
    setCountdown(120);

    try {
      await axios.post(`/api/start/${fileId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios.get(
        `${axios.defaults.baseURL}/api/share/${fileId}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setShareLink(response.data);
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert("❌ Failed to share file.");
      setShareDisabled(false);
      setActiveSharedFileId(null);
      return;
    }

    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          setCountdown(0);

          axios.post(`/api/stop/${fileId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((error) => console.error("Failed to call /stop:", error));

          setShareDisabled(false);
          setActiveSharedFileId(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ------------------- Copy -------------------
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedAlert(true);
        setTimeout(() => setCopiedAlert(false), 3000); // auto hide after 3s
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="file-manager-container">
      <Card className="file-manager-card">
        <h2>Welcome, User!</h2>
        <p>You are now logged in.</p>

        {/* Upload Section */}
        <div className="upload-section">
          <h4>Upload a File</h4>
          {uploadSuccess && (
            <Alert
              variant="success"
              onClose={() => setUploadSuccess(false)}
              dismissible
            >
              File uploaded successfully!
            </Alert>
          )}

          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Choose a file</Form.Label>
              <Form.Control
                type="file"
                name="data"
                accept=".jpg,.png,.jpeg,.pdf,.docx,.ppt,.pptx,.mp3,.mp4,.html"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Upload</Button>
          </Form>
        </div>

        <div className="total-size-section">
          <h4>Total Uploaded Size: {formatSize(totalSize)}</h4>
        </div>

        {/* Share Alert */}
        {showShareAlert && (
          <Alert
            variant={countdown > 0 ? "success" : "danger"}
            className="share-alert"
          >
            <Alert.Heading>
              {countdown > 0 ? "File shared successfully!" : "Link expired!"}
            </Alert.Heading>
            {countdown > 0 ? (
              <>
                <a href={shareLink} target="_blank" rel="noopener noreferrer">
                  {shareLink}
                </a>
                <div className="countdown">
                  <span>{countdown}</span> seconds remaining.
                </div>
                <div className="share-buttons">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Copy share link</Tooltip>}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => copyToClipboard(shareLink)}
                    >
                      Copy Link
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger placement="top" overlay={<Tooltip>Generate QR Code</Tooltip>}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowQRModal(true)}
                    >
                      Generate QR Code
                    </Button>
                  </OverlayTrigger>
                </div>
              </>
            ) : (
              <p>Please click on the share button to create a new link.</p>
            )}
          </Alert>
        )}

        {/* Copied Alert */}
        {copiedAlert && (
          <Alert variant="info" className="mt-2">
            ✅ Link copied to clipboard!
          </Alert>
        )}

        {/* File List Section */}
        <div className="file-list-section">
          <h4>Your Files:</h4>
          <Form.Group className="search-bar">
            <Form.Control
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          <div className="file-items">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-info">
                    <p className="file-name">
                      {file.fileName} ({formatSize(file.fileSize)})
                    </p>
                    <small className="upload-date">
                      Uploaded: {file.uploade_date}
                    </small>
                  </div>
                  <div className="file-actions">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Download file</Tooltip>}>
                      <Button
                        variant="success"
                        size="sm"
                        className="action-btn"
                        onClick={() => handleDownload(file.id)}
                      >
                        Download
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={<Tooltip>{activeSharedFileId === file.id ? "Cannot delete while shared" : "Delete file"}</Tooltip>}>
                      <span>
                        <Button
                          variant={activeSharedFileId === file.id ? "secondary" : "danger"}
                          size="sm"
                          className="action-btn"
                          onClick={() => {
                            setSelectedFile(file);
                            setShowDeleteModal(true);
                          }}
                          disabled={activeSharedFileId === file.id}
                        >
                          Delete
                        </Button>
                      </span>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={<Tooltip>Share file</Tooltip>}>
                      <span>
                        <Button
                          variant="info"
                          size="sm"
                          className="action-btn"
                          onClick={() => handleShare(file.id)}
                          disabled={shareDisabled}
                        >
                          Share
                        </Button>
                      </span>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={<Tooltip>File details</Tooltip>}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="action-btn"
                        onClick={() => {
                          setSelectedFile(file);
                          setShowDetailsModal(true);
                        }}
                      >
                        Details
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-files">
                <p>No files uploaded yet. Upload your first file above.</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <OverlayTrigger placement="top" overlay={<Tooltip>Logout from your account</Tooltip>}>
          <Button
            variant="danger"
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("jwt");
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </OverlayTrigger>

        {/* Modals */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>File Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedFile && (
              <>
                <p><strong>Name:</strong> {selectedFile.fileName}</p>
                <p><strong>Size:</strong> {formatSize(selectedFile.fileSize)}</p>
                <p><strong>Upload Date:</strong> {selectedFile.uploade_date}</p>
                <p><strong>Downloads:</strong> {selectedFile.downloads}</p>
              </>
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete{" "}
            <strong>{selectedFile?.fileName}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>QR Code for {selectedFile?.fileName}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="qr-code-container">
            {shareLink && <QRCodeCanvas value={shareLink} size={200} />}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQRModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </div>
  );
};

export default FileManager;
