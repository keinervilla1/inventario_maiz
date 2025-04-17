export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-full overflow-hidden bg-white">
                <img src="/img/logo.jpg" alt="Logo" className="w-8 h-8 object-cover" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-base">
                <span className="mb-0.5 truncate leading-none font-semibold">Inventario Maíz</span>
            </div>
        </>
    );
}
