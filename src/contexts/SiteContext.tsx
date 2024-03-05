'use client';
import * as React from "react";
import {toast} from "sonner";
import {useContext} from "react";

//@ts-ignore
const SiteContext = React.createContext();

//@ts-ignore
export const SiteProvider = ({ children }) => {
    const [siteSetting, setSiteSetting] = React.useState([]);


    React.useEffect(() => {
        const fetchSiteSetting = async () => {
           try {
               let res = await fetch('/api/general-setting');
               let data = await res.json();
               setSiteSetting(data.data);
           } catch (error) {
                console.log(error);
                toast.error('Something went wrong');
           }
        };
        fetchSiteSetting();
    }, []);


    return (
        <SiteContext.Provider value={{siteSetting}}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteSetting = () => useContext(SiteContext);