"use client";
import React from "react";

function Modal({ id, children }: { id: string; children: React.ReactNode }) {
	return (
		<>
			<dialog id={id} className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">{children}</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}

function ModalButton({
	id,
	children,
	className,
}: {
	id: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<button
			className={className}
			onClick={() => {
				// @ts-ignore
				document.getElementById(id).showModal();
			}}
		>
			{children}
		</button>
	);
}

Modal.Button = ModalButton;
export default Modal;
