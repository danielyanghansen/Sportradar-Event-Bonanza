import React, { Component } from "react";
import { Container, Card } from 'react-bootstrap';


export type SimpleModalProps = {
    xoffset: number;
    yoffset: number;
    showModal: boolean;
    content: string;
}


const SimpleModal = ({
    xoffset = 0,
    yoffset = 0,
    showModal = false,
    content = "loading..."
} : SimpleModalProps) => {


    if (showModal) {
        return(
            <Container style={{
                position: "absolute",
                left: xoffset,
                top: yoffset,
                opacity: 0.7,
            }}
            >
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            {content}
                        </Card.Text>
                    </Card.Body>
                </Card>

                </Container>
        );
    }

    return(<></>);


}

export default SimpleModal;