"use client";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import {
    AppsOutlined,
    DomainAddOutlined,
    DomainOutlined,
    HomeWorkOutlined,
    Inventory2Outlined,
    NoteAddOutlined,
    LocationOn,
    Lan,
    TypeSpecimen,
    Paid,
    LocalAtm,
    FormatListBulleted
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
        createMenu("Create Package", NoteAddOutlined, "/app/create-package", ["package.create"]),
        createMenu("Branches", HomeWorkOutlined, "/app/branches", ["branch"], [
            createMenu("List Branches", DomainOutlined, "/app/branches", ["branch.view"]),
            createMenu("Create Branch", DomainAddOutlined, "/app/branches/create", ["branch.create"]),
        ]),
        createMenu("Packages", Inventory2Outlined, "/app/packages", ["package.view"]),
        createMenu("Service Type", TypeSpecimen, "/app/ServiceType", ["servicetype.view"]),
        createMenu("Services", Lan, "/app/Services", ["services.view"]),
        createMenu("Locations", LocationOn, "/app/Locations", ["locations.view"]),
        createMenu("Check Fee", Paid, "/app/Feecustom/checkfee", ["checkFee.view"]),
        createMenu("Fee Custom", Paid, "/app/Feecustom", ["feecustom"], [
            createMenu("List Branches", FormatListBulleted, "/app/Feecustom", ["feecustom.view"]),
            createMenu("Create Branch", LocalAtm, "/app/Feecustom/Manager", ["feecustom.create"]),
        ]),
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