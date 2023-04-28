import React from "react";

const Header = () => {
    return (
        <>
            <section id="hero" style={{marginTop:72}} className="d-flex align-items-center">

                <div className="container">
                    <div className="row gy-4">
                        <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
                            <h1>E-Stamp Verification System</h1>
                            <h3>Drop your E-stamps here!</h3>
                            <h3>Acceptable in <b>PDF PNG JPG JPEG </b></h3>
                            <div>
                                <a href="#about" className="btn-get-started scrollto">Get Started</a>
                            </div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2 hero-img">
                            <img src="assets/img/hero-img.svg" className="img-fluid animated" alt="" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Header;
