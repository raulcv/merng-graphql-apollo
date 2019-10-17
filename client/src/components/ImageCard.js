import React, { useContext } from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';

function ImageCard({ image: { title, createdat, id, username, likeCount, commentCount, likes } }) {
    //const {title, createdat, id, username, likeCount, commentCount, likes } = props.ImageCard
    const { user } = useContext(AuthContext);
    return (
        <Card fluid>
            <Card.Content>
                <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/images/${id}`}>{moment(createdat).fromNow(true)}</Card.Meta>
                <Card.Description>{title}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} image={{ id, likes, likeCount }} />
                <MyPopup content="Hacer cometario en la imagen">
                    <Button labelPosition='right' as={Link} to={`/images/${id}`}>
                        <Button color='blue' basic><Icon name='comments' />Com</Button>
                        <Label basic color='blue' pointing='left'>{commentCount}</Label>
                    </Button>
                </MyPopup>
                {user && user.username === username && <DeleteButton imageId={id} />}
            </Card.Content>
        </Card>
    );
}

export default ImageCard;