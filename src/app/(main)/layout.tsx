export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="sticky top-0 bg-neutral-800 z-10">Doxify</div>
			{children}
		</>
	);
}
