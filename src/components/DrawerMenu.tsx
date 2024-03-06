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
    LocationOnOutlined,
    LanOutlined,
    TypeSpecimenOutlined,
    PaidOutlined,
    LocalAtmOutlined,
    FormatListBulletedOutlined,
    FactCheckOutlined
} from "@mui/icons-material";
import * as React from "react";
import {OverridableComponent} from "@mui/material/OverridableComponent";
import MenuGroup from "@/components/MenuGroup";

export default function DrawerMenu() {

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
        createMenu("Service", FactCheckOutlined, "/app/Services", ["services"], [
            createMenu("Service Type", TypeSpecimenOutlined, "/app/ServiceType", ["servicetype.view"]),
            createMenu("Services Manager", LanOutlined, "/app/Services", ["services.view"]),
        ]),
        createMenu("Locations", LocationOnOutlined, "/app/Locations", ["locations.view"]),
        createMenu("Check Fee", PaidOutlined, "/app/Feecustom/checkfee", ["checkFee.view"]),
        createMenu("Fee Custom", PaidOutlined, "/app/Feecustom", ["feecustom"], [
            createMenu("List Fee", FormatListBulletedOutlined, "/app/Feecustom", ["feecustom.view"]),
            createMenu("Manager Fee", LocalAtmOutlined, "/app/Feecustom/Manager", ["feecustom.create"]),
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