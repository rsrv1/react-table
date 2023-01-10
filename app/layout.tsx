import './../styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="">
            <head />
            <body className="overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')]">
                <div className="lg:pl-72">
                    <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
                        <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                            <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
                        </div>

                        <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                            <div className="rounded-lg bg-black">
                                <Footer />
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}

function Footer() {
    return (
        <div className="flex items-center justify-between gap-x-4 p-3.5 lg:px-5 lg:py-3">
            <div className="flex items-center gap-x-1.5">
                <div className="text-sm text-gray-400">By</div>
                <a href="https://vercel.com" title="Vercel">
                    <div className="w-16 text-gray-100 hover:text-gray-50">Logp</div>
                </a>
            </div>

            <div className="text-sm text-gray-400">
                <a
                    className="underline decoration-dotted underline-offset-4 hover:text-gray-400"
                    href="https://github.com/vercel/app-playground"
                    target="_blank">
                    View code
                </a>
            </div>
        </div>
    )
}