export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-screen flex flex-col">
			<div className="sticky top-0 z-10 bg-neutral-800">Docxify</div>
			<div className="flex-1 max-w-screen-2xl mx-auto w-full">{children}</div>
		</div>
	);
}
