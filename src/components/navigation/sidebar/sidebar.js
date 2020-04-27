import {Modal} from "react-bootstrap";
import React from "react";
import './sidebar.scss';

export const Sidebar = (props) => {
    const {isVisible, onHide, title, children} = props;

    return (
        <Modal className='menu-sidebar' show={isVisible} onHide={onHide} autoFocus keyboard>
            <Modal.Header closeButton>
                <Modal.Title className={'display-4'}>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
};
