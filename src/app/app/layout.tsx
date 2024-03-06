"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import {Menu} from "@mui/icons-material";
import {Container} from "@mui/material";
import AvatarMenu from "@/components/AvatarMenu";
import DrawerMenu from "@/components/DrawerMenu";
import MenuContext from "@/contexts/MenuContext";




const AppLayout = (props: { children: React.ReactNode; window?: Window }) => {
    const drawerWidth = 300;
    const [mobileOpen, setMobileOpen] = React.useState(false);


    const handleDrawerClose = () => {
        setMobileOpen(false);
    };


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    return (
        <Box sx={{display: "flex"}}>
            <AppBar
                position="fixed"
                sx={{
                    width: {md: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <Container
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2, display: {md: "none"}}}
                        >
                            <Menu/>
                        </IconButton>
                        <div></div>
                        <AvatarMenu/>
                    </Container>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}}
                aria-label="mailbox folders"
            ><MenuContext.Provider value={{handleDrawerClose}}>
                <Drawer
                    container={
                        props.window !== undefined ? () => window.document.body : undefined
                    }
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {xs: "block", md: "none"},
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    <DrawerMenu/>
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: "none", md: "block"},
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    <DrawerMenu/>
                </Drawer>
            </MenuContext.Provider>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: {md: `calc(100% - ${drawerWidth}px)`},
                    backgroundColor: "#f1f1f1",
                    minHeight: "100vh",
                }}
            >
                <Toolbar/>
                <Container maxWidth={"xl"}>
                    {props.children}
                </Container>
            </Box>
        </Box>
    );
};
export default AppLayout;