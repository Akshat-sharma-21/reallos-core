import React from 'react';
import { CardMedia } from '@material-ui/core';

class CardThumbnail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            thumbnailUrl: null
        }
    }

    componentDidMount() {
        this.updateThumbnail(this.props.getThumbnailFunction);
    }

    async updateThumbnail(urlFunction) {
        let thumbnailUrl = await urlFunction();
        this.setState({ thumbnailUrl });
    }

    render() {
        return (
            <div
                style={{
                    height: 200,
                    backgroundImage: 'linear-gradient(45deg,#efefef 25%,transparent 25%,transparent 75%,#efefef 75%,#efefef),linear-gradient(45deg,#efefef 25%,transparent 25%,transparent 75%,#efefef 75%,#efefef)',
                    backgroundSize: '21px 21px',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: '0 0, 10px 10px',
                    backgroundColor: '#ffffff'
                }}
            >
                {this.state.thumbnailUrl
                    ? <CardMedia
                        image={this.state.thumbnailUrl}
                        style={{
                            height: 200,
                            backgroundPositionY: 'top'
                        }}
                    />
                    : <></>
                }
            </div>
        );
    }
}

export default CardThumbnail;
