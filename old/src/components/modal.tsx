"use client";
import React, { ButtonHTMLAttributes } from "react";

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

interface ModalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	id: string;
}

const ModalButton: React.FC<ModalButtonProps> = ({
	id,
	children,
	...props
}) => {
	return (
		<button
			{...props}
			onClick={() => {
				// @ts-ignore
				document.getElementById(id).showModal();
			}}
		>
			{children}
		</button>
	);
};

Modal.Button = ModalButton;
export default Modal;
