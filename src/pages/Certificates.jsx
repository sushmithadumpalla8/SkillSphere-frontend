import React, { useState, useEffect } from 'react';
import { getMyCertificates, downloadCertificatePdfUrl } from '../services/api';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await getMyCertificates();
      setCertificates(res.data);
      if (res.data.length > 0) {
        setSelectedCert(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load certificates', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="mb-4 no-print">
        <h3 className="font-heading fw-bold text-dark">My Verified Certificates</h3>
        <p className="text-muted">View, print, or download official completion certificates earned on SkillSphere.</p>
      </div>

      {loading ? (
        <div className="text-center py-5 no-print"><div className="spinner-border text-primary"></div></div>
      ) : certificates.length === 0 ? (
        <div className="card card-custom border-0 p-5 text-center my-4 no-print">
          <i className="bi bi-award display-1 text-muted mb-3 opacity-50"></i>
          <h4 className="font-heading fw-bold text-dark">No Certificates Yet</h4>
          <p className="text-muted">Complete all course materials and pass the assessment quiz with 50%+ to earn your certificate.</p>
        </div>
      ) : (
        <div className="row g-4">
          {/* Certificate Selector Sidebar */}
          <div className="col-lg-3 no-print">
            <div className="card card-custom border-0 p-3">
              <h6 className="font-heading fw-bold text-dark mb-3 px-2">Earned Certificates</h6>
              <div className="d-flex flex-column gap-2">
                {certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`btn text-start p-3 rounded-3 border transition-all ${
                      selectedCert?.id === cert.id ? 'btn-primary text-white shadow-sm' : 'btn-light border-0 text-dark'
                    }`}
                  >
                    <div className="fw-semibold text-truncate small font-heading">{cert.courseTitle}</div>
                    <small className={selectedCert?.id === cert.id ? 'text-white-50' : 'text-muted'} style={{ fontSize: '0.75rem' }}>
                      Issued: {cert.issueDate}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate Display Area */}
          <div className="col-lg-9">
            {selectedCert && (
              <div>
                {/* Print/Download Action Toolbar */}
                <div className="d-flex justify-content-end gap-2 mb-3 no-print">
                  <button onClick={handlePrint} className="btn btn-outline-primary shadow-sm rounded-pill px-4">
                    <i className="bi bi-printer me-2"></i> Print Certificate
                  </button>
                  <a
                    href={downloadCertificatePdfUrl(selectedCert.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary-custom rounded-pill px-4"
                  >
                    <i className="bi bi-download me-2"></i> Download PDF
                  </a>
                </div>

                {/* Printable Certificate Frame */}
                <div className="certificate-frame">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <div className="brand-icon bg-primary text-white rounded-3" style={{ width: 44, height: 44, fontSize: '1.4rem' }}>
                        <i className="bi bi-mortarboard-fill"></i>
                      </div>
                      <span className="h3 mb-0 font-heading fw-bold text-dark">SkillSphere</span>
                    </div>
                    <span className="badge bg-light text-dark border px-3 py-2 font-mono small">
                      ID: {selectedCert.certificateNumber}
                    </span>
                  </div>

                  <hr className="border-primary opacity-25 my-4" />

                  <span className="text-uppercase text-primary fw-bold font-heading fs-6" style={{ letterSpacing: '3px' }}>
                    CERTIFICATE OF COMPLETION
                  </span>

                  <p className="text-muted mt-3 mb-1 fs-5 italic">This is to certify that</p>
                  <h1 className="display-5 font-heading fw-extrabold text-dark my-2 text-decoration-underline" style={{ color: '#1e3a8a' }}>
                    {selectedCert.studentName}
                  </h1>

                  <p className="text-muted fs-5 my-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    has successfully completed all required coursework, modules, and passed the final assessment quiz for the course
                  </p>

                  <h3 className="font-heading fw-bold text-primary my-3">
                    "{selectedCert.courseTitle}"
                  </h3>

                  <div className="certificate-seal">
                    <i className="bi bi-patch-check-fill"></i>
                  </div>

                  <div className="row mt-5 pt-4 border-top align-items-end text-start">
                    <div className="col-6">
                      <p className="mb-0 fw-bold font-heading text-dark fs-6">{selectedCert.instructorName}</p>
                      <small className="text-muted d-block border-top pt-1 mt-1" style={{ maxWidth: 200 }}>
                        Course Instructor
                      </small>
                    </div>

                    <div className="col-6 text-end">
                      <p className="mb-0 fw-bold font-heading text-dark fs-6">{selectedCert.issueDate}</p>
                      <small className="text-muted d-block border-top pt-1 mt-1 ms-auto" style={{ maxWidth: 200 }}>
                        Date of Issue
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
