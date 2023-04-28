import React from "react";
const About = () => {
    return (
<>
<main id="main">
<section id="about" className="about">
      <div className="container">

        <div className="row justify-content-between">
          <div className="col-lg-5 d-flex align-items-center justify-content-center about-img">
            <img src="assets/img/about-img.svg" className="img-fluid" alt=""/>
          </div>
          <div className="col-lg-6 pt-5 pt-lg-0">
            <h3>Why need e-stamp verification system?</h3>
            <p data-aos-delay="100">
              As technology is evolving everything is going digital , such as the generation of legal documents. One of such documents is E-Stamps. However, it is feasible to generate forged documents that can be easily mistaken for genuine. How can we verify whether it is tampered or not ? Our system will allow users to upload the picture or pdf of their E-Stamps and verify it using the previous record saved in the blockchain.
            </p>
            <div className="row">
              <div className="col-md-6">
                <i className="bx bx-receipt"></i>
                <h4>More Secured</h4>
                <p>By creating a record that can't be altered and is encrypted end-to-end, blockchain helps prevent fraud and unauthorized activity. It's based on principles of cryptography, decentralization and consensus, which ensure trust in security.</p>
              </div>
              <div className="col-md-6">
                <i className="bx bx-cube-alt"></i>
                <h4>More Reliable</h4>
                <p>Blockchain technology enables decentralization through the participation of members across a distributed network. There is no single point of failure and a single user cannot change the record.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
</main>
</>
)};
export default About;