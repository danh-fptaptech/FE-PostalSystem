"use client";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import {
    AppsOutlined,
    DomainAddOutlined,
    DomainOutlined,
    HomeWorkOutlined,
    Inventory2Outlined
} from "@mui/icons-material";
import * as React from "react";
import {OverridableComponent} from "@mui/material/OverridableComponent";
import {usePathname} from 'next/navigation'
import MenuGroup from "@/components/MenuGroup";

export default function DrawerMenu() {

    const path = usePathname();

    // @ts-ignore
    function createMenu(name: string, icon: OverridableComponent<any>, path: string, permission: [string], children?: any[{
        name: string,
        icon: OverridableComponent<any>,
        path: string,
        permission: [string]
    }]) {
        return {name, icon, path, permission, children}
    }

    const menu = [
        createMenu("Dashboard", AppsOutlined, "/app", ["app.view"]),
        createMenu("Branches", HomeWorkOutlined, "/app/branches", ["branches"], [
            createMenu("List Branches", DomainOutlined, "/app/branches", ["branches.view"]),
            createMenu("Create Branch", DomainAddOutlined, "/app/branches/create", ["branches.create"]),
        ]),
        createMenu("Packages", Inventory2Outlined, "/app/packages", ["package.view"]),
    ]

    return (
        <div>
            <Toolbar></Toolbar>
            <Divider/>
            <List>
                {menu.map((item, index) =>
                    (<MenuGroup item={item} key={index}></MenuGroup>
                    ))}
            </List>
        </div>
    )
}