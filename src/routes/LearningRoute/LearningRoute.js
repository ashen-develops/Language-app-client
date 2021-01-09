import React from 'react'
import TokenService from '../../services/token-service'
import config from '../../config'
import UserContext from '../../contexts/UserContext'

class LearningRoute extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            error: null,
            results: false
        }
    }

    componentDidMount() {
        return fetch(`${config.API_ENDPOINT}/language/head`)
        .then(res => res.json())
        .then(res => {
            this.context.setNextWord(res);
        })
        .catch(e => this.setState({error: e}));
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.results) {
            this.setState({ results: !this.state.results })
        }
    }

    render() {
        return (
            <div>
                <h2>Learn Some Finnish</h2>
                <h3>Some Useful Pronounciation Tips</h3>
                <ul>
                    <li>A: pronounced like the "u" in "cup"</li>
                    <li>Ä (with umlaut): sounds close to the "a" in "hat"</li>
                    <li>E: pronounced like "e" in "hen"</li>
                    <li>I: sounds like "i" in "tip"</li>
                    <li>Y: close to the "u" in the British pronunciation of "you" with tight lips</li>
                    <li>Ö (with umlaut): pronounced like the "u" in "fur" with tight lips</li>
                </ul>
            </div>
        )
    }

}

export default LearningRoute;
