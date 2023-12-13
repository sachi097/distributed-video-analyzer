import React from 'react';
import logo from './browse-svgrepo-com.png';

export default function Navbar(props) {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid my-2 mx-2">
        <div className="container text-center">
          <a className="navbar-brand" href=" ">
            <img src={logo} alt="logo" width="55" height="45" className=" text-center mx-2 "/>
            <span className="navbar-title fs-4 fw-bold text-purple text-center mx-2">
              {props.title}
            </span>
          </a>
        </div>
        
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  title: "VidzSlayers",
};
