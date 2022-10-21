import React from 'react'
import { Menu as MenuInner, MenuItem as MenuItemInner, SubMenu as SubMenuInner } from '@szhsin/react-menu'

const menuClassName = ({ state }) =>
    `box-border absolute z-50 text-sm bg-white p-1.5 border rounded shadow-md select-none text-left focus:outline-none min-w-[9rem] ${
        state === 'closed' && 'hidden'
    } ${state === 'opening' && 'animate-fadeIn'} ${state === 'closing' && 'animate-fadeOut'}`

const menuItemClassName = ({ hover, disabled, submenu }) =>
    `rounded block px-3 py-1 text-sm focus:outline-none text-left ${hover && 'bg-gray-100 text-gray-700'} ${
        disabled ? 'text-gray-400' : 'text-gray-600'
    } ${submenu && 'flex items-center'}`

const Menu = (props: any) => <MenuInner {...props} className="relative" menuClassName={menuClassName} />

const MenuItem = (props: any) => <MenuItemInner {...props} className={menuItemClassName} />

export { Menu, MenuItem }
