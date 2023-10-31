import React from "react";
import { Sentry } from "react-activity";

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <div className="heading_container">
        <h2>Nagarjuna ICT Club - Photography Contest</h2>
      </div>
      <div className="header_search_area flex items-center gap-[1rem]">
        <p>Voting open</p>
        <Sentry color="#49b33e" size={24} speed={0.5} animating={true} />
      </div>
    </header>
  );
};

export default Header;
