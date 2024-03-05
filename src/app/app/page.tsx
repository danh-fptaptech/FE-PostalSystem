'use client';
import * as React from "react";
import {useSiteSetting} from "@/contexts/SiteContext";


const App = () => {
    // @ts-ignore
    const {siteSetting} = useSiteSetting();
  return (
    <div>
      <h1>In App</h1>
        <p>{siteSetting?.site_name}</p>
    </div>
  );
};

export default App;
