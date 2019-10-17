import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react'; //for use semantic ui in ReactApp
import { AuthContext } from '../context/auth';
import ImageCard from '../components/ImageCard';
import ImageForm from '../components/ImageForm';
import { FETCH_IMAGES_QUERY } from '../util/graphql';

function Home() {
    //const [images, setImages] = useState([]);
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_IMAGES_QUERY);
    let images = [];
    if (data && !loading) {
        images = data.getImages
    }
    //console.log(`Loading: ${loading}`)
    //const {loading, data: { getImages: images }} = useQuery(FETCH_IMAGES_QUERY);

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Imagenes recientes</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <ImageForm />
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Cargando Imagenes...</h1>
                ) : (
                        <Transition.Group>
                            {images && images.map((image) => (
                                <Grid.Column key={image.id} style={{ marginBottom: 20 }}>
                                    <ImageCard image={image} />
                                </Grid.Column>
                            ))}
                        </Transition.Group>
                    )}
            </Grid.Row>
        </Grid>
    );
}

export default Home;