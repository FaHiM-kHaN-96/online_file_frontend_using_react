import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Card,
  Tooltip,
  OverlayTrigger,
  ProgressBar,
  Badge,
} from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaUpload,
  FaDownload,
  FaTrash,
  FaShare,
  FaInfoCircle,
  FaSignOutAlt,
  FaSearch,
  FaCopy,
  FaQrcode,
  FaFile,
  FaFileImage,
  FaHome,
  FaFilePdf,
  FaFileVideo,
  FaFileAudio,
  FaFileCode,
  FaFileWord,
  FaFilePowerpoint,
  FaCloudUploadAlt,
  FaFolderOpen,
  FaClock,
} from "react-icons/fa";
import "./FileManager.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

axios.defaults.baseURL = "http://192.168.1.183:8080";

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
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const countdownInterval = useRef(null);
  const token = localStorage.getItem("jwt");

  // Get file icon based on extension
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconProps = { size: 20, className: "file-icon" };

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
        return <FaFileImage {...iconProps} style={{ color: "#e74c3c" }} />;
      case "pdf":
        return <FaFilePdf {...iconProps} style={{ color: "#e74c3c" }} />;
      case "mp4":
      case "avi":
      case "mov":
        return <FaFileVideo {...iconProps} style={{ color: "#9b59b6" }} />;
      case "mp3":
      case "wav":
        return <FaFileAudio {...iconProps} style={{ color: "#3498db" }} />;
      case "html":
      case "css":
      case "js":
        return <FaFileCode {...iconProps} style={{ color: "#e67e22" }} />;
      case "docx":
      case "doc":
        return <FaFileWord {...iconProps} style={{ color: "#2980b9" }} />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint {...iconProps} style={{ color: "#e74c3c" }} />;
      default:
        return <FaFile {...iconProps} style={{ color: "#95a5a6" }} />;
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post("/api/cs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const uploadedFile = response.data;
      setFiles([...files, uploadedFile]);
      setUploadSuccess(true);
      e.target.reset();
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploading(false);
        setUploadProgress(0);
      }, 5000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + (error.response?.data || error.message));
      setIsUploading(false);
      setUploadProgress(0);
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
      await axios.post(
        `/api/start/${fileId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
    // const response_check = await  axios
    //       .get(
    //         `/share_file/stop/timer`,
    //         {},
    //         {

    //         }
    //       )

    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          setCountdown(0);

          axios
            .post(
              `/api/stop/${fileId}`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .catch((error) => console.error("Failed to call /stop:", error));

          setShareDisabled(false);
          setActiveSharedFileId(null);
          return 0;
        }
        // if (response_check) {
        //   setCountdown(0);
        // }
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
        setTimeout(() => setCopiedAlert(false), 3000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="file-manager-container">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <Card className="file-manager-card glass-effect">
        {/* Header Section */}
        <div className="header-section">
          <div className="welcome-section">
            <h2>Welcome back! 👋</h2>
            <p>Manage your files securely in one place</p>
          </div>
          <div className="stats-section">
            <div className="stat-item">
              <FaFolderOpen className="stat-icon" />
              <div>
                <span className="stat-number">{files.length}</span>
                <span className="stat-label">Total Files</span>
              </div>
            </div>
            <div className="stat-item">
              <FaCloudUploadAlt className="stat-icon" />
              <div>
                <span className="stat-number">{formatSize(totalSize)}</span>
                <span className="stat-label">Storage Used</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-section card-section">
          <div className="section-header">
            <FaUpload className="section-icon" />
            <h4>Upload New File</h4>
          </div>

          {uploadSuccess && (
            <Alert
              variant="success"
              onClose={() => setUploadSuccess(false)}
              dismissible
              className="success-alert"
            >
              <div className="alert-content">
                <FaCloudUploadAlt />
                <span>File uploaded successfully!</span>
              </div>
            </Alert>
          )}

          <Form onSubmit={handleUpload} className="upload-form">
            <div className="file-upload-area">
              <FaCloudUploadAlt className="upload-icon" />
              <div className="upload-text">
                <p>Drag & drop your files here or click to browse</p>
                <small>
                  Supports: JPG, PNG, PDF, DOCX, PPT, MP4, MP3, HTML
                </small>
                <small>Max size: 200MB (100MB for videos)</small>
              </div>
              <Form.Control
                type="file"
                name="data"
                accept=".jpg,.png,.jpeg,.pdf,.docx,.ppt,.pptx,.mp3,.mp4,.html"
                required
                className="file-input"
              />
            </div>

            {isUploading && (
              <div className="upload-progress">
                <ProgressBar
                  now={uploadProgress}
                  label={`${uploadProgress}%`}
                  variant="primary"
                  animated
                />
                <small>Uploading... {uploadProgress}%</small>
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              className="upload-btn"
              disabled={isUploading}
            >
              <FaUpload className="btn-icon" />
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          </Form>
        </div>

        {/* Share Alert */}
        {showShareAlert && (
          <Alert
            variant={countdown > 0 ? "success" : "danger"}
            className="share-alert glass-effect"
          >
            <div className="share-alert-content">
              <div className="share-header">
                <Alert.Heading>
                  {countdown > 0
                    ? "🚀 File Shared Successfully!"
                    : "⏰ Link Expired!"}
                </Alert.Heading>
                <Badge
                  bg={countdown > 0 ? "success" : "danger"}
                  className="countdown-badge"
                >
                  <FaClock className="me-1" />
                  {countdown}s
                </Badge>
              </div>

              {countdown > 0 ? (
                <>
                  <div className="share-link-container">
                    <code className="share-link">{shareLink}</code>
                  </div>

                  {/* 🔔 One-time use alert */}
                  <Alert
                    variant="warning"
                    className="expired-text"
                  >
                    ⚠️ This link is for one-time use only (single share).
                  </Alert>

                  <div className="share-buttons">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Copy share link</Tooltip>}
                    >
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="share-btn"
                        onClick={() => copyToClipboard(shareLink)}
                      >
                        <FaCopy className="btn-icon" />
                        Copy Link
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Generate QR Code</Tooltip>}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="share-btn"
                        onClick={() => setShowQRModal(true)}
                      >
                        <FaQrcode className="btn-icon" />
                        QR Code
                      </Button>
                    </OverlayTrigger>
                  </div>
                </>
              ) : (
                <p className="expired-text">
                  Please click on the share button to create a new link.
                </p>
              )}
            </div>
          </Alert>
        )}

        {/* Copied Alert */}
        {copiedAlert && (
          <Alert variant="info" className="copied-alert glass-effect">
            <FaCopy className="me-2" />✅ Link copied to clipboard!
          </Alert>
        )}

        {/* File List Section */}
        <div className="file-list-section card-section">
          <div className="section-header">
            <FaFolderOpen className="section-icon" />
            <h4>Your Files</h4>
            <Badge bg="primary" className="file-count-badge">
              {filteredFiles.length} files
            </Badge>
          </div>

          <div className="search-container">
            <FaSearch className="search-icon" />
            <Form.Control
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="file-items">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`file-item glass-effect ${
                    activeSharedFileId === file.id ? "sharing-active" : ""
                  }`}
                >
                  <div className="file-main-info">
                    <div className="file-icon-type">
                      {getFileIcon(file.fileName)}
                    </div>
                    <div className="file-details">
                      <h6 className="file-name">{file.fileName}</h6>
                      <div className="file-meta">
                        <span className="file-size">
                          {formatSize(file.fileSize)}
                        </span>
                        <span className="file-date">
                          <FaClock className="me-1" />
                          {formatDate(file.uploade_date)}
                        </span>
                        {file.downloads > 0 && (
                          <span className="file-downloads">
                            {file.downloads} downloads
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="file-actions">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Download file</Tooltip>}
                    >
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="btn-icon"
                        onClick={() => handleDownload(file.id)}
                      >
                        <FaDownload className="btn-icon" />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          {activeSharedFileId === file.id
                            ? "Cannot delete while shared"
                            : "Delete file"}
                        </Tooltip>
                      }
                    >
                      <span>
                        <Button
                          variant={
                            activeSharedFileId === file.id
                              ? "outline-secondary"
                              : "outline-danger"
                          }
                          size="sm"
                          className="btn-icon"
                          onClick={() => {
                            setSelectedFile(file);
                            setShowDeleteModal(true);
                          }}
                          disabled={activeSharedFileId === file.id}
                        >
                          <FaTrash />
                        </Button>
                      </span>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Share file</Tooltip>}
                    >
                      <span>
                        <Button
                          variant={
                            activeSharedFileId === file.id
                              ? "primary"
                              : "outline-info"
                          }
                          size="sm"
                          className="btn-icon"
                          onClick={() => handleShare(file.id)}
                          disabled={shareDisabled}
                        >
                          <FaShare className="btn-icon" />
                        </Button>
                      </span>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>File details</Tooltip>}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="btn-icon"
                        onClick={() => {
                          setSelectedFile(file);
                          setShowDetailsModal(true);
                        }}
                      >
                        <FaInfoCircle className="btn-icon" />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-files glass-effect">
                <FaFolderOpen className="no-files-icon" />
                <p>No files found</p>
                <small>
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Upload your first file to get started"}
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="logout-section">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Logout from your account</Tooltip>}
          >
            <Button
              variant="outline-danger"
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("jwt");
                window.location.href = "/login";
              }}
            >
              <FaSignOutAlt className="btn-icon" />
              Logout
            </Button>
          </OverlayTrigger>
        </div>

        {/* Modals */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          centered
          className="custom-modal"
        >
          <Modal.Header closeButton className="modal-header">
            <Modal.Title>
              <FaInfoCircle className="me-2" />
              File Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            {selectedFile && (
              <div className="file-details-content">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedFile.fileName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Size:</span>
                  <span className="detail-value">
                    {formatSize(selectedFile.fileSize)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Upload Date:</span>
                  <span className="detail-value">
                    {formatDate(selectedFile.uploade_date)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Downloads:</span>
                  <span className="detail-value">
                    <Badge bg="info">{selectedFile.downloads}</Badge>
                  </span>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
          className="custom-modal"
        >
          <Modal.Header closeButton className="modal-header">
            <Modal.Title>
              <FaTrash className="me-2" />
              Confirm Delete
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <div className="delete-confirmation">
              <div className="delete-icon">
                <FaTrash />
              </div>
              <p>
                Are you sure you want to delete{" "}
                <strong>"{selectedFile?.fileName}"</strong>?
              </p>
              <small className="text-muted">
                This action cannot be undone.
              </small>
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <Button
              variant="outline-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <FaTrash className="me-1" />
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showQRModal}
          onHide={() => setShowQRModal(false)}
          centered
          className="custom-modal"
        >
          <Modal.Header closeButton className="modal-header">
            <Modal.Title>
              <FaQrcode className="me-2" />
              QR Code
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body qr-code-container">
            <div className="qr-content">
              <p className="qr-description">
                Scan to download <strong>{selectedFile?.fileName}</strong>
              </p>
              {shareLink && <QRCodeCanvas value={shareLink} size={200} />}
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer">
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
