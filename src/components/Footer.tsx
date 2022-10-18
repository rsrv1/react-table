import clsx from 'clsx'
import { LinkedinLogo, Lightning, Globe, TwitterLogo } from 'phosphor-react'

const navigation = {
    social: [
        {
            name: 'LinkedIn',
            href: 'https://www.linkedin.com/in/sourav-rakshit1/',
            icon: props => <LinkedinLogo weight="fill" className="w-6 h-6 hover:text-sky-600" aria-hidden="true" {...props} />,
        },
        {
            name: 'StackBlitz',
            href: 'https://stackblitz.com/@rsrv1',
            icon: props => <Lightning weight="duotone" className="w-6 h-6 hover:text-orange-500" aria-hidden="true" {...props} />,
        },
        {
            name: 'Website',
            href: 'https://itsrav.dev/',
            icon: props => <Globe weight="fill" className="w-6 h-6 hover:text-green-500" aria-hidden="true" {...props} />,
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com/srvrksh',
            icon: props => <TwitterLogo weight="fill" className="w-6 h-6 hover:text-cyan-500" aria-hidden="true" {...props} />,
        },
    ],
}

export default function Footer() {
    return (
        <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
            <p className="mt-8 text-center text-sm text-gray-400 flex">
                carafted with 🤟 by{' '}
                <a
                    href="https://itsrav.dev/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={clsx(
                        'ml-2 relative font-medium text-gray-400 before:absolute before:-bottom-0.5 before:h-[0.1rem] before:w-full before:origin-left before:scale-x-0 before:bg-violet-400 before:transition hover:before:scale-100',
                        'bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-pink-500 hover:to-violet-500'
                    )}>
                    Sourav Rakshit
                </a>
            </p>
            <div className="mt-8 flex justify-center">
                {navigation.social.map(item => (
                    <a key={item.name} href={item.href} title={item.name} target="_blank" rel="noreferrer noopener" className="text-gray-400">
                        <span className="sr-only">{item.name}</span>
                        <item.icon />
                    </a>
                ))}
            </div>
        </div>
    )
}
