import React from "react";
import { Link } from "react-scroll";
const Navbar = () => {
    return (
        <>
            <header id="header" className="fixed-top d-flex align-items-center">
                <div className="container d-flex align-items-center justify-content-between">
                    <div className="logo" style={{marginLeft:-90}} >
                        <h4 className="text-light"><img src="assets/img/logo.png" alt=""
                        style={{width:160,marginTop:16}} className="img-fluid" />
                            <span style={{color:'#162b4c'}}>E-Stamp Verification</span></h4>
                    </div>

                    <nav id="navbar" style={{boxShadow:'0 0'}} className="navbar">
                        <ul>
                            <li> <Link className="nav-link scrollto active" to="header" smooth={true} duration={200}>Home</Link> </li>
                            <li><Link className="nav-link scrollto" to="about" smooth={true} duration={200} >About </Link></li>
                            <li><Link className="nav-link scrollto" to="team" smooth={true} duration={200}>Team</Link> </li>
                            <li><Link className="getstarted scrollto" to="about" smooth={true} duration={200}> Get Started</Link></li>
                        </ul>
                        <i className="bi bi-list mobile-nav-toggle"></i>
                    </nav>

                </div>
            </header>
        </>
    );
}
export default Navbar;