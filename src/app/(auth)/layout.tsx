export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-screen">
			<section className="mx-auto px-4 py-16 max-w-lg bg-slate-950 h-full">
				<div className="mb-5 mx-auto text-center text-4xl font-bold ">
					Docxify
				</div>
				{children}
			</section>
		</div>
	);
}
