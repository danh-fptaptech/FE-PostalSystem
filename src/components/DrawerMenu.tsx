'use client'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import {
  AccountBoxOutlined,
  AppsOutlined,
  BadgeOutlined,
  BusinessOutlined,
  DomainAddOutlined,
  DomainOutlined,
  DriveFileRenameOutlineOutlined, FactCheckOutlined, FormatListBulletedOutlined,
  GroupOutlined,
  HomeWorkOutlined,
  Inventory2Outlined, LanOutlined, LocalAtmOutlined, LocationOnOutlined,
  ManageAccountsOutlined,
  MoveToInboxOutlined,
  NoteAddOutlined,
  OutboxOutlined, PaidOutlined,
  PasswordOutlined, TypeSpecimenOutlined,
} from '@mui/icons-material'
import * as React from 'react'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import MenuGroup from '@/components/MenuGroup'
import PermissionCheck from './PermissionCheck'

// @ts-ignore
function createMenu(name: string, icon: OverridableComponent<any>, path: string, permission: string, children?: any[{
                        name: string
                        icon: OverridableComponent<any>
                        path: string
                        permission: string
                    }]
) {
  return { name, icon, path, permission, children }
}

export default function DrawerMenu() {
  const menu = [
    createMenu('Dashboard', AppsOutlined, '/app', 'user.view'),
    createMenu('Create Package', NoteAddOutlined, '/app/create-package', 'user.view'),
    createMenu('New Management', NoteAddOutlined, '/app/news-management', 'app.view'),

    createMenu('Packages', Inventory2Outlined, '/app/packages', 'package.view'),
    createMenu('Branches', HomeWorkOutlined, '/app/branches', 'branch', [
      createMenu('List Branches', DomainOutlined, '/app/branches', 'branch.view'),
      createMenu('Create Branch', DomainAddOutlined, '/app/branches/create', 'branch.create')
    ]),
    createMenu('Service', FactCheckOutlined, '/app/Services', 'services', [
      createMenu('Service Type', TypeSpecimenOutlined, '/app/ServiceType', 'servicetype.view'),
      createMenu('Services Manager', LanOutlined, '/app/Services', 'services.view')
    ]),
    createMenu('Locations', LocationOnOutlined, '/app/Locations', 'locations.view'),
    createMenu('Check Fee', PaidOutlined, '/app/Feecustom/checkfee', 'checkFee.view'),
    createMenu('Fee Custom', PaidOutlined, '/app/Feecustom', 'feecustom', [
      createMenu('List Fee', FormatListBulletedOutlined, '/app/Feecustom', 'feecustom.view'),
      createMenu('Manager Fee', LocalAtmOutlined, '/app/Feecustom/Manager', 'feecustom.create')
    ]),
    createMenu('User Management', GroupOutlined, '/app/admin/users', 'user'),
    createMenu('Employee Management', BadgeOutlined, '/app/admin', 'admin', [
      createMenu('List Employees', GroupOutlined, '/app/admin/employees', 'admin.employee'),
      createMenu('Updated Requests', DriveFileRenameOutlineOutlined, '/app/admin/requests', 'admin.request'),
      createMenu('Role Management', ManageAccountsOutlined, '/app/admin/roles', 'admin.role')
    ]),
    createMenu('Packages', Inventory2Outlined, '/app/user/packages', 'packages.view'),
    createMenu('Profile', AccountBoxOutlined, '/app/user', 'user.view'),
    createMenu('Change Password', PasswordOutlined, '/app/user/change-password', 'password.change'),
    createMenu('General Settings', PasswordOutlined, '/app/general-settings', 'app.view'),
    createMenu('Addresses', BusinessOutlined, '/app/user/addresses', 'addresses.view', [
      createMenu('Sender', OutboxOutlined, '/app/user/addresses/sender', 'addresses.view'),
      createMenu('Receiver', MoveToInboxOutlined, '/app/user/addresses/receiver', 'addresses.view'),
      createMenu('Add Address', DomainAddOutlined, '/app/user/add-address', 'address.create')
    ])
  ]

<<<<<<< HEAD
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
        createMenu("Fee Custom", PaidOutlined, "/app/Feecustom", ["feecustom"], [
            createMenu("List Fee", FormatListBulletedOutlined, "/app/Feecustom", ["feecustom.view"]),
            createMenu("Manager Fee", LocalAtmOutlined, "/app/Feecustom/Manager", ["feecustom.create"]),
            createMenu("Check Fee", PaidOutlined, "/app/Feecustom/checkfee", ["feecustom.checkfee"]),
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
=======
  return (
    <div>
      <Toolbar></Toolbar>
      <Divider/>
      <List>
        {menu.map((item, index) => (
          <PermissionCheck
            permission={item.permission}
            key={index}>
            <MenuGroup item={item}></MenuGroup>
          </PermissionCheck>
        ))}
      </List>
    </div>
  )
}
>>>>>>> f6b1d86e9628f99ab224f45a955485e3265ea600
