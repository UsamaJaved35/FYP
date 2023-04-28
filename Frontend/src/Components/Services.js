import React from "react";
const Services = () => {
    return (
    <>
    <section id="services" className="services section-bg">
      <div className="container">

        <div className="section-title">
          <h2> Application Insights</h2>
          <p>The goal of this project is to extract the text from the image that the user will upload. Generate a hash of that text and compare it to hash that is already saved on the blockchain.  </p>
        </div>

        <div className="row">
          <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
            <div className="icon-box">
              <div className="icon"><i className="bx bxl-dribbble"></i></div>
              <h4 className="title">User</h4>
              <p className="description">User provides the required E-stamps which are stored in blockchain after hashing to be further used for verification.</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
            <div className="icon-box">
              <div className="icon"><i className="bx bx-file"></i></div>
              <h4 className="title">Frontend</h4>
              <p className="description">React is used as frontend which is a JavaScript library. React is capable of making API calls (sending the request to the backend), which deal with the data. </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
            <div className="icon-box">
              <div className="icon"><i className="bx bx-tachometer"></i></div>
              <h4 className="title">Backend</h4>
              <p className="description">Solidity is IDE used for blockchain while Node.js is an open-source, cross-platform JavaScript runtime environment and library for running web applications outside the client's browser.</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
            <div className="icon-box">
              <div className="icon"><i className="bx bx-world"></i></div>
              <h4 className="title">Database</h4>
              <p className="description">Blockchain is a decentralized, distributed and public digital ledger that is used to record data which cannot be altered retroactively.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
);}
export default Services;