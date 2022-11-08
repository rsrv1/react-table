import React from 'react'
import { Menu as MenuInner, MenuItem as MenuItemInner, SubMenu as SubMenuInner } from '@szhsin/react-menu'

const menuClassName =
    (className?: string) =>
    ({ state }) =>
        `box-border absolute z-50 text-sm bg-white p-1.5 border rounded shadow-md select-none text-left focus:outline-none min-w-[9rem] ${
            state === 'closed' && 'hidden'
        } ${state === 'opening' && 'animate-fadeIn'} ${state === 'closing' && 'animate-fadeOut'} ${className}`

const menuItemClassName =
    (className?: string) =>
    ({ hover, disabled, submenu }) =>
        `rounded block px-3 py-1 text-sm focus:outline-none text-left ${hover && 'bg-gray-100 text-gray-700'} ${
            disabled ? 'text-gray-400' : 'text-gray-600'
        } ${submenu && 'flex items-center'} ${className}`

const MenuComponent = (props: any) => <MenuInner {...props} className="relative" menuClassName={menuClassName(props?.className ?? '')} />

const MenuItemComponent = (props: any) => <MenuItemInner {...props} className={menuItemClassName(props?.className ?? '')} />

export const Menu = React.memo(MenuComponent)
export const MenuItem = React.memo(MenuItemComponent)
