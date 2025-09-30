import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Card } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import "./FileManager.css";
import axios from "axios";

// ✅ Set base URL
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
  const [countdownInterval, setCountdownInterval] = useState(null);

  const token = localStorage.getItem("jwt"); // ✅ keep consistent

  useEffect(() => {
    if (token) fetchFiles();
  }, [token]);

  // ✅ Fetch logged-in user's files
  const fetchFiles = async () => {
    try {
      const response = await axios.get("/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data || []);
    } catch (err) {

      console.error("Failed to fetch files:", err);
      console.error("check token   ", token);
    }
  };

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
      "jpg", "png", "jpeg", "pdf", "docx",
      "ppt", "pptx", "mp4", "mp3", "html",
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

  // ------------------- Share -------------------
  const handleShare = (fileId) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    if (countdownInterval) clearInterval(countdownInterval);

    const link = `${axios.defaults.baseURL}/api/files/${fileId}/download`;
    setShareLink(link);
    setShowShareAlert(true);
    setCountdown(120);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setCountdownInterval(timer);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Link copied to clipboard!"))
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
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => copyToClipboard(shareLink)}
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowQRModal(true)}
                  >
                    Generate QR Code
                  </Button>
                </div>
              </>
            ) : (
              <p>Please click on the share button to create a new link.</p>
            )}
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
                    <Button
                      variant="success"
                      size="sm"
                      className="action-btn"
                      href={`${axios.defaults.baseURL}/api/files/${file.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="action-btn"
                      onClick={() => {
                        setSelectedFile(file);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      className="action-btn"
                      onClick={() => handleShare(file.id)}
                    >
                      Share
                    </Button>
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
            Are you sure you want to delete <strong>{selectedFile?.fileName}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
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
            <Button variant="secondary" onClick={() => setShowQRModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </div>
  );
};

export default FileManager;
