import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Inventario Maíz" />
            <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#fafaf9] to-[#f5f5f4] dark:from-[#0d0d0d] dark:to-[#1a1a1a] text-[#1c1c1c] dark:text-[#e7e7e3] font-sans">
                <nav className="flex justify-between items-center px-6 py-6 max-w-6xl mx-auto">
                    <h1 className="text-2xl font-semibold tracking-tight">Inventario Maíz</h1>
                    <div className="flex gap-6 ml-[36rem]">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2 text-sm rounded-lg bg-[#1c1c1c] text-white hover:bg-[#333] dark:bg-white dark:text-black dark:hover:bg-gray-300"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-sm rounded-lg border border-[#ccc] hover:bg-[#f4f4f4] dark:border-[#444] dark:hover:bg-[#2c2c2c]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 text-sm rounded-lg bg-[#eaeaea] hover:bg-[#dedede] dark:bg-[#2b2b2b] dark:hover:bg-[#3b3b3b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <section className="flex-grow flex flex-col items-center justify-center text-center py-24 px-6">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Bienvenido al sistema de <span className="text-[#5acafc]">Inventario de Maíz</span>
                    </h2>
                    <p className="max-w-xl text-lg text-[#555] dark:text-[#aaa] mb-10">
                        Administra fácilmente tu stock, ventas y movimientos con una interfaz intuitiva y moderna.
                    </p>
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="px-6 py-3 rounded-full bg-[#5acafc] text-white hover:bg-[#3dbcea] transition"
                        >
                            Ir al Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={route('register')}
                            className="px-6 py-3 rounded-full bg-[#5acafc] text-white hover:bg-[#3dbcea] transition"
                        >
                            Comienza Ahora
                        </Link>
                    )}
                </section>

                <footer className="text-center text-sm py-6 text-[#777] dark:text-[#666]">
                    © {new Date().getFullYear()} Inventario Maíz. Todos los derechos reservados.
                </footer>
            </div>
        </>
    );
}