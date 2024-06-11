export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="sticky top-0 z-10 bg-neutral-800">Doxify</div>
			{children}
		</>
	);
}
