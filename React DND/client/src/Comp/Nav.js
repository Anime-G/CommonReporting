import React, { useState } from "react";
import {Menu} from 'antd'
import { Link, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Report from "./Report";
const Nav = () => {
    const items = [
        {
          label: (<Link to='/' >Home</Link>),
          key: 'Home',
          
        },
        {
            label: (<Link to='/report' >Report</Link>),
            key: 'report',
            
          },
    ]
  const [current, setCurrent] = useState("Home");
  const onClick = (e) => {
    setCurrent(e.key);
  };
  return (
    <div>
      <Menu
        theme="dark"
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/report" element={<Report/>} />
      </Routes>
    </div>
  );
};

export default Nav;
